using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class UserRight
    {
        public int UserRightId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
