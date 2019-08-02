import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context'


export default class WebPages extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Страници"
            }
            ]
        );


        this.LoadData = this.LoadData.bind(this);
        this.EditPage = this.EditPage.bind(this);



    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });

        UIContext.LastPortalPartId = this.state.portalPartId;

        Comm.Instance().get('part/GetTemplates?portalPartId=' + self.state.portalPartId)
            .then(result => {
                self.setState({
                    blocks: result.data,
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
        this.setState({ mode: "loading" });
        Comm.Instance().get('part/GetBlockRequisites')
            .then(result => {

                self.setState({
                    parts: result.data.parts,
                    portalPartId: UIContext.LastPortalPartId || result.data.parts[0].portalPartId
                }, () => self.LoadData());
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


    EditPage(webPageId) {
        this.setState({
            EditPageId: webPageId,
            ShowEdit: true
        })
    }




    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.ShowEdit)
            return (
                <Redirect to={"/editwebpage/" + this.state.EditPageId}>
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
                            <div className="col-3">
                                <select className="form-control" value={self.state.portalPartId} onChange={(e) => self.setState({ portalPartId: e.target.value }, () => self.LoadData())}>
                                    {
                                        self.state.parts.map(x => <option value={x.portalPartId}>{x.name}</option>)
                                    }
                                </select>
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
                                            self.state.blocks.map(obj =>
                                                <tr>
                                                    <td>


                                                        <button className="btn btn-info" onClick={() => self.EditPage(obj.templateId)}><i class="fas fa-edit"></i></button>
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

