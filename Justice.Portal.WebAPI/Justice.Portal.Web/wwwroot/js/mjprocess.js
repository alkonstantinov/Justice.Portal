
const lsLastBannerTime = "LastBannerTime";
const lsBreadcrumbs = "Breadcrumbs";
const bcKeyMain = "___main"
class MJProcess {
    translation = {};
    language = "bg";
    MJPageData = {};
    LastBanner = null;
    Top = 0;
    ItemsContentId = "";
    NextItemsLinkId = "";

    constructor() {
        this.LoadTranslations = this.LoadTranslations.bind(this);
        this.Translate = this.Translate.bind(this);
        this.DoProcess = this.DoProcess.bind(this);
        this.ShowBannerIfNeeded = this.ShowBannerIfNeeded.bind(this);
        this.NarrowText = this.NarrowText.bind(this);
        this.Guid = this.Guid.bind(this);
        this.ClearBreadCrumbs = this.ClearBreadCrumbs.bind(this);
        this.FindMeOrAddMeInBreadCrumbs = this.FindMeOrAddMeInBreadCrumbs.bind(this);
        this.DisplayBreadCrumbs = this.DisplayBreadCrumbs.bind(this);
        

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
        text = $(text).text();
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
        var self = this;
        $("#lTranslate").text(self.language === "bg" ? "EN" : "BG");

    }

