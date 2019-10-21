using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Justice.Portal.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class SecurityController : BaseController
    {
        public SecurityController(JusticePortalContext jpc) : base(jpc)
        {
        }

        /// <summary>
        /// вход в системата
        /// </summary>
        /// <param name="model">данни за вход</param>
        /// <returns>резултат от автентикацията</returns>
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequest model)
        {
            var result = this.db.Login(model);
            if (result != null)
                result.SessionID = this.db.CreateSession(result.PortalUserId).SessionKey.ToString();
            if (result != null)
            {
                this.SaveUserAction(this.GetUserAction("Вход в системата", "", result.SessionID));

                return Ok(result);
            }
            else
                return Unauthorized();
        }

        /// <summary>
        /// извлича групи за администриране
        /// </summary>
        /// <returns>групи </returns>
        [HttpGet("GetGroupsForAdmin")]
        public async Task<IActionResult> GetGroupsForAdmin()
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            GroupsResponse grps = new GroupsResponse();
            grps.Groups = db.GetGroups();
            grps.Parts = db.GetParts();
            grps.Rights = db.GetRights();
            grps.Rubrics = db.SelectRubric(null);
            return Ok(grps);
        }

        /// <summary>
        /// Записва група
        /// </summary>
        /// <param name="group">данни за група</param>
        /// <returns></returns>
        [HttpPost("SetGroup")]
        public async Task<IActionResult> SetGroup([FromBody]JSPortalGroup group)
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            db.SetGroup(group);
            this.SaveUserAction(this.GetUserAction("Запис на група", JObject.FromObject(group).ToString()));

            return Ok();
        }

        /// <summary>
        /// Изтрива група
        /// </summary>
        /// <param name="groupId">идентификатор</param>
        /// <returns></returns>
        [HttpDelete("DelGroup/{groupId}")]
        public async Task<IActionResult> DelGroup([FromRoute]int groupId)
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            db.DelGroup(groupId);
            this.SaveUserAction(this.GetUserAction("Изтриване на група", groupId.ToString()));

            return Ok();
        }

        /// <summary>
        /// Извлича потребители за администриране
        /// </summary>
        /// <returns>потребители</returns>
        [HttpGet("GetUsersForAdmin")]
        public async Task<IActionResult> GetUsersForAdmin()
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            UsersResponse usrs = new UsersResponse();
            usrs.Users = db.GetUsers();
            usrs.Groups = db.GetGroups(false);
            usrs.Parts = db.GetParts();
            usrs.Rights = db.GetRights();
            usrs.Rubrics = db.SelectRubric(null);
            return Ok(usrs);
        }

        /// <summary>
        /// Съществува ли това потребителско име
        /// </summary>
        /// <param name="username">потребителско име</param>
        /// <returns></returns>
        [HttpGet("UserNameExists")]
        public async Task<IActionResult> UserNameExists(string username)
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            return Ok(db.UsernameExists(username));
        }

        /// <summary>
        /// Записва данни за потребител
        /// </summary>
        /// <param name="user">данни за потребител</param>
        /// <returns></returns>
        [HttpPost("SetUser")]
        public async Task<IActionResult> SetUser([FromBody]JSPortalUser user)
        {
            if (!this.HasRight("adminusers"))
                return Unauthorized();
            db.SetUser(user);
            this.SaveUserAction(this.GetUserAction("Запис на потребител", JObject.FromObject(user).ToString()));

            return Ok();
        }

        /// <summary>
        /// Изход от системата
        /// </summary>
        /// <returns></returns>
        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            this.SaveUserAction(this.GetUserAction("Излизане", ""));

            db.Logout(this.GetToken());
            
            return Ok();
        }

        /// <summary>
        /// Смяна на парола
        /// </summary>
        /// <param name="data">данни за паролата</param>
        /// <returns></returns>
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordData data)
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();

            if (db.ChangePassword(data, Guid.Parse(token)))
            {
                this.SaveUserAction(this.GetUserAction("Смяна парола", ""));

                return Ok();
            }
            else
                return Unauthorized();

        }

        /// <summary>
        /// одит на потребителски действия
        /// </summary>
        /// <param name="model">данни за одит на потребителски действия</param>
        /// <returns>потребителски действия</returns>
        [HttpGet("Audit")]
        public async Task<IActionResult> Audit([FromQuery]AuditModel model)
        {
            var result = db.Audit(model);

            return Ok(result);
        }


    }
}