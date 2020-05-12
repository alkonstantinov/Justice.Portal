using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Header
    {
        public int HeaderId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string PortalPartId { get; set; }

        public virtual PortalPart PortalPart { get; set; }
    }
}
