using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSBlock
    {
        public JSBlock()
        {

        }

        public int BlockId { get; set; }
        public string PortalPartId { get; set; }
        public string BlockTypeId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Jsonvalues { get; set; }
        public bool? IsActive { get; set; }
        public bool IsMain { get; set; }
        public int RubricId { get; set; }


    }
}
