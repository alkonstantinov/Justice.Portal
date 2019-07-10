using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Microsoft.AspNetCore.Mvc;

namespace Justice.Portal.Web.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class PartController : BaseController
    {

        public PartController(JusticePortalContext jpc) : base(jpc)
        {
        }


        [HttpGet("GetBlockRequisites")]
        public async Task<IActionResult> GetBlockRequisites()
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();


            BlockRequisites result = new BlockRequisites();
            result.BlockTypes = db.GetBlockTypes();
            result.Parts = db.GetPortalParts(Guid.Parse(token));
            return Ok(result);
        }

        [HttpGet("GetBlocks")]
        public async Task<IActionResult> GetBlocks(string portalPartId, string blockTypeId)
        {
            string token = this.GetToken();
            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.GetBlocks(portalPartId, blockTypeId));
        }

        [HttpGet("GetBlockProperties")]
        public async Task<IActionResult> GetBlockProperties(string blockTypeId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            return Ok(db.GetBlocks(portalPartId, blockTypeId));
        }

        //[HttpGet("GetBlockProperties")]

        //public async Task<IActionResult> GetBlock(int? blockId)
        //{
        //    string token = this.GetToken();
        //    if (!db.IsAuthenticated(token))
        //        return Unauthorized();
        //    if (blockId.HasValue)
        //    {
        //        var block = db.GetBlock(blockId.Value);
        //        if (!this.CanDoPart(block.PortalPartId))
        //            return Unauthorized();
        //    }


        //    return Ok(db.GetBlocks(portalPartId, blockTypeId));
        //}

    }
}