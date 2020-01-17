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
    public class GdinNews
    {
        WebClient wc;
        DB.DBFuncs db;
        public GdinNews(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {

            var i = 0;
            var found = false;
            byte[] file;
            string hash;
            do
            {
                var page = wc.DownloadString($"https://www.gdin.bg/news/{i}");
                i += 6;
                var mcNews = Regex.Matches(page, "<a href=\"(https://www.gdin.bg/news[^\"]+?)\">...виж още</a>");
                found = mcNews.Count > 0;
                foreach (Match n in mcNews)
                {
                    var np = wc.DownloadString(n.Groups[1].Value);
                    var title = Regex.Match(np, "<div class=\"page-title\">\\s+<h1>([\\w\\W]+?)</h1>").Groups[1].Value;
                    title = Regex.Replace(title, "<[^>]+>", "").Replace("&nbsp;", "");
                    np = Regex.Match(np, "<div class=\"details\">([\\w\\W]+?)<div class=\"right-sidebar\">").Groups[1].Value;
                    var time = Regex.Match(np, "datetime=\"([\\w\\W]+?) ").Groups[1].Value;
                    var type = Regex.Match(np, "<span class=\"category\">([\\w\\W]+?)</span>").Groups[1].Value;
                    var mImgMain = Regex.Match(np, "<div class=\"col-md-7 col-sm-7 col-xs-12\">[\\w\\W]+?src=\"([\\w\\W]+?)\"[\\w\\W]+?</div>");
                    string imgMainPath = null;
                    if (mImgMain.Success)
                    {

                        try
                        {
                            file = wc.DownloadData(mImgMain.Groups[1].Value);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                            continue;
                        }

                        using (var md5 = MD5.Create())
                        {
                            hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                        }
                        Blob b = new Blob()
                        {
                            Content = file,
                            ContentType = "application/octet-stream",
                            Extension = Path.GetExtension(mImgMain.Groups[1].Value),
                            Filename = Path.GetFileName(mImgMain.Groups[1].Value),
                            Hash = hash
                        };
                        db.AddBlob(b);
                        imgMainPath = hash;
                    }


                    var mcPs = Regex.Matches(np, "<p[\\w\\W]*?>([\\w\\W]+?)</p>");
                    StringBuilder sb = new StringBuilder();
                    foreach (Match p in mcPs)
                    {
                        sb.AppendLine(p.Value);
                    }
                    np = sb.ToString();

                    np = Regex.Replace(np, "<[/]*div[\\w\\W]*?>", "");
                    np = Regex.Replace(np, "<[/]*a[\\w\\W]*?>", "");

                    var mcImgs = Regex.Matches(np, "<img [\\w\\W]*?src=\"([\\w\\W]+?)\"[\\w\\W]*?>");

                    List<Tuple<string, string>> lLinks = new List<Tuple<string, string>>();
                    foreach (Match f in mcImgs)
                    {
                        string fUrl = f.Groups[1].Value;

                        try
                        {
                            file = wc.DownloadData("https://www.gdin.bg" + fUrl);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                            continue;
                        }
                        using (var md5 = MD5.Create())
                        {
                            hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                        }
                        Blob b = new Blob()
                        {
                            Content = file,
                            ContentType = "application/octet-stream",
                            Extension = Path.GetExtension(fUrl),
                            Filename = Path.GetFileName(fUrl),
                            Hash = hash
                        };
                        db.AddBlob(b);
                        lLinks.Add(new Tuple<string, string>(f.Value, hash));
                    }

                    foreach (var l in lLinks)
                        np = np.Replace(l.Item1, $"<img alt='' src='https://localhost:5001/api/part/getblob?hash={l.Item2}'>");



                    BlockData bd = new BlockData()
                    {
                        Block = new JSBlock()
                        {
                            BlockId = 0,
                            BlockTypeId = type == "Новина" ? "new" : "ad",
                            Name = title.Length > 199 ? title.Substring(0, 199) : title,
                            PortalPartId = "gdin",
                            RubricId = 3,
                            
                            Url = Guid.NewGuid().ToString(),
                            Jsonvalues = JObject.FromObject(new
                            {
                                title = JObject.FromObject(new { bg = title }),
                                body = JObject.FromObject(new { bg = np }),
                                imageId = imgMainPath
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
                                Value = time
                            }
                        }
                    };

                    db.SetBlock(bd);

                }
            } while (found);
        }

    }
}
