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
   
    public class CielaController : BaseController
    {

        ICielaComm ciela;

        public CielaController(JusticePortalContext jpc, ICielaComm cielaComm) : base(jpc)
        {
            this.ciela = cielaComm;
        }


        /// <summary>
        /// Извлича списък с документи
        /// </summary>
        /// <returns>списък с документи</returns>
        [HttpGet("GetDocList")]
        public async Task<IActionResult> GetDocList()
        {
            return Ok(ciela.GetDocuments());
        }

        /// <summary>
        /// Извлича документ
        /// </summary>
        /// <param name="id">Идентификатор</param>
        /// <returns>HTML на документ</returns>
        [HttpGet("GetDoc")]
        public async Task<IActionResult> GetDoc(int id)
        {
            return Ok(ciela.GetDocument(id));
        }

    }
}