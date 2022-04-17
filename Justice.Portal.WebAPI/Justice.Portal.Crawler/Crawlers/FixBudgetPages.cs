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
    public class FixBudgetPages
    {
        WebClient wc;
        DB.DBFuncs db;
        public FixBudgetPages(DB.DBFuncs db)
        {
            wc = new WebClient();
            this.db = db;
        }

        public void Download()
        {
            var p1 = db.GetBlock("146e0419-a846-4b52-a2d2-83eed9d10d65");
            var p2 = db.GetBlock("91a25a42-fa37-43cc-83cf-b68094afc72b");
            string content = p1.Jsonvalues + p2.Jsonvalues;
            content = content.Replace("</p>", "|").Replace("<br>", "|");
            var parts = content.Split("|");
            JArray result = new JArray();
            foreach (var part in parts)
            {
                string date = "";
                Match mDate = Regex.Match(part, "([0-9]{1,2})\\.([0-9]{1,2})\\.([0-9]{4})");
                if (mDate.Success)
                {
                    date = $"{mDate.Groups[3].Value}-{mDate.Groups[2].Value.PadLeft(2, '0')}-{mDate.Groups[1].Value.PadLeft(2, '0')}";
                }
                else
                {
                    Match mOtherDate = Regex.Match(part, "(януари|февруари|март|април|май|юни|юли|август|септември|октомври|ноември|декември) ([0-9]{4})", RegexOptions.IgnoreCase);
                    if (mOtherDate.Success)
                    {
                        switch (mOtherDate.Groups[1].Value)
                        {
                            case "януари": date = $"{mOtherDate.Groups[2].Value}-{01}-01"; break;
                            case "февруари": date = $"{mOtherDate.Groups[2].Value}-{02}-01"; break;
                            case "март": date = $"{mOtherDate.Groups[2].Value}-{03}-01"; break;
                            case "април": date = $"{mOtherDate.Groups[2].Value}-{04}-01"; break;
                            case "май": date = $"{mOtherDate.Groups[2].Value}-{05}-01"; break;
                            case "юни": date = $"{mOtherDate.Groups[2].Value}-{06}-01"; break;
                            case "юли": date = $"{mOtherDate.Groups[2].Value}-{07}-01"; break;
                            case "август": date = $"{mOtherDate.Groups[2].Value}-{08}-01"; break;
                            case "септември": date = $"{mOtherDate.Groups[2].Value}-{09}-01"; break;
                            case "октомври": date = $"{mOtherDate.Groups[2].Value}-{10}-01"; break;
                            case "ноември": date = $"{mOtherDate.Groups[2].Value}-{11}-01"; break;
                            case "декември": date = $"{mOtherDate.Groups[2].Value}-{12}-01"; break;
                        }
                    }
                    else
                    {
                        continue;
                    }

                }
                Match mFile = Regex.Match(part, @"hash=([A-Z0-9]+)");
                Match mTitle = Regex.Match(part, @"<p>([\w\W]+?)<a");
                result.Add(JObject.FromObject(
                    new
                    {
                        id = Guid.NewGuid().ToString(),
                        title = JObject.FromObject(new
                        {
                            bg = mTitle.Groups[1].Value,
                            en = mTitle.Groups[1].Value
                        }),
                        docId = mFile.Groups[1].Value,
                        date = date
                    }
                    )); ;


            }
            JObject r = JObject.FromObject(
      new
      {
          title = JObject.FromObject(new
          {
              bg = "Финансови отчети и одитни доклади на Сметна палата"
          }),
          body = JObject.FromObject(new
          {
              bg = ""
          }),
          docs = result
      }
      );

            File.WriteAllText("d:\\502.txt", r.ToString());


        }

    }
}
