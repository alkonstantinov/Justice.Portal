using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSUserRight
    {
        public JSUserRight()
        {
            
        }

        public int UserRightId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

    }
}
