import Axios from 'axios';
import serverdata from '../data/serverdata.json';
import SessionManager from './session.js';

class Comm {

    instance = null;

    Instance() {
        if (this.instance === null) {
            var session = new SessionManager().GetSession();

            this.instance = Axios.create({
                baseURL: serverdata.url,
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