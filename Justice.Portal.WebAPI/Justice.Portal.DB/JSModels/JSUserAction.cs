using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.JSModels
{
    public partial class JSUserAction
    {
        public int UserActionId { get; set; }
        public int PortalUserId { get; set; }
        public DateTime OnTime { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string UserName { get; set; }
    }
}
