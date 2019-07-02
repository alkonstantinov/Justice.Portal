using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalPart
    {
        public PortalPart()
        {
            PortalGroup2Part = new HashSet<PortalGroup2Part>();
            PortalUser2Part = new HashSet<PortalUser2Part>();
        }

        public int PortalPartId { get; set; }
        public string Name { get; set; }
        public string PartKey { get; set; }

        public virtual ICollection<PortalGroup2Part> PortalGroup2Part { get; set; }
        public virtual ICollection<PortalUser2Part> PortalUser2Part { get; set; }
    }
}
