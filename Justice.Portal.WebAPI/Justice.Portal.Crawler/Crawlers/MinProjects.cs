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
    public class MinProjects
    {
        WebClient wc;
        DB.DBFuncs db;
        public MinProjects(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {

            var page = wc.DownloadString("http://www.justice.government.bg/15/");
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("<figure class=\"table\"><table><tbody>");
            foreach(Match m in Regex.Matches(page,"<div class=\"Title\">([^<]*?)</div><div class=\"Date\">([^<]*?)</div>([\\w\\W]*?)</div></div>"))
            {
                sb.AppendLine($"<tr><td><h2>{m.Groups[1].Value}</h2>");
                sb.AppendLine($"<p>{m.Groups[2].Value}</p>");
                foreach (Match f in Regex.Matches(m.Groups[3].Value, "href=\"([^\"]+?)\""))
                {
                    try
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
                        int bID = db.AddBlob(b);
                        sb.AppendLine($"<p><a href=\"/api/part/GetBlob?hash={hash}\">Изтегли</a></p>");
                    }
                    catch
                    {

                    }
                }
                sb.AppendLine($"</td></tr>");
            }
            sb.AppendLine($"</tbody></table></figure>");
            File.WriteAllText(@"d:\project.txt", sb.ToString());
        }

    }
}
