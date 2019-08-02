
class MJProcess {
    translation = {};
    language = "bg";

    constructor() {
        this.LoadTranslations = this.LoadTranslations.bind(this);
        this.Translate = this.Translate.bind(this);
        this.DoProcess = this.DoProcess.bind(this);
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



    DoProcess() {
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

var mjProcess = new MJProcess();

mjProcess.DoProcess();