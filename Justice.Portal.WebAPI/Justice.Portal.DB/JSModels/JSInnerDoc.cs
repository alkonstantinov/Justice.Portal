using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSInnerDoc
    {
        public int InnerDocId { get; set; }
        public string PortalPartId { get; set; }
        public string Content { get; set; }

    }
}
