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
    public class CitizenshipProtoPage
    {
        WebClient wc;
        DB.DBFuncs db;
        public CitizenshipProtoPage(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            
            string url = "http://mjs.bg/25/";
            var page = wc.DownloadString(url);
            page = Regex.Match(page, "<div class=\"Panel1a_column1\">([\\w\\W]+?)<div class=\"Panel1a_column2\">").Groups[1].Value;
            var mcFiles = Regex.Matches(page, "<a href=\"(/[0-9]+/[0-9]+/)\">([\\w\\W]*?)<");
            List<Tuple<string, string, string>> lLinks = new List<Tuple<string, string, string>>();
            int iter = 0;
            foreach (Match f in mcFiles)
            {
                Console.WriteLine($"{++iter} of {mcFiles.Count}");
                string fUrl = "http://mjs.bg"+f.Groups[1].Value;

                string proto = wc.DownloadString(fUrl);
                proto = Regex.Match(proto, "<div class=\"Title\">([\\w\\W]+?)<div class=\"clear\"></div>").Groups[1].Value;
                proto = Regex.Replace(proto, "<[/]*div[\\w\\W]*?>", "\r\n");
                proto = Regex.Replace(proto, "<[/]*span[\\w\\W]*?>", "");
                proto = Regex.Replace(proto, "<[/]*img[\\w\\W]*?>", "");
                proto = proto.Replace("<br />", "\r\n");
                string hash;
                using (var md5 = MD5.Create())
                {
                    hash = string.Join("", md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(proto)).Select(x => x.ToString("X2")));
                }
                Blob b = new Blob()
                {
                    Content = System.Text.Encoding.UTF8.GetBytes(proto),
                    ContentType = "text/plain; charset=UTF-8",
                    Extension = ".txt",
                    Filename = Guid.NewGuid().ToString()+ ".txt",
                    Hash = hash
                };
                db.AddBlob(b);
                lLinks.Add(new Tuple<string, string, string>(f.Value, hash, f.Groups[2].Value.Trim()));
            }

            foreach (var l in lLinks)
                page = page.Replace(l.Item1, $"<a href='/api/part/getblob?hash={l.Item2}'>{l.Item3}<");

            page = Regex.Replace(page, "<[/]*div[\\w\\W]*?>", "");
            page = Regex.Replace(page, "<[/]*span[\\w\\W]*?>", "");
            page = Regex.Replace(page, "<[/]*img[\\w\\W]*?>", "");

            File.WriteAllText(@"d:\html.txt", page);
        }

    }
}
