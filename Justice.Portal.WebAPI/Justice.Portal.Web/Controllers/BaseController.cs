using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Justice.Portal.DB;
using Justice.Portal.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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
            var token = Request.HttpContext.Request.Headers["Authorization"];
            if (token != null)
                db.UpdateSession(token);
            return token;
        }
        protected bool HasRight(string right)
        {
            string token = this.GetToken();
            if (token == null)
                return false;
            return db.HasUserRight(token, "adminusers");
        }
    }
}