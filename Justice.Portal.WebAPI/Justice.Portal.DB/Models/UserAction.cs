using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class UserAction
    {
        public int UserActionId { get; set; }
        public int PortalUserId { get; set; }
        public DateTime OnTime { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public virtual PortalUser PortalUser { get; set; }
    }
}
