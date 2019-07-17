using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class PortalPart2WebPage
    {
        public int PortalPart2WebPageId { get; set; }
        public string WebPageId { get; set; }
        public string PortalPartId { get; set; }
        public string Template { get; set; }
        public string Sources { get; set; }

        public virtual PortalPart PortalPart { get; set; }
        public virtual WebPage WebPage { get; set; }
    }
}
