using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Justice.Portal.Web.Controllers
{
    public class ErrorController : Controller
    {
        /// <summary>
        /// връща страница за грешка
        /// </summary>
        /// <returns>страница за грешка</returns>
        public IActionResult Index()
        {
            return View();
        }
    }
}