using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Justice.Portal.Crawler.Crawlers
{
    public class MinInterview
    {
        WebClient wc;
        DB.DBFuncs db;
        public MinInterview(DB.DBFuncs db)
        {
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            wc = new WebClient();
            this.db = db;
        }

        string[] urls = new string[] { "https://mjs.bg/109/", "https://mjs.bg/109?Archiv=1" };

        public void Download()
        {
            StringBuilder sbHtml = new StringBuilder();
            foreach (var url in urls)
            {
                var page = wc.DownloadString(url);
                page = Regex.Match(page, "<div class=\"Panel1a_column1\">([\\w\\W]+?)<div class=\"Panel1a_column2\">").Groups[1].Value;
                var mcLinks = Regex.Matches(page, "<li>\\s*<a href=\"([^\"]*?)\">([^<]*?)</a>\\s*<span class=\"listDate\">([^<]*?)</span");
                foreach (Match m in mcLinks)
                {
                    var innerPage = wc.DownloadString("https://mjs.bg" + m.Groups[1].Value);
                    innerPage = Regex.Match(innerPage, "<div class=\"Panel1a_column1\">([\\w\\W]+?)<div class=\"Panel1a_column2\">").Groups[1].Value;

                    var mAttr = Regex.Match(innerPage, "<div class=\"lTitle\">([^<]+?)</div>\\s+<div class=\"lDate\">([^<]+?)</div>");
                    var title = mAttr.Groups[1].Value;
                    var date = mAttr.Groups[2].Value;
                    var text = Regex.Match(innerPage, "<div class=\"lText\">([\\w\\W]+?)</div>\\s+<div class=\"clear\">").Groups[1].Value;
                    var id = Guid.NewGuid().ToString();
                    BlockData bd = new BlockData()
                    {
                        Block = new JSBlock()
                        {
                            BlockId = 0,
                            BlockTypeId = "text",
                            Name = "Интервю" + (title.Length > 180 ? title.Substring(0, 199) : title),
                            RubricId = 1,

                            PortalPartId = "min",
                            Url = id,
                            Jsonvalues = JObject.FromObject(new
                            {
                                title = JObject.FromObject(new { bg = title }),
                                body = JObject.FromObject(new { bg = date + "<br/>" + text })
                            }).ToString()
                        },
                        Values = new PropertyValue[]
                            {
                            new PropertyValue()
                            {
                                PropertyId = "header",
                                Value = "6"
                            }

                            }
                    };

                    db.SetBlock(bd);


                    sbHtml.AppendLine($"<p><a href=\"/home/index/{id}\">{title}</a><br/>{date}</p>");
                }

                File.WriteAllText(@"d:\html.txt", sbHtml.ToString());
            }

        }
    }
}