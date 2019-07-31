using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Justice.Portal.Web.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Justice.Portal.Web.Controllers
{

    [Route("api/[controller]")]
    [ApiController]


    public class SitemapController : BaseController
    {

        public SitemapController(JusticePortalContext jpc) : base(jpc)
        {

        }

        private SitemapNode GetSitemapNode(JSBlock block)
        {
            var bt = db.GetBlockType(block.BlockTypeId);
            if (!bt.CanBePage)
                return null;
            SitemapNode result = new SitemapNode();
            result.BlockId = block.BlockId;
            result.BlockTypeId = block.BlockTypeId;
            result.PortalPartId = block.PortalPartId;
            var jo = JObject.Parse(block.Jsonvalues);
            result.TitleBG = jo["title"] != null ? jo["title"]["bg"]?.ToString() : "";
            result.TitleEN = jo["title"] != null ? jo["title"]["en"]?.ToString() : "";
            return result;
        }

        private void AddSubnode(SitemapNode parent, int blockId, HashSet<int> hsIncluded)
        {
            if (hsIncluded.Contains(blockId))
                return;
            hsIncluded.Add(blockId);
            var b = db.GetBlock(blockId);
            var sn = GetSitemapNode(b);
            if (sn == null)
            {
                AddSubTree(parent, b, hsIncluded);
            }
            else
            {
                parent.Children.Add(sn);
                AddSubTree(sn, b, hsIncluded);
            }

        }

        private void AddSubTree(SitemapNode parent, JSBlock block, HashSet<int> hsIncluded)
        {
            //var institution = db.GetInstitutionByBlock(block.BlockId);
            var template = db.GetTemplateByBlock(block.BlockTypeId, block.PortalPartId);

            if (template != null)
            {
                JArray jaItemsFromTemplate = JArray.Parse(template.Sources);
                foreach (var i in jaItemsFromTemplate)
                    if (i["value"] != null)
                        AddSubnode(parent, int.Parse(i["value"].ToString()), hsIncluded);
            }

            var mList = Regex.Matches(block.Jsonvalues, @"://.+GetPage\?pageId=([0-9]+)", RegexOptions.IgnoreCase);
            foreach (Match m in mList)
            {
                int id = int.Parse(m.Groups[1].Value);
                AddSubnode(parent, id, hsIncluded);
            }



        }

        [HttpGet("Generate")]
        public async Task<IActionResult> Generate(string part)
        {


            var block = db.GetBlockForPart(part);
            HashSet<int> hsIncluded = new HashSet<int>();
            hsIncluded.Add(block.BlockId);
            var root = GetSitemapNode(block);
            AddSubTree(root, block, hsIncluded);

            return Ok(root);
        }

    }
}