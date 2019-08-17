using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Justice.Portal.Web.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Justice.Portal.Web.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class ContentController : BaseController
    {

        ISOLRComm solr;

        public ContentController(JusticePortalContext jpc, ISOLRComm solrComm) : base(jpc)
        {
            this.solr = solrComm;
        }


        [HttpGet("GetAdsSQData")]
        public async Task<IActionResult> GetAdsSQData(int count, int blockId)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetAdsSQData(count, portalPartId));
        }

        [HttpGet("GetNewsSQData")]
        public async Task<IActionResult> GetNewsSQData(int count, int blockId)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetNewsSQData(count, portalPartId));
        }


        [HttpGet("GetAdsData")]
        public async Task<IActionResult> GetAdsData(int top, int count, int blockId)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetAdsData(top, count, portalPartId));
        }

        [HttpGet("GetNewsData")]
        public async Task<IActionResult> GetNewsData(int top, int count, int blockId)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetNewsData(top, count, portalPartId));
        }

        [HttpGet("GetSearchResultBlock")]
        public async Task<IActionResult> GetSearchResultBlock(string portalPartId)
        {
            return Ok(db.GetSearchResultBlock(portalPartId));
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search(string query, int from, int size, string part)
        {
            return Ok(this.solr.Search(query, from, size, part));
        }

        [HttpGet("GetCabinetBios")]
        public async Task<IActionResult> GetCabinetBios()
        {
            return Ok(this.db.GetCabinetBios());
        }

        [HttpGet("GetCollection")]
        public async Task<IActionResult> GetCollection(int collectionId)
        {
            return Ok(db.GetCollection(collectionId));
        }

        [HttpGet("GetHeaderByBlockid")]
        public async Task<IActionResult> GetHeaderByBlockid(int blockId)
        {
            return Ok(db.GetHeaderByBlockId(blockId));
        }

        [HttpGet("GetFirstOfKindUrl")]
        public async Task<IActionResult> GetFirstOfKindUrl(string portalPartId, string blockTypeId)
        {
            return Ok(db.GetFirstOfKindUrl(portalPartId, blockTypeId));
        }

        [HttpGet("GetPKListData")]
        public async Task<IActionResult> GetPKListData(int top, int count, int blockId, string blockTypeId, string ss)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetPKList(top, count, portalPartId, blockTypeId, ss));
        }



    }

}