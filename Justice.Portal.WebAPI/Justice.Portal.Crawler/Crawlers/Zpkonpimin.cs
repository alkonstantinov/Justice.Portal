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
    public class Zpkonpimin
    {
        WebClient wc;
        DB.DBFuncs db;
        public Zpkonpimin(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            
            //"docs":[{"id":"116454da-620c-4ad0-b0ef-4399c561a067","title":{"bg":"24.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-24"},{"id":"48260e46-5501-404f-a609-6be3b967ea73","title":{"bg":"25.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-25"},{"id":"45a97f33-0fd4-4fd3-98dc-f12a8637bb8c","title":{"bg":"01.01.2019","en":""},"docId":"8CCD98F123163912F123C92B59A21FBF","date":"2019-01-01"},{"id":"150092ea-7bef-4c07-9684-eb8a9453072d","title":{"bg":"24.04.2019","en":""},"docId":"BA4DDD4C49C052A75D8E63302D9E8DFE","date":"2019-04-24"}]
            List<string> lUrls = new List<string>() { "http://mjs.bg/2170/", "http://mjs.bg/2171/" };
            for (int pn = 0; pn < lUrls.Count - 1; pn++)
            {

                JArray result = new JArray();


                var page = wc.DownloadString(lUrls[pn]);
                var mcFiles = Regex.Matches(page, "<a\\s*href=\"([^\"]+?/Files[^\"]+)\">([^<]+)<");
                foreach (Match m in mcFiles)
                {
                    if (m.Groups[2].Value.Contains("ЗПКОНПИ"))
                        continue;
                    try
                    {
                        var url = m.Groups[1].Value;
                        url = url.Replace("../", "");
                        if (!url.Contains("http://mjs.bg/"))
                            url = "http://mjs.bg/" + url;
                        byte[] file = wc.DownloadData(url);
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
                        rec["49a60721-065c-4686-8284-e315ff99443c"] = JObject.FromObject(new { bg = m.Groups[2].Value });
                        rec["28ba0b81-430c-4f68-bfed-b0d4c4ce9b85"] = hash;
                        result.Add(rec);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }

                }
                File.WriteAllText(@"d:\2-" + pn.ToString() + ".json", result.ToString());
            }
        }

    }
}
