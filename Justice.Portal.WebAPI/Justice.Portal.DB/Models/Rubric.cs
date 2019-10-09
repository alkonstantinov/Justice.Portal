using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Rubric
    {
        public Rubric()
        {
            Block = new HashSet<Block>();
            PortalGroup2Rubric = new HashSet<PortalGroup2Rubric>();
            PortalUser2Rubric = new HashSet<PortalUser2Rubric>();
        }

        public int RubricId { get; set; }
        public string PortalPartId { get; set; }
        public string TitleBg { get; set; }
        public string TitleEn { get; set; }

        public virtual PortalPart PortalPart { get; set; }
        public virtual ICollection<Block> Block { get; set; }
        public virtual ICollection<PortalGroup2Rubric> PortalGroup2Rubric { get; set; }
        public virtual ICollection<PortalUser2Rubric> PortalUser2Rubric { get; set; }
    }
}
