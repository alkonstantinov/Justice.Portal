using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Collection
    {
        public int CollectionId { get; set; }
        public string Name { get; set; }
        public string Structure { get; set; }
        public string Content { get; set; }
        public string PortalPartId { get; set; }

        public virtual PortalPart PortalPart { get; set; }
    }
}
