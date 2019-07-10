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
        }

        public string BlockTypeId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Block> Block { get; set; }
        public virtual ICollection<BlockTypeProperty> BlockTypeProperty { get; set; }
    }
}
