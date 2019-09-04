using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Justice.Portal.DB.Models;
using Newtonsoft.Json.Linq;

namespace Justice.Portal.Web.Services
{
    public class SOLRComm : ISOLRComm
    {

        string url;
        public SOLRComm(string url)
        {
            this.url = url;
        }

        private JArray FormSOLRJson(Block block)
        {

            try
            {
                JObject jo = JObject.Parse(block.Jsonvalues);
                JObject result = new JObject();
                result["id"] = block.BlockId;
                result["urlhash"] = block.Url;
                result["part"] = block.PortalPartId;
                result["titleBG"] = jo["title"]["bg"]?.ToString();
                result["titleEN"] = jo["title"]["en"]?.ToString();
                result["type"] = block.BlockTypeId;
                result["content"] = block.Jsonvalues;
                var ja = new JArray();
                ja.Add(result);
                return ja;
            }
            catch
            {
                return null;
            }
        }
        public void DeleteBlock(int blockId)
        {
            JObject data = JObject.FromObject(new
            {
                delete = new
                {
                    id = blockId
                }
            });
            WebClient wc = new WebClient();
            wc.BaseAddress = url;

            wc.Headers[HttpRequestHeader.ContentType] = "application/json";

            string response = wc.UploadString("update?commit=true", data.ToString());
        }

        public void UpdateBlock(Block block)
        {
            var data = this.FormSOLRJson(block);
            if (data == null)
                return;

            WebClient wc = new WebClient();
            wc.BaseAddress = url;
            wc.Headers[HttpRequestHeader.ContentType] = "application/json";
            try
            {
                string response = wc.UploadString("update?commit=true", data.ToString());
            }
            catch
            {
            }
        }

        public string Search(string query, int from, int size, string part)
        {

            string q = string.IsNullOrEmpty(part) ? $"content:{query}" : $"content:{query} AND part: {part}";
            WebClient wc = new WebClient();
            wc.BaseAddress = url;
            return wc.DownloadString($"query?q={q}&rows={size}&start={from}&sort=id asc");
        }

        public void DeleteAll()
        {
            JObject data = JObject.FromObject(new
            {
                delete = new
                {
                    query = "*:*"
                }
            });
            WebClient wc = new WebClient();
            wc.BaseAddress = url;

            wc.Headers[HttpRequestHeader.ContentType] = "application/json";

            string response = wc.UploadString("update?commit=true", data.ToString());
        }
    }
}
