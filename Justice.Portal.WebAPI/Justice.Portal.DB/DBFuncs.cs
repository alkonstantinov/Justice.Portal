using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Justice.Portal.DB.Tools;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Justice.Portal.DB
{
    //Scaffold-DbContext "Server=DESKTOP-NIQT1U7\SQLEXPRESS;Database=JusticePortal;Trusted_Connection=True;persist security info=True;user id=sa;password=123;MultipleActiveResultSets=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Force
    public class DBFuncs
    {
        protected JusticePortalContext db;

        public DBFuncs(JusticePortalContext jpc)
        {


            this.db = jpc;
        }

        public HashSet<string> GetUserRights(int userId)
        {
            return db.UserRight.FromSql($"select * from vwUserRights where PortalUserId={userId}").Select(x => x.Name).Distinct().ToHashSet();
        }

        public HashSet<string> GetUserParts(int userId)
        {
            return db.PortalPart.FromSql($"select * from vwUserParts where PortalUserId={userId}", userId).Select(x => x.PortalPartId).Distinct().ToHashSet();
        }


        public LoginResponse Login(LoginRequest model)
        {
            var u = db.PortalUser
                .FirstOrDefault(x => x.UserName.Equals(model.UserName, StringComparison.InvariantCultureIgnoreCase) && x.Password.Equals(model.Password, StringComparison.InvariantCultureIgnoreCase));

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
                    g.Rights = db.PortalGroup2Right.Include(x => x.UserRight).Where(x => x.PortalGroupId == g.PortalGroupId).Select(x => x.UserRight.Name).ToArray();
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
                u.Rights = db.PortalUser2Right.Include(x => x.UserRight).Where(x => x.PortalUserId == u.PortalUserId).Select(x => x.UserRight.Name).ToArray();
                u.Groups = db.PortalUser2Group.Where(x => x.PortalUserId == u.PortalUserId).Select(x => x.PortalGroupId).ToArray();

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
                rght.UserRightId = db.UserRight.First(x => x.Name == r).UserRightId;
                db.PortalGroup2Right.Add(rght);

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
                rght.UserRightId = db.UserRight.First(x => x.Name == r).UserRightId;
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


        public JSBlock[] GetBlocks(string portalPartId, string blockTypeId)
        {
            return ModelMapper.Instance.Mapper.Map<ICollection<Block>, ICollection<JSBlock>>(db.Block.Where(x => x.BlockTypeId == blockTypeId && x.PortalPartId == portalPartId).ToArray()).ToArray();
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
            return ModelMapper.Instance.Mapper.Map<Template,JSTemplate > (db.Template.First(x => x.TemplateId == templateId));
        }



        public JSBlock GetBlock(int blockId)
        {
            return ModelMapper.Instance.Mapper.Map<JSBlock>(db.Block.First(x => x.BlockId == blockId));
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
                db.SaveChanges();
            }
            else blob.BlobId = b.BlobId;

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

        public void SetBlock(BlockData data)
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
            var user = db.Session.Include(x=>x.PortalUser).First(x => x.SessionKey == token);
            if (!user.PortalUser.Password.Equals(Utils.GetMD5(data.OldPassword),StringComparison.InvariantCultureIgnoreCase))
                return false;
            user.PortalUser.Password = Utils.GetMD5(data.NewPassword);
            db.SaveChanges();
            return true;

            
        }



    }
}
