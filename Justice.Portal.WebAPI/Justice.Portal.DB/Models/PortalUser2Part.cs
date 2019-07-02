using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalUser2Part
    {
        public int PortalUser2PartId { get; set; }
        public int PortalUserId { get; set; }
        public int PortalPartId { get; set; }

        public virtual PortalPart PortalPart { get; set; }
        public virtual PortalUser PortalUser { get; set; }
    }
}
