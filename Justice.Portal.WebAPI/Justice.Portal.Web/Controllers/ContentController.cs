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

        /// <summary>
        /// Извлича данни за каре обявления
        /// </summary>
        /// <param name="count">брой обявления</param>
        /// <param name="blockId">част</param>
        /// <returns>извлечени обявления</returns>
        [HttpGet("GetAdsSQData")]
        public async Task<IActionResult> GetAdsSQData(int count, int blockId)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetAdsSQData(count, portalPartId));
        }

        /// <summary>
        /// Извлича данни за каре новини
        /// </summary>
        /// <param name="count">брой новини</param>
        /// <param name="blockId">част</param>
        /// <returns>извлечени новини</returns>
        [HttpGet("GetNewsSQData")]
        public async Task<IActionResult> GetNewsSQData(int count, int blockId, string lang)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetNewsSQData(count, portalPartId, lang));
        }

        /// <summary>
        /// извлича обявления
        /// </summary>
        /// <param name="top">начало</param>
        /// <param name="count">брой</param>
        /// <param name="blockId">част</param>
        /// <returns>обявления</returns>
        [HttpGet("GetAdsData")]
        public async Task<IActionResult> GetAdsData(int top, int count, int blockId)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetAdsData(top, count, portalPartId));
        }

        /// <summary>
        /// извлича новини
        /// </summary>
        /// <param name="top">начало</param>
        /// <param name="count">брой</param>
        /// <param name="blockId">част</param>
        /// <returns>новини</returns>
        [HttpGet("GetNewsData")]
        public async Task<IActionResult> GetNewsData(int top, int count, int blockId)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetNewsData(top, count, portalPartId));
        }

        /// <summary>
        /// Извлича част резултат от търсене
        /// </summary>
        /// <param name="portalPartId">идентификатор на част</param>
        /// <returns>част</returns>
        [HttpGet("GetSearchResultBlock")]
        public async Task<IActionResult> GetSearchResultBlock(string portalPartId)
        {
            return Ok(db.GetSearchResultBlock(portalPartId));
        }

        /// <summary>
        /// провежда търсене
        /// </summary>
        /// <param name="query">заявка</param>
        /// <param name="from">от елемент</param>
        /// <param name="size">брой</param>
        /// <param name="part">част на портала</param>
        /// <returns></returns>
        [HttpGet("Search")]
        public async Task<IActionResult> Search(string query, int from, int size, string part)
        {
            return Ok(this.solr.Search(query, from, size, part));
        }

        /// <summary>
        /// Извлича биографии
        /// </summary>
        /// <returns>биографии</returns>
        [HttpGet("GetCabinetBios")]
        public async Task<IActionResult> GetCabinetBios()
        {
            return Ok(this.db.GetCabinetBios());
        }

        /// <summary>
        /// извлича колекция
        /// </summary>
        /// <param name="collectionId">идентификатор</param>
        /// <returns>колекция</returns>
        [HttpGet("GetCollection")]
        public async Task<IActionResult> GetCollection(int collectionId)
        {
            return Ok(db.GetCollection(collectionId));
        }


        /// <summary>
        /// Извлича заглавна част
        /// </summary>
        /// <param name="blockId">част</param>
        /// <returns>заглавна част</returns>
        [HttpGet("GetHeaderByBlockid")]
        public async Task<IActionResult> GetHeaderByBlockid(int blockId)
        {
            var hdr = db.GetHeaderByBlockId(blockId);
            hdr.Content = Regex.Replace(hdr.Content, "href=\"/home/index/([^\"]+?)\"", "href=\"/home/index/$1?top=1\"");
            return Ok(hdr);
        }


        /// <summary>
        /// Извлича път към първа част от тип
        /// </summary>
        /// <param name="portalPartId">портална част</param>
        /// <param name="blockTypeId">тип част</param>
        /// <returns>част</returns>
        [HttpGet("GetFirstOfKindUrl")]
        public async Task<IActionResult> GetFirstOfKindUrl(string portalPartId, string blockTypeId)
        {
            return Ok(db.GetFirstOfKindUrl(portalPartId, blockTypeId));
        }

        [HttpGet("GetPKListData")]
        public async Task<IActionResult> GetPKListData(int top, int count, int blockId, string ss, string type)
        {
            string portalPartId = db.GetBlock(blockId).PortalPartId;


            return Ok(db.GetPKList(top, count, portalPartId, ss, type));
        }



    }

}