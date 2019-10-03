using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalPart
    {
        public PortalPart()
        {
            Block = new HashSet<Block>();
            InnerDoc = new HashSet<InnerDoc>();
            PortalGroup2Part = new HashSet<PortalGroup2Part>();
            PortalUser2Part = new HashSet<PortalUser2Part>();
            Template = new HashSet<Template>();
        }

        public string PortalPartId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Block> Block { get; set; }
        public virtual ICollection<InnerDoc> InnerDoc { get; set; }
        public virtual ICollection<PortalGroup2Part> PortalGroup2Part { get; set; }
        public virtual ICollection<PortalUser2Part> PortalUser2Part { get; set; }
        public virtual ICollection<Template> Template { get; set; }
    }
}
