using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalGroup2Part
    {
        public int PortalGroup2PartId { get; set; }
        public int PortalGroupId { get; set; }
        public string PortalPartId { get; set; }

        public virtual PortalGroup PortalGroup { get; set; }
        public virtual PortalPart PortalPart { get; set; }
    }
}
