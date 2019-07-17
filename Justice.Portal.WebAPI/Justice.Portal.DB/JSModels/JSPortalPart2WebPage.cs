using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSPortalPart2WebPage
    {
        public int PortalPart2WebPageId { get; set; }
        public string WebPageId { get; set; }
        public string WebPageName { get; set; }
        public string PortalPartId { get; set; }
        public string Template { get; set; }
        public string Sources { get; set; }

    }
}
