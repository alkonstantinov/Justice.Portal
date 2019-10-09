using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class BlockData
    {
        public JSBlock Block { get; set; }

        public JSProperty[] Properties { get; set; }

        public JSRubric[] Rubrics { get; set; }

        public PropertyValue[] Values { get; set; }

        public bool CanBePage { get; set; }
    }
}
