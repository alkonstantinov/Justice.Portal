using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class PKListItem
    {
        public int BlockId { get; set; }
        public string Url { get; set; }

        public string Date { get; set; }
        public string JSONContent { get; set; }
    }
}
