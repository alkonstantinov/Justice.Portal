using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Block
    {
        public Block()
        {
            BlockTypePropertyValue = new HashSet<BlockTypePropertyValue>();
        }

        public int BlockId { get; set; }
        public string PortalPartId { get; set; }
        public string BlockTypeId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Jsonvalues { get; set; }
        public bool? IsActive { get; set; }
        public int RubricId { get; set; }
        public bool IsMain { get; set; }

        public virtual BlockType BlockType { get; set; }
        public virtual PortalPart PortalPart { get; set; }
        public virtual Rubric Rubric { get; set; }
        public virtual ICollection<BlockTypePropertyValue> BlockTypePropertyValue { get; set; }
    }
}
