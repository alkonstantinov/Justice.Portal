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
    public class ChildProtectionCollection
    {
        WebClient wc;
        DB.DBFuncs db;
        public ChildProtectionCollection(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            JArray result = new JArray();
            //"docs":[{"id":"116454da-620c-4ad0-b0ef-4399c561a067","title":{"bg":"24.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-24"},{"id":"48260e46-5501-404f-a609-6be3b967ea73","title":{"bg":"25.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-25"},{"id":"45a97f33-0fd4-4fd3-98dc-f12a8637bb8c","title":{"bg":"01.01.2019","en":""},"docId":"8CCD98F123163912F123C92B59A21FBF","date":"2019-01-01"},{"id":"150092ea-7bef-4c07-9684-eb8a9453072d","title":{"bg":"24.04.2019","en":""},"docId":"BA4DDD4C49C052A75D8E63302D9E8DFE","date":"2019-04-24"}]
            var page = wc.DownloadString($"http://www.mjs.bg/38/");
            var mcParts = Regex.Matches(page, "<div class=\"DocumentContainer\">\\s*<div class=\"Title\">([\\w\\W]+?)</div>\\s*<div class=\"Date\">([\\w\\W]+?)</div>[\\w\\W]+?<a href=\"([\\w\\W]+?)\"");
            
            foreach (Match m in mcParts)
            {
                byte[] file = wc.DownloadData("http://www.mjs.bg/" + m.Groups[3].Value);
                string hash;
                using (var md5 = MD5.Create())
                {
                    hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                }
                Blob b = new Blob()
                {
                    Content = file,
                    ContentType = "application/octet-stream",
                    Extension = Path.GetExtension(m.Groups[1].Value),
                    Filename = Path.GetFileName(m.Groups[1].Value),
                    Hash = hash
                };
                db.AddBlob(b);

                JObject rec = new JObject();
                rec["id"] = Guid.NewGuid().ToString();
                rec["49133545-2eae-44bb-9dc3-7bc6c8df088d"] = JObject.FromObject(new { bg = m.Groups[1].Value });
                rec["d9fe17ec-3f45-4cd0-9fd3-d0f28c713939"] = DateTime.Parse(m.Groups[2].Value).ToString("yyyy-MM-dd");
                rec["d8d7f1e5-df65-4873-a5a4-2632e381381d"] = hash;
                result.Add(rec);

            }
            File.WriteAllText(@"d:\11.json", result.ToString());
        }

    }
}
