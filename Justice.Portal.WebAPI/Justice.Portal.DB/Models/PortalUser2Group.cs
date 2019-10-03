using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalUser2Group
    {
        public int PortalUser2GroupId { get; set; }
        public int PortalUserId { get; set; }
        public int PortalGroupId { get; set; }

        public virtual PortalGroup PortalGroup { get; set; }
    }
}
