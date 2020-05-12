using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalPart
    {
        public PortalPart()
        {
            Block = new HashSet<Block>();
            Collection = new HashSet<Collection>();
            Header = new HashSet<Header>();
            InnerDoc = new HashSet<InnerDoc>();
            PortalGroup2Part = new HashSet<PortalGroup2Part>();
            PortalUser2Part = new HashSet<PortalUser2Part>();
            Rubric = new HashSet<Rubric>();
            Template = new HashSet<Template>();
        }

        public string PortalPartId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Block> Block { get; set; }
        public virtual ICollection<Collection> Collection { get; set; }
        public virtual ICollection<Header> Header { get; set; }
        public virtual ICollection<InnerDoc> InnerDoc { get; set; }
        public virtual ICollection<PortalGroup2Part> PortalGroup2Part { get; set; }
        public virtual ICollection<PortalUser2Part> PortalUser2Part { get; set; }
        public virtual ICollection<Rubric> Rubric { get; set; }
        public virtual ICollection<Template> Template { get; set; }
    }
}
