import moment from 'moment';
const SessionTimeout = 19;

class SessionManager {

    
    


    IsSessionExpired() {
        var data = this.GetSession();

        if (data === null)
            return true;
        var obj = data;
        var now = moment(new Date());
        var end = obj.LastAccessDate; // another date
        var duration = moment.duration(now.diff(end));
        var mins = duration.asMinutes();
        if (mins <= SessionTimeout) {
            obj.LastAccessDate = now;
            this.SetSession(obj);
        }
        return mins > SessionTimeout;
    }

    GetSession() {
        var user = localStorage.getItem("user");
        if (user) {
            var obj = JSON.parse(user);
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