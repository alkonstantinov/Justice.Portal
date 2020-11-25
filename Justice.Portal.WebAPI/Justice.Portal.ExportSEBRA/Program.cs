using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using Justice.Portal.DB;
using Justice.Portal.DB.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Spire.Xls;


namespace Justice.Portal.ExportSEBRA
{
    static class Program
    {

        static DBFuncs db;

        static void Main(string[] args)
        {
            db = new DBFuncs(new JusticePortalContext());
            var rec = db.GetBlock(int.Parse(ConfigurationManager.AppSettings["SebraBlockId"]));
            var json = JObject.Parse(rec.Jsonvalues);
            var docArr = json["docs"] as JArray;
            int days = 0;
            if (!int.TryParse(ConfigurationManager.AppSettings["days"], out days))
                days = 3;

            var today = DateTime.Now.AddDays(-days).ToString("yyyy-MM-dd"); //"2020-07-02"
            var currentDoc = (docArr ?? throw new InvalidOperationException()).FirstOrDefault(x => x["date"].Value<string>() == today);
            if (currentDoc == null)
                return;
            var docRec = db.GetBlob(currentDoc["docId"].Value<string>());
            string fnm = Path.GetTempFileName();
            File.WriteAllBytes(fnm, docRec.Content);
            Workbook workbook = new Workbook();
            workbook.LoadFromFile(fnm);
            var sheet = workbook.Worksheets[0];
            sheet.SaveToFile(ConfigurationManager.AppSettings["pathForExport"], ",", Encoding.UTF8);



        }
    }
}
