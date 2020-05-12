import Axios from 'axios';
import SessionManager from './session.js';

class Comm {

    instance = null;

    url = "";

    constructor() {
        this.url = process.env.NODE_ENV.toLowerCase() === "development" ? "https://localhost:5001/api/" : "http://172.16.0.57:8080/api/";
        //this.url = process.env.NODE_ENV.toLowerCase() === "development" ? "https://www.justice.government.bg/api/" : "http://172.16.0.57:8080/api/";
    }

    Instance(slow = false) {
        if (this.instance === null) {
            var session = new SessionManager().GetSession();

            this.instance = Axios.create({
                baseURL: this.url,
                headers: { 'Access-Control-Allow-Origin': '*', },
                timeout: slow ? 60000 : 10 * 60 * 1000
            });

            if (session)
                this.instance.defaults.headers.common['Authorization'] = session.token;
        }
        return this.instance;
    }


}

export default new Comm();