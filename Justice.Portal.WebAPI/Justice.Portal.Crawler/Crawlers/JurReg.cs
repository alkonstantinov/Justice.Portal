using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace Justice.Portal.Crawler.Crawlers
{
    public class JurReg
    {
        WebClient wc;
        DB.DBFuncs db;
        public JurReg(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            JArray docs = new JArray();
            var found = false;

            for (int i = 1; i < 8000; i++)
            {
                try
                {
                    var page = wc.DownloadString($"http://www.nbpp.government.bg/%D0%BD%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B5%D0%BD-%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%8A%D1%80/{i}?view=nlab_register_lawyer");
                    found = !page.Contains("Запис не може да бъде зареден");
                    if (found)
                    {
                        MatchCollection dds = Regex.Matches(page, "<dd>([\\w\\W]+?)</dd>");
                        if (dds.Count < 5)
                            continue;
                        var rec = new JObject();
                        rec["id"] = Guid.NewGuid().ToString();
                        rec["a43df482-e3e6-4e41-9612-5a7470c6dad6"] = dds[0].Groups[1].ToString();
                        rec["513528b0-774c-4c13-b358-9a5ae2955417"] = dds[1].Groups[1].ToString();
                        rec["31ffe743-87c5-45d6-9b14-14944996a482"] = dds[2].Groups[1].ToString();
                        rec["5fc707a8-5165-424a-b47c-65db047f2580"] = dds[3].Groups[1].ToString();
                        rec["04ebee56-4127-4f77-8b93-60365627ac5e"] = dds[4].Groups[1].ToString();
                        rec["223b2487-2a24-4db7-83a2-c6721fe54ac2"] = dds.Count > 5 ? dds[5].Groups[1].ToString() : "";
                        docs.Add(rec);
                    }
                }
                catch
                {
                    Console.WriteLine($"Error downloading {i}");
                }
            }



            File.WriteAllText(@"d:\14.json", docs.ToString());
        }

    }
}
