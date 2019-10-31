"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var lsLastBannerTime = "LastBannerTime";
var lsBreadcrumbs = "Breadcrumbs";
var lsSearchString = "SearchString";
var bcKeyMain = "___main";

var MJProcess =
    /*#__PURE__*/
    function () {
        function MJProcess() {
            _classCallCheck(this, MJProcess);

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

        _createClass(MJProcess, [{
            key: "Guid",
            value: function Guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }
        }, {
            key: "NarrowText",
            value: function NarrowText(text, length) {
                if (!text) return ""; //text = $(text).text();

                text = text.replace(/<\/?[^>]+(>|$)/g, "");
                text = text.replace(/&nbsp;/g, " ");
                if (text.length <= length) return text;
                return text.substring(0, length) + "...";
            }
        }, {
            key: "LoadTranslations",
            value: function LoadTranslations() {
                var self = this;
                $.ajax({
                    url: "/api/translate/GetTranslation",
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        self.translation = data;
                    }
                });
                var lng = localStorage.getItem("language");
                this.language = lng || this.language;
            }
        }, {
            key: "Translate",
            value: function Translate(element) {
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
        }, {
            key: "TranslateWord",
            value: function TranslateWord(word) {
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
        }, {
            key: "TranslateAttribs",
            value: function TranslateAttribs(element) {
                var lng = this.translation[this.language];

                if (!lng) {
                    $(element).attr("placeholder", "");
                    return;
                }

                if (!$(element).attr("placeholder")) return;
                var wording = lng[$(element).attr("placeholder").toLowerCase()];

                if (!wording) {
                    $(element).attr("placeholder", "");
                    return;
                }

                $(element).attr("placeholder", wording);
            }
        }, {
            key: "PutElement",
            value: function PutElement(e, isMain) {
                var blockId = $(e).attr("id");
                var blockTypeId = $(e).attr("mjblocktypeid");

                if (isMain) {
                    blockId = "dMain";
                    blockTypeId = this.MJPageData.maintype;
                }

                if (!isMain && !this.MJPageData["block_" + blockId]) return;

                switch (blockTypeId) {
                    case "live":
                        this.PutLive(blockId, isMain);
                        break;

                    case "html":
                        this.PutHtml(blockId, isMain);
                        break;

                    case "banner":
                        this.PutBanner(blockId, isMain);
                        this.LastBanner = blockId;
                        break;

                    case "adssq":
                        this.PutAdsSQ(blockId, isMain);
                        break;

                    case "newssq":
                        this.PutNewsSQ(blockId, isMain);
                        break;

                    case "ads":
                        this.PutAds(blockId, isMain);
                        break;

                    case "news":
                        this.PutNews(blockId, isMain);
                        break;

                    case "new":
                        this.PutNew(blockId, isMain);
                        break;

                    case "ad":
                        this.PutAd(blockId, isMain);
                        break;

                    case "info":
                        this.PutInfo(blockId, isMain);
                        break;

                    case "text":
                        this.PutText(blockId, isMain);
                        break;

                    case "bio":
                        this.PutBio(blockId, isMain);
                        break;

                    case "search":
                        this.PutSearch(blockId, isMain);
                        break;

                    case "biocabinet":
                        this.PutBiographies(blockId, isMain);
                        break;

                    case "doclist":
                        this.PutDocList(blockId, isMain);
                        break;

                    case "collection":
                        this.PutCollection(blockId, isMain);
                        break;

                    case "ciela":
                        this.PutCiela(blockId, isMain);
                        break;

                    case "sitemap":
                        this.PutSitemap(blockId, isMain);
                        break;

                    case "pk":
                        this.PutPK(blockId, isMain);
                        break;

                    case "pkops":
                        this.PutOps(blockId, isMain);
                        break;

                    case "pkoffers":
                        this.PutOffers(blockId, isMain);
                        break;

                    case "pkmessages":
                        this.PutMessages(blockId, isMain);
                        break;

                    case "pkconsults":
                        this.PutConsults(blockId, isMain);
                        break;

                    case "pkop":
                        this.PutOp(blockId, isMain);
                        break;

                    case "pkoffer":
                        this.PutOffer(blockId, isMain);
                        break;

                    case "pkmessage":
                        this.PutMessage(blockId, isMain);
                        break;

                    case "pkconsult":
                        this.PutConsult(blockId, isMain);
                        break;

                    case "career":
                        this.PutCareers(blockId, isMain);
                        break;

                    case "feedback":
                        this.PutFeedback(blockId, isMain);
                        break;
                }
            }
        }, {
            key: "PutLive",
            value: function PutLive(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("\n            <div class= \"port-wrapper grid-item-emission\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>emissions</t></h3>\n                <div class=\"port-link-item\">\n                </div>\n            </div>\n            <div class=\"port-box p-0 bgr-black box-border height-350\">\n                <div class=\"abs-content\" style='background-image: url(\"/api/part/GetBlob?hash=" + obj.imageId + "\");'>\n                    <div class=\"abs-cover\"></div>\n                    <div class=\"emission-label\">\n                        <img src=\"/images/live-symbol.png\">\n                            <span><t>live</t></span>\n\t\t\t\t\t\t</div>\n                        <div class=\"emission-title\">\n                            <h2 class=\"white\">" + obj.title[self.language] + "                                \n\t\t\t\t\t\t\t</h2>\n                            <a role=\"button\" class=\"btn btn-emission js-video\" data-toggle=\"modal\" data-src=\"" + obj.url + "\" data-target=\"#liveEmission\">\n                                <svg class=\"icon icon-play-button\"><use xlink: href=\"images/symbol-defs.svg#icon-play-button\"></use></svg>\n                            <t>watchlive</t>\n\t\t\t\t\t\t\t</a>\n                    </div>\n                </div>\n            </div>\n\t\t\t</div>\n             "));
            }
        }, {
            key: "PutBanner",
            value: function PutBanner(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;

                if (!obj) {
                    this.HasBanner = false;
                    return;
                }

                this.HasBanner = true;
                var self = this;
                oldDiv.replaceWith($("\n            <div class=\"modal fade\" id=\"" + divId + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"liveEmission\" aria-hidden=\"true\">\n  \t<div class=\"modal-dialog m-video-dialog\" role=\"document\">\n    \t<div class=\"modal-content\">\n\t\t    <div class=\"modal-body\">\n                <div class=\"row\">\n                    <div class=\"col-12\">\n\n       \t\t\t        <button type=\"button\" class=\"close-video\" data-dismiss=\"modal\" aria-label=\"Close\">\n          \t\t\t        <span aria-hidden=\"true\">&times;</span>\n        \t\t        </button>        \n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <img src=\"/api/part/GetBlob?hash=" + obj.imageId + "\" alt=\"\" style=\"max-width:100%;max-height:100%\"/>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.FixText(obj.body[self.language] || "") + "\n                    </div>\n                </div>\n                \n\t\t    </div>\n    \t</div>\n  \t</div>\n</div> \n\n\n             "));
            }
        }, {
            key: "PutHtml",
            value: function PutHtml(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($(obj.html[self.language]));
            }
        }, {
            key: "PutAdsSQ",
            value: function PutAdsSQ(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                var lis = "";
                $.ajax({
                    url: "/api/content/GetAdsSQData?count=6&blockId=" + this.MJPageData["block_" + divId].value,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        data.forEach(function (x) {
                            return lis += '<li><h3><span>' + x.date + '</span><a href="home/index/' + x.url + '">' + self.NarrowText($(JSON.parse(x.jsonContent).body[self.language]).text(), 140) + '</a></h3></li>';
                        });
                    }
                });
                var newContent = "<div class=\"port-wrapper\">\n\t\t\t<div class=\"port-head\">\n\t\t\t\t<h3 class=\"port-title\"><t>ads</t></h3>\n\t\t\t\t<div class=\"port-link-item\">\n\t\t\t\t\t<a href=\"#\" autolink=\"ads\" class=\"port-head-link\"><t>allads</t>\n\t\t\t\t\t\t<svg class=\"icon icon-arrow-right\"><use xlink:href=\"images/symbol-defs.svg#icon-angle-arrow-down\"></use></svg>\n\t\t\t\t\t</a>\t\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"port-box box-border\">\n\t\t\t\t<ul class=\"announce-list list-unstyled\">\n\t\t\t\t\t" + lis + "\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div >";
                oldDiv.replaceWith($(newContent));
            }
        }, {
            key: "PutNextAds",
            value: function PutNextAds(blockId) {
                var self = this;
                var divs = "";
                var showMore = false;
                $.ajax({
                    url: "/api/content/GetAdsData?count=10&blockId=" + blockId + "&top=" + self.Top,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        self.Top += data.rows.length;
                        showMore = self.Top < data.count;
                        data.rows.forEach(function (x) {
                            return divs += "<div class=\"list-box\">\n\t\t\t\t\t\t<div class=\"port-content\">\n\t\t\t\t\t\t\t" + (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt=""   class="list-article-img img-list"/>' : '') + "<div>\n\t\t\t\t\t\t\t\t<h6 class=\"date\">" + x.date + "</h6>\n                                <h2>" + self.NarrowText(JSON.parse(x.jsonContent).title[self.language], 100) + "</a></h2>     \n\t\t\t\t\t\t\t\t<h3><a href=\"" + x.url + "\">" + self.NarrowText($(JSON.parse(x.jsonContent).body[self.language]).text(), 100) + "</a></h3>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t";
                        });
                    }
                });
                $("#" + this.ItemsContentId).append($(divs));
                if (!showMore) $("#" + this.NextItemsLinkId).hide();
            }
        }, {
            key: "PutAds",
            value: function PutAds(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.NextItemsLinkId = this.Guid();
                var self = this;
                var newContent = "<div class=\"port-wrapper\">\n\t\t\t\t<div class=\"port-head\">\n\t\t\t\t\t<h3 class=\"port-title\"><t>ads</t></h3>\n\t\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class=\"port-box box-border\" id=\"" + this.ItemsContentId + "\">\n\t\t\t\t\t\n\t\t\t\t</div>\n                <div class=\"port-footer\">\n\t\t\t\t\t\t<div class=\"port-link-item\">\n\t\t\t\t\t\t\t<a class=\"btn btn-primary\" id=\"" + this.NextItemsLinkId + "\" onclick=\"mjProcess.PutNextAds(" + blockId + ")\">\n                                <t>more</t>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t</div>";
                oldDiv.replaceWith($(newContent));
                this.PutNextAds(blockId);
            }
        }, {
            key: "PutNextNews",
            value: function PutNextNews(blockId) {
                var self = this;
                var divs = "";
                var showMore = false;
                $.ajax({
                    url: "/api/content/GetNewsData?count=6&blockId=" + blockId + "&top=" + self.Top,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        self.Top += data.rows.length;
                        showMore = self.Top < data.count;
                        data.rows.forEach(function (x) {
                            divs += "<div class=\"list-box\">\n\t\t\t\t\t\t<div class=\"port-content\">\n\t\t\t\t\t\t\t" + (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt=""   class="list-article-img img-list"/>' : '') + "<div>\n\t\t\t\t\t\t\t\t<h6 class=\"date\">" + x.date + "</h6>\n                                <h2><a href=\"" + x.url + "\">" + self.NarrowText(JSON.parse(x.jsonContent).title[self.language], 100) + "</a></h2>     \n\n\t\t\t\t\t\t\t\t<h3>" + self.NarrowText(JSON.parse(x.jsonContent).body[self.language], 100) + "</h3>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t";
                            console.log(divs);
                        });
                    }
                });
                $("#" + this.ItemsContentId).append($(divs));
                if (!showMore) $("#" + this.NextItemsLinkId).hide();
            }
        }, {
            key: "PutNews",
            value: function PutNews(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.NextItemsLinkId = this.Guid();
                var self = this;
                var newContent = "<div class=\"port-wrapper\">\n\t\t\t\t<div class=\"port-head\">\n\t\t\t\t\t<h3 class=\"port-title\"><t>news</t></h3>\n\t\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class=\"port-box box-border\" id=\"" + this.ItemsContentId + "\">\n\t\t\t\t\t\n\t\t\t\t</div>\n                <div class=\"port-footer\">\n\t\t\t\t\t\t<div class=\"port-link-item\">\n\t\t\t\t\t\t\t<a class=\"btn btn-primary\" id=\"" + this.NextItemsLinkId + "\" onclick=\"mjProcess.PutNextNews(" + blockId + ")\">\n                                <t>more</t>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t</div>";
                oldDiv.replaceWith($(newContent));
                this.PutNextNews(blockId);
            }
        }, {
            key: "PutNewsSQ",
            value: function PutNewsSQ(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                var divs = "";
                $.ajax({
                    url: "/api/content/GetNewsSQData?count=3&blockId=" + this.MJPageData["block_" + divId].value,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        data.forEach(function (x, idx) {
                            var data = JSON.parse(x.jsonContent);
                            divs += "<div class=\"carousel-item " + (idx === 0 ? "active" : "") + "\">\n                        <h6 class=\"date\">" + x.date + "</h6>\n                        <h2>" + (data.title[self.language] || "") + "</h2>\n                        <div class=\"port-content\">\n                            <img src=\"/api/part/GetBlob?hash=" + data.imageId + "\" alt=\"\" class=\"list-article-img img-prime\" />\n                            <div>\n                                " + self.NarrowText($(data.body[self.language]).text(), 400) + "\n                                <a class=\"btn btn-primary\" href=\"/home/index/" + x.url + "\" role=\"button\"><t>learnmore</t></a>\n                            </div>\n\t\t\t\t\t\t</div>\n                    </div>";
                        });
                    }
                });
                var newContent = "<div class=\"port-wrapper\">\n\t\t\t    <div class=\"port-head\">\n\t\t\t\t    <h3 class=\"port-title\"><t>news</t></h3>\n\t\t\t\t    <div class=\"port-link-item\">\n\t\t\t\t\t    <a href=\"news-list.html\" autolink=\"news\" class=\"port-head-link\"><t>allnews</t>\n\t\t\t\t\t        <svg class=\"icon icon-arrow-right\"><use xlink:href=\"images/symbol-defs.svg#icon-angle-arrow-down\"></use></svg>\n\t\t\t\t\t    </a>\n\t\t\t\t    </div>\n\t\t\t    </div>\n\t\t\t    <div class=\"port-box box-border height-350\">\n\t\t\t\t    <div id=\"carouselIndicators\" class=\"carousel slide\" data-ride=\"carousel\">\n\t\t\t\t\t    <ol class=\"carousel-indicators\" id=\"carIndicators\">\n\t\t\t\t\t\t    <li data-target=\"#carouselIndicators\" data-slide-to=\"0\" class=\"active\"></li>\n\t\t\t\t\t\t    <li data-target=\"#carouselIndicators\" data-slide-to=\"1\"></li>\n\t\t\t\t\t\t    <li data-target=\"#carouselIndicators\" data-slide-to=\"2\"></li>\n\t\t\t\t\t    </ol>\n\t\t\t\t\t    <div class=\"carousel-inner\">\n\t\t\t\t\t\t    " + divs + "\n\t\t\t\t\t    </div>\n\t\t\t\t    </div>\n\t\t\t    </div>\n\t\t    </div>\n\t\t";
                oldDiv.replaceWith($(newContent)); //$('.carousel').carousel();
            }
        }, {
            key: "PutNextSearch",
            value: function PutNextSearch() {
                var self = this;
                var divs = "";
                var showMore = false;
                var query = localStorage.getItem(lsSearchString) || "";
                query = encodeURI(query);
                $.ajax({
                    url: "/api/content/search?size=10&query=" + query + "&from=" + self.Top + "&part=" + (this.MJPageData.mainpartid === "min" ? "" : this.MJPageData.mainpartid),
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        self.Top += data.response.docs.length;
                        $("#" + self.FoundCountId).text(data.response.numFound);
                        showMore = self.Top < data.response.numFound;
                        data.response.docs.forEach(function (x) {
                            return divs += "<div class=\"list-box\">\n\t\t\t\t\t\t<div class=\"port-content\">\n                    <div>\n\t\t\t\t\t\t\t\t<h3><a href=\"" + x.urlhash[0] + "\">" + JSON.parse(x.content).title[self.language] + "</a></h3>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t";
                        });
                    }
                });
                $("#" + this.ItemsContentId).append($(divs));
                if (!showMore) $("#" + this.NextItemsLinkId).hide();
            }
        }, {
            key: "PutSearch",
            value: function PutSearch(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.NextItemsLinkId = this.Guid();
                this.FoundCountId = this.Guid();
                var self = this;
                var newContent = "<div class=\"port-wrapper\">\n\t\t\t\t<div class=\"port-head\">\n\t\t\t\t\t<h3 class=\"port-title\"><t>searchresult</t></h3>\n                    <span>\n                        <t>found</t>: <span id=" + this.FoundCountId + "></span> <t>records</t>\n\t\t\t\t    </span>\t\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class=\"port-box box-border\" id=\"" + this.ItemsContentId + "\">\n\t\t\t\t\t\n\t\t\t\t</div>\n                <div class=\"port-footer\">\n\n\t\t\t\t\t\t<div class=\"port-link-item\">\n                            <a class=\"btn btn-primary\" id=\"" + this.NextItemsLinkId + "\" onclick=\"mjProcess.PutNextSearch(" + blockId + ")\">\n                                <t>more</t>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t</div>";
                oldDiv.replaceWith($(newContent));
                this.PutNextSearch();
            }
        }, {
            key: "PutNew",
            value: function PutNew(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("<article class=\"article-container\">\n\n\t\t\t\t<h1>" + obj.title[self.language] + "\t\t\t\t\n\t\t\t\t</h1>\n\t\t\t\t\n\t\t\t\t<figure>\n\n\t\t\t\t\t" + (obj.imageId ? "<img class=\"half-pic\" src=\"/api/part/GetBlob?hash=" + obj.imageId + "\">" : "") + "\n\t\t\t\t</figure >\n            <div class=\"article-content\">\n                " + self.FixText(obj.body[self.language]) + "\n\t\t\t\t</div>\n\t\t\t</article > "));
            }
        }, {
            key: "PutAd",
            value: function PutAd(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n\n            <figure>\n\n                " + (obj.imageId ? '<img class="half-pic" src="/api/part/GetBlob?hash=' + obj.imageId + '">' : "") + "\n\t\t\t\t</figure>\n                <div class=\"article-content\">\n                    " + self.FixText(obj.body[self.language]) + "\n\t\t\t\t</div>\n\t\t\t</article>"));
            }
        }, {
            key: "PutText",
            value: function PutText(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n\n            <figure>\n\n                " + (obj.imageId ? '<img class="half-pic" src="/api/part/GetBlob?hash=' + obj.imageId + '">' : "") + "\n\t\t\t\t</figure>" + (obj.others ? "<div class=\"article-content\">\n                    " + obj.others + "\n\t\t\t\t</div>" : "") + "<div class=\"article-content\">\n                    " + self.FixText(obj.body[self.language]) + "\n\t\t\t\t</div>\n\t\t\t</article>"));
            }
        }, {
            key: "PutBio",
            value: function PutBio(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "<span>" + (obj.addinfo[self.language] || "") + "</span>" + "\n    \n\t\t\t\t</h1>\n\n            <figure>\n\n                <img class=\"half-pic\" src=\"/api/part/GetBlob?hash=" + obj.imageId + "\">\n\t\t\t\t</figure>\n                <div class=\"article-content\">\n                    " + self.FixText(obj.body[self.language]) + "\n\t\t\t\t</div>\n\t\t\t</article>"));
            }
        }, {
            key: "PutInfo",
            value: function PutInfo(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n\n            <figure>\n\n                <img class=\"half-pic\" src=\"/api/part/GetBlob?hash=" + obj.imageId + "\">\n\t\t\t\t</figure>\n                <div class=\"article-content\" style=\"max-width:100%\">\n                    " + self.FixText(obj.body[self.language]) + "\n\t\t\t\t</div>\n\t\t\t</article>"));
            }
        }, {
            key: "PutBiographies",
            value: function PutBiographies(divId, isMain) {
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
                    success: function success(data) {
                        data.forEach(function (x) {
                            var data = JSON.parse(x.jsonvalues);
                            divs += "<div class= \"list-box\">\n            <div class=\"port-content\">\n                " + (data.imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonvalues).imageId + '" alt="" style="-width:auto;height:auto;" class="list-article-img img-list" />' : '') + "<div>\n\n                    <h3><a href=\"" + x.url + "\">" + data.title[self.language] + "</a>\n\n                    </h3>\n                    <span>" + (data.addinfo[self.language] || "") + "</span>\n                </div>\n            </div>\n\t\t\t\t\t</div >\n            ";
                        });
                    }
                });
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>bios</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\" id=\"" + this.ItemsContentId + "\">\n                " + divs + "\n\t\t\t\t</div>\n            <div class=\"port-footer\">\n\n            </div>";
                oldDiv.replaceWith($(newContent));
            }
        }, {
            key: "FormatDate",
            value: function FormatDate(d) {
                var currentDt = new Date(d);
                var mm = currentDt.getMonth() + 1;
                if (mm < 10) mm = '0' + mm;
                var dd = currentDt.getDate();
                if (dd < 10) dd = '0' + dd;
                var yyyy = currentDt.getFullYear();
                var date = dd + '.' + mm + '.' + yyyy;
                return date;
            }
        }, {
            key: "NetDate",
            value: function NetDate(d) {
                var currentDt = new Date(d);
                var mm = currentDt.getMonth() + 1;
                if (mm < 10) mm = '0' + mm;
                var dd = currentDt.getDate();
                if (dd < 10) dd = '0' + dd;
                var yyyy = currentDt.getFullYear();
                var date = yyyy + '-' + mm + '-' + dd;
                return date;
            }
        }, {
            key: "ShowMonth",
            value: function ShowMonth(year, month, divId) {
                $("div[id^=dMonth_]").hide();
                var self = this;
                var download = this.TranslateWord("download");
                var ul = "<ul class='list-group'>";
                this.years.filter(function (x) {
                    return x.year === year;
                })[0].months.filter(function (x) {
                    return x.month === month;
                })[0].docs.forEach(function (x) {
                    var li = "";

                    if (x.docId !== "") {
                        li = "<li class='list-group-item'>" + self.FormatDate(x.date) + " " + self.FixText(x.title[self.language]) + " " + " <a href='/api/part/getblob?hash=" + x.docId + "'>" + download + "</a></li>";
                    }

                    if (x.html) {
                        li = "<li class='list-group-item'>" + x.html[self.language] + "</a></li>";
                    }

                    ul += li;
                });
                ul += "</ul>";
                console.log("ul", ul); //$("#" + divId).empty();

                $("#" + divId).html(ul);
                $("#" + divId).show();
            }
        }, {
            key: "SearchCollection",
            value: function SearchCollection() {
                var searchResult = [];
                var self = this;
                self.CollectionContent.forEach(function (r) {
                    var ok = true;
                    self.CollectionStructure.forEach(function (ss) {
                        var src = "";

                        switch (parseInt(ss.type)) {
                            case 1:
                                src = $("#" + ss.id).val().toLowerCase();
                                if ((src || "") !== "" && r[ss.id].toLowerCase().indexOf(src) === -1) ok = false;
                                break;

                            case 2:
                                src = $("#" + ss.id).val().toLowerCase();
                                if ((src || "") !== "" && r[ss.id][self.language].toLowerCase().indexOf(src) === -1) ok = false;
                                break;
                        }

                        ;
                    });
                    if (ok) searchResult.push(r);
                });
                var resultTbl = "<table class='table table-bordered table-striped'><thead><tr>";
                self.CollectionStructure.forEach(function (x) {
                    resultTbl += "<th>" + x.name[self.language] + "</th>";
                });
                resultTbl += "</tr></thead><tbody>";
                var download = self.TranslateWord("download");
                searchResult.forEach(function (x) {
                    resultTbl += "<tr>";
                    self.CollectionStructure.forEach(function (ss) {
                        switch (parseInt(ss.type)) {
                            case 1:
                                resultTbl += "<td>" + x[ss.id] + "</td>";
                                break;

                            case 2:
                                resultTbl += "<td>" + x[ss.id][self.language] + "</td>";
                                break;

                            case 3:
                                resultTbl += "<td>" + x[ss.id] + "</td>";
                                break;

                            case 4:
                                resultTbl += "<td><a href='/api/part/getblob?hash=" + x[ss.id] + "'>" + download + "</a></td>";
                                break;

                            case 5:
                                resultTbl += "<td><a href='" + x[ss.id] + "'>" + download + "</a></td>";
                                break;
                        }
                    });
                    resultTbl += "</tr>";
                });
                resultTbl += "</tbody></table>";
                $("#dSearchResult").html(resultTbl);
            }
        }, {
            key: "PutCollection",
            value: function PutCollection(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                $.ajax({
                    url: "/api/content/GetCollection?collectionId=" + self.MJPageData.main.collectionId,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        self.CollectionStructure = JSON.parse(data.structure);
                        self.CollectionContent = JSON.parse(data.content);
                    }
                });
                var divSearchControls = "";
                self.CollectionStructure.forEach(function (x) {
                    switch (parseInt(x.type)) {
                        case 1:
                            divSearchControls += "\n            <div class=\"row\">\n            <div class=\"col-12\">\n                <label class=\"control-label\">" + x.name[self.language] + "</label>\n                <input type=\"text\" id=\"" + x.id + "\" class=\"form-control\" />\n            </div>\n                </div>\n            ";
                            break;

                        case 2:
                            divSearchControls += "\n            <div class=\"row\">\n            <div class=\"col-12\">\n                <label class=\"control-label\">" + x.name[self.language] + "</label>\n                <input type=\"text\" id=\"" + x.id + "\" class=\"form-control\" />\n            </div>\n                </div>\n            ";
                            break;
                    }
                });
                divSearchControls += "\n            <div class= \"row\">\n            <div class=\"col-12\">\n                <button class=\"btn btn-primary\" onclick=\"mjProcess.SearchCollection()\"><t>search</t></label>\n            </div>\n                </div>\n            ";
                oldDiv.replaceWith($("<article class=\"article-container\">\n\n            <h1>" + (obj.title ? obj.title[self.language] : "") + "\n\t\t\t\t</h1>\n\n            <div class=\"article-content\">\n                " + divSearchControls + "\n\t\t\t\t</div>\n            <div class=\"article-content\" id=\"dSearchResult\"></div>\n\t\t\t</article > "));
                this.SearchCollection();
            }
        }, {
            key: "PutDocList",
            value: function PutDocList(divId, isMain) {
                var _this = this;

                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                var list = obj.docs.sort(function (a, b) {
                    return a.date < b.date ? 1 : -1;
                });
                list.forEach(function (i) {
                    var date = new Date(i.date);
                    var y = self.years.filter(function (x) {
                        return parseInt(x.year) === date.getFullYear();
                    })[0];

                    if (!y) {
                        y = {
                            year: date.getFullYear(),
                            months: [{
                                month: 1,
                                docs: []
                            }, {
                                month: 2,
                                docs: []
                            }, {
                                month: 3,
                                docs: []
                            }, {
                                month: 4,
                                docs: []
                            }, {
                                month: 5,
                                docs: []
                            }, {
                                month: 6,
                                docs: []
                            }, {
                                month: 7,
                                docs: []
                            }, {
                                month: 8,
                                docs: []
                            }, {
                                month: 9,
                                docs: []
                            }, {
                                month: 10,
                                docs: []
                            }, {
                                month: 11,
                                docs: []
                            }, {
                                month: 12,
                                docs: []
                            }]
                        };
                        self.years.push(y);
                    }

                    var m = y.months.filter(function (x) {
                        return parseInt(x.month) === date.getMonth() + 1;
                    })[0];
                    m.docs.push({
                        title: i.title,
                        docId: i.docId,
                        html: i.html,
                        date: i.date
                    });
                });
                var divYears = "";
                self.years.forEach(function (x) {
                    var hiddenDivId = "dMonth_" + _this.Guid();

                    divYears += "<br /> <div class=\"article-content\">\n                ";
                    divYears += '<h2>' + x.year + '</h2>';
                    x.months.forEach(function (m) {
                        return divYears += '<a onclick="mjProcess.ShowMonth(' + x.year + ', ' + m.month + ',\'' + hiddenDivId + '\')" class="pnt"><t>month' + m.month + '</t></a>&nbsp;&nbsp;';
                    });
                    divYears += '<br /><div id="' + hiddenDivId + '" />';
                    divYears += "</div>";
                });
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n\n            <div class=\"article-content\">\n                " + self.FixText(obj.body ? obj.body[self.language] : "") + "\n\t\t\t\t</div>\n                " + divYears + "\n\t\t\t</article > "));
            }
        }, {
            key: "PutCiela",
            value: function PutCiela(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                var actsLI = "";
                obj.links.sort(function (a, b) {
                    return a.id < b.id ? -1 : 1;
                }).forEach(function (x) {
                    return actsLI += "<li class= 'list-group-item' > <a href='/home/normdoc/" + x.link + "' target='_blank'>" + x.title[self.language] + "</a></li > ";
                });
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n            <div class=\"article-content\">\n                " + (obj.body[self.language] || "") + "\n\t\t\t\t</div>\n            <div class=\"article-content\">\n                <ul class='list-group'>\n                    " + actsLI + "\n                    </ul>\n            </div>\n\t\t\t</article > "));
            }
        }, {
            key: "PutSitemap",
            value: function PutSitemap(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n            <div class=\"article-content\">\n                " + (obj.body[self.language] || "") + "\n\t\t\t\t</div>\n        \t</article > "));
            }
        }, {
            key: "PutPK",
            value: function PutPK(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n            <div class=\"article-content\">\n                <ul class='list-group'>\n                    <li class='list-group-item'><a href='#' autolink=\"pkops\"><t>ops</t></a></li>\n                    <li class='list-group-item'><a href='#' autolink=\"pkoffers\"><t>offers</t></a></li>\n                    <li class='list-group-item'><a href='#' autolink=\"pkmessages\"><t>messages</t></a></li>\n                    <li class='list-group-item'><a href='#' autolink=\"pkconsults\"><t>consults</t></a></li>\n                </ul>\n            </div>\n        \t</article > "));
            }
        }, {
            key: "PutBlocks",
            value: function PutBlocks() {
                var _this2 = this;

                this.PutElement(null, true);
                var array = $("div[mjblocktypeid]").each(function (i, e) {
                    _this2.PutElement(e, false);
                });
            }
        }, {
            key: "ShowBannerIfNeeded",
            value: function ShowBannerIfNeeded() {
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
                    } else show = true;

                    show = show && this.HasBanner;

                    if (show) {
                        $('#' + self.LastBanner).modal('show');
                        localStorage.setItem(lsLastBannerTime, new Date().toISOString());
                    } else $('#' + self.LastBanner).modal('hide');
                }
            }
        }, {
            key: "DoProcess",
            value: function DoProcess(MJPageData) {
                this.MJPageData = MJPageData; //this.ClearBreadCrumbs();

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
                    var code = e.keyCode ? e.keyCode : e.which;

                    if (code === 13) {
                        e.preventDefault();
                        self.InitiateSearch($('#tbSS').val());
                    }
                });
            }
        }, {
            key: "SwitchLanguage",
            value: function SwitchLanguage() {
                localStorage.setItem("language", this.language === "bg" ? "en" : "bg");
                location.reload();
            }
        }, {
            key: "ClearBreadCrumbs",
            value: function ClearBreadCrumbs() {
                var bc = [];
                bc.push({
                    key: bcKeyMain,
                    title: {
                        bg: this.translation.bg.start,
                        en: this.translation.en.start
                    }
                });
                localStorage.setItem(lsBreadcrumbs, JSON.stringify(bc));
            }
        }, {
            key: "FindMeOrAddMeInBreadCrumbs",
            value: function FindMeOrAddMeInBreadCrumbs() {
                var bc = JSON.parse(localStorage.getItem(lsBreadcrumbs) || "[]");
                if (bc.length === 0) bc.push({
                    key: bcKeyMain,
                    title: {
                        bg: this.translation.bg.start,
                        en: this.translation.en.start
                    }
                });
                var urlParts = window.location.href.split('/');
                var key = (urlParts.length === 4 || urlParts[urlParts.length - 1] === "" ? bcKeyMain : urlParts[urlParts.length - 1]).toLowerCase();
                var me = bc.filter(function (x) {
                    return x.key === key;
                })[0];

                if (me) {
                    bc.splice(bc.indexOf(me) + 1);
                } else {
                    bc.push({
                        key: key,
                        title: this.MJPageData.main.title
                    });
                }

                while (bc.length > 3) {
                    bc.splice(1, 1);
                }

                localStorage.setItem(lsBreadcrumbs, JSON.stringify(bc));
            }
        }, {
            key: "DisplayBreadCrumbs",
            value: function DisplayBreadCrumbs() {
                var self = this;
                var olbc = $("#olBC");

                if (olbc.length > 0) {
                    $("#olBC li").remove();
                    var bc = JSON.parse(localStorage.getItem(lsBreadcrumbs) || "[]");
                    bc.forEach(function (x, i) {
                        return $("#olBC").append($('<li class="breadcrumb-item" aria-current="page"><a href="' + (x.key === bcKeyMain ? '/' : '/home/index/' + x.key) + '">' + self.NarrowText(x.title ? x.title[self.language] : "...", 50) + '</a></li>'));
                    });
                }
            }
        }, {
            key: "InitiateSearch",
            value: function InitiateSearch(str) {
                if ((str || "") === "") return;
                localStorage.setItem(lsSearchString, str);
                $.ajax({
                    url: "/api/content/GetSearchResultBlock?portalPartId=" + this.MJPageData.mainpartid,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        window.location.href = "/home/index/" + data.url;
                    }
                });
            }
        }, {
            key: "PutHeader",
            value: function PutHeader() {
                var self = this;
                $.ajax({
                    url: "/api/content/GetHeaderByBlockid?blockId=" + self.MJPageData.mainid,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        $("div[mjheader]").replaceWith(data.content);
                    }
                });
            }
        }, {
            key: "ShareOn",
            value: function ShareOn(platform) {
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
        }, {
            key: "PutAutomaticLinks",
            value: function PutAutomaticLinks() {
                var self = this;
                $("a[autolink]").each(function (i, e) {
                    $.ajax({
                        url: "/api/content/GetFirstOfKindUrl?portalPartId=" + self.MJPageData.mainpartid + "&blockTypeId=" + $(e).attr("autolink"),
                        dataType: 'text',
                        async: true,
                        success: function success(data) {
                            console.log("data", data);
                            $(e).attr("href", "/home/index/" + data);
                        }
                    });
                });
            }
        }, {
            key: "PutNextPKListItems",
            value: function PutNextPKListItems(blockId, itemType) {
                var self = this;
                var divs = "";
                var showMore = false;
                var url = "/api/content/GetPKListData?count=10&blockId=" + blockId + "&top=" + self.Top + "&blockTypeId=" + itemType + "&type=" + encodeURI(self.PKType) + "&ss=" + $("#" + this.TBSSId).val();
                $.ajax({
                    url: url,
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        self.Top += data.rows.length;
                        showMore = self.Top < data.count;
                        data.rows.forEach(function (x) {
                            divs += "<div class= \"list-box\" >\n            <div class=\"port-content\">\n                " + (JSON.parse(x.jsonContent).imageId ? '<img src="/api/part/GetBlob?hash=' + JSON.parse(x.jsonContent).imageId + '" alt="" class="list-article-img img-list" />' : '') + "<div>\n                    <h6 class=\"date\">" + x.date + "</h6>\n                    <h3><a href=\"" + x.url + "\">" + self.NarrowText(JSON.parse(x.jsonContent).title[self.language], 100) + "</a></h3>\n                </div>\n            </div>\n\t\t\t\t\t</div >\n            ";
                            console.log(JSON.parse(x.jsonContent));
                        });
                    }
                });
                $("#" + this.ItemsContentId).append($(divs));
                if (!showMore) $("#" + this.NextItemsLinkId).hide();
            }
        }, {
            key: "PutOps",
            value: function PutOps(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.TBSSId = this.Guid();
                this.NextItemsLinkId = this.Guid();
                var self = this;
                self.fromDate = obj.fromDate;
                self.toDate = obj.toDate;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>ops</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-10\">\n                        <input type=\"text\" class=\"form-control\" id=\"" + this.TBSSId + "\" placeholder=\"search\" />\n                    </div>\n                    <div class=\"col-2\">\n                        <a class=\"btn btn-primary\" onclick=\"mjProcess.Top=0; $('#" + this.ItemsContentId + "').empty(); mjProcess.PutNextPKListItems(" + blockId + ",'pkop')\">\n                            <t>search</t>\n                        </a>\n                    </div>\n                </div>\n                <br /><br />\n                <div id=\"" + this.ItemsContentId + "\">\n\n                </div>\n\n            </div>\n            <div class=\"port-footer\">\n                <div class=\"port-link-item\">\n                    <a class=\"btn btn-primary\" id=\"" + this.NextItemsLinkId + "\" onclick=\"mjProcess.PutNextPKListItems(" + blockId + ", 'pkop')\">\n                        <t>more</t>\n                    </a>\n                </div>\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutNextPKListItems(blockId, 'pkop');
            }
        }, {
            key: "PutOffers",
            value: function PutOffers(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.TBSSId = this.Guid();
                this.NextItemsLinkId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>offers</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-10\">\n                        <input type=\"text\" class=\"form-control\" id=\"" + this.TBSSId + "\" placeholder=\"search\" />\n                    </div>\n                    <div class=\"col-2\">\n                        <a class=\"btn btn-primary\" onclick=\"mjProcess.Top=0; $('#" + this.ItemsContentId + "').empty(); mjProcess.PutNextPKListItems(" + blockId + ",'pkoffer')\">\n                            <t>search</t>\n                        </a>\n                    </div>\n                </div>\n                <br /><br />\n                <div id=\"" + this.ItemsContentId + "\">\n\n                </div>\n\n            </div>\n            <div class=\"port-footer\">\n                <div class=\"port-link-item\">\n                    <a class=\"btn btn-primary\" id=\"" + this.NextItemsLinkId + "\" onclick=\"mjProcess.PutNextPKListItems(" + blockId + ", 'pkoffer')\">\n                        <t>more</t>\n                    </a>\n                </div>\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutNextPKListItems(blockId, 'pkoffer');
            }
        }, {
            key: "PutMessages",
            value: function PutMessages(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                this.PKType = obj.type;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.TBSSId = this.Guid();
                this.NextItemsLinkId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\">" + obj.title[self.language] + "</h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-10\">\n                        <input type=\"text\" class=\"form-control\" id=\"" + this.TBSSId + "\" placeholder=\"search\" />\n                    </div>\n                    <div class=\"col-2\">\n                        <a class=\"btn btn-primary\" onclick=\"mjProcess.Top=0; $('#" + this.ItemsContentId + "').empty(); mjProcess.PutNextPKListItems(" + blockId + ",'pkmessage')\">\n                            <t>search</t>\n                        </a>\n                    </div>\n                </div>\n                <br /><br />\n                <div id=\"" + this.ItemsContentId + "\">\n\n                </div>\n\n            </div>\n            <div class=\"port-footer\">\n                <div class=\"port-link-item\">\n                    <a class=\"btn btn-primary\" id=\"" + this.NextItemsLinkId + "\" onclick=\"mjProcess.PutNextPKListItems(" + blockId + ", 'pkmessage')\">\n                        <t>more</t>\n                    </a>\n                </div>\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutNextPKListItems(blockId, 'pkmessage');
            }
        }, {
            key: "PutConsults",
            value: function PutConsults(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.TBSSId = this.Guid();
                this.NextItemsLinkId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>consults</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-10\">\n                        <input type=\"text\" class=\"form-control\" id=\"" + this.TBSSId + "\" placeholder=\"search\" />\n                    </div>\n                    <div class=\"col-2\">\n                        <a class=\"btn btn-primary\" onclick=\"mjProcess.Top=0; $('#" + this.ItemsContentId + "').empty(); mjProcess.PutNextPKListItems(" + blockId + ",'pkconsult')\">\n                            <t>search</t>\n                        </a>\n                    </div>\n                </div>\n                <br /><br />\n                <div id=\"" + this.ItemsContentId + "\">\n\n                </div>\n\n            </div>\n            <div class=\"port-footer\">\n                <div class=\"port-link-item\">\n                    <a class=\"btn btn-primary\" id=\"" + this.NextItemsLinkId + "\" onclick=\"mjProcess.PutNextPKListItems(" + blockId + ", 'pkconsult')\">\n                        <t>more</t>\n                    </a>\n                </div>\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutNextPKListItems(blockId, 'pkconsult');
            }
        }, {
            key: "LoadAllPKNomenclatures",
            value: function LoadAllPKNomenclatures() {
                var self = this;
                $.ajax({
                    url: "/api/part/GetPKLabels",
                    dataType: 'json',
                    async: false,
                    success: function success(data) {
                        self.PKLabels = data;
                    }
                });
            }
        }, {
            key: "PutFiles",
            value: function PutFiles(files, dFilesId) {
                var self = this;
                var divs = "<table class='table table-bordered'><tbody>";
                files.forEach(function (x) {
                    return divs += "\n            <tr>\n            <td><a href=\"/api/part/GetBlob?hash=" + x.file + "\">" + x.title[self.language] + "</a>  </td>\n            <td>\n                <small><t>uploaddate</t></small>: " + x.date + "\n                </td>                \n            </tr>\n\n            ";
                });
                divs += "</tbody><table>";
                $("#" + dFilesId).append(divs);
            }
        }, {
            key: "PutOp",
            value: function PutOp(divId, isMain) {
                this.LoadAllPKNomenclatures();
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.dFilesId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>op</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>title</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.title) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>name</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.PBName) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>aopnum</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.AOPNum + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>elnum</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.ElNum + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>proctype</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.proctype) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>procobject</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.procobject) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>subject</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.Subject) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>procstatus</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.procstatus) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>novatprognosis</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.novatprognosis + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>cpv</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.cpv + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>teritorry</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.teritorry) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>novat</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.novat + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>enddate</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.enddate + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>business</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.business) + "\n                        </div>\n                </div>\n\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-12\" id=\"" + this.dFilesId + "\">\n\n                    </div>\n                </div>\n\n\n            </div>\n            <div class=\"port-footer\">\n\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutFiles(obj.files, this.dFilesId);
            }
        }, {
            key: "PutOffer",
            value: function PutOffer(divId, isMain) {
                this.LoadAllPKNomenclatures();
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.dFilesId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>offer</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>title</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.title[self.language] + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>content</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.FixText(obj.body[self.language]) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>enddate</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.enddate + "\n                        </div>\n                </div>\n\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-12\" id=\"" + this.dFilesId + "\">\n\n                    </div>\n                </div>\n\n\n            </div>\n            <div class=\"port-footer\">\n\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutFiles(obj.files, this.dFilesId);
            }
        }, {
            key: "PutMessage",
            value: function PutMessage(divId, isMain) {
                this.LoadAllPKNomenclatures();
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.dFilesId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>message</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>title</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.title[self.language] + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>content</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.FixText(obj.body[self.language]) + "\n                        </div>\n                </div>\n\n\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-12\" id=\"" + this.dFilesId + "\">\n\n                    </div>\n                </div>\n\n\n            </div>\n            <div class=\"port-footer\">\n\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutFiles(obj.files, this.dFilesId);
            }
        }, {
            key: "PutConsult",
            value: function PutConsult(divId, isMain) {
                this.LoadAllPKNomenclatures();
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.dFilesId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\"><t>consult</t></h3>\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>title</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.T(obj.title) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>elnum</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.code + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>content</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + self.FixText(self.T(obj.body)) + "\n                        </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-6\">\n                        <b><t>enddate</t></b>\n                    </div>\n                    <div class=\"col-6\">\n                        " + obj.enddate + "\n                        </div>\n                </div>\n\n\n            </div>\n            <div class=\"port-box box-border\">\n                <div class=\"row\">\n                    <div class=\"col-12\" id=\"" + this.dFilesId + "\">\n\n                    </div>\n                </div>\n\n\n            </div>\n            <div class=\"port-footer\">\n\n            </div>";
                oldDiv.replaceWith($(newContent));
                this.PutFiles(obj.files, this.dFilesId);
            }
        }, {
            key: "FixText",
            value: function FixText(data) {
                if (!data) return "";
                data = data.replace(/<ul>/g, "<ul style='margin-left:100px;'>");
                return data;
            }
        }, {
            key: "ShowCareers",
            value: function ShowCareers() {
                var _this3 = this;

                var self = this;
                var toShow = this.careers.filter(function (x) {
                    return x.type[self.language] === $("#" + self.TypeSelectId).val();
                });
                var html = "<ul class= 'list-group' > ";
                toShow.forEach(function (c) {
                    var docHtml = "<ul class= 'list-group' > ";
                    c.docs.forEach(function (d) {
                        return docHtml += "<li class= 'list-group-item' >\n            <a href=\"/api/part/GetBlob?hash=" + d.link + "\">" + d.title[_this3.language] + "</a></li > ";
                    });
                    docHtml += "</ul>";
                    html += "<li class= 'list-group-item' >\n            <h4>" + c.title[_this3.language] + "</h4> <br />" + c.body[_this3.language] + " <br />\n            " + docHtml + "\n            </li > ";
                });
                $("#" + this.ItemsContentId).html(html);
            }
        }, {
            key: "PutCareers",
            value: function PutCareers(divId, isMain) {
                var _this4 = this;

                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var blockId = isMain ? this.MJPageData.mainid : this.MJPageData["block_" + divId].value;
                this.ItemsContentId = this.Guid();
                this.TypeSelectId = this.Guid();
                var self = this;
                var newContent = "<div class= \"port-wrapper\" >\n            <div class=\"port-head\">\n                <h3 class=\"port-title\">" + this.TranslateWord("careers") + "</h3><br />\n                <h3 class=\"port-title\"><select class=\"form-control\" id=" + this.TypeSelectId + " onchange=\"mjProcess.ShowCareers()\"></select>    </h3>\n                    \n\t\t\t\t</div >\n\n            <div class=\"port-box box-border\" id=\"" + this.ItemsContentId + "\">\n\n            </div>\n                \n\t\t\t</div > ";
                oldDiv.replaceWith($(newContent));

                var types = _toConsumableArray(new Set(obj.data.map(function (d) {
                    return d.type[_this4.language];
                })));

                types.forEach(function (y) {
                    return $("#" + _this4.TypeSelectId).append("<option value='" + y + "'>" + y + "</option>");
                });
                $("#" + this.TypeSelectId).val(types[0]);
                this.careers = obj.data;
                this.ShowCareers(); //this.PutNextNews(blockId);
            }
        }, {
            key: "T",
            value: function T(obj) {
                if (!obj) return "";
                if (!obj[this.language]) return "";
                return obj[this.language];
            }
        }, {
            key: "PutFeedback",
            value: function PutFeedback(divId, isMain) {
                var oldDiv = $("#" + divId);
                var obj = isMain ? this.MJPageData.main : this.MJPageData["block_" + divId].blockData;
                var self = this;
                var lMandatory = [];
                var form = "<form action='/home/SendFeedback' method='POST' id='fFeedBack' target='_blank' enctype='multipart/form-data'><input type='hidden' name='id' value='" + window.location.href.split("/").pop() + "' />";
                obj.datas.forEach(function (x) {
                    var element = "";
                    var id = "fbe_" + x.id;

                    switch (parseInt(x.type)) {
                        case 1:
                            element = "<input type='text' id='" + id + "' class='form-control' name='" + x.title[self.language] + "'/>";
                            break;

                        case 2:
                            element = "<textarea id='" + id + "' class='form-control' rows='6' name='" + x.title[self.language] + "'/>";
                            break;

                        case 3:
                            element = "<input type='file' id='" + id + "' class='form-control' name='upload_" + id + "'/>";
                            break;
                    }

                    ;
                    if (x.mandatory) lMandatory.push({
                        id: id,
                        title: x.title[self.language]
                    });
                    form += "<div class=\"row\">\n                <div class=\"col-12\">\n                    <label class=\"control-label\">" + x.title[self.language] + (x.mandatory ? "*" : "") + "</label>\n                    " + element + "\n                </div>\n             </div> ";
                });
                form += '</form>';
                self.MandatoryFields = lMandatory;
                oldDiv.replaceWith($("<article class= \"article-container\" >\n\n            <h1>" + obj.title[self.language] + "\n\t\t\t\t</h1>\n            \n\n            <div class=\"article-content\">\n            \n                " + self.FixText(obj.body[self.language]) + "\n                " + form + "\n                <div class=\"row\">\n                    <div class=\"col-12\">\n                        <a class=\"btn btn-primary\" onclick=\"mjProcess.SendFeedback()\"><t>send</t></a>\n                    </div>\n                </div>\n\t\t\t\t</div>\n\t\t\t</article > "));
            }
        }, {
            key: "SendFeedback",
            value: function SendFeedback() {
                var self = this;
                var ok = true;
                var errors = "";
                self.MandatoryFields.forEach(function (x) {
                    if (($("#" + x.id).val() || "") === "") {
                        errors += x.title + " ";
                        ok = false;
                    }

                    ;
                });

                if (!ok) {
                    alert(self.TranslateWord("followingfieldsmusthavevalue") + ":\r\n" + errors);
                    return;
                } //console.log($("#fFeedBack"));
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
                document.getElementById("fFeedBack").reset(); //
            }
        }, {
            key: "RepairLinks",
            value: function RepairLinks() {
                $("a").each(function (i, e) {
                    if ($(e).attr("href") && $(e).attr("href").indexOf("http") === 0) $(e).attr("target", "_blank");
                });
            }
        }]);

        return MJProcess;
    }();