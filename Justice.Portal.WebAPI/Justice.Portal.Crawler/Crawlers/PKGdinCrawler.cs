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
    public class PKGdinCrawler
    {
        WebClient wc;
        DB.DBFuncs db;
        //url, ime
        List<Tuple<string, string>> lUrls = new List<Tuple<string, string>>()
        {
            new Tuple<string, string>("http://profile.gdin.bg/?c=1","Процедури"),
            new Tuple<string, string>("http://profile.gdin.bg/?c=2","Обяви/публични покани"),
            new Tuple<string, string>("http://profile.gdin.bg/?c=3","Пазарни консултации")
        };


        public PKGdinCrawler(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public string Download10Times(string url, string cookies)
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
            wc.DownloadString("http://profile.gdin.bg/");
            //string sid = Regex.Match(wc.ResponseHeaders["Set-Cookie"], "PHPSESSID=([^;]+?);").Groups[1].Value;
            string cookies = wc.ResponseHeaders["Set-Cookie"];
            wc.Headers.Add(HttpRequestHeader.Cookie, cookies);
            for (int year = 2014; year <= DateTime.Now.Year; year++)
            {
                wc.DownloadString("http://profile.gdin.bg/?year=" + year);

                foreach (var url in lUrls)
                {
                    var page = 0;
                    var found = false;
                    do
                    {

                        string pageLinks = this.Download10Times(url.Item1 + "&page=" + page.ToString(), cookies);

                        page++;
                        var mcLinks = Regex.Matches(pageLinks, "<h6>\\s*<a href=\"(/[^\"]{32})\"");
                        found = mcLinks.Count > 0;
                        foreach (Match lnk in mcLinks)
                        {
                            string pageOP = this.Download10Times("http://profile.gdin.bg" + lnk.Groups[1].Value, cookies);

                            var mTitle = Regex.Match(pageOP, "<h4><i[\\w\\W]+?/i>([\\w\\W]+?)</h4>");
                            var mDate = Regex.Match(pageOP, "Дата на създаване на преписката: ([0-9\\.]{10})</div>");
                            var mText = Regex.Match(pageOP, "<div class=\"page-header\">[\\w\\W]+?</div>[\\w\\W]*?>([\\w\\W]+?)<hr />");
                            string text = mText.Groups[1].Value;
                            text = text.Replace("</div>", "<br />");
                            text = Regex.Replace(text, "<[/]*div[\\w\\W]*?>", "");
                            text = Regex.Replace(text, "<[/]*i[\\w\\W]*?>", "");


                            var op = JObject.FromObject(
                            new
                            {
                                title = JObject.FromObject(new { bg = mTitle.Groups[1].Value }),
                                type = url.Item2,
                                body = JObject.FromObject(new { bg = text }),
                            }
                            );
                            var mcFiles = Regex.Matches(pageOP, "<a href=\"(/file[^\"]+?)\"[^>]+?>([\\w\\W]+?)</a>\\s*<small>([^<]+?)</small>");
                            var jaFiles = new JArray();
                            foreach (Match f in mcFiles)
                            {
                                byte[] file;
                                try
                                {
                                    file = wc.DownloadData("http://profile.gdin.bg" + f.Groups[1].Value);
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
                                    fileName = Guid.NewGuid().ToString() + ".pdf";
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
                                            date = f.Groups[3].Value,
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
                                    RubricId = 3,
                                    BlockTypeId = "pkmessage",
                                    Name = mTitle.Groups[1].Value.Length > 199 ? mTitle.Groups[1].Value.Substring(0, 199) : mTitle.Groups[1].Value,
                                    PortalPartId = "gdin",
                                    Url = Guid.NewGuid().ToString(),
                                    Jsonvalues = op.ToString()
                                },
                                Values = new PropertyValue[]
                            {
                            new PropertyValue()
                            {
                                PropertyId = "header",
                                Value = "11"
                            },
                            new PropertyValue()
                            {
                                PropertyId = "date",
                                Value = DateTime.Parse(mDate.Groups[1].Value).ToString("yyyy-MM-dd")
                            }
                            }
                            });

                        }
                    } while (found);



                }

            }


        }

    }
}
