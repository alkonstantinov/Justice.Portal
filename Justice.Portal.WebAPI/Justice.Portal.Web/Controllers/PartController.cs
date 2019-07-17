using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Microsoft.AspNetCore.Http;
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


        [HttpGet("GetWebPageRequisites")]
        public async Task<IActionResult> GetWebPageRequisites()
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();


            WebPageRequisites result = new WebPageRequisites();
            result.Parts = db.GetPortalParts(Guid.Parse(token));
            return Ok(result);
        }

        [HttpGet("GetWebPagesForPortalPart")]
        public async Task<IActionResult> GetWebPagesForPortalPart(string portalPartId)
        {
            string token = this.GetToken();
            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.GetPortalParts2WebPages(portalPartId));
        }


        [HttpGet("GetSpecificWebPageProperties")]
        public async Task<IActionResult> GetSpecificWebPageProperties(int portalPart2WebPageId)
        {
            string token = this.GetToken();
            var data = db.GetSpecificWebPageProperties(portalPart2WebPageId);
            if (!this.CanDoPart(data.PortalPartId))
                return Unauthorized();

            return Ok(data);
        }

        [HttpGet("GetBlocksPerPortalPart")]
        public async Task<IActionResult> GetBlocksPerPortalPart(string portalPartId)
        {
            string token = this.GetToken();
            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.GetBlocksPerPortalPart(portalPartId));

        }


        [HttpGet("GetBlocks")]
        public async Task<IActionResult> GetBlocks(string portalPartId, string blockTypeId)
        {
            string token = this.GetToken();
            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.GetBlocks(portalPartId, blockTypeId));
        }

        [HttpGet("GetBlockData")]
        public async Task<IActionResult> GetBlockData(string blockTypeId, int? blockId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            BlockData result = new BlockData();
            result.Properties = db.GetBlockProperties(blockTypeId);
            if (blockId.HasValue)
            {
                result.Block = db.GetBlock(blockId.Value);
                if (!this.CanDoPart(result.Block.PortalPartId))
                    return Unauthorized();
                result.Values = db.GetBlockPropertyValues(blockId.Value);
            }

            return Ok(result);
        }


        [HttpPost("AddBlob")]
        public async Task<IActionResult> AddBlob([FromForm]IFormFile image)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            Stream st = image.OpenReadStream();
            MemoryStream mst = new MemoryStream();
            st.CopyTo(mst);
            string hash;
            byte[] imageBytes = mst.ToArray();
            using (var md5 = MD5.Create())
            {
                hash = string.Join("", md5.ComputeHash(imageBytes).Select(x => x.ToString("X2")));
            }

            Blob b = new Blob();
            b.Content = imageBytes;
            b.Extension = System.IO.Path.GetExtension(image.FileName);
            b.Filename = System.IO.Path.GetFileName(image.FileName);
            b.Hash = hash;
            b.ContentType = image.ContentType;
            this.db.AddBlob(b);
            return Ok(b.Hash);

        }



        [HttpGet("GetBlob")]
        public async Task<FileContentResult> GetBlob(string hash)
        {
            var b = db.GetBlob(hash);
            var response = File(b?.Content, b?.ContentType); // FileStreamResult
            return response;
        }


        [HttpPost("SetBlock")]
        public async Task<IActionResult> SetBlock([FromBody]BlockData data)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(data.Block.PortalPartId))
                return Unauthorized();

            db.SetBlock(data);

            return Ok();

        }

        [HttpDelete("DeleteBlock/{blockId}")]
        public async Task<IActionResult> DeleteBlock([FromRoute]int blockId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            var block = db.GetBlock(blockId);

            if (!this.CanDoPart(block.PortalPartId))
                return Unauthorized();
            db.DeleteBlock(blockId);
            return Ok();

        }

        [HttpGet("GetPagesForLinking")]
        public async Task<IActionResult> GetPagesForLinking()
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();


            List<PageInfo> lst = new List<PageInfo>();
            lst.Add(new PageInfo()
            {
                PageId = 1,
                Part = "Агенция по вписванията",
                Title = "Page 1"
            });
            lst.Add(new PageInfo()
            {
                PageId = 2,
                Part = "Министерство",
                Title = "Page 2"
            });
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            lst.AddRange(lst);
            return Ok(lst);

        }


        [HttpPost("SetWebPage")]
        public async Task<IActionResult> SetWebPage([FromBody] JSPortalPart2WebPage page)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            var oldPage = db.GetSpecificWebPageProperties(page.PortalPart2WebPageId);

            if (!this.CanDoPart(oldPage.PortalPartId))
                return Unauthorized();
            db.SetWebPage(page);
            return Ok();
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