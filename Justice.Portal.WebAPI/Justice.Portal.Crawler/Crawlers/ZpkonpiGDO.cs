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
    public class ZpkonpiGDO
    {
        WebClient wc;
        DB.DBFuncs db;
        public ZpkonpiGDO(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        private void DownloadRecurs(string path, string url, JArray result)
        {
            var page = wc.DownloadString(url);
            page = Regex.Match(page, "<h2>([\\w\\W]+?)</h2>([\\w\\W]+?)<!-- FOOTER -->").Groups[2].Value;
            var mcFiles = Regex.Matches(page, "<a\\s*href=\"(/Uploads[^\"]+?)\"[^>]*?>([^<]+)<");
            if (mcFiles.Count == 0)
            {
                var mcLinks = Regex.Matches(page, "<a\\s*href=\"([^\"]+?)\"[^>]*?>([^<]+)<");
                foreach (Match l in mcLinks)
                {
                    var newPath = path;
                    if (newPath != "")
                        newPath += "/" + l.Groups[2].Value;
                    else
                        newPath = l.Groups[2].Value;
                    DownloadRecurs(newPath, "http://www.gdo.bg" + l.Groups[1].Value, result);
                }
                return;
            }

            foreach (Match f in mcFiles)
            {

                byte[] file;
                try
                {
                    file = wc.DownloadData("http://www.gdo.bg" + f.Groups[1].Value);
                }
                catch
                {
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
                    Extension = Path.GetExtension(f.Groups[1].Value),
                    Filename = Path.GetFileName(f.Groups[1].Value),
                    Hash = hash
                };
                db.AddBlob(b);

                JObject rec = new JObject();
                rec["id"] = Guid.NewGuid().ToString();
                rec["781254eb-344b-408f-9646-c14fb8c954c9"] = path;
                rec["fd94572c-5036-48fc-87db-7d563ee1a424"] = f.Groups[2].Value;
                rec["a72ab72b-3459-4d71-8944-51983e350ca8"] = hash;
                result.Add(rec);
            }
        }

        public void Download()
        {
            JArray result = new JArray();


            DownloadRecurs("", "http://www.gdo.bg/page/c1213/deklaracii_po_tchl__35,_al__1,_t__2_ot_zpkonpi", result);



            File.WriteAllText(@"d:\24.json", result.ToString());
        }

    }
}
