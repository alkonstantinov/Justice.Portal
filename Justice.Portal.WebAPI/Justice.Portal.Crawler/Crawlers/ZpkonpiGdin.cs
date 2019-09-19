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
    public class ZpkonpiGdin
    {
        WebClient wc;
        DB.DBFuncs db;
        public ZpkonpiGdin(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            JArray result = new JArray();
            //"docs":[{"id":"116454da-620c-4ad0-b0ef-4399c561a067","title":{"bg":"24.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-24"},{"id":"48260e46-5501-404f-a609-6be3b967ea73","title":{"bg":"25.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-25"},{"id":"45a97f33-0fd4-4fd3-98dc-f12a8637bb8c","title":{"bg":"01.01.2019","en":""},"docId":"8CCD98F123163912F123C92B59A21FBF","date":"2019-01-01"},{"id":"150092ea-7bef-4c07-9684-eb8a9453072d","title":{"bg":"24.04.2019","en":""},"docId":"BA4DDD4C49C052A75D8E63302D9E8DFE","date":"2019-04-24"}]
            var page = wc.DownloadString($"https://www.gdin.bg/deklaratsii-po-zpkonpi/deklaratsii-po-chl-35");
            var mcFiles = Regex.Matches(page, "<a href=\"([^\"]+)\"[^>]*>([0-9\\.]{10}) - ([\\w\\W]+?) - ([^<]+?)<");
            foreach (Match m in mcFiles)
            {
                try
                {
                    byte[] file = wc.DownloadData("http://www.gdin.bg" + m.Groups[1].Value);
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
                    rec["8a6c22e6-d495-4404-9fcd-8e3df3c3fc2d"] = DateTime.Parse(m.Groups[2].Value).ToString("yyyy-MM-dd");
                    rec["34a42d4c-5700-415c-a271-a5a211c52eff"] = m.Groups[3].Value;
                    rec["72c76bc3-fff2-4632-8812-7142aff81aec"] = m.Groups[4].Value;
                    rec["ca4e44ea-1c0c-4fb8-a1b7-bfe4e6a13437"] = hash;
                    result.Add(rec);
                }
                catch
                {
                }
            }
            File.WriteAllText(@"d:\17.json", result.ToString());
        }

    }
}
