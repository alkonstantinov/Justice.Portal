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
    public class CareersGdin
    {
        WebClient wc;
        DB.DBFuncs db;

        List<Tuple<string, string, int>> lUrls = new List<Tuple<string, string, int>>()
        {
            new Tuple<string, string, int>("https://www.gdin.bg/karieri/naznachavane-na-darzhavna-sluzhba-na-dlazhnosti-za-darzhavni-sluzhiteli-po-chl-19-al1-t1-zinzs/zapovedi-za-obyavyavane","page51",1006),
            new Tuple<string, string, int>("https://www.gdin.bg/karieri/naznachavane-na-darzhavna-sluzhba-na-dlazhnosti-za-darzhavni-sluzhiteli-po-chl-19-al1-t1-zinzs/rezultati-i-saobshteniya","page52",1008),
            new Tuple<string, string, int>("https://www.gdin.bg/karieri/naznachavane-na-darzhavna-sluzhba-na-dlazhnosti-za-darzhavni-sluzhiteli-po-chl-19-al1-t2-zinzs/obyavleniya",null,1009),
            new Tuple<string, string, int>("https://www.gdin.bg/karieri/naznachavane-na-darzhavna-sluzhba-na-dlazhnosti-za-darzhavni-sluzhiteli-po-chl-19-al1-t2-zinzs/spisatsi-i-saobshteniya",null,1010),
            new Tuple<string, string, int>("https://www.gdin.bg/karieri/obyavi-za-kt",null,1011),
            new Tuple<string, string, int>("https://www.gdin.bg/karieri/karierno-razvitie/zapovedi-za-obyavyavane-na-konkursi-za-izrastvane-v-karierata","page54",1012),
            new Tuple<string, string, int>("https://www.gdin.bg/karieri/karierno-razvitie/protokoli-i-spisatsi-ot-konkursni-protseduri-v-gdin-izrastvane-v-kariera","page55",1013)
        };

        public CareersGdin(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {            
            foreach (var url in lUrls)
            {
                JArray result = new JArray();
                var i = 1;
                var found = false;
                do
                {
                    var pageUrl = url.Item1;
                    if (i > 1)
                        pageUrl += "?" + url.Item2 + "=" + i.ToString();
                    i++;
                    var page = wc.DownloadString(pageUrl);
                    var mcFiles = Regex.Matches(page, "<a href=\"([^\"]+)\"[^>]*>([0-9\\.]{10}) - ([^<]+?)<");
                    found = mcFiles.Count > 0 && url.Item2 != null;
                    foreach (Match m in mcFiles)
                    {
                        try
                        {
                            byte[] file = wc.DownloadData("http://www.gdin.bg" + m.Groups[1].Value);
                            string hash;
                            using (var md5 = MD5.Create())
                            {
                                hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                            }
                            Blob b = new Blob()
                            {
                                Content = file,
                                ContentType = "application/octet-stream",
                                Extension = Path.GetExtension(m.Groups[1].Value),
                                Filename = Path.GetFileName(m.Groups[1].Value),
                                Hash = hash
                            };
                            db.AddBlob(b);

                            JObject rec = new JObject();
                            rec["id"] = Guid.NewGuid().ToString();
                            rec["ead9f5ac-a318-4b3a-a78a-a8de754052ba"] = DateTime.Parse(m.Groups[2].Value).ToString("yyyy-MM-dd");
                            rec["b771ae8f-2587-46ee-8d43-2e819f43058a"] = m.Groups[3].Value;
                            rec["2960039f-e2fb-4e2a-83fd-cc3eef410339"] = hash;
                            result.Add(rec);
                        }
                        catch
                        {
                        }
                    }
                } while (found);
                File.WriteAllText($"d:\\18-{url.Item3}.json", result.ToString());
            }
        }

    }
}
