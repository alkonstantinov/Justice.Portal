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
            return db.PortalPart.FromSql($"select * from vwUserParts where PortalUserId={userId}", userId).Select(x => x.PartKey).Distinct().ToHashSet();
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
                    g.Parts = db.PortalGroup2Part.Include(x => x.PortalPart).Where(x => x.PortalGroupId == g.PortalGroupId).Select(x => x.PortalPart.PartKey).ToArray();
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
                u.Parts = db.PortalUser2Part.Include(x => x.PortalPart).Where(x => x.PortalUserId == u.PortalUserId).Select(x => x.PortalPart.PartKey).ToArray();
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
                part.PortalPartId = db.PortalPart.First(x => x.PartKey == p).PortalPartId;
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
                part.PortalPartId = db.PortalPart.First(x => x.PartKey == p).PortalPartId;
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
    }
}
