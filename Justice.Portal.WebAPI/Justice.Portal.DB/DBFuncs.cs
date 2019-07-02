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


        public JSPortalGroup[] GetGroups()
        {
            var grps = ModelMapper.Instance.Mapper.Map<ICollection<PortalGroup>, ICollection<JSPortalGroup>>(db.PortalGroup.OrderBy(x => x.Name).ToList()).ToArray();
            foreach (var g in grps)
            {
                g.CanDel = !db.PortalUser2Group.Any(x => x.PortalGroupId == g.PortalGroupId);
                g.Parts = db.PortalGroup2Part.Include(x => x.PortalPart).Where(x => x.PortalGroupId == g.PortalGroupId).Select(x => x.PortalPart.PartKey).ToArray();
                g.Rights = db.PortalGroup2Right.Include(x => x.UserRight).Where(x => x.PortalGroupId == g.PortalGroupId).Select(x => x.UserRight.Name).ToArray();
            }

            return grps;

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
            var u = db.Session.Include(x => x.PortalUser).FirstOrDefault(x => x.SessionKey.ToString() == token);
            if (u == null)
                return false;
            var hs = this.GetUserRights(u.PortalUserId);
            return hs.Contains(right);
        }

    }
}
