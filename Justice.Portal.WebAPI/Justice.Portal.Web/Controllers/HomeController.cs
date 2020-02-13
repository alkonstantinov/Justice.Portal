using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Justice.Portal.DB;
using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Justice.Portal.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Binder;
using Newtonsoft.Json.Linq;
using Serilog;

namespace Justice.Portal.Web.Controllers
{
    //[Route("[controller]")]
    public class HomeController : Controller
    {
        protected DBFuncs db;
        protected ICielaComm cielaComm;
        protected IConfiguration config;

        public HomeController(JusticePortalContext jpc, ICielaComm cielaComm, IConfiguration config)
        {
            this.db = new DBFuncs(jpc);
            this.cielaComm = cielaComm;
            this.config = config;
        }
        //[HttpGet("index/{url?}")]

        /// <summary>
        /// връща страница
        /// </summary>
        /// <param name="url">уникален идентификатор</param>
        /// <returns>страница</returns>
        public IActionResult Index([FromRoute]string url)
        {

            JSBlock block;
            if (string.IsNullOrEmpty(url))
                block = db.GetBlockForPart(null);
            else
                block = db.GetBlock(url);



            //var institution = db.GetInstitutionByBlock(block.BlockId);
            var template = db.GetTemplateByBlock(block.BlockTypeId, block.PortalPartId);
            string html = template.TemplateJson;
            html = Regex.Replace(html, "href=\"/home/index/([^\"]+?)\"", "href=\"/home/index/$1?top=1\"");

            var jv = JObject.Parse(block.Jsonvalues);

            if (jv["title"] == null)
            {
                jv["title"] = JObject.FromObject(new
                {
                    bg = block.Name
                });

                block.Jsonvalues = jv.ToString();

            }


        


            JObject joPageData = new JObject();
            var hosts = config.GetSection("HostsToClear").Get<string[]>();
            foreach (var s in hosts)
                block.Jsonvalues = block.Jsonvalues.Replace(s, "");
            joPageData["main"] = JObject.Parse(block.Jsonvalues);
            joPageData["maintype"] = block.BlockTypeId;
            joPageData["mainid"] = block.BlockId;
            joPageData["mainpartid"] = block.PortalPartId;
            joPageData["bcpath"] = db.GetMainPath(block.PortalPartId);


            JArray jaSources = JArray.Parse(template.Sources);
            foreach (var b in jaSources)
            {

                if (int.TryParse(b["value"]?.ToString(), out int innerBlockId))
                {
                    b["blockData"] = JObject.Parse(db.GetBlock(innerBlockId).Jsonvalues);
                    joPageData["block_" + b["id"].ToString()] = b;
                }
            }

            string strTemplate = template.TemplateJson;
            html = html.Replace("###MJPageData###", joPageData.ToString());


            html = html.Replace("###MJPageContent###", strTemplate);





            return View("index", html);
        }

        /// <summary>
        /// извлича нормативен документ
        /// </summary>
        /// <param name="id">идентификатор</param>
        /// <returns>документ</returns>
        [HttpGet("home/NormDoc/{id}")]
        public IActionResult NormDoc([FromRoute]Int64 id)
        {
            return View("index", cielaComm.GetDocument(id));
        }


        /// <summary>
        /// изпраща обратна връзка
        /// </summary>
        /// <returns>ок</returns>
        [HttpPost("home/SendFeedback")]
        public IActionResult SendFeedback()
        {
            StringBuilder sb = new StringBuilder();
            string id = null;
            foreach (var k in Request.Form)
            {
                if (k.Key == "id")
                    id = k.Value;
                else
                    sb.AppendLine(k.Key + ":" + k.Value);
            }


            var b = db.GetBlock(id);
            var data = JObject.Parse(b.Jsonvalues);

            // send email
            var smtpConfig = config.GetSection("Smtp").Get<SmtpConfig>();

            using (var smtp = new SmtpClient(smtpConfig.Host, smtpConfig.Port))
            {
                smtp.EnableSsl = smtpConfig.Ssl;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(smtpConfig.Username, smtpConfig.Password);

                var message = new MailMessage();
                message.To.Add(data["sendTo"].ToString());
                message.From = new MailAddress(smtpConfig.Username);
                message.Subject = data["title"]["bg"].ToString();
                message.Body = sb.ToString();

                foreach (var f in Request.Form.Files)
                {
                    Attachment a = new Attachment(f.OpenReadStream(), f.FileName);
                    message.Attachments.Add(a);
                }


                try
                {
                    smtp.Send(message);
                }
                catch (SmtpException e)
                {
                    return BadRequest();
                }
            }


            return Json("OK");
        }
    }

    internal class SmtpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool Ssl { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

}