import moment from 'moment';
class SessionManager {




    IsSessionExpired() {
        var obj = this.GetSession(false);
        if (obj === null)
            return true;
        var now = moment(new Date());
        var end = obj.LastAccessDate; // another date
        var duration = moment.duration(now.diff(end));
        var mins = duration.asMinutes();
        return mins > 19;
    }

    GetSession(updTime = true) {
        var user = localStorage.getItem("user");
        if (user) {
            var obj = JSON.parse(user);
            obj.LastAccessDate = moment(new Date());
            if (updTime)
                this.SetSession(obj);
            return obj;
        }
        else
            return null;
    }

    SetSession(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    Logout() {
        localStorage.removeItem("user");
    }

    CheckSession() {
        return false;
    }

    GetLanguage() {
        var language = localStorage.getItem("lang");
        if (!language) {
            language = "en";
            localStorage.setItem("lang", language);
        }

        return language;
    }

    SetLanguage(language) {
        localStorage.setItem("lang", language);
    }



}

export default SessionManager;