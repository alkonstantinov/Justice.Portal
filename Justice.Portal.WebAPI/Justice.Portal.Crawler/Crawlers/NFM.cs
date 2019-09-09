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
    public class NFM
    {
        WebClient wc;
        DB.DBFuncs db;
        public NFM(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {

            var page = wc.DownloadString($"http://mjs.bg/132/");
            var mcElements = Regex.Matches(page, "<div class=\"DocumentContainer\">([\\w\\W]+?)</a>\\s+</div>\\s+</div>");
            StringBuilder sb = new StringBuilder();
            var i = 0;
            foreach (Match e in mcElements)
            {
                var mTitle =Regex.Match(e.Groups[1].Value, "<div class=\"Title\\\">([\\w\\W]+?)</div>");
                var mcFiles = Regex.Matches(e.Groups[1].Value, "<a href=\\\"([^\\\"]+)\\\">Изтегли");
                sb.AppendLine($"<p>{mTitle.Groups[1].Value}</p>");
                sb.AppendLine($"<ul>");
                foreach(Match f in mcFiles)
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
                i++;
                Console.WriteLine($"{i}/{mcElements.Count}");

                

            }
            File.WriteAllText(@"d:\nfm.txt", sb.ToString());
        }

    }
}
