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
    public class MinConsult
    {
        WebClient wc;
        DB.DBFuncs db;
        string[] urls = new string[] {
            "http://profile.mjs.bg/?c=16&page="
        };
        public MinConsult(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {

            foreach (var url in this.urls)
            {
                var found = false;
                var downloaded = 0;
                int pn = 0;
                do
                {                    
                    var page = wc.DownloadString(url + pn);
                    pn++;
                    var mcLinks = Regex.Matches(page, "<a href=\"(/[a-z0-9]{32})\">");
                    found = mcLinks.Count > 0;
                    foreach (Match ml in mcLinks)
                    {
                        
                        page = wc.DownloadString("http://profile.mjs.bg" + ml.Groups[1].Value);

                        var mTitle = Regex.Match(page, "<h3><i[\\w\\W]+?/i>([\\w\\W]+?)</h3>");
                        var mDate = Regex.Match(page, "Дата на създаване на преписката: ([0-9\\.]{10})</div>");
                        var mEndDate = Regex.Match(page, "Краен срок за подаване на оферти или заявления за участие: ([\\w\\W]+?)</div>");
                        var mCode = Regex.Match(page, "Идентификационен номер на електронната преписка: ([\\w\\W]+?)</div>");
                        var mStatus = Regex.Match(page, "Статус: ([\\w\\W]+?)</div>");
                        var mText = Regex.Match(page, "<div class=\"clearfix\"><hr /></div>\\s*<div class=\"clearfix\">[\\w\\W]+?</div>\\s*<div class=\"clearfix\"><hr /></div>");

                        var op = JObject.FromObject(
                            new
                            {
                                title = JObject.FromObject(new { bg = mTitle.Groups[1].Value }),
                                enddate = DateTime.Parse(mEndDate.Groups[1].Value).ToString("yyyy-MM-dd HH:mm"),
                                code = mCode.Groups[1].Value,
                                procstatus = JObject.FromObject(new { bg = mStatus.Groups[1].Value }),
                                Subject = JObject.FromObject(new { bg = mText.Groups[1].Value })
                            }
                            );

                        var mcFiles = Regex.Matches(page, "<li class=\"media well clearfix\"[\\w\\W]+?>\\s*<a class=\"pull-left\" href=\"(/file[\\w\\W]+?)\"[\\w\\W]+?</h4>\\s*([\\w\\W]+?)</div>");
                        Console.WriteLine($"download: {++downloaded} files:{mcFiles.Count}");
                        
                        var jaFiles = new JArray();
                        foreach (Match f in mcFiles)
                        {
                            byte[] file;
                            try
                            {
                                file = wc.DownloadData("http://profile.mjs.bg" + f.Groups[1].Value);
                            }
                            catch(Exception e)
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
                                BlockTypeId = "pkconsult",
                                Name = mTitle.Groups[1].Value.Length > 199 ? mTitle.Groups[1].Value.Substring(0, 199) : mTitle.Groups[1].Value,
                                PortalPartId = "min",
                                Url = Guid.NewGuid().ToString(),
                                Jsonvalues = op.ToString()
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
                                Value = DateTime.Parse(mDate.Groups[1].Value).ToString("yyyy-MM-dd")
                            }
                        }
                        });

                    }



                }
                while (found);


            }


        }

    }
}
