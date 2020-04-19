const lsLastBannerTime = "LastBannerTime";
const lsBreadcrumbs = "Breadcrumbs";
const lsSearchString = "SearchString";
const bcKeyMain = "___main";


class MJProcess {

    constructor() {

        this.translation = {};
        this.language = "bg";
        this.MJPageData = {};
        this.LastBanner = null;
        this.Top = 0;
        this.ItemsContentId = "";
        this.NextItemsLinkId = "";
        this.years = [];

        this.LoadTranslations = this.LoadTranslations.bind(this);
        this.Translate = this.Translate.bind(this);
        this.TranslateWord = this.TranslateWord.bind(this);

        this.TranslateAttribs = this.TranslateAttribs.bind(this);
        this.LoadAllPKNomenclatures = this.LoadAllPKNomenclatures.bind(this);

        this.DoProcess = this.DoProcess.bind(this);
        this.ShowBannerIfNeeded = this.ShowBannerIfNeeded.bind(this);
        this.NarrowText = this.NarrowText.bind(this);
        this.Guid = this.Guid.bind(this);
        this.ClearBreadCrumbs = this.ClearBreadCrumbs.bind(this);
        this.FindMeOrAddMeInBreadCrumbs = this.FindMeOrAddMeInBreadCrumbs.bind(this);
        this.DisplayBreadCrumbs = this.DisplayBreadCrumbs.bind(this);
        this.ShowMonth = this.ShowMonth.bind(this);
        this.SearchCollection = this.SearchCollection.bind(this);
        this.PutHeader = this.PutHeader.bind(this);
        this.ShowCareers = this.ShowCareers.bind(this);
        this.NetDate = this.NetDate.bind(this);


        this.PutBlocks = this.PutBlocks.bind(this);
        this.PutElement = this.PutElement.bind(this);
        this.PutLive = this.PutLive.bind(this);
        this.PutHtml = this.PutHtml.bind(this);
        this.PutAdsSQ = this.PutAdsSQ.bind(this);
        this.PutNewsSQ = this.PutNewsSQ.bind(this);
        this.PutAds = this.PutAds.bind(this);
        this.PutNews = this.PutNews.bind(this);
        this.PutNew = this.PutNew.bind(this);
        this.PutAd = this.PutAd.bind(this);
        this.PutText = this.PutText.bind(this);
        this.PutBio = this.PutBio.bind(this);
        this.PutInfo = this.PutInfo.bind(this);
        this.PutSearch = this.PutSearch.bind(this);
        this.PutBiographies = this.PutBiographies.bind(this);
        this.PutDocList = this.PutDocList.bind(this);
        this.PutCollection = this.PutCollection.bind(this);
        this.PutCiela = this.PutCiela.bind(this);
        this.PutSitemap = this.PutSitemap.bind(this);
        this.PutPK = this.PutPK.bind(this);
        this.PutOps = this.PutOps.bind(this);
        this.PutOp = this.PutOp.bind(this);
        this.PutOffers = this.PutOffers.bind(this);
        this.PutOffer = this.PutOffer.bind(this);
        this.PutMessages = this.PutMessages.bind(this);
        this.PutMessage = this.PutMessage.bind(this);
        this.PutConsults = this.PutConsults.bind(this);
        this.PutConsult = this.PutConsult.bind(this);
        this.PutCareers = this.PutCareers.bind(this);

        this.PutNextPKListItems = this.PutNextPKListItems.bind(this);
        this.PutFeedback = this.PutFeedback.bind(this);
        this.SendFeedback = this.SendFeedback.bind(this);

        this.RepairLinks = this.RepairLinks.bind(this);


        this.T = this.T.bind(this);

        this.LoadTranslations();
    }



    Guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    NarrowText(text, length) {
        if (!text)
            return "";
        //text = $(text).text();
        text = text.replace(/<\/?[^>]+(>|$)/g, "");
        text = text.replace(/&nbsp;/g, " ");

        if (text.length <= length)
            return text;

        return text.substring(0, length) + "...";
    }


    LoadTranslations() {
        var self = this;
        $.ajax({
            url: "/api/translate/GetTranslation",
            dataType: 'json',
            async: false,

            success: function (data) {
                self.translation = data;

            }
        });

        var lng = localStorage.getItem("language");
        this.language = lng || this.language;

    }



    Translate(element) {
        var lng = this.translation[this.language];
        if (!lng) {
            element.replaceWith("");
            return;
        }

        var wording = lng[element.innerText.toLowerCase()];
        if (!wording) {
            element.replaceWith("");
            return;
        }
        element.replaceWith(wording);



    }


    TranslateWord(word) {
        var lng = this.translation[this.language];
        if (!lng) {
            return "";
        }

        var wording = lng[word.toLowerCase()];
        if (!wording) {
            return "";
        }
        return wording;
    }

    TranslateAttribs(element) {
        var lng = this.translation[this.language];
        if (!lng) {
            $(element).attr("placeholder", "");
            return;
        }
        if (!$(element).attr("placeholder"))
            return;
        var wording = lng[$(element).attr("placeholder").toLowerCase()];
        if (!wording) {
            $(element).attr("placeholder", "");
            return;
        }
        $(element).attr("placeholder", wording);



    }

