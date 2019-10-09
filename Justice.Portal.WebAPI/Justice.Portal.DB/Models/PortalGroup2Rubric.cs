using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalGroup2Rubric
    {
        public int PortalGroup2RubricId { get; set; }
        public int PortalGroupId { get; set; }
        public int RubricId { get; set; }

        public virtual PortalGroup PortalGroup { get; set; }
        public virtual Rubric Rubric { get; set; }
    }
}
