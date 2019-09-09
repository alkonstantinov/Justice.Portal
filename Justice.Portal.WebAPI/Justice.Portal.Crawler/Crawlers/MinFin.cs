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
    public class MinFin
    {
        WebClient wc;
        DB.DBFuncs db;
        public MinFin(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            JArray docs = new JArray();
            //"docs":[{"id":"116454da-620c-4ad0-b0ef-4399c561a067","title":{"bg":"24.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-24"},{"id":"48260e46-5501-404f-a609-6be3b967ea73","title":{"bg":"25.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-25"},{"id":"45a97f33-0fd4-4fd3-98dc-f12a8637bb8c","title":{"bg":"01.01.2019","en":""},"docId":"8CCD98F123163912F123C92B59A21FBF","date":"2019-01-01"},{"id":"150092ea-7bef-4c07-9684-eb8a9453072d","title":{"bg":"24.04.2019","en":""},"docId":"BA4DDD4C49C052A75D8E63302D9E8DFE","date":"2019-04-24"}]
            var page = "";
            for (int year = 2013; year <= DateTime.Now.Year; year++)
            {
                for (int month = 1; month < 13; month++)
                {
                    page = wc.DownloadString($"http://mjs.bg/149/{year}/{month}");
                    var mcTitles = Regex.Matches(page, "<div class=\\\"Title\\\">([\\w\\W]+?)</div>");
                    var mcDates = Regex.Matches(page, "<div class=\\\"Date\\\">([0-9\\.]+)</div>");
                    var mcFiles = Regex.Matches(page, "<a href=\\\"([^\\\"]+)\\\">Изтегли</a>");
                    for (int i = 0; i < mcDates.Count; i++)
                    {
                        try
                        {
                            byte[] file = wc.DownloadData("http://www.justice.government.bg" + mcFiles[i].Groups[1].Value);
                            string hash;
                            using (var md5 = MD5.Create())
                            {
                                hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                            }
                            Blob b = new Blob()
                            {
                                Content = file,
                                ContentType = "application/octet-stream",
                                Extension = Path.GetExtension(mcFiles[i].Groups[1].Value),
                                Filename = Path.GetFileName(mcFiles[i].Groups[1].Value),
                                Hash = hash
                            };
                            int bID = db.AddBlob(b);
                            docs.Add(
                                JObject.FromObject(
                                    new
                                    {
                                        id = Guid.NewGuid().ToString(),
                                        title = JObject.FromObject(new { bg = mcTitles[i].Groups[1].Value }),
                                        docId = hash,
                                        date = DateTime.Parse(mcDates[i].Groups[1].Value).ToString("yyyy-MM-dd")
                                    }
                                    )
                                );
                            Console.WriteLine($"date:{mcDates[i].Groups[1].Value} file:{file.Length}");

                        }
                        catch (Exception e)
                        {
                            Console.WriteLine($"error:{e.Message}");
                        }

                    }
                }
            }


            page = wc.DownloadString($"http://mjs.bg/154/");
            var mcElements = Regex.Matches(page, "<div class=\"DocumentContainer\">([\\w\\W]+?)</a>\\s+</div>\\s+</div>");
            StringBuilder sb = new StringBuilder();
            var iter = 0;
            foreach (Match e in mcElements)
            {
                var mTitle = Regex.Match(e.Groups[1].Value, "<div class=\"Title\\\">([\\w\\W]+?)</div>");
                var mcFiles = Regex.Matches(e.Groups[1].Value, "<a href=\\\"([^\\\"]+)\\\">Изтегли");
                sb.AppendLine($"<p>{mTitle.Groups[1].Value}</p>");
                sb.AppendLine($"<ul>");
                foreach (Match f in mcFiles)
                {
                    byte[] file = wc.DownloadData("http://www.justice.government.bg" + f.Groups[1].Value);
                    string hash;
                    using (var md5 = MD5.Create())
                    {
                        hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                    }
                    Blob b = new Blob()
                    {
                        Content = file,
                        ContentType = "application/octet-stream",
                        Extension = Path.GetExtension(f.Groups[1].Value),
                        Filename = Path.GetFileName(f.Groups[1].Value),
                        Hash = hash
                    };
                    db.AddBlob(b);
                    sb.AppendLine($"<li><a href=\"/api/part/GetBlob?hash={hash}\"><t>download</t></a></li>");

                }
                sb.AppendLine($"</ul>");
                iter++;
                Console.WriteLine($"{iter}/{mcElements.Count}");



            }


            JObject result = JObject.FromObject(
                new
                {
                    title = JObject.FromObject(new { bg = "Финанси" }),
                    text  = JObject.FromObject(new { bg = sb.ToString() }),
                    docs = docs
                }
                );
            File.WriteAllText(@"d:\budget.json", result.ToString());
        }

    }
}
