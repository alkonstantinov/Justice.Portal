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
using System.Web;

namespace Justice.Portal.Crawler.Crawlers
{
    public class NLABNews
    {
        WebClient wc;
        DB.DBFuncs db;
        public NLABNews(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        private string GetDate(string s)
        {
            Match m = Regex.Match(s, "([0-9]{2}) ([а-яА-Я]+?) ([0-9]{4})");
            int day = int.Parse(m.Groups[1].Value);
            int month = 1;
            switch (m.Groups[2].Value.ToLower())
            {
                case "януари": month = 1; break;
                case "февруари": month = 2; break;
                case "март": month = 3; break;
                case "април": month = 4; break;
                case "май": month = 5; break;
                case "юни": month = 6; break;
                case "юли": month = 7; break;
                case "август": month = 8; break;
                case "септември": month = 9; break;
                case "октомври": month = 10; break;
                case "ноември": month = 11; break;
                case "декември": month = 12; break;
            }
            int year = int.Parse(m.Groups[3].Value);
            return new DateTime(year, month, day).ToString("yyyy-MM-dd");

        }

        public void Download()
        {
            var i = 0;
            var found = false;
            do
            {
                var page = wc.DownloadString($"http://www.nbpp.government.bg/%D0%BD%D0%BE%D0%B2%D0%B8%D0%BD%D0%B8?start={i}");
                i += 20;
                var mcNews = Regex.Matches(page, "<h2>\\s+<a href=\"(/новини/[\\w\\W]+?)\"");
                found = mcNews.Count > 0;
                foreach (Match n in mcNews)
                {
                    var url = HttpUtility.UrlEncode(n.Groups[1].Value).Replace("%2f", "/");
                    var np = wc.DownloadString($"http://www.nbpp.government.bg" + url);
                    Match mp = Regex.Match(np, "</h2>\\s*([\\w\\W]+?)<div class=\"articleInfoFooter\">([\\w\\W]+?)</div>");

                    page = mp.Groups[1].Value;
                    var mcPs = Regex.Matches(page, "<p>[\\w\\W]*?</p>");
                    var title = Regex.Match(np, "<h2>\\s*<a [\\w\\W]+?>\\s*([\\w\\W]+?)</a>").Groups[1].Value;
                    StringBuilder sbPage = new StringBuilder();
                    foreach (Match p in mcPs)
                        sbPage.AppendLine(p.Value);
                    page = sbPage.ToString();
                    var mcFiles = Regex.Matches(page.ToString(), "<a [\\w\\W]*?href=\"([\\w\\W]+?\\.[a-z]{3,4})\"[\\w\\W]*?>");
                    List<Tuple<string, string>> lLinks = new List<Tuple<string, string>>();
                    foreach (Match f in mcFiles)
                    {
                        string fUrl = f.Groups[1].Value;

                        fUrl = fUrl.Replace("../", "");
                        if (!fUrl.StartsWith("/") && !fUrl.Contains("http"))
                            fUrl = "/" + fUrl;
                        byte[] file;
                        try
                        {
                            file = fUrl.Contains("http") ? wc.DownloadData(fUrl) : wc.DownloadData("http://www.nbpp.government.bg" + fUrl);
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
                            Extension = Path.GetExtension(fUrl),
                            Filename = Path.GetFileName(fUrl),
                            Hash = hash
                        };
                        db.AddBlob(b);
                        lLinks.Add(new Tuple<string, string>(f.Value, hash));
                    }

                    foreach (var l in lLinks)
                        page = page.Replace(l.Item1, $"<a href='/api/part/getblob?hash={l.Item2}'>");


                    BlockData bd = new BlockData()
                    {
                        Block = new JSBlock()
                        {
                            BlockId = 0,
                            BlockTypeId = "new",
                            Name = title.Length > 199 ? title.Substring(0, 199) : title,
                            PortalPartId = "nbpp",
                            RubricId = 6,
                            Url = Guid.NewGuid().ToString(),
                            Jsonvalues = JObject.FromObject(new
                            {
                                title = JObject.FromObject(new { bg = title }),
                                body = JObject.FromObject(new { bg = page })
                            }).ToString()
                        },
                        Values = new PropertyValue[]
                        {
                                    new PropertyValue()
                                    {
                                        PropertyId = "header",
                                        Value = "10"
                                    },
                                    new PropertyValue()
                                    {
                                        PropertyId = "date",
                                        Value = GetDate(mp.Groups[2].Value)
                                    }
                        }
                    };

                    db.SetBlock(bd);

                }
            } while (found);


            //var mcNews = Regex.Matches(page, "<a href=\"(/117/[0-9]+/)\"");
            //foreach (Match n in mcNews)
            //{
            //    var np = wc.DownloadString($"http://www.justice.government.bg" + n.Groups[1].Value);
            //    var mData = Regex.Match(np, "<div class=\"lBorder\"></div>\\s*<div class=\"lTitle\">([^<]+)</div>\\s*<div class=\"lDate\">([^<]+)</div>\\s*<div class=\"lBorder\"></div>\\s*<div class=\"lText\">([\\w\\W]+?)</div>");
            //    if (mData.Success)
            //    {
            //        BlockData bd = new BlockData()
            //        {
            //            Block = new JSBlock()
            //            {
            //                BlockId = 0,
            //                BlockTypeId = "new",
            //                Name = mData.Groups[1].Value.Length > 199 ? mData.Groups[1].Value.Substring(0, 199) : mData.Groups[1].Value,
            //                PortalPartId = "min",
            //                Url = Guid.NewGuid().ToString(),
            //                Jsonvalues = JObject.FromObject(new
            //                {
            //                    title = JObject.FromObject(new { bg = mData.Groups[1].Value }),
            //                    body = JObject.FromObject(new { bg = mData.Groups[3].Value })
            //                }).ToString()
            //            },
            //            Values = new PropertyValue[]
            //            {
            //                new PropertyValue()
            //                {
            //                    PropertyId = "header",
            //                    Value = "6"
            //                },
            //                new PropertyValue()
            //                {
            //                    PropertyId = "date",
            //                    Value = DateTime.Parse(mData.Groups[2].Value).ToString("yyyy-MM-dd")
            //                }
            //            }
            //        };

            //        db.SetBlock(bd);
            //    }
            //}
        }

    }
}
