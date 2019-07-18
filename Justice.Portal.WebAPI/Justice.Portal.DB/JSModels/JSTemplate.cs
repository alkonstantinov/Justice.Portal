using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSTemplate
    {
        public int TemplateId { get; set; }
        public string BlockTypeId { get; set; }
        public string PortalPartId { get; set; }
        public string TemplateJson { get; set; }
        public string Sources { get; set; }
        public string Title { get; set; }


    }
}
