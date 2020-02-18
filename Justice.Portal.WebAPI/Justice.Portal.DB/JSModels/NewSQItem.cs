using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class NewSQItem
    {
        public int BlockId { get; set; }
        public string Url { get; set; }

        public string Date { get; set; }
        public string JSONContent { get; set; }

        public JObject JSON { get; set; }
    }
}
