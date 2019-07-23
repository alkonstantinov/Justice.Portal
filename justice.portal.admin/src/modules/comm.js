import Axios from 'axios';
import SessionManager from './session.js';

class Comm {

    instance = null;

    url = "";

    constructor() {
        this.url = process.env.NODE_ENV.toLowerCase() === "development" ? "https://localhost:5001/api/" : "http://172.16.0.57:8080/api/";
    }

    Instance() {
        if (this.instance === null) {
            var session = new SessionManager().GetSession();

            this.instance = Axios.create({
                baseURL: this.url,
                headers: { 'Access-Control-Allow-Origin': '*', },
                timeout: 60000
            });

            if (session)
                this.instance.defaults.headers.common['Authorization'] = session.token;
        }
        return this.instance;
    }


}

export default new Comm();