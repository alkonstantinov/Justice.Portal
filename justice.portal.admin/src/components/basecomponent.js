import React, { Component } from 'react';
import SessionManager from '../modules/session';
import eventClient from '../modules/eventclient';
import Comm from '../modules/comm';

class BaseComponent extends Component {

    SM = new SessionManager();

    constructor(props) {
        super(props);
        this.HandleChange = this.HandleChange.bind(this);
        this.HandleSubmit = this.HandleSubmit.bind(this);
        this.Refresh = this.Refresh.bind(this);
        this.ConvertArrayToObject = this.ConvertArrayToObject.bind(this);
        this.ValidateEmail = this.ValidateEmail.bind(this);
        this.Logout = this.Logout.bind(this);


        this.state = {
            Error: null,
            spinner: false,
            Rec: {}
        };

    }

    Logout() {

        Comm.Instance().get('security/logout');
        this.SM.Logout();
        eventClient.emit('loginchange');
    }

    Refresh() {
        window.location.reload();
    }


    HandleChange = event => {
        var rec = this.state.Rec;
        rec[event.target.id] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        this.setState({
            Rec: rec
        });
    }

    HandleSubmit = event => {
        event.preventDefault();
    }

    ShowSpin() {
        this.setState({ spinner: true });
    }

    HideSpin() {
        this.setState({ spinner: false });
    }


    ConvertArrayToObject(array) {
        var result = new Object(null);
        if (array) {
            array.forEach(item => result[item] = true);
        }
        return result;
    }

    ConvertObjectToArray(obj) {
        var result = [];
        if (obj) {
            Object.keys(obj).forEach(item => {
                if (obj[item])
                    result.push(item)
            });
        }
        return result;
    }

    ValidateEmail(mail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(mail);
    }


    render() {
        return (<div></div>);
    }
}

export default BaseComponent;