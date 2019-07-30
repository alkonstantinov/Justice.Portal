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


    public class SearchController : BaseController
    {

        ISOLRComm SolrComm;
        public SearchController(JusticePortalContext jpc, ISOLRComm solrComm) : base(jpc)
        {
            this.SolrComm = solrComm;
        }


        [HttpGet("Search")]
        public async Task<IActionResult> Search(string query, int from, int size)
        {
            return Ok(SolrComm.Search(query, from, size));
        }

    }
}