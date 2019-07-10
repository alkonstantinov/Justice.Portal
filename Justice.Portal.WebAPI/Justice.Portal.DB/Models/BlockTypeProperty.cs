using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class BlockTypeProperty
    {
        public int BlockTypePropertyId { get; set; }
        public string BlockTypeId { get; set; }
        public string PropertyId { get; set; }

        public virtual BlockType BlockType { get; set; }
        public virtual Property Property { get; set; }
    }
}
