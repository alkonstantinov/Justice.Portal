using Justice.Portal.Crawler.Crawlers;
using Justice.Portal.DB.Models;
using System;

namespace Justice.Portal.Crawler
{
    class Program
    {
        static void Main(string[] args)
        {
            JusticePortalContext jpc = new JusticePortalContext();

            DB.DBFuncs db = new DB.DBFuncs(jpc);

            Console.WriteLine("Choose:");
            Console.WriteLine("1. SEBRA");
            Console.WriteLine("2. ZPKONPI MIN");
            Console.WriteLine("3. CAREERS");
            var choice = Console.ReadLine();
            switch (choice)
            {
                case "1":
                    var sebra = new Sebra(db);
                    sebra.Download();
                    break;
                case "2":
                    var zpkonpi = new Zpkonpimin(db);
                    zpkonpi.Download();
                    break;
                case "3":
                    var careers = new Careers(db);
                    careers.Download();
                    break;
            }

        }
    }
}
