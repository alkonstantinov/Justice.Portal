using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class InnerDoc
    {
        public int InnerDocId { get; set; }
        public string PortalPartId { get; set; }
        public string Content { get; set; }

        public virtual PortalPart PortalPart { get; set; }
    }
}
