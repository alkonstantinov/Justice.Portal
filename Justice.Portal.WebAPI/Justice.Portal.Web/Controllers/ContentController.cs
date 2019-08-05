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


        public ContentController(JusticePortalContext jpc, ISOLRComm solrComm) : base(jpc)
        {

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

    }
}