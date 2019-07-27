using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalGroup2Right
    {
        public int PortalGroup2RightId { get; set; }
        public int PortalGroupId { get; set; }
        public string UserRightId { get; set; }

        public virtual PortalGroup PortalGroup { get; set; }
        public virtual UserRight UserRight { get; set; }
    }
}
