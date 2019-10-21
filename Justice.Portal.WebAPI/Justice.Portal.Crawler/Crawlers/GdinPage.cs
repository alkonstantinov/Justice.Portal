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
    public class GdinPage
    {
        WebClient wc;
        DB.DBFuncs db;
        public GdinPage(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            Console.Write("URL:");
            string url = Console.ReadLine();
            var page = wc.DownloadString(url);
            

            page = Regex.Match(page, "<!-- BEGIN PAGE CONTENT INNER -->[\\w\\W]*?<div class=\"col-lg-9\">([\\w\\W]*?)</div>").Groups[1].Value;


            var mcFiles = Regex.Matches(page, "<img [\\w\\W]*?src=\"([^\"]+)\"[^>]*?>");
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
                     file = fUrl.Contains("http") ? wc.DownloadData(fUrl) : wc.DownloadData("https://www.gdin.bg" + fUrl);
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
                page = page.Replace(l.Item1, $"<img alt=\"\" src='https://localhost:5001/api/part/GetBlob?hash={l.Item2}'>");

            
            File.WriteAllText(@"d:\html.txt", page);
        }

    }
}
