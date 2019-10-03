import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context'
import uuidv4 from 'uuid/v4';


export default class InsideDocs extends BaseComponent {
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
                    title: "Вътрешни документи"
                }
                ]
            );


        this.NewInnerDoc = this.NewInnerDoc.bind(this);
        this.DeleteDoc = this.DeleteDoc.bind(this);
        this.OpenLink = this.OpenLink.bind(this);
        this.Save = this.Save.bind(this);



    }

    OpenLink(hash) {
        window.open(Comm.url + "part/getblob?hash=" + hash);
    }

    NewInnerDoc() {
        var rec = {
            id: uuidv4(),
            title: "Нов документ",
            hash: null

        };
        var docs = this.state.docs;
        docs = [rec].concat(docs);
        this.setState({ docs: docs });
    }

    DeleteDoc(id) {
        var docs = this.state.docs;
        var el = docs.find(x => x.id === id);
        var i = docs.indexOf(el);
        docs.splice(i, 1);
        this.setState({ docs: docs });
    }

    SetValue(id, prop, value) {
        var docs = this.state.docs;
        var el = docs.find(x => x.id === id);
        el[prop] = value;
        this.setState({ docs: docs });
    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });
        UIContext.LastPortalPartId = this.state.portalPartId;


        Comm.Instance().get('part/GetInnerDocs?portalPartId=' + self.state.portalPartId + "&blockTypeId=" + self.state.blockTypeId + "&ss=" + (self.state.ss || ""))
            .then(result => {
                self.setState({
                    docs: result.data.sort((a, b) => a.title > b.title ? 1 : -1),
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

    Save() {
        var data = {
            PortalPartId: this.state.portalPartId,
            Content: JSON.stringify(this.state.docs)
        };
        Comm.Instance().post('part/SetInnerDocs', data)
            .then(result => {

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

        var session = self.SM.GetSession();
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
                            <div className="col-4">
                                <select className="form-control" value={self.state.portalPartId} onChange={(e) => self.setState({ portalPartId: e.target.value }, () => self.LoadData())}>
                                    {
                                        self.state.parts.map(x => <option value={x.portalPartId}>{x.name}</option>)
                                    }
                                </select>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-2">
                                {
                                    session.rights.find(x => x === "editinsidedocuments") ?
                                        <button className="btn btn-primary pull-right" onClick={() => self.NewInnerDoc()}>Нов</button>
                                        : null
                                }
                            </div>
                            <div className="col-10">
                                {
                                    session.rights.find(x => x === "editinsidedocuments") ?
                                        <button className="btn btn-primary pull-right" onClick={() => self.Save()}>Запис</button>
                                        : null
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="30%"></th>
                                        <th width="70%">Име</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.docs.map(obj =>
                                                <tr>
                                                    <td>
                                                        {
                                                            session.rights.find(x => x === "editinsidedocuments") ?
                                                                <button className="btn btn-danger" onClick={() => self.DeleteDoc(obj.id)}><i className="far fa-trash-alt"></i></button>
                                                                : null
                                                        }
                                                        {
                                                            session.rights.find(x => x === "editinsidedocuments") ?
                                                                <button className="btn btn-light" onClick={() => self.UploadBlob((hash) => self.SetValue(obj.id, "hash", hash))}><i className="far fa-file-word"></i></button>
                                                                : null
                                                        }

                                                        {
                                                            obj.hash ? <button className="btn btn-light" onClick={() => self.OpenLink(obj.hash)}><i className="fas fa-external-link-alt"></i></button>
                                                                : null
                                                        }


                                                    </td>
                                                    <td>{
                                                        session.rights.find(x => x === "editinsidedocuments") ?
                                                            <input className="form-control" type="text" value={obj.title} onChange={(e) => self.SetValue(obj.id, "title", e.target.value)} />
                                                            :
                                                            obj.title
                                                    }</td>

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

