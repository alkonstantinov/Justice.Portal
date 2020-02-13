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
    public class Careers
    {
        WebClient wc;
        DB.DBFuncs db;
        Tuple<string, string>[] urls = new Tuple<string, string>[4] {
            new Tuple<string, string>("http://www.mjs.bg/110/", "Министерство на правосъдието"),
            new Tuple<string, string>("http://www.mjs.bg/112/", "ЦРОЗ"),
            new Tuple<string, string>("http://www.mjs.bg/114/", "ЗСВ"),
            new Tuple<string, string>("http://www.mjs.bg/115/", "ЗННД")
        };
        public Careers(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            JObject result = JObject.FromObject(new { title = JObject.FromObject(new { bg = "" }), body = JObject.FromObject(new { bg = "" }) });
            JArray data = new JArray();


            foreach (var url in urls)
            {
                var page = wc.DownloadString(url.Item1);
                var mcCareers = Regex.Matches(page, "</div>\\s+(<div class=\"lTitle\">[\\w\\W]+?)<div class=\"clear\">");

                foreach (Match m in mcCareers)
                {
                    var mTitle = Regex.Match(m.Groups[1].Value, "<div class=\"lTitle\">([^<]+?)</div>");
                    var mDate = Regex.Match(m.Groups[1].Value, "<div class=\"lDate\">([0-9\\.]{10})</div>");
                    var mText = Regex.Match(m.Groups[1].Value, "<div class=\"lText\">([^<]+?)</div>");
                    var mcFiles = Regex.Matches(m.Groups[1].Value, "<a href=\"([^\"]+?)\">([^<]*?)</a>");

                    JObject rec = JObject.FromObject(new
                    {
                        id = Guid.NewGuid().ToString(),
                        type = JObject.FromObject(new { bg = url.Item2 }),
                        title = JObject.FromObject(new
                        {
                            bg = mTitle.Success ? mTitle.Groups[1].Value : ""
                        }),
                        body = JObject.FromObject(new
                        {
                            bg = mText.Success ? mText.Groups[1].Value : ""
                        }),
                        date = DateTime.Parse(mDate.Groups[1].Value).ToString("yyyy-MM-dd"),
                        canceled = m.Groups[1].Value.Contains("Приключил!")
                    });

                    //"body":{"bg":"666","en":""},"docs":[{"id":"4874634b-09d9-40fb-a42a-349dc2e92805","title":{"bg":"8888","en":""},"link":"BA4DDD4C49C052A75D8E63302D9E8DFE"}],"date":"2019-09-07","canceled":false}]}
                    JArray docs = new JArray();
                    foreach (Match f in mcFiles)
                    {
                        try
                        {
                            Console.WriteLine($"download{f.Groups[1].Value}");
                            System.Threading.Thread.Sleep(1000);
                            byte[] file = wc.DownloadData("http://www.mjs.bg" + f.Groups[1].Value);
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
                            docs.Add(JObject.FromObject(new
                            {
                                title = JObject.FromObject(new
                                {
                                    bg = string.IsNullOrEmpty(f.Groups[2].Value) ? "..." : f.Groups[2].Value
                                }),
                                link = hash
                            }));
                        }
                        catch(Exception e)
                        {
                            Console.WriteLine(e.Message);
                        }
                    }
                    rec["docs"] = docs;
                    data.Add(rec);
                }
                result["data"] = data;
                File.WriteAllText("d:\\3.json", result.ToString());

            }





            //

        }
    }
}
