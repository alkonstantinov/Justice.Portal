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
    }
}