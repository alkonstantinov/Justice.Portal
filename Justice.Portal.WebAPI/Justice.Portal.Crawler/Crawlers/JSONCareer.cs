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
using System.Xml.Linq;

namespace Justice.Portal.Crawler.Crawlers
{
    public class JSONCareer
    {
        WebClient wc;
        DB.DBFuncs db;
        public JSONCareer(DB.DBFuncs db)
        {
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            wc = new WebClient();
            this.db = db;
        }


        public void Download()
        {

            var allJSONS = db.GetMinCareerJsons();
            var json = JObject.FromObject(new { title = new { bg = "" }, body = new { bg = "" }, data = new JArray() });
            foreach (var j in allJSONS)
            {

                foreach (JObject i in (JObject.Parse(j)["data"] as JArray))
                    (json["data"] as JArray).Add(i);
            }

            System.IO.File.WriteAllText(@"d:\allcareer.json", json.ToString());



        }

    }
}