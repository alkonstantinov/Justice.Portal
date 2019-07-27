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

export default class InstitutionEditor extends BaseComponent {

    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Институции",
                href: "institutions"
            }
            ]
        );

        this.Cancel = this.Cancel.bind(this);
        this.Save = this.Save.bind(this);




        this.state = { mode: "loading" };

    }



    componentDidMount() {
        var self = this;
        Comm.Instance().get('part/GetInstitution?institutionId=' + self.props.match.params.id)
            .then(result => {
                self.setState({
                    content: result.data.content,
                    mode: "edit"
                });

                eventClient.emit(
                    "addbreadcrump",
                    [
                        {
                            title: result.data.name
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
    }





    Save() {
        var self = this;
        var data = {
            InstitutionId: self.props.match.params.id,
            Content: self.state.content
        };
        Comm.Instance().post('part/SaveInstitution', data)
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
                <Redirect to={"/institutions"}>
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
                        <div className="col-12">
                            <label className="control-label">Съдържание</label>
                            <textarea className="form-control" rows="30" value={this.state.content} onChange={(e) => self.setState({ content: e.target.value })}></textarea>

                        </div>
                    </div>
                </div>
        );
    }




}