    PutElement(e, isMain) {
        let blockId = $(e).attr("id");
        let blockTypeId = $(e).attr("mjblocktypeid");
        if (isMain) {
            blockId = "dMain";
            blockTypeId = this.MJPageData.maintype;
        }
        if (!isMain && !this.MJPageData["block_" + blockId]) return;



        switch (blockTypeId) {
            case "live": this.PutLive(blockId, isMain); break;
            case "html": this.PutHtml(blockId, isMain); break;
            case "banner": this.PutBanner(blockId, isMain); this.LastBanner = blockId; break;
            case "adssq": this.PutAdsSQ(blockId, isMain); break;
            case "newssq": this.PutNewsSQ(blockId, isMain); break;
            case "ads": this.PutAds(blockId, isMain); break;
            case "news": this.PutNews(blockId, isMain); break;
            case "new": this.PutNew(blockId, isMain); break;
            case "ad": this.PutAd(blockId, isMain); break;
            case "info": this.PutInfo(blockId, isMain); break;
            case "text": this.PutText(blockId, isMain); break;
            case "bio": this.PutBio(blockId, isMain); break;
            case "search": this.PutSearch(blockId, isMain); break;
            case "biocabinet": this.PutBiographies(blockId, isMain); break;
            case "doclist": this.PutDocList(blockId, isMain); break;
            case "collection": this.PutCollection(blockId, isMain); break;
            case "ciela": this.PutCiela(blockId, isMain); break;
            case "sitemap": this.PutSitemap(blockId, isMain); break;
            case "pk": this.PutPK(blockId, isMain); break;
            case "pkops": this.PutOps(blockId, isMain); break;
            case "pkoffers": this.PutOffers(blockId, isMain); break;
            case "pkmessages": this.PutMessages(blockId, isMain); break;
            case "pkconsults": this.PutConsults(blockId, isMain); break;
            case "pkop": this.PutOp(blockId, isMain); break;
            case "pkoffer": this.PutOffer(blockId, isMain); break;
            case "pkmessage": this.PutMessage(blockId, isMain); break;
            case "pkconsult": this.PutConsult(blockId, isMain); break;
            case "career": this.PutCareers(blockId, isMain); break;
            case "feedback": this.PutFeedback(blockId, isMain); break;

        }
    }

