using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Template
    {
        public int TemplateId { get; set; }
        public string BlockTypeId { get; set; }
        public string PortalPartId { get; set; }
        public string TemplateJson { get; set; }
        public string Sources { get; set; }

        public virtual BlockType BlockType { get; set; }
        public virtual PortalPart PortalPart { get; set; }
    }
}
