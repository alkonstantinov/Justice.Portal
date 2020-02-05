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
    public class CrawlPage
    {
        WebClient wc;
        DB.DBFuncs db;
        public CrawlPage(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            Console.Write("URL:");
            string url = Console.ReadLine();
            var page = wc.DownloadString(url);
            page = Regex.Match(page, "<div class=\"Panel1a_column1\">([\\w\\W]+?)<div class=\"Panel1a_column2\">").Groups[1].Value;
            var mcFiles = Regex.Matches(page, "<a [\\w\\W]*?href=\"([\\w\\W]+?\\.[a-z]{3,4})\"[\\w\\W]*?>");
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
                     file = fUrl.Contains("http") ? wc.DownloadData(fUrl) : wc.DownloadData("http://mjs.bg" + fUrl);
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

            page = Regex.Replace(page, "<[/]*div[\\w\\W]*?>", "");
            page = Regex.Replace(page, "<[/]*span[\\w\\W]*?>", "");
            page = Regex.Replace(page, "<[/]*img[\\w\\W]*?>", "");

            File.WriteAllText(@"d:\html.txt", page);
        }

    }
}
