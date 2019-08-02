
class MJProcess {
    translation = {};
    language = "bg";
    MJPageData = {};

    constructor() {
        this.LoadTranslations = this.LoadTranslations.bind(this);
        this.Translate = this.Translate.bind(this);
        this.DoProcess = this.DoProcess.bind(this);
        this.PutBlocks = this.PutBlocks.bind(this);
        this.PutElement = this.PutElement.bind(this);
        this.PutLive = this.PutLive.bind(this);
        this.LoadTranslations();
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

    PutBlocks() {
        let array = $("div[mjblocktypeid]").each(
            (i, e) => {

                this.PutElement(e);

            });
    }

    DoProcess(MJPageData) {
        this.MJPageData = MJPageData;
        this.PutBlocks();
        var self = this;
        $("T").each(function (i, e) {
            self.Translate(e);
        });

    }




    SwitchLanguage() {
        localStorage.setItem("language", this.language === "bg" ? "en" : "bg");
        location.reload();
    }

}