    PutLive(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`
            <div class= "port-wrapper grid-item-emission" >
            <div class="port-head">
                <h3 class="port-title"><t>emissions</t></h3>
                <div class="port-link-item">
                </div>
            </div>
            <div class="port-box p-0 bgr-black box-border height-350">
                <div class="abs-content" style='background-image: url("/api/part/GetBlob?hash=`+ obj.imageId + `");'>
                    <div class="abs-cover"></div>
                    <div class="emission-label">
                        <img src="/images/live-symbol.png">
                            <span><t>live</t></span>
						</div>
                        <div class="emission-title">
                            <h2 class="white">`+ obj.title[self.language] + `                                
							</h2>
+ `+ ((obj.url != null && obj.url != "") ?
                `<a role="button" class="btn btn-emission js-video" data-toggle="modal" data-src="` + obj.url + `" data-target="#liveEmission">
                                <svg class="icon icon-play-button"><use xlink: href="images/symbol-defs.svg#icon-play-button"></use></svg>
                            <t>watchlive</t>
							</a>`: ``) + `
                    </div>
                </div>
            </div>
			</div>
             `));


    }

    PutBanner(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;

        if (!obj) {
            this.HasBanner = false;
            return;
        }
        this.HasBanner = true;
        var self = this;
        oldDiv.replaceWith($(`
            <div class="modal fade" id="`+ divId + `" tabindex="-1" role="dialog" aria-labelledby="liveEmission" aria-hidden="true">
  	<div class="modal-dialog m-video-dialog" role="document">
    	<div class="modal-content">
		    <div class="modal-body">
                <div class="row">
                    <div class="col-12">

       			        <button type="button" class="close- " data-dismiss="modal" aria-label="Close">
          			        <span aria-hidden="true">&times;</span>
        		        </button>        
                    </div>
                </div>
                <div class="row">
                    <div class="col-`+ ((obj.body[self.language] && obj.body[self.language].length > 0) ? "6" : "12") + `">
                        <img src="/api/part/GetBlob?hash=`+ obj.imageId + `" alt="" style="max-width:100%;max-height:100%"/>
                    </div>
                    <div class="col-6">
                        `+ self.FixText(obj.body[self.language] || "") + `
                    </div>
                </div>
                
		    </div>
    	</div>
  	</div>
</div> 


             `));


    }


    PutHtml(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(obj.html[self.language]));


    }

    PutAdsSQ(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        var lis = "";

        $.ajax({
            url: "/api/content/GetAdsSQData?count=6&blockId=" + this.MJPageData["block_" + divId].value,
            dataType: 'json',
            async: false,

            success: function (data) {
                data.forEach(x =>
                    lis += '<li><h3><span>' + x.date + '</span><a href="home/index/' + x.url + '">' + self.NarrowText($(JSON.parse(x.jsonContent).body[self.language]).text(), 140) + '</a></h3></li>'
                );

            }
        });


        var newContent = `<div class="port-wrapper">
			<div class="port-head">
				<h3 class="port-title"><t>ads</t></h3>
				<div class="port-link-item">
					<a href="#" autolink="ads" class="port-head-link"><t>allads</t>
						<svg class="icon icon-arrow-right"><use xlink:href="images/symbol-defs.svg#icon-angle-arrow-down"></use></svg>
					</a>	
				</div>
			</div>
			<div class="port-box box-border">
				<ul class="announce-list list-unstyled">
					`+ lis + `
				</ul>
			</div>
		</div >`;

        oldDiv.replaceWith($(newContent));


    }


    PutNextAds(blockId) {
        var self = this;
        var divs = "";
        var showMore = false;
        $.ajax({
            url: "/api/content/GetAdsData?count=10&blockId=" + blockId + "&top=" + self.Top,
            dataType: 'json',
            async: false,

            success: function (data) {
                self.Top += data.rows.length;
                showMore = self.Top < data.count;
                data.rows.forEach(x =>
                    divs += `<div class="list-box">
						<div class="port-content">
							`+ (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt=""   class="list-article-img img-list"/>' : '') +
                    `<div>
								<h6 class="date">`+ x.date + `</h6>
                                <h2>` + self.NarrowText(JSON.parse(x.jsonContent).title[self.language], 100) + `</a></h2>     
								<h3><a href="`+ x.url + `">` + self.NarrowText($(JSON.parse(x.jsonContent).body[self.language]).text(), 100) + `</a></h3>
							</div>
						</div>
					</div>
					`
                );

            }
        });

        $("#" + this.ItemsContentId).append($(divs));
        if (!showMore)
            $("#" + this.NextItemsLinkId).hide();

    }

    PutAds(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        var self = this;

        var newContent = `<div class="port-wrapper">
				<div class="port-head">
					<h3 class="port-title"><t>ads</t></h3>
					
				</div>
				<div class="port-box box-border" id="` + this.ItemsContentId + `">
					
				</div>
                <div class="port-footer">
						<div class="port-link-item">
							<a class="btn btn-primary" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextAds(` + blockId + `)">
                                <t>more</t>
							</a>
						</div>
			</div>`;

        oldDiv.replaceWith($(newContent));
        this.PutNextAds(blockId);


    }







    PutNextNews(blockId) {
        var self = this;
        var divs = "";
        var showMore = false;
        $.ajax({
            url: "/api/content/GetNewsData?count=6&blockId=" + blockId + "&top=" + self.Top,
            dataType: 'json',
            async: false,

            success: function (data) {
                self.Top += data.rows.length;

                showMore = self.Top < data.count;
                data.rows.forEach(x => {
                    divs += `<div class="list-box">
						<div class="port-content">
							`+ (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt=""   class="list-article-img img-list"/>' : '') +
                        `<div>
								<h6 class="date">`+ x.date + `</h6>
                                <h2><a href="`+ x.url + `">` + self.NarrowText(JSON.parse(x.jsonContent).title[self.language], 100) + `</a></h2>     

								<h3>` + self.NarrowText(JSON.parse(x.jsonContent).body[self.language], 100) + `</h3>
							</div>
						</div>
					</div>
					`;
                    console.log(divs);
                });

            }
        });

        $("#" + this.ItemsContentId).append($(divs));
        if (!showMore)
            $("#" + this.NextItemsLinkId).hide();

    }

    PutNews(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        var self = this;

        var newContent = `<div class="port-wrapper">
				<div class="port-head">
					<h3 class="port-title"><t>news</t></h3>
					
				</div>
				<div class="port-box box-border" id="` + this.ItemsContentId + `">
					
				</div>
                <div class="port-footer">
						<div class="port-link-item">
							<a class="btn btn-primary" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextNews(` + blockId + `)">
                                <t>more</t>
							</a>
						</div>
			</div>`;

        oldDiv.replaceWith($(newContent));
        this.PutNextNews(blockId);


    }


    PutNewsSQ(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;


        var divs = "";

        $.ajax({
            url: "/api/content/GetNewsSQData?count=3&blockId=" + this.MJPageData["block_" + divId].value + "&lang=" + self.language,
            dataType: 'json',
            async: false,

            success: function (data) {
                data.forEach((x, idx) => {
                    var data = JSON.parse(x.jsonContent);
                    divs +=
                        `<div class="carousel-item ` + (idx === 0 ? "active" : "") + `">
                        <h6 class="date">`+ x.date + `</h6>
                        <h2>`+ (data.title[self.language] || "") + `</h2>
                        <div class="port-content">
                            <div class="col-4">
                                <img src="/api/part/GetBlob?hash=`+ data.imageId + `" alt="" class="list-article-img img-prime" style="max-width:100%; max-height:100%"/>
                            </div>
                            <div class="col-8">
                                <div style="height:80%; max-height:80%; min-height:80%; overflow: hidden;">
                                `+ self.NarrowText($(data.body[self.language]).text(), 400) + `
                                </div>
                                <a class="btn btn-primary" href="/home/index/`+ x.url + `" role="button" style="margin-top:10px"><t>learnmore</t></a>
                            </div>
						</div>
                    </div>`;
                }

                );

            }
        });



        var newContent =
            `<div class="port-wrapper">
			    <div class="port-head">
				    <h3 class="port-title"><t>news</t></h3>
				    <div class="port-link-item">
					    <a href="news-list.html" autolink="news" class="port-head-link"><t>allnews</t>
					        <svg class="icon icon-arrow-right"><use xlink:href="images/symbol-defs.svg#icon-angle-arrow-down"></use></svg>
					    </a>
				    </div>
			    </div>
			    <div class="port-box box-border height-350">
				    <div id="carouselIndicators" class="carousel slide" data-ride="carousel">
					    <ol class="carousel-indicators" id="carIndicators">
						    <li data-target="#carouselIndicators" data-slide-to="0" class="active"></li>
						    <li data-target="#carouselIndicators" data-slide-to="1"></li>
						    <li data-target="#carouselIndicators" data-slide-to="2"></li>
					    </ol>
					    <div class="carousel-inner">
						    `+ divs + `
					    </div>
				    </div>
			    </div>
		    </div>
		`;


        oldDiv.replaceWith($(newContent));

        //$('.carousel').carousel();
    }



    PutNextSearch() {
        var self = this;
        var divs = "";
        var showMore = false;
        var query = localStorage.getItem(lsSearchString) || "";
        query = encodeURI(query);
        $.ajax({
            url: "/api/content/search?size=10&query=" + query + "&from=" + self.Top + "&part=" + (this.MJPageData.mainpartid === "min" ? "" : this.MJPageData.mainpartid),
            dataType: 'json',
            async: false,

            success: function (data) {
                self.Top += data.response.docs.length;
                $("#" + self.FoundCountId).text(data.response.numFound);
                showMore = self.Top < data.response.numFound;
                data.response.docs.forEach(x =>
                    divs += `<div class="list-box">
						<div class="port-content">
                    <div>
								<h3><a href="`+ x.urlhash[0] + `">` + JSON.parse(x.content).title[self.language] + `</a></h3>
							</div>
						</div>
					</div>
					`
                );

            }
        });

        $("#" + this.ItemsContentId).append($(divs));
        if (!showMore)
            $("#" + this.NextItemsLinkId).hide();



    }

    PutSearch(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        this.FoundCountId = this.Guid();
        var self = this;
        var newContent = `<div class="port-wrapper">
				<div class="port-head">
					<h3 class="port-title"><t>searchresult</t></h3>
                    <span>
                        <t>found</t>: <span id=`+ this.FoundCountId + `></span> <t>records</t>
				    </span>					
				</div>
				<div class="port-box box-border" id="` + this.ItemsContentId + `">
					
				</div>
                <div class="port-footer">

						<div class="port-link-item">
                            <a class="btn btn-primary" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextSearch(` + blockId + `)">
                                <t>more</t>
							</a>
						</div>
			</div>`;

        oldDiv.replaceWith($(newContent));
        this.PutNextSearch();


    }


    PutNew(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class="article-container">

				<h1>`+ obj.title[self.language] + `				
				</h1>
				
				<figure>

					`+ (obj.imageId ? `<img class="half-pic" src="/api/part/GetBlob?hash=` + obj.imageId + `">` : ``) + `
				</figure >
            <div class="article-content">
                `+ self.FixText(obj.body[self.language]) + `
				</div>
			</article > `));


    }

    PutAd(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>

            <figure>

                `+ (obj.imageId ? '<img class="half-pic" src="/api/part/GetBlob?hash=' + obj.imageId + '">' : "") + `
				</figure>
                <div class="article-content">
                    `+ self.FixText(obj.body[self.language]) + `
				</div>
			</article>`));


    }

    PutText(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>

            <figure>

                `+ (obj.imageId ? '<img class="half-pic" src="/api/part/GetBlob?hash=' + obj.imageId + '">' : "") + `
				</figure>`
            + (obj.others ?
                `<div class="article-content">
                    `+ obj.others + `
				</div>`: "") +
            `<div class="article-content">
                    `+ self.FixText(obj.body[self.language]) + `
				</div>
			</article>`));


    }


    PutBio(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] +
            "<span>" + (obj.addinfo[self.language] || "") + "</span>" +



            `
    
				</h1>

            <figure>

                <img class="half-pic" src="/api/part/GetBlob?hash=`+ obj.imageId + `">
				</figure>
                <div class="article-content">
                    `+ self.FixText(obj.body[self.language]) + `
				</div>
			</article>`));


    }


    PutInfo(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>

            <figure>

                <img class="half-pic" src="/api/part/GetBlob?hash=`+ obj.imageId + `">
				</figure>
                <div class="article-content" style="max-width:100%">
                    `+ self.FixText(obj.body[self.language]) + `
				</div>
			</article>`));


    }



    PutBiographies(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        var self = this;
        var divs = "";
        $.ajax({
            url: "/api/content/GetCabinetBios",
            dataType: 'json',
            async: false,

            success: function (data) {
                data.forEach(x => {
                    var data = JSON.parse(x.jsonvalues);
                    divs += `<div class= "list-box">
            <div class="port-content">
                `+ (data.imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonvalues).imageId + '" alt="" style="-width:auto;height:auto;" class="list-article-img img-list" />' : '') +
                        `<div>

                    <h3><a href="`+ x.url + `">` + data.title[self.language] + `</a>

                    </h3>
                    <span>` + (data.addinfo[self.language] || "") + `</span>
                </div>
            </div>
					</div >
            `;
                });

            }
        });


        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>bios</t></h3>

            </div>
            <div class="port-box box-border" id="` + this.ItemsContentId + `">
                `+ divs + `
				</div>
            <div class="port-footer">

            </div>`;

        oldDiv.replaceWith($(newContent));


    }

    FormatDate(d) {
        var currentDt = new Date(d);
        var mm = currentDt.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        var dd = currentDt.getDate();
        if (dd < 10) dd = '0' + dd;
        var yyyy = currentDt.getFullYear();
        var date = dd + '.' + mm + '.' + yyyy;
        return date;
    }

    NetDate(d) {
        var currentDt = new Date(d);
        var mm = currentDt.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        var dd = currentDt.getDate();
        if (dd < 10) dd = '0' + dd;
        var yyyy = currentDt.getFullYear();
        var date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    ShowMonth(year, month, divId) {
        $("div[id^=dMonth_]").hide();
        var self = this;
        var download = this.TranslateWord("download");

        var ul = "<ul class='list-group'>";
        this.years.find(x => x.year === year).months.find(x => x.month === month).docs.forEach(x => {
            var li = "";
            if (x.docId !== "") {
                li = "<li class='list-group-item'>" + self.FormatDate(x.date) + " " + self.FixText(x.title[self.language]) + " " + " <a href='/api/part/getblob?hash=" + x.docId + "'>" + download + "</a></li>";
            }
            if (x.html) {
                li = "<li class='list-group-item'>" + x.html[self.language] + "</a></li>";
            }
            ul += li;
        }
        );
        ul += "</ul>";
        console.log("ul", ul);
        //$("#" + divId).empty();
        $("#" + divId).html(ul);

        $("#" + divId).show();
    }

    SearchCollection() {
        var searchResult = [];
        var self = this;

        self.CollectionContent.forEach(r => {
            var ok = true;

            self.CollectionStructure.forEach(ss => {
                var src = "";
                switch (parseInt(ss.type)) {
                    case 1:
                        src = $("#" + ss.id).val().toLowerCase();
                        if ((src || "") !== "" && r[ss.id].toLowerCase().indexOf(src) === -1)
                            ok = false;
                        break;
                    case 2:
                        src = $("#" + ss.id).val().toLowerCase();
                        if ((src || "") !== "" && r[ss.id][self.language].toLowerCase().indexOf(src) === -1)
                            ok = false;
                        break;
                };

            });
            if (ok)
                searchResult.push(r);
        });

        var resultTbl = "<table class='table table-bordered table-striped'><thead><tr>";

        self.CollectionStructure.forEach(x => {
            resultTbl += "<th>" + x.name[self.language] + "</th>";

        });
        resultTbl += "</tr></thead><tbody>";
        var download = self.TranslateWord("download");
        var link = self.TranslateWord("link").toLowerCase();
        searchResult.forEach(x => {
            resultTbl += "<tr>";
            self.CollectionStructure.forEach(ss => {
                switch (parseInt(ss.type)) {
                    case 1:
                        resultTbl += "<td>" + x[ss.id] + "</td>"; break;
                    case 2:
                        resultTbl += "<td>" + (x[ss.id][self.language] || "") + "</td>"; break;
                    case 3:
                        resultTbl += "<td>" + x[ss.id] + "</td>"; break;
                    case 4:
                        resultTbl += "<td><a href='/api/part/getblob?hash=" + x[ss.id] + "'>" + download + "</a></td>"; break;
                    case 5:
                        resultTbl += "<td><a href='" + x[ss.id] + "'>" + link + "</a></td>"; break;
                }

            });
            resultTbl += "</tr>";
        });
        resultTbl += "</tbody></table>";
        $("#dSearchResult").html(resultTbl);

    }

    PutCollection(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;

        $.ajax({
            url: "/api/content/GetCollection?collectionId=" + self.MJPageData.main.collectionId,
            dataType: 'json',
            async: false,

            success: function (data) {
                self.CollectionStructure = JSON.parse(data.structure);
                self.CollectionContent = JSON.parse(data.content);
            }
        });
        var divSearchControls = "";
        self.CollectionStructure.forEach(x => {
            switch (parseInt(x.type)) {
                case 1:
                    divSearchControls += `
            <div class="row">
            <div class="col-12">
                <label class="control-label">`+ x.name[self.language] + `</label>
                <input type="text" id="`+ x.id + `" class="form-control" />
            </div>
                </div>
            `;
                    break;
                case 2:
                    divSearchControls += `
            <div class="row">
            <div class="col-12">
                <label class="control-label">`+ x.name[self.language] + `</label>
                <input type="text" id="`+ x.id + `" class="form-control" />
            </div>
                </div>
            `;
                    break;

            }

        });

        divSearchControls += `
            <div class= "row">
            <div class="col-12">
                <button class="btn btn-primary" onclick="mjProcess.SearchCollection()"><t>search</t></label>
            </div>
                </div>
            `;
        oldDiv.replaceWith($(`<article class="article-container">

            <h1>`+ (obj.title ? obj.title[self.language] : "") + `
				</h1>

            <div class="article-content">
                `+ divSearchControls + `
				</div>
            <div class="article-content" id="dSearchResult"></div>
			</article > `));


        this.SearchCollection();

    }

    PutDocList(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;


        var list = obj.docs.sort((a, b) => a.date < b.date ? 1 : -1);
        list.forEach(i => {
            var date = new Date(i.date);
            var y = self.years.find(x => parseInt(x.year) === date.getFullYear());
            if (!y) {
                y = {
                    year: date.getFullYear(),
                    months: [{ month: 1, docs: [] }, { month: 2, docs: [] }, { month: 3, docs: [] }, { month: 4, docs: [] }, { month: 5, docs: [] }, { month: 6, docs: [] },
                    { month: 7, docs: [] }, { month: 8, docs: [] }, { month: 9, docs: [] }, { month: 10, docs: [] }, { month: 11, docs: [] }, { month: 12, docs: [] }]
                };
                self.years.push(y);
            }

            var m = y.months.find(x => parseInt(x.month) === date.getMonth() + 1);
            m.docs.push({
                title: i.title,
                docId: i.docId,
                html: i.html,
                date: i.date
            });


        });

        var divYears = "";
        self.years.forEach(x => {
            var hiddenDivId = "dMonth_" + this.Guid();
            divYears += `<br /> <div class="article-content">
                `;
            divYears += '<h2>' + x.year + '</h2>';
            x.months.forEach(m => divYears += '<a onclick="mjProcess.ShowMonth(' + x.year + ', ' + m.month + ',\'' + hiddenDivId + '\')" class="pnt"><t>month' + m.month + '</t></a>&nbsp;&nbsp;');
            divYears += '<br /><div id="' + hiddenDivId + '" />';

            divYears += `</div>`;
        });



        var btext = (obj.text || obj.body);

        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>

            <div class="article-content">
                `+ self.FixText(btext ? btext[self.language] : "") + `
				</div>
                `+ divYears + `
			</article > `));




    }


    PutCiela(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        var actsLI = "";

        obj.links.sort((a, b) => a.id < b.id ? -1 : 1)
            .forEach(x =>
                actsLI += `<li class= 'list-group-item' > <a href='/home/normdoc/` + x.link + `' target='_blank'>` + x.title[self.language] + `</a></li > `
            );

        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>
            <div class="article-content">
                `+ (obj.body[self.language] || "") + `
				</div>
            <div class="article-content">
                <ul class='list-group'>
                    `+ actsLI + `
                    </ul>
            </div>
			</article > `));


    }


    PutSitemap(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;


        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>
            <div class="article-content">
                `+ (obj.body[self.language] || "") + `
				</div>
        	</article > `));


    }


    PutPK(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;


        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>
            <div class="article-content">
                <ul class='list-group'>
                    <li class='list-group-item'><a href='#' autolink="pkops"><t>ops</t></a></li>
                    <li class='list-group-item'><a href='#' autolink="pkoffers"><t>offers</t></a></li>
                    <li class='list-group-item'><a href='#' autolink="pkmessages"><t>messages</t></a></li>
                    <li class='list-group-item'><a href='#' autolink="pkconsults"><t>consults</t></a></li>
                </ul>
            </div>
        	</article > `));


    }


    PutBlocks() {
        this.PutElement(null, true);
        let array = $("div[mjblocktypeid]").each(
            (i, e) => {

                this.PutElement(e, false);

            });
    }

    ShowBannerIfNeeded() {
        var self = this;
        if (self.LastBanner) {
            var lb = localStorage.getItem(lsLastBannerTime);
            var show = false;
            if (lb) {
                var d1 = new Date(lb);
                var d2 = new Date();
                var timeDiff = d2.getTime() - d1.getTime();
                var DaysDiff = timeDiff / (1000 * 3600 * 24);
                show = DaysDiff > 1;
            }
            else show = true;

            show = show && this.HasBanner;
            if (show) {
                $('#' + self.LastBanner).modal('show');
                localStorage.setItem(lsLastBannerTime, new Date().toISOString());
            }
            else
                $('#' + self.LastBanner).modal('hide');
        }


    }

    DoProcess(MJPageData) {
        this.MJPageData = MJPageData;
        //this.ClearBreadCrumbs();
        this.PutHeader();
        this.FindMeOrAddMeInBreadCrumbs();
        this.PutBlocks();
        var self = this;
        $("T").each(function (i, e) {
            self.Translate(e);
        });
        $("input").each(function (i, e) {

            self.TranslateAttribs(e);
        });
        $("#lTranslate").text(self.language === "bg" ? "EN" : "BG");
        self.ShowBannerIfNeeded();
        self.DisplayBreadCrumbs();
        self.PutAutomaticLinks();
        self.RepairLinks();
        $("#tbSS").keyup(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code === 13) {
                e.preventDefault();
                self.InitiateSearch($('#tbSS').val());
            }

        });
    }




    SwitchLanguage() {
        localStorage.setItem("language", this.language === "bg" ? "en" : "bg");
        location.reload();
    }


    ClearBreadCrumbs() {
        var bc = [];
        bc.push({
            key: bcKeyMain,
            title: { bg: this.translation.bg.start, en: this.translation.en.start }
        });
        localStorage.setItem(lsBreadcrumbs, JSON.stringify(bc));

    }

    FindMeOrAddMeInBreadCrumbs() {
        var bc = [];
        var urlParts = window.location.href.split('/');
        var key = ((urlParts.length === 4 || urlParts[urlParts.length - 1] === "") ? bcKeyMain : urlParts[urlParts.length - 1]).toLowerCase();
        if (key.indexOf('?') > -1)
            key = key.substring(0, key.indexOf('?'));
        if (this.GetUrlParameter("top") == 1) {
            var foundInPath = false;
            self.MJPageData.bcpath.forEach(x => {
                bc.push({
                    key: x.Url,
                    title: x.Title
                });
                foundInPath = foundInPath || x.Url == key;
            });
            if (!foundInPath)
                bc.push({
                    key: key,
                    title: this.MJPageData.main.title
                });
        }
        else {

            bc = JSON.parse(localStorage.getItem(lsBreadcrumbs) || "[]");
            if (bc.length === 0)
                bc.push({
                    key: bcKeyMain,
                    title: { bg: this.translation.bg.start, en: this.translation.en.start }
                });
            var me = bc.find(x => x.key === key);
            if (me) {
                bc.splice(bc.indexOf(me) + 1);
            }
            else {
                bc.push({
                    key: key,
                    title: this.MJPageData.main.title
                });
            }
        }
        localStorage.setItem(lsBreadcrumbs, JSON.stringify(bc));
    }

    DisplayBreadCrumbs() {

        var self = this;
        var olbc = $("#olBC");
        if (olbc.length > 0) {
            $("#olBC li").remove();
            var bc = JSON.parse(localStorage.getItem(lsBreadcrumbs) || "[]");
            bc.forEach((x, i) =>
                $("#olBC").append($('<li class="breadcrumb-item" aria-current="page"><a href="' + ((x.key == '' || x.key === bcKeyMain) ? '/' : '/home/index/' + x.key) + '">' + self.NarrowText((x.title ? x.title[self.language] : "..."), 50) + '</a></li>'))
            );

        }


    }


    InitiateSearch(str) {
        if ((str || "") === "")
            return;
        localStorage.setItem(lsSearchString, str);

        $.ajax({
            url: "/api/content/GetSearchResultBlock?portalPartId=" + this.MJPageData.mainpartid,
            dataType: 'json',
            async: false,
            success: function (data) {
                window.location.href = "/home/index/" + data.url;

            }
        });


    }


    PutHeader() {
        var self = this;
        $.ajax({
            url: "/api/content/GetHeaderByBlockid?blockId=" + self.MJPageData.mainid,
            dataType: 'json',
            async: false,

            success: function (data) {
                $("div[mjheader]").replaceWith(data.content);

            }
        });


    }

    ShareOn(platform) {
        var url = window.location.href;
        switch (platform) {
            case "twitter":
                var text = this.MJPageData.main.title ? this.MJPageData.main.title[this.language] : "";
                window.open('http://twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
                break;
            case "fb":
                window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url));
                break;
            case "googleplus":
                window.open('https://plus.google.com/share?url=' + encodeURIComponent(url));
                break;
        }


    }

    PutAutomaticLinks() {
        var self = this;
        $("a[autolink]").each(function (i, e) {

            $.ajax({
                url: "/api/content/GetFirstOfKindUrl?portalPartId=" + self.MJPageData.mainpartid + "&blockTypeId=" + $(e).attr("autolink"),
                dataType: 'text',
                async: true,

                success: function (data) {
                    console.log("data", data);
                    $(e).attr("href", "/home/index/" + data);

                }
            });
        });
    }



    PutNextPKListItems(blockId, itemType) {
        var self = this;
        var divs = "";
        var showMore = false;
        var url = "/api/content/GetPKListData?count=10&blockId=" + blockId + "&top=" + self.Top + "&blockTypeId=" + itemType + "&type=" + encodeURI(self.PKType) + "&ss=" + $("#" + this.TBSSId).val();
        $.ajax({
            url: url,
            dataType: 'json',
            async: false,

            success: function (data) {
                self.Top += data.rows.length;

                showMore = self.Top < data.count;
                data.rows.forEach(x => {
                    divs += `<div class= "list-box" >
            <div class="port-content">
                `+ (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt="" class="list-article-img img-list" />' : '') +
                        `<div>
                    <h6 class="date">`+ x.date + `</h6>
                    <h3><a href="`+ x.url + `">` + self.NarrowText(JSON.parse(x.jsonContent).title[self.language], 100) + `</a></h3>
                </div>
            </div>
					</div >
            `;
                    console.log(JSON.parse(x.jsonContent));
                });

            }
        });

        $("#" + this.ItemsContentId).append($(divs));
        if (!showMore)
            $("#" + this.NextItemsLinkId).hide();

    }

    PutOps(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.TBSSId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        var self = this;
        self.fromDate = obj.fromDate;
        self.toDate = obj.toDate;
        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>ops</t></h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-10">
                        <input type="text" class="form-control" id="` + this.TBSSId + `" placeholder="search" />
                    </div>
                    <div class="col-2">
                        <a class="btn btn-primary" onclick="mjProcess.Top=0; $('#` + this.ItemsContentId + `').empty(); mjProcess.PutNextPKListItems(` + blockId + `,'pkop')">
                            <t>search</t>
                        </a>
                    </div>
                </div>
                <br /><br />
                <div id="` + this.ItemsContentId + `">

                </div>

            </div>
            <div class="port-footer">
                <div class="port-link-item">
                    <a class="btn btn-primary" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextPKListItems(` + blockId + `, 'pkop')">
                        <t>more</t>
                    </a>
                </div>
            </div>`;

        oldDiv.replaceWith($(newContent));
        this.PutNextPKListItems(blockId, 'pkop');


    }


    PutOffers(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.TBSSId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>offers</t></h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-10">
                        <input type="text" class="form-control" id="` + this.TBSSId + `" placeholder="search" />
                    </div>
                    <div class="col-2">
                        <a class="btn btn-primary" onclick="mjProcess.Top=0; $('#` + this.ItemsContentId + `').empty(); mjProcess.PutNextPKListItems(` + blockId + `,'pkoffer')">
                            <t>search</t>
                        </a>
                    </div>
                </div>
                <br /><br />
                <div id="` + this.ItemsContentId + `">

                </div>

            </div>
            <div class="port-footer">
                <div class="port-link-item">
                    <a class="btn btn-primary" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextPKListItems(` + blockId + `, 'pkoffer')">
                        <t>more</t>
                    </a>
                </div>
            </div>`;

        oldDiv.replaceWith($(newContent));
        this.PutNextPKListItems(blockId, 'pkoffer');


    }

    PutMessages(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        this.PKType = obj.type;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.TBSSId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title">`+ obj.title[self.language] + `</h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-10">
                        <input type="text" class="form-control" id="` + this.TBSSId + `" placeholder="search" />
                    </div>
                    <div class="col-2">
                        <a class="btn btn-primary" onclick="mjProcess.Top=0; $('#` + this.ItemsContentId + `').empty(); mjProcess.PutNextPKListItems(` + blockId + `,'pkmessage')">
                            <t>search</t>
                        </a>
                    </div>
                </div>
                <br /><br />
                <div id="` + this.ItemsContentId + `">

                </div>

            </div>
            <div class="port-footer">
                <div class="port-link-item">
                    <a class="btn btn-primary" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextPKListItems(` + blockId + `, 'pkmessage')">
                        <t>more</t>
                    </a>
                </div>
            </div>`;

        oldDiv.replaceWith($(newContent));
        this.PutNextPKListItems(blockId, 'pkmessage');


    }

    PutConsults(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.TBSSId = this.Guid();
        this.NextItemsLinkId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>consults</t></h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-10">
                        <input type="text" class="form-control" id="` + this.TBSSId + `" placeholder="search" />
                    </div>
                    <div class="col-2">
                        <a class="btn btn-primary" onclick="mjProcess.Top=0; $('#` + this.ItemsContentId + `').empty(); mjProcess.PutNextPKListItems(` + blockId + `,'pkconsult')">
                            <t>search</t>
                        </a>
                    </div>
                </div>
                <br /><br />
                <div id="` + this.ItemsContentId + `">

                </div>

            </div>
            <div class="port-footer">
                <div class="port-link-item">
                    <a class="btn btn-primary" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextPKListItems(` + blockId + `, 'pkconsult')">
                        <t>more</t>
                    </a>
                </div>
            </div>`;

        oldDiv.replaceWith($(newContent));
        this.PutNextPKListItems(blockId, 'pkconsult');


    }

    LoadAllPKNomenclatures() {
        var self = this;
        $.ajax({
            url: "/api/part/GetPKLabels",
            dataType: 'json',
            async: false,

            success: function (data) {
                self.PKLabels = data;

            }
        });


    }

    PutFiles(files, dFilesId) {
        var self = this;
        var divs = "<table class='table table-bordered'><tbody>";
        files.forEach(x =>
            divs += `
            <tr>
            <td><a href="/api/part/GetBlob?hash=`+ x.file + `">` + x.title[self.language] + `</a>  </td>
            <td>
                <small><t>uploaddate</t></small>: ` + x.date + `
                </td>                
            </tr>

            `);
        divs += "</tbody><table>";
        $("#" + dFilesId).append(divs);
    }

    PutOp(divId, isMain) {
        this.LoadAllPKNomenclatures();
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.dFilesId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>op</t></h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-6">
                        <b><t>title</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.title) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>name</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.PBName) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>aopnum</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.AOPNum + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>elnum</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.ElNum + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>proctype</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.proctype) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>procobject</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.procobject) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>subject</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.Subject) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>procstatus</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.procstatus) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>novatprognosis</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.novatprognosis + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>cpv</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.cpv + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>teritorry</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.teritorry) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>novat</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.novat + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>enddate</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.enddate + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>business</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.business) + `
                        </div>
                </div>


            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-12" id="`+ this.dFilesId + `">

                    </div>
                </div>


            </div>
            <div class="port-footer">

            </div>`;



        oldDiv.replaceWith($(newContent));
        this.PutFiles(obj.files, this.dFilesId);

    }

    PutOffer(divId, isMain) {
        this.LoadAllPKNomenclatures();
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.dFilesId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>offer</t></h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-6">
                        <b><t>title</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.title[self.language] + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>content</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.FixText(obj.body[self.language]) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>enddate</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.enddate + `
                        </div>
                </div>


            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-12" id="`+ this.dFilesId + `">

                    </div>
                </div>


            </div>
            <div class="port-footer">

            </div>`;



        oldDiv.replaceWith($(newContent));
        this.PutFiles(obj.files, this.dFilesId);

    }

    PutMessage(divId, isMain) {
        this.LoadAllPKNomenclatures();
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.dFilesId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>message</t></h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-6">
                        <b><t>title</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.title[self.language] + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>content</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.FixText(obj.body[self.language]) + `
                        </div>
                </div>



            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-12" id="`+ this.dFilesId + `">

                    </div>
                </div>


            </div>
            <div class="port-footer">

            </div>`;



        oldDiv.replaceWith($(newContent));
        this.PutFiles(obj.files, this.dFilesId);

    }


    PutConsult(divId, isMain) {
        this.LoadAllPKNomenclatures();
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.dFilesId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title"><t>consult</t></h3>

            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-6">
                        <b><t>title</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.T(obj.title) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>elnum</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.code + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>content</t></b>
                    </div>
                    <div class="col-6">
                        `+ self.FixText(self.T(obj.body)) + `
                        </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b><t>enddate</t></b>
                    </div>
                    <div class="col-6">
                        `+ obj.enddate + `
                        </div>
                </div>


            </div>
            <div class="port-box box-border">
                <div class="row">
                    <div class="col-12" id="`+ this.dFilesId + `">

                    </div>
                </div>


            </div>
            <div class="port-footer">

            </div>`;



        oldDiv.replaceWith($(newContent));
        this.PutFiles(obj.files, this.dFilesId);

    }

    FixText(data) {
        if (!data)
            return "";
        data = data.replace(/<ul>/g, "<ul style='margin-left:100px;'>");
        return data;
    }

    ShowCareers() {
        var self = this;
        var toShow = this.careers.filter(x => x.type[self.language] === $("#" + self.TypeSelectId).val());
        toShow.sort((a, b) => a.date > b.date ? -1 : 1);
        var html = `<ul class= 'list-group' > `;
        toShow.forEach(c => {
            var docHtml = `<ul class= 'list-group' > `;
            c.docs.forEach(d => docHtml += `<li class= 'list-group-item' >
            <a href="/api/part/GetBlob?hash=`+ d.link + `">` + d.title[this.language] + `</a></li > `);
            docHtml += "</ul>";
            html += `<li class= 'list-group-item' >
            <h4>`+ c.title[this.language] + `</h4> <br />` + c.body[this.language] + ` <br />
            `+ docHtml + `
            </li > `;
        });
        $("#" + this.ItemsContentId).html(html);
    }

    PutCareers(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
        this.ItemsContentId = this.Guid();
        this.TypeSelectId = this.Guid();
        var self = this;

        var newContent = `<div class= "port-wrapper" >
            <div class="port-head">
                <h3 class="port-title">`+ this.TranslateWord("careers") + `</h3><br />
                <h3 class="port-title"><select class="form-control" id=`+ this.TypeSelectId + ` onchange="mjProcess.ShowCareers()"></select>    </h3>
                    
				</div >

            <div class="port-box box-border" id="` + this.ItemsContentId + `">

            </div>
                
			</div > `;

        oldDiv.replaceWith($(newContent));

        var types = [...new Set(obj.data.map(d => d.type[this.language]))];
        types.forEach(y => $("#" + this.TypeSelectId).append("<option value='" + y + "'>" + y + "</option>"));
        $("#" + this.TypeSelectId).val(types[0]);
        this.careers = obj.data;
        this.ShowCareers();
        //this.PutNextNews(blockId);


    }

    T(obj) {
        if (!obj)
            return "";
        if (!obj[this.language])
            return "";
        return obj[this.language];
    }


    PutFeedback(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        var lMandatory = [];

        var form = "<form action='/home/SendFeedback' method='POST' id='fFeedBack' target='_blank' enctype='multipart/form-data'><input type='hidden' name='id' value='" + window.location.href.split("/").pop() + "' />";
        obj.datas.forEach(x => {
            var element = "";
            var id = "fbe_" + x.id;
            switch (parseInt(x.type)) {
                case 1:
                    element = "<input type='text' id='" + id + "' class='form-control' name='" + x.title[self.language] + "'/>"; break;
                case 2:
                    element = "<textarea id='" + id + "' class='form-control' rows='6' name='" + x.title[self.language] + "'/>"; break;
                case 3:
                    element = "<input type='file' id='" + id + "' class='form-control' name='upload_" + id + "'/>"; break;

            };
            if (x.mandatory)
                lMandatory.push({ id: id, title: x.title[self.language] });
            form +=
                `<div class="row">
                <div class="col-12">
                    <label class="control-label">`+ x.title[self.language] + (x.mandatory ? "*" : "") + `</label>
                    `+ element + `
                </div>
             </div> `;
        });
        form += '</form>';
        self.MandatoryFields = lMandatory;

        oldDiv.replaceWith($(`<article class= "article-container" >

            <h1>`+ obj.title[self.language] + `
				</h1>
            

            <div class="article-content">
            
                `+ self.FixText(obj.body[self.language]) + `
                `+ form + `
                <div class="row">
                    <div class="col-12">
                        <a class="btn btn-primary" onclick="mjProcess.SendFeedback()"><t>send</t></a>
                    </div>
                </div>
				</div>
			</article > `));


    }

    SendFeedback() {
        var self = this;
        var ok = true;
        var errors = "";
        self.MandatoryFields.forEach(x => {
            if (($("#" + x.id).val() || "") === "") {
                errors += x.title + " ";
                ok = false;
            };
        });

        if (!ok) {
            alert(self.TranslateWord("followingfieldsmusthavevalue") + ":\r\n" + errors);
            return;
        }

        //console.log($("#fFeedBack"));
        //$("#fFeedBack").submit(function (e) {
        //    e.preventDefault(); // avoid to execute the actual submit of the form.

        //    var form = $(this);
        //    var url = form.attr('action');

        //    $.ajax({
        //        type: "POST",
        //        url: url,
        //        data: form.serialize(), // serializes the form's elements.
        //        success: function (data) {
        //            alert(data); // show response from the php script.
        //        }
        //    });
        //    document.getElementById("fFeedBack").reset();

        //});
        document.getElementById("fFeedBack").submit();
        document.getElementById("fFeedBack").reset();


        //


    }

    RepairLinks() {
        $("a").each(function (i, e) {
            if ($(e).attr("href") && $(e).attr("href").indexOf("http") === 0)
                $(e).attr("target", "_blank");
        });

    }

    GetUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };




}

