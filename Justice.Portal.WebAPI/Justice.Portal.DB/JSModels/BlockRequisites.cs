using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class BlockRequisites
    {
        public JSPortalPart[] Parts { get; set; }

        public JSBlockType[] BlockTypes { get; set; }

        public JSRubric[] Rubrics { get; set; }

    }
}
