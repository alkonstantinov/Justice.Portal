using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalPart
    {
        public PortalPart()
        {
            Block = new HashSet<Block>();
            PortalGroup2Part = new HashSet<PortalGroup2Part>();
            PortalUser2Part = new HashSet<PortalUser2Part>();
        }

        public string PortalPartId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Block> Block { get; set; }
        public virtual ICollection<PortalGroup2Part> PortalGroup2Part { get; set; }
        public virtual ICollection<PortalUser2Part> PortalUser2Part { get; set; }
    }
}
