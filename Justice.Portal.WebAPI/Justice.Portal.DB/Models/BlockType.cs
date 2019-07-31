using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class BlockType
    {
        public BlockType()
        {
            Block = new HashSet<Block>();
            BlockTypeProperty = new HashSet<BlockTypeProperty>();
            Template = new HashSet<Template>();
        }

        public string BlockTypeId { get; set; }
        public string Name { get; set; }
        public bool CanBePage { get; set; }
        public bool IsSearchable { get; set; }

        public virtual ICollection<Block> Block { get; set; }
        public virtual ICollection<BlockTypeProperty> BlockTypeProperty { get; set; }
        public virtual ICollection<Template> Template { get; set; }
    }
}
