using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalUser2Right
    {
        public int PortalUser2RightId { get; set; }
        public int PortalUserId { get; set; }
        public int UserRightId { get; set; }

        public virtual PortalUser PortalUser { get; set; }
        public virtual UserRight UserRight { get; set; }
    }
}
