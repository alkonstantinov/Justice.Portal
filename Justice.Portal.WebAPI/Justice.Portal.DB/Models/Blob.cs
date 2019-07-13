using System;
using System.Collections.Generic;

namespace Justice.Portal.DB.Models
{
    public partial class Blob
    {
        public int BlobId { get; set; }
        public string Hash { get; set; }
        public string Filename { get; set; }
        public string Extension { get; set; }
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
    }
}
