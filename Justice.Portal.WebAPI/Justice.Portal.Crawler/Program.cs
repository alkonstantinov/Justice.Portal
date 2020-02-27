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
                Console.WriteLine("17. GDIN KONPI");
                Console.WriteLine("18. GDIN Careers");
                Console.WriteLine("19. PKGdinCrawler");
                Console.WriteLine("20. Anticorr");
                Console.WriteLine("21.PKMinCrawler");
                Console.WriteLine("22.PKGDOCrawler");
                Console.WriteLine("23.GDOCraw");
                Console.WriteLine("24.ZPKONPI GDO");
                Console.WriteLine("25.AV TEXT");
                Console.WriteLine("26.AV Careers");
                Console.WriteLine("27.AV PK");
                Console.WriteLine("28.AV News");
                Console.WriteLine("29.AV CHL12");
                Console.WriteLine("30. AV ZPKONPI");
                Console.WriteLine("300. AV FULL");
                Console.WriteLine("301. MinProjects");
                Console.WriteLine("302. GDIN Page");
                Console.WriteLine("303. MinPKArchiveCrawler");
                Console.WriteLine("304. CitizenshipProtoPage");
                Console.WriteLine("305. MinInterviews");



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
                    case "17":
                        var ZpkonpiGdin = new ZpkonpiGdin(db);
                        ZpkonpiGdin.Download();
                        break;
                    case "18":
                        var CareersGdin = new CareersGdin(db);
                        CareersGdin.Download();
                        break;
                    case "19":
                        var PKGdinCrawler = new PKGdinCrawler(db);
                        PKGdinCrawler.Download();
                        break;

                    case "20":
                        var Anticorr = new Anticorr(db);
                        Anticorr.Download();
                        break;
                    case "21":
                        var PKMinCrawler = new PKMinCrawler(db);
                        PKMinCrawler.Download();
                        break;
                    case "22":
                        var GDOPKCrawler = new GDOPKCrawler(db);
                        GDOPKCrawler.Download();
                        break;
                    case "23":
                        var GDOCraw = new GDOCraw(db);
                        GDOCraw.Download();
                        break;
                    case "24":
                        var ZpkonpiGDO = new ZpkonpiGDO(db);
                        ZpkonpiGDO.Download();
                        break;
                    case "25":
                        var AVText = new AVText(db);
                        AVText.Download();
                        break;
                    case "26":
                        var AVCareers = new AVCareers(db);
                        AVCareers.Download();
                        break;
                    case "27":
                        var AVPK = new AVPK(db);
                        AVPK.Download();
                        break;
                    case "28":
                        var AVNews = new AVNews(db);
                        AVNews.Download();
                        break;
                    case "29":
                        var AVCHL12 = new AVCHL12(db);
                        AVCHL12.Download();
                        break;
                    case "30":
                        var AVZPKONPI = new AVZPKONPI(db);
                        AVZPKONPI.Download();
                        break;
                    case "300":
                        var AVText1 = new AVText(db);
                        AVText1.Download();
                        
                        var AVCareers1 = new AVCareers(db);
                        AVCareers1.Download();
                        
                        var AVPK1 = new AVPK(db);
                        AVPK1.Download();
                        
                        var AVNews1 = new AVNews(db);
                        AVNews1.Download();
                        break;

                    case "301":
                        var MinProjects = new MinProjects(db);
                        MinProjects.Download();

                        break;

                    case "302":
                        var GdinPage = new GdinPage(db);
                        GdinPage.Download();

                        break;
                    case "303":
                        var MinPKArchiveCrawler = new MinPKArchiveCrawler(db);
                        MinPKArchiveCrawler.Download();

                        break;

                    case "304":
                        var CitizenshipProtoPage = new CitizenshipProtoPage(db);
                        CitizenshipProtoPage.Download();

                        break;
                    case "305":
                        var MinInterview = new MinInterview(db);
                        MinInterview.Download();

                        break;
                }
                Console.WriteLine("Press key");
                Console.ReadKey();

            }
        }
    }
}
