using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Justice.Portal.DB.Models;
using kl2.server.DB.Models;
using Microsoft.AspNetCore.Mvc;

namespace Justice.Portal.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class SecurityController : BaseController
    {
        public SecurityController(JusticePortalContext jpc) : base(jpc)
        {
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequest model)
        {
            var result = this.db.Login(model);
            if (result != null)
                result.Session = new Session[] { this.db.CreateSession(result.PortalUserId)};
            if (result != null)
                return Ok(result);
            else
                return Unauthorized();
        }


    }
}