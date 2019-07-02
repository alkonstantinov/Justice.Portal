using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class LoginResponse
    {
        public LoginResponse()
        {
            
        }

        public int PortalUserId { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string SessionID { get; set; }
        public string[] Rights { get; set; }
        public string[] Parts { get; set; }
    }
}
