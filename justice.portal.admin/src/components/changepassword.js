import React from 'react';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import { Link } from 'react-router-dom';
import Comm from '../modules/comm';

import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { throwStatement } from '@babel/types';


export default class ChangePassword extends BaseComponent {
    constructor(props) {
        super(props);

        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Смяна на парола"
            }
            ]
        );

        this.ChangePassword = this.ChangePassword.bind(this);



    }


    ChangePassword() {

        if ((this.state.OldPassword || "") === "") {
            toast.error("Моля, въведете стара парола");
            return;
        }
        if ((this.state.NewPassword || "") === "") {
            toast.error("Моля, въведете стара парола");
            return;
        }
        if ((this.state.NewPassword || "") !== (this.state.RePassword || "")) {
            toast.error("Паролите не съвпадат");
            return;
        }

        var data = {
            OldPassword: this.state.OldPassword,
            NewPassword: this.state.NewPassword
        };
        var self = this;

        Comm.Instance().post('security/ChangePassword', data)
            .then(result => {
                self.setState({
                    OldPassword: "",
                    NewPassword: "",
                    RePassword: ""
                });
                toast.info("Успешна промяна");
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Некоректна стара парола");
                else
                    toast.error(error.message);

            });


    }




    render() {
        var self = this;

        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }

        var session = self.SM.GetSession();
        return (

            <div className="container mt-3">
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Стара парола</label>
                        <input type="password" className="form-control" value={self.state.OldPassword} onChange={(e) => self.setState({ OldPassword: e.target.value })}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Нова парола</label>
                        <input type="password" className="form-control" value={self.state.NewPassword} onChange={(e) => self.setState({ NewPassword: e.target.value })}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Повторно въвеждане</label>
                        <input type="password" className="form-control" value={self.state.RePassword} onChange={(e) => self.setState({ RePassword: e.target.value })}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-primary" onClick={self.ChangePassword}>Смяна</button>
                    </div>
                </div>

            </div>

        )
    }
}

