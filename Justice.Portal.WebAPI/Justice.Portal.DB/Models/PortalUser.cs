using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalUser
    {
        public PortalUser()
        {
            PortalUser2Rubric = new HashSet<PortalUser2Rubric>();
            Session = new HashSet<Session>();
            UserAction = new HashSet<UserAction>();
        }

        public int PortalUserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<PortalUser2Rubric> PortalUser2Rubric { get; set; }
        public virtual ICollection<Session> Session { get; set; }
        public virtual ICollection<UserAction> UserAction { get; set; }
    }
}
