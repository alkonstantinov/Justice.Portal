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

    }
}