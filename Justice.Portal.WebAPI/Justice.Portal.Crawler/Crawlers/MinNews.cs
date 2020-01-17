using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace Justice.Portal.Crawler.Crawlers
{
    public class MinNews
    {
        WebClient wc;
        DB.DBFuncs db;
        public MinNews(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {

            var page = wc.DownloadString($"http://www.justice.government.bg/117");
            var mcNews = Regex.Matches(page, "<a href=\"(/117/[0-9]+/)\"");
            foreach (Match n in mcNews)
            {
                var np = wc.DownloadString($"http://www.justice.government.bg" + n.Groups[1].Value);
                var mData = Regex.Match(np, "<div class=\"lBorder\"></div>\\s*<div class=\"lTitle\">([^<]+)</div>\\s*<div class=\"lDate\">([^<]+)</div>\\s*<div class=\"lBorder\"></div>\\s*<div class=\"lText\">([\\w\\W]+?)</div>");
                if (mData.Success)
                {
                    BlockData bd = new BlockData()
                    {
                        Block = new JSBlock()
                        {
                            BlockId = 0,
                            BlockTypeId = "new",
                            Name = mData.Groups[1].Value.Length > 199 ? mData.Groups[1].Value.Substring(0, 199) : mData.Groups[1].Value,
                            PortalPartId = "min",
                            Url = Guid.NewGuid().ToString(),
                            RubricId = 5,
                            Jsonvalues = JObject.FromObject(new
                            {
                                title = JObject.FromObject(new { bg = mData.Groups[1].Value }),
                                body = JObject.FromObject(new { bg = mData.Groups[3].Value })
                            }).ToString()
                        },
                        Values = new PropertyValue[]
                        {
                            new PropertyValue()
                            {
                                PropertyId = "header",
                                Value = "6"
                            },
                            new PropertyValue()
                            {
                                PropertyId = "date",
                                Value = DateTime.Parse(mData.Groups[2].Value).ToString("yyyy-MM-dd")
                            }
                        }
                    };

                    db.SetBlock(bd);
                }
            }
        }

    }
}
