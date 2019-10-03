using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalUser
    {
        public PortalUser()
        {
            Session = new HashSet<Session>();
        }

        public int PortalUserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<Session> Session { get; set; }
    }
}