    PutElement(e, isMain) {
        let blockId = $(e).attr("id");
        let blockTypeId = $(e).attr("mjblocktypeid");
        if (isMain) {
            blockId = "dMain";
            blockTypeId = this.MJPageData.maintype;
        }

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
            case "text": this.PutText(blockId, isMain); break;
            case "bio": this.PutBio(blockId, isMain); break;


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
                            <a role="button" class="btn btn-emission js-video" data-toggle="modal" data-src="`+ obj.url + `" data-target="#liveEmission">
                                <svg class="icon icon-play-button"><use xlink: href="images/symbol-defs.svg#icon-play-button"></use></svg>
                            <t>watchlive</t>
							</a>
                    </div>
                </div>
            </div>
			</div>
             `));


    }

    PutBanner(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`
            <div class="modal fade" id="`+ divId + `" tabindex="-1" role="dialog" aria-labelledby="liveEmission" aria-hidden="true">
  	<div class="modal-dialog m-video-dialog" role="document">
    	<div class="modal-content">
		    <div class="modal-body">
                <div class="row">
                    <div class="col-12">

       			        <button type="button" class="close-video" data-dismiss="modal" aria-label="Close">
          			        <span aria-hidden="true">&times;</span>
        		        </button>        
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <img src="/api/part/GetBlob?hash=`+ obj.imageId + `" alt="" style="max-width:100%;max-height:100%;"/>
                    </div>
                    <div class="col-6">
                        `+ (obj.body[self.language] || "") + `
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
            url: "/api/content/GetAdsSQData?count=6&blockId=" + obj.value,
            dataType: 'json',
            async: false,

            success: function (data) {
                data.forEach(x =>
                    lis += '<li><h3><span>' + x.date + '</span><a href="home/index/' + x.blockId + '">' + self.NarrowText(JSON.parse(x.jsonContent).body[self.language], 140) + '</a></h3></li>'
                );

            }
        });


        var newContent = `<div class="port-wrapper">
			<div class="port-head">
				<h3 class="port-title"><t>ads</t></h3>
				<div class="port-link-item">
					<a href="#" class="port-head-link"><t>allads</t>
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
            url: "/api/content/GetAdsData?count=6&blockId=" + blockId + "&top=" + self.Top,
            dataType: 'json',
            async: false,

            success: function (data) {
                self.Top += data.rows.length;
                showMore = self.Top < data.count;
                data.rows.forEach(x =>
                    divs += `<div class="list-box">
						<div class="port-content">
							`+ (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt="" style="max-width:100%;max-height:100%;"  class="list-article-img img-list"/>' : '') +
                    `<div>
								<h6 class="date">`+ x.date + `</h6>
								<h3><a href="#">`+ self.NarrowText(JSON.parse(x.jsonContent).body[self.language], 100) + `</a></h3>
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
							<span class="port-head-link" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextAds(` + blockId + `)">
                                Още
							</span>
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
                data.rows.forEach(x =>
                    divs += `<div class="list-box">
						<div class="port-content">
							`+ (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt="" style="max-width:100%;max-height:100%;"  class="list-article-img img-list"/>' : '') +
                    `<div>
								<h6 class="date">`+ x.date + `</h6>
								<h3><a href="#">`+ self.NarrowText(JSON.parse(x.jsonContent).body[self.language], 100) + `</a></h3>
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
							<span class="port-head-link" id="` + this.NextItemsLinkId + `" onclick="mjProcess.PutNextAds(` + blockId + `)">
                                Още
							</span>
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
            url: "/api/content/GetNewsSQData?count=3&blockId=" + obj.value,
            dataType: 'json',
            async: false,

            success: function (data) {
                data.forEach((x, idx) => {
                    var data = JSON.parse(x.jsonContent);
                    divs += `<div class="carousel-item ` + (idx === 0 ? "active" : "") + `">
                        <h6 class="date">`+ x.date + `</h6>
                        <h2>`+ (data.title[self.language] || "") + `</h2>
                        <div class="port-content">
                            <img src="/api/part/GetBlob?hash=`+ data.imageId + `" alt="" class="list-article-img img-prime" style="max-width:100%;max-height:100%;"/>
                        <div>
                            
                                    `+ self.NarrowText(data.body[self.language], 400) + `
                                    <a class="btn btn-primary" href="#" role="button">Научи повече</a>
                                </div>
							</div>
                        </div>`;
                }

                );

            }
        });



        var newContent = `<div class="port-wrapper">
			<div class="port-head">
				<h3 class="port-title">Новини</h3>
				<div class="port-link-item">
					<a href="news-list.html" class="port-head-link">Всички новини
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


    PutNew(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class="article-container">

				<h1>`+ obj.title[self.language] + `				
				</h1>
				
				<figure>

					<img class="half-pic" src="/api/part/GetBlob?hash=`+ obj.imageId + `">
				</figure>
				<div class="article-content">
					`+ obj.body[self.language] + `
				</div>
			</article>`));


    }

    PutAd(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class="article-container">

				<h1>`+ obj.title[self.language] + `				
				</h1>
				
				<figure>

					<img class="half-pic" src="/api/part/GetBlob?hash=`+ obj.imageId + `">
				</figure>
				<div class="article-content">
					`+ obj.body[self.language] + `
				</div>
			</article>`));


    }

    PutText(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class="article-container">

				<h1>`+ obj.title[self.language] + `				
				</h1>
				
				<figure>

					<img class="half-pic" src="/api/part/GetBlob?hash=`+ obj.imageId + `">
				</figure>
				<div class="article-content">
					`+ obj.body[self.language] + `
				</div>
			</article>`));


    }


    PutBio(divId, isMain) {
        var oldDiv = $("#" + divId);
        var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
        var self = this;
        oldDiv.replaceWith($(`<article class="article-container">

				<h1>`+ obj.title[self.language] +
            (obj.prime ? "<span><t>minister</t></span>" : "") +


            `				

				</h1>
				
				<figure>

					<img class="half-pic" src="/api/part/GetBlob?hash=`+ obj.imageId + `">
				</figure>
				<div class="article-content">
					`+ obj.body[self.language] + `
				</div>
			</article>`));


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

        }

        if (show) {
            $('#' + self.LastBanner).modal('show');
            localStorage.setItem(lsLastBannerTime, new Date().toISOString());
        }
    }

    DoProcess(MJPageData) {
        this.MJPageData = MJPageData;
        //this.ClearBreadCrumbs();
        this.FindMeOrAddMeInBreadCrumbs();
        this.PutBlocks();
        var self = this;
        $("T").each(function (i, e) {
            self.Translate(e);
        });

        self.ShowBannerIfNeeded();
        self.DisplayBreadCrumbs();
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
        var bc = JSON.parse(localStorage.getItem(lsBreadcrumbs) || "[]");
        if (bc.length === 0)
            bc.push({
                key: bcKeyMain,
                title: { bg: this.translation.bg.start, en: this.translation.en.start }
            });
        var urlParts = window.location.href.split('/');
        var key = ((urlParts.length === 4 || urlParts[urlParts.length - 1] === "") ? bcKeyMain : urlParts[urlParts.length - 1]).toLowerCase();
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


        localStorage.setItem(lsBreadcrumbs, JSON.stringify(bc));
    }

    DisplayBreadCrumbs() {
        
        var self = this;
        var olbc = $("#olBC");
        if (olbc.length > 0) {
            $("#olBC li").remove();
            var bc = JSON.parse(localStorage.getItem(lsBreadcrumbs) || "[]");
            bc.forEach((x, i) =>
                $("#olBC").append($('<li class="breadcrumb - item" aria-current="page"><a href="' + (x.key === bcKeyMain ? '/' : '/home/index/' + x.key) + '">' + x.title[self.language] + '</a></li>'))
                );
            
        }


    }

}

