using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class UserRight
    {
        public UserRight()
        {
            PortalUser2Right = new HashSet<PortalUser2Right>();
        }

        public int UserRightId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public virtual ICollection<PortalUser2Right> PortalUser2Right { get; set; }
    }
}
