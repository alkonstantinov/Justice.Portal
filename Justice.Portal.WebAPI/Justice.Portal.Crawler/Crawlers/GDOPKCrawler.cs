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
    public class GDOPKCrawler
    {
        WebClient wc;
        DB.DBFuncs db;
        public GDOPKCrawler(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        List<Tuple<string,string>> urls = new List<Tuple<string, string>>()
        {
            new Tuple<string, string>("http://www.gdo.bg/jobs/p57","Първоначално постъпване"),
            new Tuple<string, string>("http://www.gdo.bg/jobs/p58","Вътрешно израстване"),
            new Tuple<string, string>("http://www.gdo.bg/orders/p55","Предварителни обявления"),
            new Tuple<string, string>("http://www.gdo.bg/orders/p56","Обществени поръчки")
        };

        public string Download10Times(string url)
        {
            string result = null;
            for (int i = 0; i < 10; i++)
            {
                try
                {
                    result = wc.DownloadString(url);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(url + "   " + e.Message);
                }
                System.Threading.Thread.Sleep(10000);
            }
            throw new Exception();
            return null;
        }

        public void Download()
        {
            JArray docs = new JArray();
            //"docs":[{"id":"116454da-620c-4ad0-b0ef-4399c561a067","title":{"bg":"24.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-24"},{"id":"48260e46-5501-404f-a609-6be3b967ea73","title":{"bg":"25.04.2016","en":""},"docId":"4C3216697058FE257B4A264CBE69A861","date":"2016-04-25"},{"id":"45a97f33-0fd4-4fd3-98dc-f12a8637bb8c","title":{"bg":"01.01.2019","en":""},"docId":"8CCD98F123163912F123C92B59A21FBF","date":"2019-01-01"},{"id":"150092ea-7bef-4c07-9684-eb8a9453072d","title":{"bg":"24.04.2019","en":""},"docId":"BA4DDD4C49C052A75D8E63302D9E8DFE","date":"2019-04-24"}]
            foreach (var url in urls)
            {
                var page = 1;
                var found = false;
                do
                {

                    string pageLinks = this.Download10Times(url.Item1 + "?page=" + page.ToString());

                    page++;
                    var mcLinks = Regex.Matches(pageLinks, "<div class=\"item-title\">\\s*<a href=\"([^\"]+?)\">([^<]+?)</a>\\s+</div>\\s+<div class=\"item-published\">([^<]+?)<");
                    found = mcLinks.Count > 0;
                    foreach (Match lnk in mcLinks)
                    {

                        var title = lnk.Groups[2].Value;
                        var date = lnk.Groups[3].Value.Trim();
                        string pageOP = this.Download10Times("http://www.gdo.bg" + lnk.Groups[1].Value);
                        var mText = Regex.Match(pageOP, "</h2>([\\w\\W]+?)<div class=\"item-docs\">").Groups[1].Value;
                        string text = mText;
                        text = text.Replace("<div class=\"display-label\">", "<br />");
                        text = Regex.Replace(text, "<[/]*div[\\w\\W]*?>", "");
                        text = Regex.Replace(text, "<[/]*i[\\w\\W]*?>", "");


                        var op = JObject.FromObject(
                        new
                        {
                            title = JObject.FromObject(new { bg = lnk.Groups[2].Value }),
                            type = url.Item2,
                            body = JObject.FromObject(new { bg = text }),
                        }
                        );
                        var mcFiles = Regex.Matches(pageOP, "<a href=\"(/Uploads[^\"]+?)\">([\\w\\W]+?)</a>[\\w\\W]+?<td class=\"publ\">([0-9\\.]+?)</td>");
                        var jaFiles = new JArray();
                        foreach (Match f in mcFiles)
                        {
                            byte[] file;
                            try
                            {
                                file = wc.DownloadData("http://www.gdo.bg" + f.Groups[1].Value);
                            }
                            catch (Exception e)
                            {
                                Console.WriteLine(e.Message);
                                continue;
                            }
                            System.Threading.Thread.Sleep(1000);
                            string hash;
                            using (var md5 = MD5.Create())
                            {
                                hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                            }

                            string header = wc.ResponseHeaders["Content-Disposition"] ?? string.Empty;
                            string filename = "filename=";
                            string fileName = "";
                            int index = header.LastIndexOf(filename, StringComparison.OrdinalIgnoreCase);
                            if (index > -1)
                            {
                                fileName = header.Substring(index + filename.Length);
                            }
                            else
                                fileName = Guid.NewGuid().ToString() + Path.GetExtension(f.Groups[1].Value);
                            Blob b = new Blob()
                            {
                                Content = file,
                                ContentType = "application/octet-stream",
                                Extension = Path.GetExtension(fileName),
                                Filename = Path.GetFileName(fileName),
                                Hash = hash
                            };
                            int bID = db.AddBlob(b);
                            jaFiles.Add(
                                JObject.FromObject(
                                    new
                                    {
                                        id = Guid.NewGuid().ToString(),
                                        title = JObject.FromObject(new { bg = f.Groups[2].Value }),
                                        fileType = "",
                                        date = DateTime.Parse(f.Groups[3].Value).ToString("yyyy-MM-dd"),
                                        file = hash
                                    }
                                    )
                                );
                        }

                        op["files"] = jaFiles;
                        db.SetBlock(new BlockData()
                        {
                            Block = new JSBlock()
                            {
                                BlockId = 0,
                                RubricId = 4,
                                BlockTypeId = "pkmessage",
                                Name = title.Length > 199 ? title.Substring(0, 199) : title,
                                PortalPartId = "gdo",
                                Url = Guid.NewGuid().ToString(),
                                Jsonvalues = op.ToString()
                            },
                            Values = new PropertyValue[]
                        {
                            new PropertyValue()
                            {
                                PropertyId = "header",
                                Value = "12"
                            },
                            new PropertyValue()
                            {
                                PropertyId = "date",
                                Value = DateTime.Parse(date).ToString("yyyy-MM-dd")
                            }
                        }
                        });

                    }
                } while (found);



            }


        }

    }
}
