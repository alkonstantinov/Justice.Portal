using Justice.Portal.DB.Models;
using kl2.server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Justice.Portal.DB
{
    public class DBFuncs
    {
        protected JusticePortalContext db;

        public DBFuncs(JusticePortalContext jpc)
        {


            this.db = jpc;
        }


        public PortalUser Login(LoginRequest model)
        {
            var u = db.PortalUser
                
                .FirstOrDefault(x => x.UserName.Equals(model.UserName, StringComparison.InvariantCultureIgnoreCase) && x.Password.Equals(model.Password, StringComparison.InvariantCultureIgnoreCase));
            return u;
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
            return newSession;
        }

    }
}
