const lsLastBannerTime = "LastBannerTime";
class MJProcess {
    translation = {};
    language = "bg";
    MJPageData = {};
    LastBanner = null;

    constructor() {
        this.LoadTranslations = this.LoadTranslations.bind(this);
        this.Translate = this.Translate.bind(this);
        this.DoProcess = this.DoProcess.bind(this);
        this.ShowBannerIfNeeded = this.ShowBannerIfNeeded.bind(this);
        this.NarrowText = this.NarrowText.bind(this);

        this.PutBlocks = this.PutBlocks.bind(this);
        this.PutElement = this.PutElement.bind(this);
        this.PutLive = this.PutLive.bind(this);
        this.PutHtml = this.PutHtml.bind(this);
        this.PutAdsSQ = this.PutAdsSQ.bind(this);

        this.LoadTranslations();
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

    PutElement(e) {
        let blockId = $(e).attr("id");
        let blockTypeId = $(e).attr("mjblocktypeid");
        switch (blockTypeId) {
            case "live": this.PutLive(blockId); break;
            case "html": this.PutHtml(blockId); break;
            case "banner": this.PutBanner(blockId); this.LastBanner = blockId; break;
            case "adssq": this.PutAdsSQ(blockId); break;

        }
    }

    PutLive(divId) {
        var oldDiv = $("#" + divId);
        var obj = this.MJPageData["block_" + divId];
        var self = this;
        oldDiv.replaceWith($(`
            <div class= "port-wrapper grid-item-emission" >
            <div class="port-head">
                <h3 class="port-title"><t>emissions</t></h3>
                <div class="port-link-item">
                </div>
            </div>
            <div class="port-box p-0 bgr-black box-border height-350">
                <div class="abs-content" style='background-image: url("api/part/GetBlob?hash=`+ obj.blockData.imageId + `");'>
                    <div class="abs-cover"></div>
                    <div class="emission-label">
                        <img src="images/live-symbol.png">
                            <span><t>live</t></span>
						</div>
                        <div class="emission-title">
                            <h2 class="white">`+ obj.blockData.title[self.language] + `                                
							</h2>
                            <a role="button" class="btn btn-emission js-video" data-toggle="modal" data-src="`+ obj.blockData.url + `" data-target="#liveEmission">
                                <svg class="icon icon-play-button"><use xlink: href="images/symbol-defs.svg#icon-play-button"></use></svg>
                            <t>watchlive</t>
							</a>
                    </div>
                </div>
            </div>
			</div>
             `));


    }

    PutBanner(divId) {
        var oldDiv = $("#" + divId);
        var obj = this.MJPageData["block_" + divId];
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
                        <img src="api/part/GetBlob?hash=`+ obj.blockData.imageId + `" alt="" style="max-width:100%;max-height:100%;"/>
                    </div>
                    <div class="col-6">
                        `+ (obj.blockData.body[self.language] || "") + `
                    </div>
                </div>
                
		    </div>
    	</div>
  	</div>
</div> 


             `));


    }


    PutHtml(divId) {
        var oldDiv = $("#" + divId);
        var obj = this.MJPageData["block_" + divId];
        var self = this;
        oldDiv.replaceWith($(obj.blockData.html[self.language]));


    }

    PutAdsSQ(divId) {
        var oldDiv = $("#" + divId);
        var obj = this.MJPageData["block_" + divId];
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


    PutBlocks() {
        let array = $("div[mjblocktypeid]").each(
            (i, e) => {

                this.PutElement(e);

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
        this.PutBlocks();
        var self = this;
        $("T").each(function (i, e) {
            self.Translate(e);
        });

        self.ShowBannerIfNeeded();
    }




    SwitchLanguage() {
        localStorage.setItem("language", this.language === "bg" ? "en" : "bg");
        location.reload();
    }

}

