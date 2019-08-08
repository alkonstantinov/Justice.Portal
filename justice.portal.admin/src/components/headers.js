import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context'


export default class Headers extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Заглавни части"
            }
            ]
        );


        this.LoadData = this.LoadData.bind(this);
        this.EditHeader = this.EditHeader.bind(this);
        this.DeleteHeader = this.DeleteHeader.bind(this);



    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });



        Comm.Instance().get('part/GetHeaders')
            .then(result => {
                self.setState({
                    headers: result.data,
                    mode: "list"
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
        self.LoadData();

    }


    EditHeader(headerId) {
        this.setState({
            EditHeaderId: headerId,
            ShowEdit: true
        })
    }
    DeleteHeader(headerId) {
        if (!window.confirm("Моля, потвърдете"))
            return;
        var self = this;
        Comm.Instance().delete('part/DeleteHeader/' + headerId)
            .then(result => {
                self.LoadData();
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




    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.ShowEdit)
            return (
                <Redirect to={"/editheader/" + (this.state.EditHeaderId || "")}>
                </Redirect>
            );


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
                            <div className="col-2">
                                <button className="btn btn-primary pull-right" onClick={() => self.EditHeader(null)}>Нов</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="10%"></th>
                                        <th width="90%">Име</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.headers.map(obj =>
                                                <tr>
                                                    <td>
                                                        <button className="btn btn-light" onClick={() => self.EditHeader(obj.headerId)}><i className="fas fa-edit"></i></button>
                                                        <button className="btn btn-danger" onClick={() => self.DeleteHeader(obj.headerId)}><i className="far fa-trash-alt"></i></button>

                                                    </td>
                                                    <td>{obj.title}</td>

                                                </tr>
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

