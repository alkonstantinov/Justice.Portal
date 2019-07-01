using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Session
    {
        public int SessionId { get; set; }
        public Guid SessionKey { get; set; }
        public int PortalUserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastEdit { get; set; }

        public virtual PortalUser PortalUser { get; set; }
    }
}
