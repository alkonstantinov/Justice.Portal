using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalGroup
    {
        public PortalGroup()
        {
            PortalGroup2Part = new HashSet<PortalGroup2Part>();
            PortalGroup2Right = new HashSet<PortalGroup2Right>();
            PortalGroup2Rubric = new HashSet<PortalGroup2Rubric>();
            PortalUser2Group = new HashSet<PortalUser2Group>();
        }

        public int PortalGroupId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<PortalGroup2Part> PortalGroup2Part { get; set; }
        public virtual ICollection<PortalGroup2Right> PortalGroup2Right { get; set; }
        public virtual ICollection<PortalGroup2Rubric> PortalGroup2Rubric { get; set; }
        public virtual ICollection<PortalUser2Group> PortalUser2Group { get; set; }
    }
}
