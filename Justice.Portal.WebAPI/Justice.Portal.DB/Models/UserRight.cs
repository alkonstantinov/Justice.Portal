using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class UserRight
    {
        public UserRight()
        {
            PortalGroup2Right = new HashSet<PortalGroup2Right>();
            PortalUser2Right = new HashSet<PortalUser2Right>();
        }

        public string UserRightId { get; set; }
        public string Description { get; set; }

        public virtual ICollection<PortalGroup2Right> PortalGroup2Right { get; set; }
        public virtual ICollection<PortalUser2Right> PortalUser2Right { get; set; }
    }
}
