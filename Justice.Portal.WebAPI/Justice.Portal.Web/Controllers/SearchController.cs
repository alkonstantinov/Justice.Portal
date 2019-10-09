using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Justice.Portal.DB;
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

        /// <summary>
        /// Пълнотекстово търсене
        /// </summary>
        /// <param name="query">заявка</param>
        /// <param name="from">от</param>
        /// <param name="size">брой</param>
        /// <param name="part">част на портала</param>
        /// <returns>открити страници</returns>
        [HttpGet("Search")]
        public async Task<IActionResult> Search(string query, int from, int size, string part)
        {
            return Ok(SolrComm.Search(query, from, size, part));
        }

        /// <summary>
        /// преиндексира съдържанието
        /// </summary>
        /// <returns></returns>
        [HttpGet("Reindex")]
        public async Task<IActionResult> Reindex()
        {
            string token = this.GetToken();
            if (!db.IsAuthenticated(token))
                return Unauthorized();
            await Task.Run(() =>
            {
                SolrComm.DeleteAll();
                int top = 0;
                int count = 50;
                Block[] blocks = null;
                do
                {
                    blocks = db.GetNextIndexableBlocks(top, count);
                    foreach (var b in blocks)
                        SolrComm.UpdateBlock(b);
                    top += count;
                } while (count == blocks.Length);
            });
            return Ok();
        }



    }
}