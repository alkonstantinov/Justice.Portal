﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class GroupsResponse
    {

        public JSPortalGroup[] Groups { get; set; }

        public JSPortalPart[] Parts { get; set; }

        public JSUserRight[] Rights { get; set; }

    }
}