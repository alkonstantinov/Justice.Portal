using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class UsersResponse
    {
        public JSPortalUser[] Users { get; set; }

        public JSPortalGroup[] Groups { get; set; }

        public JSPortalPart[] Parts { get; set; }

        public JSUserRight[] Rights { get; set; }

        public JSRubric[] Rubrics { get; set; }


    }
}
