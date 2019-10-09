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


    public class TranslateController : BaseController
    {

        
        public TranslateController(JusticePortalContext jpc) : base(jpc)
        {
            
        }

        /// <summary>
        /// Извлича данни за преводите
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetTranslation")]
        public async Task<IActionResult> GetTranslation()
        {
            return Ok(this.db.GetTranslation());
            
        }

        /// <summary>
        /// Записва данни за преводите
        /// </summary>
        /// <param name="trans">данни за преводите</param>
        /// <returns></returns>
        [HttpPost("SetTranslation")]
        public async Task<IActionResult> SetTranslation([FromBody] JSTranslation trans)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            if (!this.HasRight("admintranslations"))
                return Unauthorized();
            this.db.SetTranslation(trans);
            return Ok();

        }

    }
}