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
            while (true)
            {
                Console.WriteLine("Choose:");
                Console.WriteLine("1. SEBRA MIN");
                Console.WriteLine("2. ZPKONPI MIN");
                Console.WriteLine("3. CAREERS MIN");
                Console.WriteLine("4. NEWS MIN");
                Console.WriteLine("5. NFM MIN");
                Console.WriteLine("6. OPDU MIN");
                Console.WriteLine("7. BUDGET MIN");
                Console.WriteLine("8. OP MIN");
                Console.WriteLine("9. CONSULT MIN");
                Console.WriteLine("10. CRAWL PAGE");
                Console.WriteLine("11. CHILD PROTECTION COLLECTION");
                Console.WriteLine("12. ESPCH COLLECTION");
                Console.WriteLine("13. CRAWL NLAB PAGE");
                Console.WriteLine("14. JUR REG");
                Console.WriteLine("15. NLAB NEWS");
                Console.WriteLine("16. GDIN NEWS");
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
                    case "4":
                        var newsMin = new MinNews(db);
                        newsMin.Download();
                        break;
                    case "5":
                        var nfm = new NFM(db);
                        nfm.Download();
                        break;
                    case "6":
                        var opdu = new OPDU(db);
                        opdu.Download();
                        break;
                    case "7":
                        var minFin = new MinFin(db);
                        minFin.Download();
                        break;
                    case "8":
                        var minOP = new MinOP(db);
                        minOP.Download();
                        break;
                    case "9":
                        var minConsult = new MinConsult(db);
                        minConsult.Download();
                        break;
                    case "10":
                        var crawlPage = new CrawlPage(db);
                        crawlPage.Download();
                        break;
                    case "11":
                        var ChildProtectionCollection = new ChildProtectionCollection(db);
                        ChildProtectionCollection.Download();
                        break;
                    case "12":
                        var ESPCHCollection = new ESPCHCollection(db);
                        ESPCHCollection.Download();
                        break;
                    case "13":
                        var CrawlNLABPage = new CrawlNLABPage(db);
                        CrawlNLABPage.Download();
                        break;
                    case "14":
                        var JurReg = new JurReg(db);
                        JurReg.Download();
                        break;
                    case "15":
                        var NLABNews = new NLABNews(db);
                        NLABNews.Download();
                        break;
                    case "16":
                        var GdinNews = new GdinNews(db);
                        GdinNews.Download();
                        break;


                }
            }
        }
    }
}
