import React from 'react';
import { withRouter } from 'react-router-dom'
import BaseComponent from './basecomponent';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import eventClient from '../modules/eventclient';
import Comm from '../modules/comm';
import moment from 'moment';



class Login extends BaseComponent {
    constructor(props) {
        super(props);
        this.Login = this.Login.bind(this);

    }




    Login() {

        this.ShowSpin();
        var self = this;
        var postData = {
            UserName: self.state.Rec.username,
            Password: self.state.Rec.password

        };

        Comm.Instance().post('security/login', postData)
            .then(result => {
                self.SM.SetSession({
                    id: result.data.portalUserId,
                    name: result.data.name,
                    userName: result.data.userName,
                    token: result.data.sessionID,
                    rights: result.data.rights,
                    parts: result.data.parts,
                    LastAccessDate: moment(new Date())
                });

                Comm.Instance().defaults.headers.common['Authorization'] = result.data.sessionID;

                eventClient.emit("loginchange");
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Невалидно потребителско име или парола");
                else
                    toast.error(error.message);

            })
            .then(() => self.HideSpin());

    }




    render() {
        var self = this;
        return (
            <p>
                {
                    this.state.spinner === true ?
                        <Loader
                            type="ThreeDots"
                            color="#00BFFF"

                            height="100"
                            width="100"
                        /> :
                        self.SM.GetSession() !== null ?
                            <Redirect to={"/mainmenu"} push></Redirect>
                            :
                            <div className="form-signin">
                                <h2 className="form-signin-heading">Вход в системата</h2>
                                <label htmlFor="inputEmail" className="control-label">Потребителско име</label>
                                <input type="email" id="username" className="form-control" placeholder="Потребителско име" required autoFocus value={self.state.Rec.username} onChange={self.HandleChange}></input>
                                <label htmlFor="inputPassword" className="control-label">Парола</label>
                                <input type="password" id="password" className="form-control" placeholder="Парола" required value={self.state.Rec.password} onChange={self.HandleChange}></input>

                                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={self.Login}>Вход</button>
                            </div>
                }
            </p>
        );
    }
}

export default Login;