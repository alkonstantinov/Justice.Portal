import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context';
import uuidv4 from 'uuid/v4';


export default class Rubric extends BaseComponent {
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
                    title: "Рубрики"
                }
                ]
            );


        this.LoadData = this.LoadData.bind(this);
        this.New = this.New.bind(this);
        this.SetData = this.SetData.bind(this);
        this.Delete = this.Delete.bind(this);
        this.Save = this.Save.bind(this);

    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });


        Comm.Instance().get('part/SelectRubric?portalPartId=' + self.state.portalPartId)
            .then(result => {
                console.log(result.data);
                self.setState({
                    rubrics: result.data,
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


    SetData(id, prop, val) {
        var rubrics = this.state.rubrics;
        rubrics.find(x => x.rubricId == id)[prop] = val;
        this.setState({ rubrics: rubrics });
    }

    New() {
        var rubrics = this.state.rubrics;
        rubrics.push({
            titleBg: "Рубрика",
            titleEn: "Rubric",
            portalPartId: this.state.portalPartId,
            rubricId: uuidv4(),
            canDel: true,
            isNew: true
        });
        this.setState({ rubrics: rubrics });

    }

    Delete(id) {
        var rubrics = this.state.rubrics;
        var isNew = rubrics.find(x => x.rubricId == id).isNew || false;
        rubrics = rubrics.filter(x => x.rubricId != id);
        this.setState({ rubrics: rubrics });
        if (!isNew) {
            Comm.Instance().delete('part/DeleteRubric?rubricId=' + id)
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

    }

    Save() {
        var self = this;
        var data = [];
        var rubrics = this.state.rubrics;
        rubrics.forEach(x => {
            var rec = JSON.parse(JSON.stringify(x));
            if (rec.isNew)
                rec.rubricId = null;
            data.push(rec);


        });

        console.log(data);

        Comm.Instance().post('part/UpdateRubric', data)
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
                                <button className="btn btn-primary pull-right" onClick={self.New}>Нова</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="10%"></th>
                                        <th width="45%">Име БГ</th>
                                        <th width="45%">Име EN</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.rubrics.map(obj =>
                                                <tr>
                                                    <td>
                                                        {obj.canDel ?
                                                            <button className="btn btn-danger" onClick={() => self.Delete(obj.rubricId)}><i className="far fa-trash-alt"></i></button>
                                                            : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" value={obj.titleBg} onChange={(e) => self.SetData(obj.rubricId, "titleBg", e.target.value)}></input>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" value={obj.titleEn} onChange={(e) => self.SetData(obj.rubricId, "titleEn", e.target.value)}></input>
                                                    </td>

                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <button className="btn btn-primary" onClick={self.Save}>Запис</button>
                            </div>
                            <div className="col-2">
                                <button className="btn btn-danger" onClick={() => self.LoadData()}>Отказ</button>
                            </div>
                        </div>
                    </div>
                    : null


        )
    }
}

