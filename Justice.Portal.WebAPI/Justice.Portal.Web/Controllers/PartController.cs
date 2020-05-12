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
using Newtonsoft.Json.Linq;

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

        /// <summary>
        /// Извлича данни за част
        /// </summary>
        /// <returns>част</returns>
        [HttpGet("GetBlockRequisites")]
        public async Task<IActionResult> GetBlockRequisites()
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();


            BlockRequisites result = new BlockRequisites();
            result.BlockTypes = db.GetBlockTypes();
            result.Parts = db.GetPortalParts(Guid.Parse(token));
            result.Rubrics = db.GetPortalRubrics(Guid.Parse(token));
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

        /// <summary>
        /// извлича страница
        /// </summary>
        /// <param name="portalPartId">част</param>
        /// <returns>страница</returns>
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

        /// <summary>
        /// извлича видове блокове за част на портала
        /// </summary>
        /// <param name="portalPartId">част на портала</param>
        /// <returns>блокове</returns>
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


        /// <summary>
        /// извлича всички блокове отговарящи на критерии
        /// </summary>
        /// <param name="portalPartId">част</param>
        /// <param name="blockTypeId">тип</param>
        /// <param name="ss">текст за търсене</param>
        /// <returns>блокове</returns>
        [HttpGet("GetBlocks")]
        public async Task<IActionResult> GetBlocks(string portalPartId, string blockTypeId, int rubricId, string ss)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            var rs = db.GetUserRubrics(token);
            return Ok(db.GetBlocks(portalPartId, blockTypeId, rs, ss));
        }

        /// <summary>
        /// извлича данни на блок
        /// </summary>
        /// <param name="blockTypeId">тип</param>
        /// <param name="blockId">блок</param>
        /// <returns>блок</returns>
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
            result.Rubrics = db.GetPortalRubrics(Guid.Parse(token));
            return Ok(result);
        }


        /// <summary>
        /// добавя електронен оригинал
        /// </summary>
        /// <param name="image">оригинал</param>
        /// <returns>хеш</returns>
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
            this.SaveUserAction(this.GetUserAction("Добавяне на електронен оригинал", hash));
            return Ok(b.Hash);

        }


        /// <summary>
        /// извлича електронен оригинал
        /// </summary>
        /// <param name="hash">хеш</param>
        /// <returns>оригинал</returns>
        [HttpGet("GetBlob")]
        public async Task<FileContentResult> GetBlob(string hash)
        {
            var b = db.GetBlob(hash);
            var response = b != null ? File(b.Content, b.ContentType, b.Filename) : null; // FileStreamResult
            return response;
        }

        /// <summary>
        /// записва блок
        /// </summary>
        /// <param name="data">данни на блока</param>
        /// <returns>идентификатор</returns>
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
                Task.Run(() => SolrComm.UpdateBlock(block));
            this.SaveUserAction(this.GetUserAction("Запис на част", JObject.FromObject(data).ToString()));

            return Ok();

        }


        /// <summary>
        /// извлича страница
        /// </summary>
        /// <param name="templateId">идентификатор на страница</param>
        /// <returns>страница</returns>
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

        /// <summary>
        /// записва страница
        /// </summary>
        /// <param name="template">страница</param>
        /// <returns>идентификатор</returns>
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
            this.SaveUserAction(this.GetUserAction("Запис на страница", JObject.FromObject(template).ToString()));
            return Ok();
        }

        /// <summary>
        /// извлича колекции
        /// </summary>
        /// <returns>колекции</returns>
        [HttpGet("GetCollections")]
        public async Task<IActionResult> GetCollections()
        {
            if (!this.HasRight("admincollections"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            return Ok(db.GetCollections(Guid.Parse(token)));
        }

        /// <summary>
        /// извлича колекциq
        /// </summary>
        /// 
        /// <returns>колекциq</returns>

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

        /// <summary>
        /// изтрива колекция
        /// </summary>
        /// <param name="collectionId">идентификатор</param>
        /// <returns></returns>
        [HttpDelete("DeleteCollection/{collectionId}")]
        public async Task<IActionResult> DeleteCollection([FromRoute]int collectionId)
        {
            if (!this.HasRight("admincollections"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            db.DeleteCollection(collectionId);
            this.SaveUserAction(this.GetUserAction("Изтриване на колекция", collectionId.ToString()));

            return Ok();

        }


        /// <summary>
        /// записва колекция
        /// </summary>
        /// <param name="collection">данни на колекцията</param>
        /// <returns></returns>
        [HttpPost("SaveCollection")]
        public async Task<IActionResult> SaveCollection([FromBody]JSCollection collection)
        {
            if (!this.HasRight("admincollections"))
                return Unauthorized();
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            db.SaveCollection(collection);
            this.SaveUserAction(this.GetUserAction("Запис на колекция", JObject.FromObject(collection).ToString()));

            return Ok();
        }




        /// <summary>
        /// проверява дали има такова урл
        /// </summary>
        /// <param name="url">урл</param>
        /// <param name="blockId">идентификатор на част</param>
        /// <returns>да/не</returns>
        [HttpGet("UrlExists")]
        public async Task<IActionResult> UrlExists([FromQuery]string url, [FromQuery]int? blockId)
        {
            return Ok(db.UrlExists(url, blockId));
        }

        /// <summary>
        /// извлича заглавни части
        /// </summary>
        /// <returns>заглавни части</returns>
        [HttpGet("GetHeaders")]
        public async Task<IActionResult> GetHeaders()
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("adminheaders"))
                return Unauthorized();
            return Ok(db.GetHeaders(Guid.Parse(token)));
        }

        /// <summary>
        /// извлича заглавн част
        /// </summary>
        /// <param name="headerId">идентификатор</param>
        /// <returns>заглавн част</returns>
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

        /// <summary>
        /// Записва заглавна част
        /// </summary>
        /// <param name="header">данни за частта</param>
        /// <returns></returns>
        [HttpPost("SaveHeader")]
        public async Task<IActionResult> SaveHeader([FromBody]JSHeader header)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("adminheaders"))
                return Unauthorized();
            db.SaveHeader(header);
            this.SaveUserAction(this.GetUserAction("Запис на заглавна част", JObject.FromObject(header).ToString()));

            return Ok();
        }

        /// <summary>
        /// Изтрива заглавна част
        /// </summary>
        /// <param name="headerId">идентификатор</param>
        /// <returns></returns>
        [HttpDelete("DeleteHeader/{headerId}")]
        public async Task<IActionResult> DeleteHeader([FromRoute]int headerId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("adminheaders"))
                return Unauthorized();
            db.DeleteHeader(headerId);
            this.SaveUserAction(this.GetUserAction("Изтриване на заглавна част", headerId.ToString()));



            return Ok();

        }

        [HttpGet("GetPKLabels")]
        public async Task<IActionResult> GetPKLabels(string group)
        {
            return Ok(db.GetPKLabels(group));
        }

        /// <summary>
        /// изтрива част
        /// </summary>
        /// <param name="blockId">идентификатор</param>
        /// <returns></returns>
        [HttpDelete("DeleteBlock/{blockId}")]
        public async Task<IActionResult> DeleteBlock([FromRoute]int blockId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            db.DeleteBlock(blockId);

            this.SaveUserAction(this.GetUserAction("Изтриване на част", blockId.ToString()));

            return Ok();

        }

        /// <summary>
        /// Извлича вътрешни документи
        /// </summary>
        /// <param name="portalPartId">част на портала</param>
        /// <returns>вътрешни документи</returns>
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

        /// <summary>
        /// Записва вътрешни документи
        /// </summary>
        /// <param name="doc">вътрешни документи</param>
        /// <returns></returns>
        [HttpPost("SetInnerDocs")]
        public async Task<IActionResult> SetInnerDocs(JSInnerDoc doc)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(doc.PortalPartId))
                return Unauthorized();
            db.SetInnerDocs(doc);
            this.SaveUserAction(this.GetUserAction("Запис на вътрешни документи", JObject.FromObject(doc).ToString()));

            return Ok();
        }

        /// <summary>
        /// Извлича рубрики
        /// </summary>
        /// <param name="portalPartId">част на портала</param>
        /// <returns></returns>
        [HttpGet("SelectRubric")]
        public async Task<IActionResult> SelectRubric([FromQuery]string portalPartId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (!this.CanDoPart(portalPartId))
                return Unauthorized();

            return Ok(db.SelectRubric(portalPartId));
        }

        /// <summary>
        /// Изтрива рубрика
        /// </summary>
        /// <param name="rubricId">рубрика</param>
        /// <returns></returns>
        [HttpDelete("DeleteRubric")]
        public async Task<IActionResult> DeleteRubric([FromQuery]int rubricId)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();


            db.DeleteRubric(rubricId);
            return Ok();
        }

        /// <summary>
        /// обновява рубрики
        /// </summary>
        /// <param name="rubrics">рубрики</param>
        /// <returns></returns>
        [HttpPost("UpdateRubric")]
        public async Task<IActionResult> UpdateRubric([FromBody]JSRubric[] rubrics)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (rubrics.Length == 0)
                return Ok();
            if (!this.CanDoPart(rubrics[0].PortalPartId))
                return Unauthorized();
            foreach (var r in rubrics)
                if (r.RubricId.HasValue)
                    db.UpdateRubric(r);
                else
                    db.InsertRubric(r);

            return Ok();
        }





    }
}