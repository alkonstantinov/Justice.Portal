using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSPortalPart
    {
        public JSPortalPart()
        {
        }

        public int PortalPartId { get; set; }
        public string Name { get; set; }
        public string PartKey { get; set; }

    }
}
