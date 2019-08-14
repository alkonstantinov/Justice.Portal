using Justice.Portal.DB.JSModels;
using Justice.Portal.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Justice.Portal.Web.Services
{
    public interface ICielaComm
    {
        CielaDocInfo[] GetDocuments();
        string GetDocument(Int64 id);
    }
}
