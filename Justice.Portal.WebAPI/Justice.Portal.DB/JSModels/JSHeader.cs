using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSHeader
    {
        public int HeaderId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public string PortalPartId { get; set; }
    }
}
