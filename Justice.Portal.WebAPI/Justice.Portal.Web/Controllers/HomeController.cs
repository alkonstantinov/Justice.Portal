using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Justice.Portal.DB;
using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Serilog;

namespace Justice.Portal.Web.Controllers
{
    //[Route("[controller]")]
    public class HomeController : Controller
    {
        protected DBFuncs db;

        public HomeController(JusticePortalContext jpc)
        {
            this.db = new DBFuncs(jpc);
        }
        //[HttpGet("index/{url?}")]
        public IActionResult Index([FromRoute]string url)
        {
            
            JSBlock block;
            if (string.IsNullOrEmpty(url))
                block = db.GetBlockForPart(null);
            else
                block = db.GetBlock(url);



            var institution = db.GetInstitutionByBlock(block.BlockId);
            var template = db.GetTemplateByBlock(block.BlockTypeId, block.PortalPartId);
            string html = institution.Content;

            JObject joPageData = new JObject();
            joPageData["main"] = JObject.Parse(block.Jsonvalues);
            joPageData["maintype"] = block.BlockTypeId;
            JArray jaSources = JArray.Parse(template.Sources);
            foreach (var b in jaSources)
            {

                b["blockData"] = JObject.Parse(db.GetBlock(int.Parse(b["value"].ToString())).Jsonvalues);
                joPageData["block_" + b["id"].ToString()] = b;
            }

            string strTemplate = template.TemplateJson;
            html = html.Replace("###MJPageData###", joPageData.ToString());
            html = html.Replace("###MJPageContent###", strTemplate);





            return View("index", html);
        }

        
    }
}