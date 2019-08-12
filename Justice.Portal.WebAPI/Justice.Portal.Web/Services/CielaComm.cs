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

namespace Justice.Portal.Web.Services
{
    public class CielaComm : ICielaComm
    {
        string credentials;
        string xsl;
        WebClient wc;

        public CielaComm(string url, string credentials, string xsl)
        {
            wc = new WebClient();
            wc.BaseAddress = url;

            this.credentials = credentials;
            this.xsl = xsl;
        }


        public string GetDocument(int id)
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
            wc.Headers.Add(HttpRequestHeader.ContentType, "text/xml");
            var resultXML = System.Text.Encoding.UTF8.GetString(wc.UploadData("", System.Text.Encoding.UTF8.GetBytes(xe.ToString())));

            return "Документец от сиела";


            var data = Regex.Match(resultXML, "<PrivateAccessDocumentResult>([^<]+)<").Groups[1].Value;
            string xmlData = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(data));
            XDocument xd = XDocument.Parse(xmlData);
            StringBuilder sb = new StringBuilder();
            using (TextWriter writer = new StringWriter(sb))
            {
                XslCompiledTransform xslt = new XslCompiledTransform();
                xslt.Load(XmlReader.Create(new StringReader(this.xsl)));

                xslt.Transform(xd.CreateReader(), null, writer);
            }

            return sb.ToString();
        }

        public CielaDocInfo[] GetDocuments()
        {

            XDocument xe = XDocument.Parse($"<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
                $"xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><PrivateAccessList xmlns=\"http://tempuri.org/\"><accessKey>{this.credentials}</accessKey></PrivateAccessList></soap:Body></soap:Envelope>");
            wc.Headers.Add(HttpRequestHeader.ContentType, "text/xml");
            var resultXML = System.Text.Encoding.UTF8.GetString(wc.UploadData("", System.Text.Encoding.UTF8.GetBytes(xe.ToString())));



            HashSet<int> hsIds = new HashSet<int>();
            List<CielaDocInfo> result = new List<CielaDocInfo>();

            foreach (Match m in Regex.Matches(resultXML, "<Document db=\"0\" id=\"([0-9]+)\"[^>]+>([\\w\\W]*?)</Document>"))
            {

                int id = int.Parse(m.Groups[1].Value);
                string name = m.Groups[2].Value;
                if (hsIds.Contains(id))
                    continue;
                hsIds.Add(id);
                result.Add(new CielaDocInfo() { Id = id, Name = name });

            }

            return result.OrderBy(x=>x.Name).ToArray();
        }
    }
}
