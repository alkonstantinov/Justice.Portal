using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Property
    {
        public Property()
        {
            BlockTypeProperty = new HashSet<BlockTypeProperty>();
            BlockTypePropertyValue = new HashSet<BlockTypePropertyValue>();
        }

        public string PropertyId { get; set; }
        public string Name { get; set; }
        public string PropertyType { get; set; }

        public virtual ICollection<BlockTypeProperty> BlockTypeProperty { get; set; }
        public virtual ICollection<BlockTypePropertyValue> BlockTypePropertyValue { get; set; }
    }
}
