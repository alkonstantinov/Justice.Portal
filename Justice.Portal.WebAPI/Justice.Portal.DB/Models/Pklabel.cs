using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Pklabel
    {
        public int PklabelId { get; set; }
        public string PklabelGroup { get; set; }
        public string TitleBg { get; set; }
        public string TitleEn { get; set; }
    }
}
