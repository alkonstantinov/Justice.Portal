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

    public class AVCHL12
    {
        WebClient wc;
        DB.DBFuncs db;
        HashSet<string> hsDownloaded = new HashSet<string>();

        public AVCHL12(DB.DBFuncs db)
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
            JArray result = new JArray();
            var list = DownloadString("bg/antikorupciya/deklaraciya-po-chl-12/");
            var mYears = Regex.Matches(list, "<div class=\"panel-heading\">\\s*<h3 class=\"panel-title\">Декларации за ([0-9]{4})[^<]*</h3>\\s*</div>([\\w\\W]+?)</div>\\s*</div>");
            foreach (Match my in mYears)
            {
                var mDocs = Regex.Matches(my.Groups[2].Value, "<div class=\"document\">\\s*<p>\\s*<a href=\"(/media/[^\"]+)\" target=\"_self\">\\s*([^<]+)\\s*</a><br>\\s*([^<]+)<br />([^<]+)<br>");
                foreach (Match mdoc in mDocs)
                {
                    var hash = UploadBlob(mdoc.Groups[1].Value);

                    JObject rec = new JObject();
                    rec["id"] = Guid.NewGuid().ToString();
                    rec["0fae9959-450e-49de-a0c2-4e04bbf5fc7e"] = my.Groups[1].Value;
                    rec["39ce2b63-4f0b-42ba-9d0c-7500f82f03c8"] = mdoc.Groups[2].Value.Trim();
                    rec["c08a131b-bcea-4de1-8c92-468ced002b11"] = mdoc.Groups[3].Value;
                    rec["f9fd1db6-8437-491d-9a9f-761b6f19596c"] = mdoc.Groups[4].Value;
                    rec["926778b8-2bb9-4926-8418-038df8738b8e"] = hash;
                    result.Add(rec);
                }
            }


            File.WriteAllText(@"d:\29.json", result.ToString());

        }
    }
}