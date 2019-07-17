using System;
using System.Collections.Generic;
using System.Text;

namespace Justice.Portal.DB.JSModels
{
    public class BlocksPerPortalPart
    {
        public Dictionary<string, List<JSBlock>> Data { get; set; }

        public BlocksPerPortalPart()
        {
            Data = new Dictionary<string, List<JSBlock>>();

        }
    }
}
