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
        this.GetTranslation = this.GetTranslation.bind(this);
        this.UploadBlob = this.UploadBlob.bind(this);
        this.GetStateMLData = this.GetStateMLData.bind(this);
        this.SetStateMLData = this.SetStateMLData.bind(this);



        this.state = {
            Error: null,
            spinner: false,
            Rec: {}
        };

    }



    FormatDate(d) {
        var month = d.getMonth() + 1;
        if (month < 10) month = '0' + month;
        var day = d.getDay();
        if (day < 10) day = '0' + day;
        return d.getFullYear() + '-' + month + '-' + day;
    }


    UploadBlob(callback) {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "file");
        x.style.display = 'none';
        document.body.appendChild(x);
        x.addEventListener("change", () => {
            var formData = new FormData();
            formData.append("image", x.files[0]);
            Comm.Instance().post('part/AddBlob', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(
                function (response) {
                    callback(response.data);

                })
                .finally(
                    function (response) {
                        document.body.removeChild(x);
                    });


        });



        x.click();
    }

    GetTranslation(obj) {
        return obj == null ? null : obj[this.state.lang];
    }

    Logout() {

        Comm.Instance().get('security/logout');
        this.SM.Logout();
        window.document.location.href = "/login";
        //eventClient.emit('loginchange');
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


    SetSpecific = (prop, value) => {
        var self = this;
        var rec = this.state[prop];
        rec = value;
        this.setState({
            [prop]: rec
        }, () => console.log("xxxx", self.state));
    }

    // GetSpecific = (prop) => {
    //     var rec = this.state.Rec;

    //     return rec !== null ? rec[prop] : null;
    // }


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


    GetStateMLData(stateId) {
        //console.log("get", this.state[stateId][this.state.lang]);
        return this.state[stateId][this.state.lang] || "";
    }
    SetStateMLData(value, stateId, lang) {
        if (!lang)
            lang = this.state.lang;
        var info = this.state[stateId];
        info[lang] = value;
        this.setState({ [stateId]: info });
    }


    render() {
        return (<div></div>);
    }
}

export default BaseComponent;