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


        [HttpGet("GetTranslation")]
        public async Task<IActionResult> GetTranslation()
        {
            return Ok(this.db.GetTranslation());
            
        }

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