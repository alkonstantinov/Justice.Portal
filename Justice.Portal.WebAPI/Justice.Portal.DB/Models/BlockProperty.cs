﻿using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class BlockProperty
    {
        public int BlockPropertyId { get; set; }
        public int BlockId { get; set; }
        public string PropertyId { get; set; }
        public string Value { get; set; }

        public virtual Block Block { get; set; }
        public virtual Property Property { get; set; }
    }
}
