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
    public class ESPCHCollection
    {
        WebClient wc;
        DB.DBFuncs db;
        public ESPCHCollection(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            JArray result = new JArray();
            //"docs":[{"id":"116454da-620c-4ad0-b0ef-4399c561a067","title":{"bg":"24.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-24"},{"id":"48260e46-5501-404f-a609-6be3b967ea73","title":{"bg":"25.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-25"},{"id":"45a97f33-0fd4-4fd3-98dc-f12a8637bb8c","title":{"bg":"01.01.2019","en":""},"docId":"8CCD98F123163912F123C92B59A21FBF","date":"2019-01-01"},{"id":"150092ea-7bef-4c07-9684-eb8a9453072d","title":{"bg":"24.04.2019","en":""},"docId":"BA4DDD4C49C052A75D8E63302D9E8DFE","date":"2019-04-24"}]
            var page = wc.DownloadString($"http://172.16.0.44/47/");
            var i = 0;
            foreach (Match m in Regex.Matches(page, "<a href=\"(/47/[0-9]+/)\""))
            {
                page = wc.DownloadString($"http://172.16.0.44/" + m.Groups[1].Value);
                var mTitle = Regex.Match(page, "<div class=\"ProfileActHead\">([\\w\\W]+?)</div>");
                var mOthers = Regex.Match(page, "<td>Дата на решение:[\\w\\W]*?<td>\\s*([\\w\\W]*?)</td>[\\w\\W]*?<td>№ на жалба:[\\w\\W]*?<td>([\\w\\W]*?)</td>[\\w\\W]*?<td>Членове:[\\w\\W]*?<li>\\s*([\\w\\W]*?)\\s*</li>");
                var mDoc = Regex.Match(page, "<a href=\"([^\"]+?)\">Изтегли");
                var mLink = Regex.Match(page, "<a href=\"([^\"]+?)\">Отвори");
                byte[] file;
                try
                {
                    file = wc.DownloadData("http://172.16.0.44/" + mDoc.Groups[1].Value);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    continue;
                }

                string hash;
                using (var md5 = MD5.Create())
                {
                    hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                }
                Blob b = new Blob()
                {
                    Content = file,
                    ContentType = "application/octet-stream",
                    Extension = Path.GetExtension(mDoc.Groups[1].Value),
                    Filename = Path.GetFileName(mDoc.Groups[1].Value),
                    Hash = hash
                };
                db.AddBlob(b);
                Console.WriteLine(++i);
                JObject rec = new JObject();
                rec["id"] = Guid.NewGuid().ToString();
                rec["8832f117-e52f-4ad8-8e16-0d50742488fa"] = JObject.FromObject(new { bg = mTitle.Groups[1].Value });
                rec["988be796-1227-4ad4-95d8-ff0bf356c79c"] = DateTime.Parse(mOthers.Groups[1].Value).ToString("yyyy-MM-dd");
                rec["b9b900f5-2a6d-4a7a-8dd2-dbc4c39c37c2"] = mOthers.Groups[2].Value;
                rec["0ec35482-0a53-455f-b236-a17967a41bd8"] = hash;
                rec["8460beb6-a976-4056-8415-9c44673d8322"] = mLink.Groups[1].Value;
                rec["7c3ff3bd-073d-43b2-b472-56efb5fcb0ab"] = mOthers.Groups[3].Value;

                result.Add(rec);

            }


            File.WriteAllText(@"d:\12.json", result.ToString());
        }

    }
}
