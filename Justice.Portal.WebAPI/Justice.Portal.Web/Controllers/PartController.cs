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

    public class PartController : BaseController
    {

        ISOLRComm SolrComm;
        public PartController(JusticePortalContext jpc, ISOLRComm solrComm) : base(jpc)
        {
            this.SolrComm = solrComm;
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


        //[HttpGet("GetWebPageRequisites")]
        //public async Task<IActionResult> GetWebPageRequisites()
        //{
        //    string token = this.GetToken();
        //    if (!db.IsAuthenticated(token))
        //        return Unauthorized();


        //    WebPageRequisites result = new WebPageRequisites();
        //    result.Parts = db.GetPortalParts(Guid.Parse(token));
        //    result.BlockTypes = db.GetBlockTypes();
        //    return Ok(result);
        //}

        [HttpGet("GetTemplates")]
        public async Task<IActionResult> GetTemplates(string portalPartId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.GetTemplates(portalPartId));
        }


        //[HttpGet("GetSpecificWebPageProperties")]
        //public async Task<IActionResult> GetSpecificWebPageProperties(int portalPart2WebPageId)
        //{
        //    string token = this.GetToken();
        //    var data = db.GetSpecificWebPageProperties(portalPart2WebPageId);
        //    if (!this.CanDoPart(data.PortalPartId))
        //        return Unauthorized();

        //    return Ok(data);
        //}

        [HttpGet("GetBlocksPerPortalPart")]
        public async Task<IActionResult> GetBlocksPerPortalPart(string portalPartId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.GetBlocksPerPortalPart(portalPartId));

        }


        [HttpGet("GetBlocks")]
        public async Task<IActionResult> GetBlocks(string portalPartId, string blockTypeId, string ss)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.GetBlocks(portalPartId, blockTypeId, ss));
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
            result.CanBePage = db.GetBlockType(blockTypeId).CanBePage;
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
            var response = b != null ? File(b.Content, b.ContentType, b.Filename) : null; // FileStreamResult
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

            var block = db.SetBlock(data);
            var bt = db.GetBlockType(block.BlockTypeId);

            if (bt.IsSearchable)

                await Task.Run(() => SolrComm.UpdateBlock(block));

            return Ok();

        }



        [HttpGet("GetTemplate")]

        public async Task<IActionResult> GetTemplate(int templateId)
        {
            if (!this.HasRight("admintemplates"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            var template = db.GetTemplate(templateId);
            if (!this.CanDoPart(template.PortalPartId))
                return Unauthorized();
            return Ok(template);
        }
        [HttpPost("SetTemplate")]
        public async Task<IActionResult> SetTemplate([FromBody]JSTemplate template)
        {
            if (!this.HasRight("admintemplates"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            var oldPage = db.GetTemplate(template.TemplateId);

            if (!this.CanDoPart(oldPage.PortalPartId))
                return Unauthorized();
            db.SetTemplate(template);
            return Ok();
        }

        [HttpGet("GetCollections")]
        public async Task<IActionResult> GetCollections()
        {
            if (!this.HasRight("admincollections"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            return Ok(db.GetCollections());
        }

        [HttpGet("GetCollection")]
        public async Task<IActionResult> GetCollection(int collectionId)
        {
            if (!this.HasRight("admincollections"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            return Ok(db.GetCollection(collectionId));
        }

        [HttpDelete("DeleteCollection/{collectionId}")]
        public async Task<IActionResult> DeleteCollection([FromRoute]int collectionId)
        {
            if (!this.HasRight("admincollections"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            db.DeleteCollection(collectionId);
            return Ok();

        }

        [HttpPost("SaveCollection")]
        public async Task<IActionResult> SaveCollection([FromBody]JSCollection collection)
        {
            if (!this.HasRight("admincollections"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            db.SaveCollection(collection);
            return Ok();
        }





        [HttpGet("UrlExists")]
        public async Task<IActionResult> UrlExists([FromQuery]string url, [FromQuery]int? blockId)
        {
            return Ok(db.UrlExists(url, blockId));
        }

        [HttpGet("GetHeaders")]
        public async Task<IActionResult> GetHeaders()
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("adminheaders"))
                return Unauthorized();
            return Ok(db.GetHeaders());
        }

        [HttpGet("GetHeader")]
        public async Task<IActionResult> GetHeader(int headerId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("adminheaders"))
                return Unauthorized();
            return Ok(db.GetHeader(headerId));
        }

        [HttpPost("SaveHeader")]
        public async Task<IActionResult> SaveHeader([FromBody]JSHeader header)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("adminheaders"))
                return Unauthorized();
            db.SaveHeader(header);
            return Ok();
        }

        [HttpDelete("DeleteHeader/{headerId}")]
        public async Task<IActionResult> DeleteHeader([FromRoute]int headerId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("adminheaders"))
                return Unauthorized();
            db.DeleteHeader(headerId);


            return Ok();

        }

        [HttpGet("GetPKLabels")]
        public async Task<IActionResult> GetPKLabels(string group)
        {
            return Ok(db.GetPKLabels(group));
        }


        [HttpDelete("DeleteBlock/{blockId}")]
        public async Task<IActionResult> DeleteBlock([FromRoute]int blockId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            db.DeleteBlock(blockId);


            return Ok();

        }

        [HttpGet("GetInnerDocs")]
        public async Task<IActionResult> GetInnerDocs(string portalPartId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(portalPartId))
                return Unauthorized();
            return Ok(db.GetInnerDocs(portalPartId));
        }

        [HttpPost("SetInnerDocs")]
        public async Task<IActionResult> SetInnerDocs(JSInnerDoc doc)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(doc.PortalPartId))
                return Unauthorized();
            db.SetInnerDocs(doc);
            return Ok();
        }


    }
}