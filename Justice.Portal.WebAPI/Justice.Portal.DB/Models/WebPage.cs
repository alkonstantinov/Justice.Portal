using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class WebPage
    {
        public WebPage()
        {
            PortalPart2WebPage = new HashSet<PortalPart2WebPage>();
        }

        public string WebPageId { get; set; }
        public string WebPageName { get; set; }

        public virtual ICollection<PortalPart2WebPage> PortalPart2WebPage { get; set; }
    }
}
