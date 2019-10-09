import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context'
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';


export default class Audit extends BaseComponent {
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
                    title: "Одит"
                }
                ]
            );


        this.LoadData = this.LoadData.bind(this);
        this.ShowData = this.ShowData.bind(this);



    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });
        var data = {
            portalUserId: self.state.portalUserId || null,
            fromDate: moment(self.state.fromDate).format("YYYY-MM-DD"),
            toDate: moment(self.state.toDate).format("YYYY-MM-DD"),
        }


        Comm.Instance().get('security/Audit?portalUserId=' + (self.state.portalUserId || "") + "&fromDate=" + moment(self.state.fromDate).format("YYYY-MM-DD")
            + "&toDate=" + moment(self.state.toDate).format("YYYY-MM-DD"))
            .then(result => {
                self.setState({
                    mode: "list",
                    actions: result.data
                })
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права", {
                        onClose: this.Logout
                    });
                else
                    toast.error(error.message);

            });
    }
    componentDidMount() {
        var self = this;
        this.setState({ mode: "loading" });
        Comm.Instance().get('security/GetUsersForAdmin')
            .then(result => {
                self.setState({
                    users: result.data.users,
                    actions: [],
                    mode: "list",
                    fromDate: moment().toDate(),
                    toDate: moment().toDate()
                });
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права", {
                        onClose: this.Logout
                    });
                else
                    toast.error(error.message);

            });


    }

    ShowData(id) {
        var element = window.document.getElementById("dContent_" + id);
        console.log(element);
        if (element.style.display === "none")
            element.style.display = "block";
        else
            element.style.display = "none";
    }


    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }



        return (
            self.state.mode === "loading" ?
                <Loader
                    type="ThreeDots"
                    color="#00BFFF"

                    height="100"
                    width="100"
                /> :
                self.state.mode === "list" ?
                    <div className="container mt-3">
                        <div className="row">
                            <div className="col-34">
                                <label className="control-label">Потребител</label>

                                <select className="form-control" value={self.state.portalPartId} onChange={(e) => self.setState({ portalUserId: e.target.value })}>
                                    <option></option>
                                    {
                                        self.state.users.map(x => <option value={x.portalUserId}>{x.name}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label className="control-label">От дата</label>

                                <Calendar dateFormat="dd.mm.yy" value={(this.state.fromDate || "") === "" ? moment().toDate() : moment(this.state.fromDate, "YYYY-MM-DD").toDate()}
                                    onChange={(e) => this.setState({ fromDate: moment(e.value).format("YYYY-MM-DD") })}
                                    readOnlyInput="true" inputClassName="form-control"></Calendar>
                            </div>
                            <div className="col-3">
                                <label className="control-label">До дата</label>

                                <Calendar dateFormat="dd.mm.yy" value={(this.state.toDate || "") === "" ? moment().toDate() : moment(this.state.toDate, "YYYY-MM-DD").toDate()}
                                    onChange={(e) => this.setState({ toDate: moment(e.value).format("YYYY-MM-DD") })}
                                    readOnlyInput="true" inputClassName="form-control"></Calendar>
                            </div>
                            <div className="col-2">
                                <button className="btn btn-primary pull-right" onClick={() => self.LoadData()}>Търси</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="30%">Потребител</th>
                                        <th width="30%">Момент</th>
                                        <th width="30%">Дейност</th>
                                        <th width="10%">Данни</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.actions.map(obj =>
                                                [
                                                    <tr>
                                                        <td>{obj.userName}</td>
                                                        <td>{moment(obj.onTime).format("YYYY-MM-DD hh:mm")}</td>
                                                        <td>{obj.title}</td>
                                                        <td><a onClick={() => self.ShowData(obj.userActionId)}><i className="fas fa-plus-circle"></i></a></td>
                                                    </tr>,
                                                    <tr>
                                                        <td colSpan="4">
                                                            <div id={"dContent_" + obj.userActionId} style={{ 'display': 'none' }}>
                                                                {obj.content != "" ? obj.content : "Няма данни"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ]
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    : null


        )
    }
}

