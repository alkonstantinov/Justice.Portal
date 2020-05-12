using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;
using System.Xml.Xsl;
using System.Text.RegularExpressions;
using Justice.Portal.DB.JSModels;
using Microsoft.AspNet.Mvc.ViewFeatures;
using System.Reflection;
using System.Xml.Serialization;

namespace Justice.Portal.Web.Services
{
    public class CielaComm : ICielaComm
    {
        string credentials;
        string xsl;
        string url;

        public CielaComm(string url, string credentials, string xsl)
        {
            this.url = url;

            this.credentials = credentials;
            this.xsl = xsl;
        }


        public string GetDocument(Int64 id)
        {
            XElement xe = XElement.Parse($"<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                $"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                $"<soap:Body>" +
                $"<PrivateAccessDocument xmlns=\"http://tempuri.org/\">" +
                $"<accessKey>{this.credentials}</accessKey>" +
                $"<db>0</db>" +
                $"<id>{id}</id>" +
                $"</PrivateAccessDocument>" +
                $"</soap:Body>" +
                $"</soap:Envelope>");
            WebClient wc = new WebClient();
            wc.BaseAddress = url;
            wc.Headers.Add(HttpRequestHeader.ContentType, "text/xml");
            var resultXML = System.Text.Encoding.UTF8.GetString(wc.UploadData("", System.Text.Encoding.UTF8.GetBytes(xe.ToString())));

            //return "Документец от сиела";


            var data = Regex.Match(resultXML, "<PrivateAccessDocumentResult>([^<]+)<").Groups[1].Value;
            string xmlData = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(data));

            MethodInfo method = typeof(XmlSerializer).GetMethod("set_Mode", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
            method.Invoke(null, new object[] { 1 });

            var transform = new XslCompiledTransform();
            var settings = new XsltSettings(false, true);

            using (TextReader textReader = new StringReader(this.xsl))
            using (XmlReader reader = new XmlTextReader(textReader))
            {

                transform.Load(reader, settings, null);
            }



            XPathDocument docXPath;
            using (var reader = new StringReader(xmlData))
            using (var xml = XmlReader.Create(reader))
                docXPath = new XPathDocument(xml, XmlSpace.Preserve);

            var xslArg = new XsltArgumentList();
            xslArg.AddParam("CurrentEdition", "", int.MaxValue);
            xslArg.AddParam("Repealed", "", false);
            xslArg.AddParam("LicenseLastEdition", "", int.MaxValue);
            xslArg.AddParam("LicenseExpiredText", "", string.Empty);
            xslArg.AddParam("DocumentDbId", "", string.Empty);
            xslArg.AddParam("Language", "", 1);

            var dbActualityDate = DateTime.Now;
            var currentDate = (int)((dbActualityDate - DateTime.MinValue).TotalDays + 3);
            xslArg.AddParam("CurrentDate", "", currentDate.ToString());

            var writtenHtmlString = new StringBuilder();
            var stringWriter = new StringWriter(writtenHtmlString);


            transform.Transform(docXPath, xslArg, stringWriter);

            return writtenHtmlString.ToString();


        }

        public CielaDocInfo[] GetDocuments()
        {

            XDocument xe = XDocument.Parse($"<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
                $"xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><PrivateAccessList xmlns=\"http://tempuri.org/\"><accessKey>{this.credentials}</accessKey></PrivateAccessList></soap:Body></soap:Envelope>");
            WebClient wc = new WebClient();
            wc.BaseAddress = url;
            wc.Headers.Add(HttpRequestHeader.ContentType, "text/xml");
            var resultXML = System.Text.Encoding.UTF8.GetString(wc.UploadData("", System.Text.Encoding.UTF8.GetBytes(xe.ToString())));



            HashSet<Int64> hsIds = new HashSet<Int64>();
            List<CielaDocInfo> result = new List<CielaDocInfo>();

            foreach (Match m in Regex.Matches(resultXML, "<Document[\\w\\W]*?id=\"([\\-0-9]+?)\"[\\w\\W]*?>([\\w\\W]*?)</Document>"))
            {

                Int64 id = Int64.Parse(m.Groups[1].Value);
                string name = m.Groups[2].Value;
                if (hsIds.Contains(id))
                    continue;
                hsIds.Add(id);
                result.Add(new CielaDocInfo() { Id = id, Name = name });

            }

            return result.OrderBy(x => x.Name).ToArray();
        }
    }
}
