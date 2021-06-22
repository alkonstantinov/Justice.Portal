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
    public class FixPages
    {
        WebClient wc;
        DB.DBFuncs db;
        public FixPages(DB.DBFuncs db)
        {
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            wc = new WebClient();
            this.db = db;
        }


        public void Download()
        {

            var allTemplates = db.GetTemplates(null);
            foreach (var t in allTemplates)
            {
                var template = db.GetTemplate(t.TemplateId);
                template.TemplateJson = Regex.Replace(template.TemplateJson, "<a href=\"#sectionTop\">([\\w\\W]+?)</a>", "$1");//лъва долу да е без линк
                db.SetTemplate(template);
            }

        }
            
	}
}