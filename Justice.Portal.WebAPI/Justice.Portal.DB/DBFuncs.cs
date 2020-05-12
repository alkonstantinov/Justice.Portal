using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Justice.Portal.DB.Tools;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace Justice.Portal.DB
{
    //Scaffold-DbContext "Server=DESKTOP-NIQT1U7;Database=JusticePortal;Trusted_Connection=True;persist security info=True;user id=sa;password=123;MultipleActiveResultSets=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Force
    //Scaffold-DbContext "Server=172.16.0.56\MSSQLSERVER2017;Database=JusticePortal;Trusted_Connection=False;persist security info=True;user id = sa; password=@D1mitrov;MultipleActiveResultSets=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Force
    public class DBFuncs
    {
        protected JusticePortalContext db;

        public DBFuncs(JusticePortalContext jpc)
        {


            this.db = jpc;

        }

        public HashSet<string> GetUserRights(int userId)
        {
            return db.UserRight.FromSql($"select * from vwUserRights where PortalUserId={userId}").Select(x => x.UserRightId).Distinct().ToHashSet();
        }

        public HashSet<string> GetUserParts(int userId)
        {
            return db.PortalPart.FromSql($"select * from vwUserParts where PortalUserId={userId}", userId).Select(x => x.PortalPartId).Distinct().ToHashSet();
        }


        public HashSet<int> GetUserRubrics(string token)
        {
            var user = db.Session.Include(x => x.PortalUser).First(x => x.SessionKey == Guid.Parse(token));
            return GetUserRubrics(user.PortalUserId);


        }

        public HashSet<int> GetUserRubrics(int userId)
        {
            var fromUser = db.PortalUser2Rubric.Where(x => x.PortalUserId == userId).Select(x => x.RubricId).ToArray();
            var fromGroups = (from g in db.PortalUser2Group
                              join g2r in db.PortalGroup2Rubric on new { gid = g.PortalGroupId } equals new { gid = g2r.PortalGroupId }
                              where g.PortalUserId == userId
                              select g2r.RubricId
                             ).ToArray();

            List<int> l = new List<int>();
            l.AddRange(fromUser);
            l.AddRange(fromGroups);
            return l.ToHashSet<int>();


        }


        public LoginResponse Login(LoginRequest model)
        {
            var u = db.PortalUser
                .FirstOrDefault(x => x.UserName.Equals(model.UserName, StringComparison.InvariantCultureIgnoreCase) && x.Password.Equals(model.Password, StringComparison.InvariantCultureIgnoreCase) && x.Active);

            if (u != null)
            {
                var result = ModelMapper.Instance.Mapper.Map<LoginResponse>(u);
                result.Rights = this.GetUserRights(u.PortalUserId).ToArray();
                result.Parts = this.GetUserParts(u.PortalUserId).ToArray();
                return result;
            }

            return null;
        }


        public Session CreateSession(int userId)
        {
            db.Session.RemoveRange(db.Session.Where(x => x.PortalUserId == userId || Math.Abs((x.LastEdit - DateTime.Now).TotalMinutes) > 30));
            var newSession = new Session()
            {
                CreatedOn = DateTime.Now,
                LastEdit = DateTime.Now,
                PortalUserId = userId,
                SessionKey = Guid.NewGuid()
            };
            db.Session.Add(newSession);
            db.SaveChanges();
            return newSession;
        }


        public JSPortalGroup[] GetGroups(bool loadRights = true)
        {
            var grps = ModelMapper.Instance.Mapper.Map<ICollection<PortalGroup>, ICollection<JSPortalGroup>>(db.PortalGroup.OrderBy(x => x.Name).ToList()).ToArray();
            foreach (var g in grps)
            {
                if (loadRights)
                {
                    g.CanDel = !db.PortalUser2Group.Any(x => x.PortalGroupId == g.PortalGroupId);
                    g.Parts = db.PortalGroup2Part.Include(x => x.PortalPart).Where(x => x.PortalGroupId == g.PortalGroupId).Select(x => x.PortalPart.PortalPartId).ToArray();
                    g.Rights = db.PortalGroup2Right.Include(x => x.UserRight).Where(x => x.PortalGroupId == g.PortalGroupId).Select(x => x.UserRight.UserRightId).ToArray();
                    g.Rubrics = db.PortalGroup2Rubric.Include(x => x.Rubric).Where(x => x.PortalGroupId == g.PortalGroupId).Select(x => x.Rubric.RubricId).ToArray();
                }
            }

            return grps;

        }

        public JSPortalUser[] GetUsers()
        {
            var usrs = ModelMapper.Instance.Mapper.Map<ICollection<PortalUser>, ICollection<JSPortalUser>>(db.PortalUser.OrderBy(x => x.Name).ToList()).ToArray();
            foreach (var u in usrs)
            {
                u.Parts = db.PortalUser2Part.Include(x => x.PortalPart).Where(x => x.PortalUserId == u.PortalUserId).Select(x => x.PortalPart.PortalPartId).ToArray();
                u.Rights = db.PortalUser2Right.Include(x => x.UserRight).Where(x => x.PortalUserId == u.PortalUserId).Select(x => x.UserRight.UserRightId).ToArray();
                u.Groups = db.PortalUser2Group.Where(x => x.PortalUserId == u.PortalUserId).Select(x => x.PortalGroupId).ToArray();
                u.Rubrics = db.PortalUser2Rubric.Include(x => x.Rubric).Where(x => x.PortalUserId == u.PortalUserId).Select(x => x.Rubric.RubricId).ToArray();
            }

            return usrs;

        }

        public JSPortalPart[] GetParts()
        {
            return ModelMapper.Instance.Mapper.Map<ICollection<PortalPart>, ICollection<JSPortalPart>>(db.PortalPart.OrderBy(x => x.Name).ToList()).ToArray();
        }

        public JSUserRight[] GetRights()
        {
            return ModelMapper.Instance.Mapper.Map<ICollection<UserRight>, ICollection<JSUserRight>>(db.UserRight.OrderBy(x => x.Description).ToList()).ToArray();
        }

        public void SetGroup(JSPortalGroup grp)
        {
            PortalGroup newGroup;


            if (!grp.PortalGroupId.HasValue)
            {
                newGroup = new PortalGroup();
                db.PortalGroup.Add(newGroup);
            }
            else
            {
                newGroup = db.PortalGroup.First(x => x.PortalGroupId == grp.PortalGroupId);
            }
            newGroup.Name = grp.Name;
            db.SaveChanges();
            db.PortalGroup2Part.RemoveRange(db.PortalGroup2Part.Where(x => x.PortalGroupId == newGroup.PortalGroupId));
            foreach (var p in grp.Parts)
            {
                var part = new PortalGroup2Part();
                part.PortalGroupId = newGroup.PortalGroupId;
                part.PortalPartId = p;
                db.PortalGroup2Part.Add(part);

            }

            db.PortalGroup2Right.RemoveRange(db.PortalGroup2Right.Where(x => x.PortalGroupId == newGroup.PortalGroupId));
            foreach (var r in grp.Rights)
            {
                var rght = new PortalGroup2Right();
                rght.PortalGroupId = newGroup.PortalGroupId;
                rght.UserRightId = r;
                db.PortalGroup2Right.Add(rght);

            }

            db.PortalGroup2Rubric.RemoveRange(db.PortalGroup2Rubric.Where(x => x.PortalGroupId == newGroup.PortalGroupId));
            foreach (var r in grp.Rubrics)
            {
                var rub = new PortalGroup2Rubric();
                rub.PortalGroupId = newGroup.PortalGroupId;
                rub.RubricId = r;
                db.PortalGroup2Rubric.Add(rub);

            }

            db.SaveChanges();


        }
        public void DelGroup(int groupId)
        {

            db.PortalGroup.Remove(db.PortalGroup.First(x => x.PortalGroupId == groupId));
            db.SaveChanges();
        }

        public bool HasUserRight(string token, string right)
        {
            db.Session.RemoveRange(db.Session.Where(x => Math.Abs((x.LastEdit - DateTime.Now).TotalMinutes) > 30));
            db.SaveChanges();
            var u = db.Session.Include(x => x.PortalUser).FirstOrDefault(x => x.SessionKey.ToString() == token);
            if (u == null)
                return false;
            var hs = this.GetUserRights(u.PortalUserId);
            return hs.Contains(right);
        }

        public bool CanDoPart(string token, string part)
        {
            db.Session.RemoveRange(db.Session.Where(x => Math.Abs((x.LastEdit - DateTime.Now).TotalMinutes) > 30));
            db.SaveChanges();
            var u = db.Session.Include(x => x.PortalUser).FirstOrDefault(x => x.SessionKey.ToString() == token);
            if (u == null)
                return false;
            var hs = this.GetUserParts(u.PortalUserId);
            return hs.Contains(part);
        }

        public bool IsAuthenticated(string token)
        {
            db.Session.RemoveRange(db.Session.Where(x => Math.Abs((x.LastEdit - DateTime.Now).TotalMinutes) > 30));
            db.SaveChanges();
            this.UpdateToken(token);

            return db.Session.Any(x => x.SessionKey.ToString() == token);
        }


        public bool UsernameExists(string username)
        {
            return db.PortalUser.Any(x => x.UserName == username);
        }



        public void SetUser(JSPortalUser usr)
        {
            PortalUser newUser;


            if (!usr.PortalUserId.HasValue)
            {
                newUser = new PortalUser();
                db.PortalUser.Add(newUser);
            }
            else
            {
                newUser = db.PortalUser.First(x => x.PortalUserId == usr.PortalUserId);
            }
            newUser.Name = usr.Name;
            newUser.UserName = usr.UserName;
            newUser.Password = string.IsNullOrEmpty(usr.Password) ? newUser.Password : Utils.GetMD5(usr.Password);
            newUser.Active = usr.Active;

            db.SaveChanges();
            db.PortalUser2Part.RemoveRange(db.PortalUser2Part.Where(x => x.PortalUserId == newUser.PortalUserId));
            foreach (var p in usr.Parts)
            {
                var part = new PortalUser2Part();
                part.PortalUserId = newUser.PortalUserId;
                part.PortalPartId = p;
                db.PortalUser2Part.Add(part);

            }

            db.PortalUser2Right.RemoveRange(db.PortalUser2Right.Where(x => x.PortalUserId == newUser.PortalUserId));
            foreach (var r in usr.Rights)
            {
                var rght = new PortalUser2Right();
                rght.PortalUserId = newUser.PortalUserId;
                rght.UserRightId = r;// db.UserRight.First(x => x.Name == r).UserRightId;
                db.PortalUser2Right.Add(rght);

            }

            db.PortalUser2Group.RemoveRange(db.PortalUser2Group.Where(x => x.PortalUserId == newUser.PortalUserId));
            foreach (var g in usr.Groups)
            {
                var grp = new PortalUser2Group();
                grp.PortalUserId = newUser.PortalUserId;
                grp.PortalGroupId = g;
                db.PortalUser2Group.Add(grp);

            }

            db.PortalUser2Rubric.RemoveRange(db.PortalUser2Rubric.Where(x => x.PortalUserId == newUser.PortalUserId));
            foreach (var r in usr.Rubrics)
            {
                var rub = new PortalUser2Rubric();
                rub.PortalUserId = newUser.PortalUserId;
                rub.RubricId = r;
                db.PortalUser2Rubric.Add(rub);

            }

            db.SaveChanges();


        }

        public void Logout(string token)
        {
            var s = db.Session.FirstOrDefault(x => x.SessionKey.ToString() == token);
            if (s != null)
            {
                db.Session.Remove(s);
                db.SaveChanges();
            }
        }

        public void UpdateToken(string token)
        {
            var s = db.Session.FirstOrDefault(x => x.SessionKey.ToString() == token);
            if (s != null)
            {
                s.LastEdit = DateTime.Now;
                db.SaveChanges();
            }
        }

        public JSBlockType[] GetBlockTypes()
        {
            return ModelMapper.Instance.Mapper.Map<ICollection<BlockType>, ICollection<JSBlockType>>(db.BlockType.OrderBy(x => x.Name).ToArray()).ToArray();
        }

        //public JSBlock[] GetWebPages()
        //{
        //    return ModelMapper.Instance.Mapper.Map<ICollection<Block>, ICollection<JSBlock>>(db.WebPage.OrderBy(x => x.WebPageName).ToArray()).ToArray();
        //}

        public JSPortalPart[] GetPortalParts(Guid token)
        {
            var user = db.Session.Include(x => x.PortalUser).First(x => x.SessionKey == token);
            var allowedParts = GetUserParts(user.PortalUserId);
            var parts = db.PortalPart.Where(x => allowedParts.Contains(x.PortalPartId));

            return ModelMapper.Instance.Mapper.Map<ICollection<PortalPart>, ICollection<JSPortalPart>>(parts.ToArray()).ToArray();
        }

        public JSRubric[] GetPortalRubrics(Guid token)
        {
            var user = db.Session.Include(x => x.PortalUser).First(x => x.SessionKey == token);
            var allowedRubrics = GetUserRubrics(user.PortalUserId);
            var rubrics = db.Rubric.Where(x => allowedRubrics.Contains(x.RubricId));

            return ModelMapper.Instance.Mapper.Map<ICollection<Rubric>, ICollection<JSRubric>>(rubrics.ToArray()).ToArray();
        }


        public JSBlock[] GetBlocks(string portalPartId, string blockTypeId, HashSet<int> rs, string ss)
        {
            return ModelMapper.Instance.Mapper.Map<ICollection<Block>, ICollection<JSBlock>>(db.Block
                .Where(x => (blockTypeId == "0" || x.BlockTypeId == blockTypeId)
                && x.PortalPartId == portalPartId
                && rs.Contains(x.RubricId)
                && (string.IsNullOrEmpty(ss) || x.Name.Contains(ss, StringComparison.InvariantCultureIgnoreCase) || x.Url.Equals(ss, StringComparison.InvariantCultureIgnoreCase)))
                .OrderBy(x => x.Name).Take(50).ToArray()).ToArray();
        }


        //public JSPortalPart2WebPage[] GetPortalParts2WebPages(string portalPartId)
        //{
        //    return db.PortalPart2WebPage.Include(x => x.WebPage).Where(x => x.PortalPartId == portalPartId)
        //        .Select(x => new JSPortalPart2WebPage() { PortalPart2WebPageId = x.PortalPart2WebPageId, WebPageId=x.WebPageId, WebPageName=x.WebPage.WebPageName}).ToArray();
        //}


        //public JSPortalPart2WebPage GetSpecificWebPageProperties(int portalPart2WebPageId)
        //{
        //    return ModelMapper.Instance.Mapper.Map<JSPortalPart2WebPage>(db.PortalPart2WebPage.First(x => x.PortalPart2WebPageId == portalPart2WebPageId));
        //}

        public JSTemplate[] GetTemplates(string portalPartId)
        {
            return db.Template.Include(x => x.BlockType).Where(x => x.PortalPartId == portalPartId)
                .Select(x => new JSTemplate()
                {
                    TemplateId = x.TemplateId,
                    Title = x.BlockType.Name
                }).OrderBy(x => x.Title).ToArray();
        }

        public JSTemplate GetTemplate(int templateId)
        {
            return ModelMapper.Instance.Mapper.Map<Template, JSTemplate>(db.Template.First(x => x.TemplateId == templateId));
        }



        public JSBlock GetBlock(int blockId)
        {
            return ModelMapper.Instance.Mapper.Map<JSBlock>(db.Block.First(x => x.BlockId == blockId));
        }


        public JSBlock GetBlock(string url)
        {
            return ModelMapper.Instance.Mapper.Map<JSBlock>(db.Block.First(x => x.IsActive.Value && x.Url.Equals(url, StringComparison.InvariantCultureIgnoreCase)));
        }


        public JSBlock GetBlockForPart(string part)
        {
            return ModelMapper.Instance.Mapper.Map<JSBlock>(db.Block.First(x => x.IsActive.Value && (string.IsNullOrEmpty(part) || x.PortalPartId == part) && x.BlockTypeId == "main"));
        }


        public JSPortalPart GetPart(string partId)
        {
            return ModelMapper.Instance.Mapper.Map<JSPortalPart>(db.PortalPart.First(x => x.PortalPartId == partId));
        }


        public JSProperty[] GetBlockProperties(string blockTypeId)
        {
            var props = db.BlockTypeProperty.Where(x => x.BlockTypeId == blockTypeId).Select(x => x.PropertyId).ToHashSet();
            return ModelMapper.Instance.Mapper.Map<ICollection<Property>, ICollection<JSProperty>>(db.Property.Where(x => props.Contains(x.PropertyId)).ToArray()).ToArray();
        }


        public PropertyValue[] GetBlockPropertyValues(int blockId)
        {
            return db.BlockTypePropertyValue.Where(x => x.BlockId == blockId).Select(x => new PropertyValue() { PropertyId = x.PropertyId, Value = x.Value }).ToArray();
        }

        public int AddBlob(Blob blob)
        {
            var b = db.Blob.FirstOrDefault(x => x.Hash == blob.Hash);
            if (b == null)
            {
                db.Blob.Add(blob);

            }
            else
            {
                blob.BlobId = b.BlobId;
                b.ContentType = blob.ContentType;
                b.Extension = blob.Extension;
                b.Filename = blob.Filename;
            }


            db.SaveChanges();

            return blob.BlobId;
        }

        public Blob GetBlob(string hash)
        {
            var b = db.Blob.FirstOrDefault(x => x.Hash == hash);
            return b;
        }

        public void DeleteBlock(int blockId)
        {
            db.Block.Remove(db.Block.First(x => x.BlockId == blockId));
            db.SaveChanges();
        }

        public Block SetBlock(BlockData data)
        {
            Block block;
            if (data.Block.BlockId == 0)
            {
                block = ModelMapper.Instance.Mapper.Map<Block>(data.Block);
                db.Block.Add(block);

            }
            else
            {
                block = db.Block.First(x => x.BlockId == data.Block.BlockId);
                block.Jsonvalues = data.Block.Jsonvalues;
                block.Name = data.Block.Name;
                block.Url = data.Block.Url;
                block.RubricId = data.Block.RubricId;
                block.IsActive = data.Block.IsActive;
                block.IsMain = data.Block.IsMain;

            }
            db.SaveChanges();
            db.BlockTypePropertyValue.RemoveRange(db.BlockTypePropertyValue.Where(x => x.BlockId == block.BlockId));
            foreach (var p in data.Values)
            {
                db.BlockTypePropertyValue.Add(
                    new BlockTypePropertyValue()
                    {
                        BlockId = block.BlockId,
                        PropertyId = p.PropertyId,
                        Value = p.Value
                    }
                    );
            }
            db.SaveChanges();
            return block;
        }


        public BlocksPerPortalPart GetBlocksPerPortalPart(string portalPartId)
        {
            BlocksPerPortalPart result = new BlocksPerPortalPart();

            foreach (var b in db.Block.Where(x => x.PortalPartId == portalPartId).ToArray())
            {
                var bt = b.BlockTypeId;
                JSBlock blk = new JSBlock()
                {
                    BlockId = b.BlockId,
                    Name = b.Name
                };
                result.Data.TryAdd(bt, new List<JSBlock>());
                result.Data[bt].Add(blk);
            }

            return result;
        }

        public void SetTemplate(JSTemplate template)
        {
            var oldPage = db.Template.First(x => x.TemplateId == template.TemplateId);
            oldPage.Sources = template.Sources;
            oldPage.TemplateJson = template.TemplateJson;
            db.SaveChanges();
        }

        public bool ChangePassword(ChangePasswordData data, Guid token)
        {
            var user = db.Session.Include(x => x.PortalUser).First(x => x.SessionKey == token);
            if (!user.PortalUser.Password.Equals(Utils.GetMD5(data.OldPassword), StringComparison.InvariantCultureIgnoreCase))
                return false;
            user.PortalUser.Password = Utils.GetMD5(data.NewPassword);
            db.SaveChanges();
            return true;


        }

        public JSCollection[] GetCollections(Guid token)
        {
            var user = db.Session.Include(x => x.PortalUser).First(x => x.SessionKey == token);
            var allowedParts = GetUserParts(user.PortalUserId);



            return db.Collection
                .Where(x => allowedParts.Contains(x.PortalPartId))
                .Select(x =>
            new JSCollection()
            {
                CollectionId = x.CollectionId,
                Name = x.Name
            })
                .ToArray();
        }

        public JSCollection GetCollection(int collectionId)
        {
            return ModelMapper.Instance.Mapper.Map<JSCollection>(db.Collection.First(x => x.CollectionId == collectionId));
        }

        public void DeleteCollection(int collectionId)
        {
            db.Collection.Remove(db.Collection.First(x => x.CollectionId == collectionId));
            db.SaveChanges();
        }

        public void SaveCollection(JSCollection collection)
        {
            Collection c;
            if (collection.CollectionId == 0)
            {
                c = new Collection();
                db.Collection.Add(c);
            }
            else
                c = db.Collection.First(x => x.CollectionId == collection.CollectionId);
            c.Content = collection.Content;
            c.Name = collection.Name;
            c.Structure = collection.Structure;
            c.PortalPartId = collection.PortalPartId;
            db.SaveChanges();
        }




        public bool UrlExists(string url, int? blockId)
        {
            return db.Block.Any(x => x.Url == url && (!blockId.HasValue || x.BlockId != blockId.Value));
        }


        public JSTemplate GetTemplateByBlock(string blockTypeId, string portalPartId)
        {
            return ModelMapper.Instance.Mapper.Map<JSTemplate>(db.Template.FirstOrDefault(x => x.BlockTypeId == blockTypeId && x.PortalPartId == portalPartId));
        }

        public JSBlockType GetBlockType(string blockTypeId)
        {
            return ModelMapper.Instance.Mapper.Map<JSBlockType>(db.BlockType.First(x => x.BlockTypeId == blockTypeId));
        }

        public string GetTranslation()
        {
            return db.Translation.First().Content;
        }

        public void SetTranslation(JSTranslation trans)
        {
            db.Translation.First().Content = trans.Content;
            db.SaveChanges();
        }

        public AdSQItem[] GetAdsSQData(int count, string portalPartId)
        {
            return (from b in db.Block
                    join btpv in db.BlockTypePropertyValue on new { bid = b.BlockId, pid = "date" } equals new { bid = btpv.BlockId, pid = btpv.PropertyId }
                    where b.PortalPartId == portalPartId && b.BlockTypeId == "ad"
                    orderby btpv.Value descending
                    select new AdSQItem()
                    {
                        BlockId = b.BlockId,
                        Date = btpv.Value,
                        Url = b.Url,
                        JSONContent = b.Jsonvalues
                    }).Take(count).ToArray();
        }

        public NewSQItem[] GetNewsSQData(int count, string portalPartId, string language)
        {
            return (from b in db.Block
                    join btpv in db.BlockTypePropertyValue on new { bid = b.BlockId, pid = "date" } equals new { bid = btpv.BlockId, pid = btpv.PropertyId }
                    where b.PortalPartId == portalPartId && b.BlockTypeId == "new"
                    orderby btpv.Value descending
                    select new NewSQItem()
                    {
                        BlockId = b.BlockId,
                        Date = btpv.Value,
                        Url = b.Url,
                        JSONContent = b.Jsonvalues,
                        JSON = JObject.Parse(b.Jsonvalues)

                    })
                    .Where(x => language == "bg" || (x.JSON["title"] != null && x.JSON["title"]["en"] != null && x.JSON["title"]["en"].ToString() != ""))
                    .Take(count).ToArray();
        }


        public AdsData GetAdsData(int top, int count, string portalPartId)
        {
            var rows = (from b in db.Block
                        join btpv in db.BlockTypePropertyValue on new { bid = b.BlockId, pid = "date" } equals new { bid = btpv.BlockId, pid = btpv.PropertyId }
                        where b.PortalPartId == portalPartId && b.BlockTypeId == "ad"
                        orderby btpv.Value descending
                        select new AdSQItem()
                        {
                            BlockId = b.BlockId,
                            Date = btpv.Value,
                            Url = b.Url,
                            JSONContent = b.Jsonvalues
                        }).ToArray();
            return new AdsData()
            {
                Count = rows.Length,
                Rows = rows.Skip(top).Take(count).ToArray()
            };
        }


        public NewsData GetNewsData(int top, int count, string portalPartId)
        {
            var rows = (from b in db.Block
                        join btpv in db.BlockTypePropertyValue on new { bid = b.BlockId, pid = "date" } equals new { bid = btpv.BlockId, pid = btpv.PropertyId }
                        where b.PortalPartId == portalPartId && b.BlockTypeId == "new"
                        orderby btpv.Value descending
                        select new NewSQItem()
                        {
                            BlockId = b.BlockId,
                            Date = btpv.Value,
                            Url = b.Url,
                            JSONContent = b.Jsonvalues
                        }).ToArray();
            return new NewsData()
            {
                Count = rows.Length,
                Rows = rows.Skip(top).Take(count).ToArray()
            };
        }

        public JSBlock GetSearchResultBlock(string portalPartId)
        {
            return ModelMapper.Instance.Mapper.Map<JSBlock>(db.Block.First(x => x.PortalPartId == portalPartId && x.BlockTypeId == "search"));
        }


        public JSBlock[] GetCabinetBios()
        {

            var result = ModelMapper.Instance.Mapper.Map<ICollection<Block>, ICollection<JSBlock>>(db.Block.Where(x =>
                         x.BlockTypeId == "bio" && !bool.Parse(JObject.Parse(x.Jsonvalues)["prime"].ToString())
            ).ToList()).ToArray();
            return result;
        }


        public JSHeader[] GetHeaders(Guid token)
        {
            var user = db.Session.Include(x => x.PortalUser).First(x => x.SessionKey == token);
            var allowedParts = GetUserParts(user.PortalUserId);

            return db.Header
                .Where(x => allowedParts.Contains(x.PortalPartId))
                .Select(x => new JSHeader() { HeaderId = x.HeaderId, Title = x.Title }).ToArray();
        }

        public JSHeader GetHeader(int headerId)
        {

            return ModelMapper.Instance.Mapper.Map<JSHeader>(db.Header.First(x => x.HeaderId == headerId));
        }

        public void SaveHeader(JSHeader header)
        {
            Header h;
            if (header.HeaderId == 0)
            {
                h = ModelMapper.Instance.Mapper.Map<Header>(header);
                db.Header.Add(h);


            }
            else
            {
                h = db.Header.First(x => x.HeaderId == header.HeaderId);
                h.Content = header.Content;
                h.Title = header.Title;
                h.PortalPartId = header.PortalPartId;

            }
            db.SaveChanges();
        }

        public void DeleteHeader(int headerId)
        {

            db.Header.Remove(db.Header.First(x => x.HeaderId == headerId));
            db.SaveChanges();
        }

        public JSHeader GetHeaderByBlockId(int blockId)
        {
            var headerId = db.BlockTypePropertyValue.First(x => x.BlockId == blockId && x.PropertyId == "header").Value;
            var result = ModelMapper.Instance.Mapper.Map<JSHeader>(db.Header.First(x => x.HeaderId == int.Parse(headerId)));
            return result;
        }

        public string GetFirstOfKindUrl(string portalPartId, string blockTypeId)
        {
            var blk = db.Block.FirstOrDefault(x => x.PortalPartId == portalPartId && x.BlockTypeId == blockTypeId);
            return blk == null ? "" : blk.Url;
        }

        public JSPklabel[] GetPKLabels(string group)
        {
            return ModelMapper.Instance.Mapper.Map<ICollection<Pklabel>, ICollection<JSPklabel>>(db.Pklabel.Where(x => string.IsNullOrEmpty(group) || x.PklabelGroup == group).OrderBy(x => x.TitleBg).ToArray()).ToArray();
        }


        public PKListData GetPKList(int top, int count, string portalPartId, string ss, string type)
        {
            var rows = (from b in db.Block
                        join btpv in db.BlockTypePropertyValue on new { bid = b.BlockId, pid = "date" } equals new { bid = btpv.BlockId, pid = btpv.PropertyId }
                        where b.PortalPartId == portalPartId && b.BlockTypeId == "pkmessage" && (string.IsNullOrEmpty(ss) || b.Jsonvalues.Contains(ss)) && JObject.Parse(b.Jsonvalues)["type"].ToString() == type
                        orderby btpv.Value descending
                        select new PKListItem()
                        {
                            BlockId = b.BlockId,
                            Date = btpv.Value,
                            Url = b.Url,
                            JSONContent = b.Jsonvalues
                        }).ToArray();
            return new PKListData()
            {
                Count = rows.Length,
                Rows = rows.Skip(top).Take(count).ToArray()
            };
        }

        public Block[] GetNextIndexableBlocks(int top, int count)
        {
            var arr = (from b in db.Block
                       join bt in db.BlockType on new { btid = b.BlockTypeId } equals new { btid = bt.BlockTypeId }
                       where bt.IsSearchable
                       orderby b.BlockId
                       select b).Skip(top).Take(count).ToArray();
            return arr;
        }


        public JArray GetInnerDocs(string portalPartId)
        {
            var id = db.InnerDoc.FirstOrDefault(x => x.PortalPartId == portalPartId);
            return id?.Content != null ? JArray.Parse(id.Content) : new JArray();
        }

        public void SetInnerDocs(JSInnerDoc doc)
        {
            var id = db.InnerDoc.FirstOrDefault(x => x.PortalPartId == doc.PortalPartId);
            if (id == null)
            {
                id = new InnerDoc();
                id.PortalPartId = doc.PortalPartId;

                db.InnerDoc.Add(id);
            }
            id.Content = doc.Content;
            db.SaveChanges();

        }

        public void SaveUserAction(UserAction ua)
        {
            db.UserAction.Add(ua);
            db.SaveChanges();
        }

        public PortalUser GetUserByToken(string token)
        {
            var guid = Guid.Parse(token);
            return db.Session.Include(x => x.PortalUser).FirstOrDefault(x => x.SessionKey == guid)?.PortalUser;
        }

        public JSUserAction[] Audit(AuditModel model)
        {
            return db.UserAction
                .Where(x => (!model.PortalUserId.HasValue || model.PortalUserId.Value == x.PortalUserId) && (DateTime.Compare(model.FromDate.Value, x.OnTime) <= 0) && (DateTime.Compare(model.ToDate.Value.AddDays(1), x.OnTime) >= 0))
                .OrderBy(x => x.OnTime)
                .Select(x => new JSUserAction()
                {
                    Content = x.Content,
                    PortalUserId = x.PortalUserId,
                    OnTime = x.OnTime,
                    Title = x.Title,
                    UserActionId = x.UserActionId,
                    UserName = x.PortalUser.Name
                })
                .ToArray();
        }


        public JSRubric[] SelectRubric(string portalPartId)
        {
            var res = ModelMapper.Instance.Mapper.Map<ICollection<Rubric>, JSRubric[]>(db.Rubric.Where(x => string.IsNullOrEmpty(portalPartId) || x.PortalPartId == portalPartId).ToList());
            foreach (var r in res)
                r.CanDel = !db.Block.Any(x => x.RubricId == r.RubricId);
            return res;
        }

        public void DeleteRubric(int rubricId)
        {
            db.Rubric.Remove(db.Rubric.First(x => x.RubricId == rubricId));
            db.SaveChanges();
        }

        public void InsertRubric(JSRubric r)
        {
            db.Rubric.Add(ModelMapper.Instance.Mapper.Map<Rubric>(r));
            db.SaveChanges();
        }

        public void UpdateRubric(JSRubric r)
        {
            var dbr = db.Rubric.First(x => x.RubricId == r.RubricId);
            dbr.TitleBg = r.TitleBg;
            dbr.TitleEn = r.TitleEn;
            db.SaveChanges();
        }


        public JArray GetMainPath(string portalPartId)
        {
            var blocks = db.Block
                .Where(x => x.IsMain && (x.PortalPartId == portalPartId || x.PortalPartId == "min"))
                .Select(x => new { Order = x.PortalPartId == "min" ? 1 : 2, Title = JObject.Parse(x.Jsonvalues)["title"], Url = x.PortalPartId == "min" ? "" : x.Url })
                .OrderBy(x => x.Order);
            return JArray.FromObject(blocks.ToArray());
        }



    }
}
