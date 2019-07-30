using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Justice.Portal.DB.Tools
{
    public class SOLRWrapper
    {
        private WebClient wc;
        public SOLRWrapper(string url)
        {
            wc = new WebClient();
        }
    }
}
