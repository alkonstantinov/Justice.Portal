using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSBlockType
    {
        public JSBlockType()
        {
        }

        public string BlockTypeId { get; set; }
        public string Name { get; set; }
        public bool CanBePage { get; set; }
        public bool IsSearchable { get; set; }
    }
}
