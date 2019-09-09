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
    public class OPDU
    {
        WebClient wc;
        DB.DBFuncs db;
        public OPDU(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {

            var page = wc.DownloadString($"http://mjs.bg/2155/");
            var mPage = Regex.Match(page, "<div class=\"Panel1a\">([\\w\\W]+?)<div class=\"Panel1a_column2\">");
            var mcElements = Regex.Matches(mPage.Groups[1].Value, "<a href=\"([\\w\\W]+?)\"[\\w\\W]*?>([\\w\\W]+?)</a>");
            StringBuilder sb = new StringBuilder();
            var i = 0;
            List<Tuple<string, string>> lUrls = new List<Tuple<string, string>>();
            foreach (Match e in mcElements)
            {
                string url = e.Groups[1].Value;
                url = url.Replace("../", "");
                if (!url.StartsWith("/") && !url.Contains("http"))
                    url = "/" + url;
                if (e.Groups[2].Value.Contains("<a"))
                    continue;

                string text = e.Groups[2].Value;
                text = Regex.Replace(text, "<[^>]+>", "", RegexOptions.Multiline);


                byte[] file = url.Contains("http") ? wc.DownloadData(url) : wc.DownloadData("http://www.justice.government.bg" + url);
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
                lUrls.Add(new Tuple<string, string>(hash, text));



                i++;
                Console.WriteLine($"{i}/{mcElements.Count}");



            }

            i = 0;
            while (i < lUrls.Count - 1)
            {
                if (lUrls[i].Item1 == lUrls[i + 1].Item1)
                {
                    lUrls[i] = new Tuple<string, string>(lUrls[i].Item1, lUrls[i].Item2 + " " + lUrls[i + 1].Item2);
                    lUrls.RemoveAt(i + 1);
                }
                else i++;
            }

            foreach (var t in lUrls)
                sb.AppendLine($"<p><a href=\"/api/part/GetBlob?hash={t.Item1}\">{t.Item2}</a></p>");

            File.WriteAllText(@"d:\opdu.txt", sb.ToString());
        }

    }
}
