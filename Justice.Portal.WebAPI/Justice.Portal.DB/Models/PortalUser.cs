using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalUser
    {
        public PortalUser()
        {
            PortalUser2Group = new HashSet<PortalUser2Group>();
            PortalUser2Part = new HashSet<PortalUser2Part>();
            PortalUser2Right = new HashSet<PortalUser2Right>();
            Session = new HashSet<Session>();
        }

        public int PortalUserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<PortalUser2Group> PortalUser2Group { get; set; }
        public virtual ICollection<PortalUser2Part> PortalUser2Part { get; set; }
        public virtual ICollection<PortalUser2Right> PortalUser2Right { get; set; }
        public virtual ICollection<Session> Session { get; set; }
    }
}
