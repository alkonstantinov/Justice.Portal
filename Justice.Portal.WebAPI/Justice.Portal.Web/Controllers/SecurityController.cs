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
                result.SessionID = this.db.CreateSession(result.PortalUserId).SessionKey.ToString();
            if (result != null)
                return Ok(result);
            else
                return Unauthorized();
        }

        [HttpGet("GetGroupsForAdmin")]
        public async Task<IActionResult> GetGroupsForAdmin()
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            GroupsResponse grps = new GroupsResponse();
            grps.Groups = db.GetGroups();
            grps.Parts = db.GetParts();
            grps.Rights = db.GetRights();
            return Ok(grps);            
        }

        [HttpPost("SetGroup")]
        public async Task<IActionResult> SetGroup([FromBody]JSPortalGroup group)
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            db.SetGroup(group);
            return Ok();
        }

        [HttpDelete("DelGroup/{groupId}")]
        public async Task<IActionResult> DelGroup([FromRoute]int groupId)
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            db.DelGroup(groupId);
            return Ok();
        }


    }
}