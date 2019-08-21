using Justice.Portal.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Justice.Portal.Web.Services
{
    public interface ISOLRComm
    {
        void UpdateBlock(Block block);

        void DeleteBlock(int blockId);

        void DeleteAll ();

        string Search(string query, int from, int size, string part);
    }
}
