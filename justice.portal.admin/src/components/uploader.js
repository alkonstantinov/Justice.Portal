import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context'


export default class Uploader extends BaseComponent {
    constructor(props) {
        super(props);
        if (this.props.mode !== "select")
            eventClient.emit(
                "breadcrump",
                [{
                    title: "Начало",
                    href: ""
                },
                {
                    title: "Електронни оригинали"
                }
                ]
            );





    }


    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }




        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col-6">
                        <button className="btn btn-light" onClick={() => self.UploadBlob((href) => self.setState({ href: href }))}>Зареди</button>
                    </div>
                    <div className="col-6">
                        <label className="control-label">{self.state.href ? "/api/part/getblob?hash=" + self.state.href : ""}</label>
                    </div>
                </div>
            </div>


        )
    }
}

