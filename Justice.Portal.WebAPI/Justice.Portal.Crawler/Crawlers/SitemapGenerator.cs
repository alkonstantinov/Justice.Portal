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
    public class SitemapGenerator
    {
        WebClient wc;
        DB.DBFuncs db;
        public SitemapGenerator(DB.DBFuncs db)
        {
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            wc = new WebClient();
            this.db = db;
        }

        string[] urls = new string[] { "https://mjs.bg/109/", "https://mjs.bg/109?Archiv=1" };

        public void Download()
        {
            XElement xe = XElement.Parse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                "xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\"></urlset>");
            var urls = db.GetAllPages();
            foreach (var url in urls)
            {
                xe.Add(XElement.Parse($"<url><loc>https://justice.government.bg/home/index/{url.Url}</loc></url>"));
                
                
            }
            File.WriteAllText(@"d:\sitemap.xml", xe.ToString());

        }
    }
}