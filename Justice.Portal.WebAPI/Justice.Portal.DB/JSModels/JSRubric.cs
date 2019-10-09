using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public class JSRubric
    {
        public int? RubricId { get; set; }
        public string PortalPartId { get; set; }
        public string TitleBg { get; set; }
        public string TitleEn { get; set; }
        public bool CanDel { get; set; }

    }
}
