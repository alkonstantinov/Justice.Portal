using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Justice.Portal.DB;
using Justice.Portal.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;

namespace Justice.Portal.Web.Controllers
{
    public class BaseController : Controller
    {
        protected DBFuncs db;

        public BaseController(JusticePortalContext jpc)
        {
            this.db = new DBFuncs(jpc);
        }


        protected string GetToken()
        {
            if (Request.Headers.TryGetValue("Authorization", out StringValues authToken))
            {

                string authHeader = authToken.First();
                return authHeader;

            }
            else return null;

        }
        protected bool HasRight(string right)
        {
            string token = this.GetToken();
            if (token == null)
                return false;
            return db.HasUserRight(token, right);
        }


        protected bool CanDoPart(string portalPartId)
        {
            string token = this.GetToken();
            if (token == null)
                return false;
            return db.CanDoPart(token, portalPartId);
        }

        protected void SaveUserAction(UserAction ua)
        {
            db.SaveUserAction(ua);
        }

        protected UserAction GetUserAction(string title, string content, string token = null)
        {
            UserAction ua = new UserAction();
            token = token ?? this.GetToken();
            
            ua.PortalUserId = db.GetUserByToken(token).PortalUserId;
            ua.OnTime = DateTime.Now;
            ua.Content = content;
            ua.Title = title;
            return ua;
        }
    }
}