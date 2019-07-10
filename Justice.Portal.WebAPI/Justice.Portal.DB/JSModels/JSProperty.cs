using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSProperty
    {
        public JSProperty()
        {
        }

        public string PropertyId { get; set; }
        public string Name { get; set; }
        public string PropertyType { get; set; }

    }
}
