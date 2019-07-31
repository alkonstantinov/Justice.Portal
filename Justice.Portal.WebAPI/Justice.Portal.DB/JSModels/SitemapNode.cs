using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class SitemapNode
    {
        public int BlockId { get; set; }

        public string BlockTypeId { get; set; }

        public string PortalPartId { get; set; }

        public string TitleBG { get; set; }

        public string TitleEN { get; set; }

        public List<SitemapNode> Children { get; set; }

        public SitemapNode()
        {
            this.Children = new List<SitemapNode>();
        }
    }
}
