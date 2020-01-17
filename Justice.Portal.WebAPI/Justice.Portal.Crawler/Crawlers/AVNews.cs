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

    public class AVNews
    {
        WebClient wc;
        DB.DBFuncs db;
        HashSet<string> hsDownloaded = new HashSet<string>();

        public AVNews(DB.DBFuncs db)
        {
            wc = new WebClient();
            wc.BaseAddress = "https://www.registryagency.bg";
            wc.Headers.Add(HttpRequestHeader.UserAgent, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36");

            this.db = db;
        }

        private string ReplaceWhileExists(string content, string regex, string repl)
        {
            var newContent = content;
            do
            {
                content = newContent;
                newContent = Regex.Replace(content, regex, repl);
            } while (newContent != content);

            return content;
        }

        private string UploadBlob(string url)
        {
            byte[] file;
            try
            {
                file = this.DownloadData(url);
            }
            catch
            {
                return null;
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
                Extension = Path.GetExtension(url),
                Filename = Path.GetFileName(url),
                Hash = hash
            };
            db.AddBlob(b);
            return hash;
        }



        public string DownloadString(string url)
        {
            wc.BaseAddress = "https://www.registryagency.bg";
            wc.Headers.Add(HttpRequestHeader.UserAgent, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36");
            return wc.DownloadString(url);
        }

        public byte[] DownloadData(string url)
        {
            wc.BaseAddress = "https://www.registryagency.bg";
            wc.Headers.Add(HttpRequestHeader.UserAgent, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36");
            return wc.DownloadData(url);
        }

        private string ClearPage(string page)
        {
            page = ReplaceWhileExists(page, "<nav[\\w\\W]+?</nav>", "");
            page = ReplaceWhileExists(page, "<ol class=\"breadcrumb\">[\\w\\W]+?</ol>", "");
            page = ReplaceWhileExists(page, "<ul class=\"list-inline aside-links\">[\\w\\W]+?</ul><!--end-->", "");
            page = ReplaceWhileExists(page, "<aside[\\w\\W]+?</aside>", "");
            page = ReplaceWhileExists(page, "<figure[\\w\\W]+?</figure>", "");
            page = page.Replace("<img src=\"/static/images/icons/pdf.svg\" alt=\"pdf document\">", "");
            page = page.Replace("<img src=\"/static/images/icons/doc.svg\" alt=\"doc document\">", "");
            page = ReplaceWhileExists(page, "<span>\\s*<strong>Сподели</strong>[\\w\\W]+?</ul>", "");
            return page;
        }

        public void Download()
        {

            var pageNo = 1;
            var found = true;
            do
            {
                var list = DownloadString("https://www.registryagency.bg/bg/prestsentar/novini/?page=" + pageNo.ToString());
                pageNo++;
                list = Regex.Match(list, "</header>([\\w\\W]+?)<footer").Groups[1].Value;
                var mcLinks = Regex.Matches(list, "<h2>\\s*<a href=\"(/bg/prestsentar/novini/[^\"]+)\"");
                foreach (Match mLink in mcLinks)
                {
                    if (hsDownloaded.Contains(mLink.Groups[1].Value))
                    {
                        found = false;
                        break;
                    }
                    hsDownloaded.Add(mLink.Groups[1].Value);
                    var page = this.DownloadString(mLink.Groups[1].Value);
                    var title = Regex.Match(page, "<h1>([\\w\\W]+?)</h1>").Groups[1].Value;
                    page = Regex.Match(page, "</header>([\\w\\W]+?)<footer").Groups[1].Value;
                    page = ClearPage(page);

                    List<Tuple<string, string>> lBlobs = new List<Tuple<string, string>>();

                    var mb = Regex.Matches(page, "<img[\\w\\W]*?src=\"([^\"]+?)\"");
                    foreach (Match m in mb)
                    {
                        string newUrl = "https://localhost:5001/api/part/GetBlob?hash=" + UploadBlob(m.Groups[1].Value);
                        lBlobs.Add(new Tuple<string, string>(m.Groups[1].Value, newUrl));
                    }

                    mb = Regex.Matches(page, "<a[\\w\\W]*?href=\"(/media[^\"]+?)\"[\\w\\W]*?>([\\w\\W]+?)</a>");
                    foreach (Match m in mb)
                    {
                        string newUrl = "/api/part/GetBlob?hash=" + UploadBlob(m.Groups[1].Value);
                        lBlobs.Add(new Tuple<string, string>(m.Groups[1].Value, newUrl));
                    }

                    foreach (var ru in lBlobs)
                        page = page.Replace(ru.Item1, ru.Item2);




                    page = Regex.Replace(page, "<div[\\w\\W]*?>", "<br />");
                    page = Regex.Replace(page, "</*div[\\w\\W]*?>", "");
                    page = ReplaceWhileExists(page, "<br />\\s*<br />", "<br />");


                    var mDate = Regex.Match(page, "<time datetime=\"([\\w\\W]+?)\">[\\w\\W]+?</time>");
                    page = page.Replace(mDate.Value, "");


                    BlockData bd = new BlockData()
                    {
                        Block = new JSBlock()
                        {
                            BlockId = 0,
                            BlockTypeId = "new",
                            Name = title.Length > 199 ? title.Substring(0, 199) : title,
                            RubricId = 1,

                            PortalPartId = "av",
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
                                Value = "8"
                            },
                            new PropertyValue()
                            {
                                PropertyId = "date",
                                Value = DateTime.Parse(mDate.Groups[1].Value).ToString("yyyy-MM-dd")
                            }

                            }
                    };

                    db.SetBlock(bd);
                }

            } while (found);
        }
    }
}