using Justice.Portal.DB.Tools;
using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class LoginRequest
    {
        public String UserName { get; set; }

        private string password;
        public String Password
        {
            get
            {
                return password;
            }
            set
            {
                password = Utils.GetMD5(value);
            }
        }
    }
}
