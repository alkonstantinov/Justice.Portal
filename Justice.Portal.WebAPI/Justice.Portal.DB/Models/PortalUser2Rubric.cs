using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalUser2Rubric
    {
        public int PortalUser2RubricId { get; set; }
        public int PortalUserId { get; set; }
        public int RubricId { get; set; }

        public virtual PortalUser PortalUser { get; set; }
        public virtual Rubric Rubric { get; set; }
    }
}
