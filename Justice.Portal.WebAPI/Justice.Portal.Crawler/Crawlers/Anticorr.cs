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
    public class Anticorr
    {
        WebClient wc;
        DB.DBFuncs db;
        public Anticorr(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            JArray docs = new JArray();
            //"docs":[{"id":"116454da-620c-4ad0-b0ef-4399c561a067","title":{"bg":"24.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-24"},{"id":"48260e46-5501-404f-a609-6be3b967ea73","title":{"bg":"25.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-25"},{"id":"45a97f33-0fd4-4fd3-98dc-f12a8637bb8c","title":{"bg":"01.01.2019","en":""},"docId":"8CCD98F123163912F123C92B59A21FBF","date":"2019-01-01"},{"id":"150092ea-7bef-4c07-9684-eb8a9453072d","title":{"bg":"24.04.2019","en":""},"docId":"BA4DDD4C49C052A75D8E63302D9E8DFE","date":"2019-04-24"}]

            for (int year = 2012; year <= DateTime.Now.Year; year++)
            {
                for (int month = 1; month < 13; month++)
                {
                    var page = wc.DownloadString($"http://www.mjs.bg/62/{year}/{month}");
                    var mTable = Regex.Match(page, "<div class=\"TableS\">\\s*(<table>[\\w\\W]+?</table>)");
                    if (mTable.Success)
                    {
                        docs.Add(
                                JObject.FromObject(
                                    new
                                    {
                                        id = Guid.NewGuid().ToString(),
                                        title = JObject.FromObject(new { bg = month.ToString() + "/" + year.ToString(), en = "" }),
                                        docId = "",
                                        html = JObject.FromObject(new { bg = mTable.Groups[1].Value, en = "" }),
                                        date = new DateTime(year, month, 1).ToString("yyyy-MM-dd")
                                    }
                                    )
                                );
                    }


                }
            }

            JObject result = JObject.FromObject(
                new
                {
                    title = JObject.FromObject(new { bg = "Антикорупция" }),
                    docs = docs
                }
                );
            File.WriteAllText(@"d:\20.json", result.ToString());
        }

    }
}
