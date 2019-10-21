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
    public class MinPKArchiveCrawler
    {
        WebClient wc;
        DB.DBFuncs db;
        //url, ime
        List<Tuple<string, string>> lUrls = new List<Tuple<string, string>>()
        {
            //new Tuple<string, string>("http://mjs.bg/103/","Предварителни обявления"),
            new Tuple<string, string>("http://mjs.bg/104/","Процедури"),
            new Tuple<string, string>("http://mjs.bg/105/","Публични покани"),
            new Tuple<string, string>("http://mjs.bg/106/","Обяви")
        };


        public MinPKArchiveCrawler(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public string Download10Times(string url)
        {
            string result = null;
            for (int i = 0; i < 10; i++)
            {
                try
                {
                    result = wc.DownloadString(url);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(url + "   " + e.Message);
                }
                System.Threading.Thread.Sleep(10000);
            }
            throw new Exception();
            return null;
        }

        public void Download()
        {


            foreach (var url in lUrls)
            {

                string page = this.Download10Times(url.Item1);

                var mcOps = Regex.Matches(page, "<div class=\"lTitle\">[^<]*?</div>\\s*<div class=\"lDate\">[0-9\\.]+</div>[\\w\\W]*?<div class=\"clear\"></div>");
                foreach (Match mOp in mcOps)
                {
                    string pageOP = mOp.Value;

                    var mTitle = Regex.Match(pageOP, "<div class=\"lTitle\">([^<]*?)<");
                    var mDate = Regex.Match(pageOP, "<div class=\"lDate\">([^<]*?)<");
                    var mText = Regex.Match(pageOP, "<div class=\"lText\">([\\w\\W]*?)</div>");
                    string text = mText.Success ? mText.Groups[1].Value : "";
                    text = url.Item2 + "<br/>" + text;


                    var op = JObject.FromObject(
                    new
                    {
                        title = JObject.FromObject(new { bg = mTitle.Groups[1].Value }),
                        type = "Архив",
                        body = JObject.FromObject(new { bg = text }),
                    }
                    );
                    var mcFiles = Regex.Matches(pageOP, "<a href=\"(/Files[^\"]+?)\"[^>]*?>([\\w\\W]+?)</a>");
                    var jaFiles = new JArray();
                    foreach (Match f in mcFiles)
                    {
                        byte[] file;
                        try
                        {
                            file = wc.DownloadData("http://mjs.bg" + f.Groups[1].Value);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                            continue;
                        }
                        //System.Threading.Thread.Sleep(1000);
                        string hash;
                        using (var md5 = MD5.Create())
                        {
                            hash = string.Join("", md5.ComputeHash(file).Select(x => x.ToString("X2")));
                        }

                        string header = wc.ResponseHeaders["Content-Disposition"] ?? string.Empty;
                        string filename = "filename=";
                        string fileName = "";
                        int index = header.LastIndexOf(filename, StringComparison.OrdinalIgnoreCase);
                        if (index > -1)
                        {
                            fileName = header.Substring(index + filename.Length);
                        }
                        else
                            fileName = Path.GetFileName(f.Groups[1].Value);
                        Blob b = new Blob()
                        {
                            Content = file,
                            ContentType = "application/octet-stream",
                            Extension = Path.GetExtension(fileName),
                            Filename = Path.GetFileName(fileName),
                            Hash = hash
                        };
                        int bID = db.AddBlob(b);
                        jaFiles.Add(
                            JObject.FromObject(
                                new
                                {
                                    id = Guid.NewGuid().ToString(),
                                    title = JObject.FromObject(new { bg = f.Groups[2].Value }),
                                    fileType = "",
                                    date = f.Groups[3].Value,
                                    file = hash
                                }
                                )
                            );
                    }

                    op["files"] = jaFiles;
                    db.SetBlock(new BlockData()
                    {
                        Block = new JSBlock()
                        {
                            BlockId = 0,
                            RubricId = 5,
                            BlockTypeId = "pkmessage",
                            Name = mTitle.Groups[1].Value.Length > 199 ? mTitle.Groups[1].Value.Substring(0, 199) : mTitle.Groups[1].Value,
                            PortalPartId = "min",
                            Url = Guid.NewGuid().ToString(),
                            Jsonvalues = op.ToString()
                        },
                        Values = new PropertyValue[]
                    {
                            new PropertyValue()
                            {
                                PropertyId = "header",
                                Value = "6"
                            },
                            new PropertyValue()
                            {
                                PropertyId = "date",
                                Value = DateTime.Parse(mDate.Groups[1].Value).ToString("yyyy-MM-dd")
                            }
                    }
                    });

                }




            }




        }

    }
}
