using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSPortalGroup
    {
        public JSPortalGroup()
        {

        }

        public int? PortalGroupId { get; set; }
        public string Name { get; set; }
        public bool? CanDel { get; set; }
        public string[] Parts { get; set; }
        public string[] Rights { get; set; }
        public int[] Rubrics { get; set; }



    }
}
