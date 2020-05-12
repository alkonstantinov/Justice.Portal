import React from 'react';
import { Redirect } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import BaseComponent from './basecomponent';
import Comm from '../modules/comm';
import Loader from 'react-loader-spinner';
import { TabView, TabPanel } from 'primereact/tabview';
import { toast } from 'react-toastify';
import eventClient from '../modules/eventclient';
import uuidv4 from 'uuid/v4';
import { ToggleButton } from 'primereact/togglebutton';
import moment from 'moment';
import UIContext from '../modules/context'


export default class HeaderEditor extends BaseComponent {

    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Заглавни части",
                href: "headers"
            }
            ]
        );

        this.Cancel = this.Cancel.bind(this);
        this.Save = this.Save.bind(this);




        this.state = { mode: "loading" };

    }



    async componentDidMount() {
        var self = this;
        await Comm.Instance().get('part/GetBlockRequisites')
            .then(result => {

                self.setState({
                    parts: result.data.parts,
                    portalPartId: UIContext.LastPortalPartId || result.data.parts[0].portalPartId
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


        if (self.props.match.params.id) {
            Comm.Instance().get('part/GetHeader?headerId=' + self.props.match.params.id)
                .then(result => {
                    self.setState({
                        content: result.data.content,
                        title: result.data.title,
                        portalPartId: result.data.portalPartId,
                        mode: "edit"
                    });

                    eventClient.emit(
                        "addbreadcrump",
                        [
                            {
                                title: result.data.title
                            }
                        ]);

                })
                .catch(error => {
                    if (error.response && error.response.status === 401)
                        toast.error("Липса на права", {
                            onClose: this.Logout
                        });
                    else
                        toast.error(error.message);

                });
        } else {
            self.setState({
                mode: "edit"
            });
        }
    }





    Save() {
        var self = this;
        var data = {
            HeaderId: self.props.match.params.id,
            Content: self.state.content || "",
            Title: self.state.title || "",
            PortalPartId: self.state.portalPartId
        };
        Comm.Instance().post('part/SaveHeader', data)
            .then(result => {
                self.setState({ Saved: true });
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

    Cancel() {
        this.setState({ Saved: true });
    }



    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.Saved)
            return (
                <Redirect to={"/headers"}>
                </Redirect>
            );
        return (
            self.state.mode === "loading" ?
                <Loader
                    type="ThreeDots"
                    color="#00BFFF"

                    height="100"
                    width="100"
                />
                :
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-2">
                            {
                                self.state.templateChanged ? null : <button className="btn btn-primary" onClick={self.Save}>Запис</button>
                            }

                        </div>
                        <div className="col-2">
                            <button className="btn btn-danger" onClick={self.Cancel}>Отказ</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <label className="control-label">Част</label>
                            <select className="form-control" value={self.state.portalPartId} onChange={(e) => self.setState({ portalPartId: e.target.value })}>
                                {
                                    self.state.parts.map(x => <option value={x.portalPartId}>{x.name}</option>)
                                }
                            </select>
                        </div>

                        <div className="col-9">
                            <label className="control-label">Название</label>
                            <input type="text" className="form-control" value={this.state.title} onChange={(e) => self.setState({ title: e.target.value })}></input>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <label className="control-label">Съдържание</label>
                            <textarea className="form-control" rows="30" value={this.state.content} onChange={(e) => self.setState({ content: e.target.value })}></textarea>

                        </div>
                    </div>
                </div>
        );
    }




}