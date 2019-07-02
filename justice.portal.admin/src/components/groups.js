import React from 'react';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';


export default class Groups extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Групи"
            }
            ]
        );
        this.LoadData = this.LoadData.bind(this);
        this.Edit = this.Edit.bind(this);
        this.CheckPart = this.CheckPart.bind(this);
        this.CheckRight = this.CheckRight.bind(this);
        this.Save = this.Save.bind(this);
        this.Delete = this.Delete.bind(this);

        this.state.mode = "loading";


    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });

        Comm.Instance().get('security/GetGroupsForAdmin')
            .then(result => {
                self.setState({
                    groups: result.data.groups,
                    parts: result.data.parts,
                    rights: result.data.rights,
                    mode: "list"
                })
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права");
                else
                    toast.error(error.message);

            });
    }
    componentDidMount() {
        this.LoadData();
    }


    Edit(obj) {
        if (!obj)
            obj = {
                portalGroupId: null,
                name: "",
                parts: [],
                rights: []
            }
        this.setState({ obj: obj, mode: "edit" })
    }


    CheckPart(part, checked) {

        var obj = this.state.obj
        if (checked)
            obj.parts.push(part);
        else
            obj.parts.splice(this.state.obj.parts.indexOf(part), 1);
        this.setState({ obj: obj });

    }

    CheckRight(right, checked) {

        var obj = this.state.obj
        if (checked)
            obj.rights.push(right);
        else
            obj.rights.splice(this.state.obj.rights.indexOf(right), 1);
        this.setState({ obj: obj });

    }

    Save() {
        if (this.state.obj.name === "") {
            toast.error("Моля, въведете име");
            return;
        }
        var self = this;
        Comm.Instance().post('security/SetGroup', self.state.obj)
            .then(result => {
                self.LoadData();
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права");
                else
                    toast.error(error.message);

            });
    }

    Delete(group) {
        if (!window.confirm("Моля, потвърдете")) {
            return;
        }
        var self = this;
        Comm.Instance().delete('security/DelGroup/' + group.portalGroupId)
            .then(result => {
                self.LoadData();
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права");
                else
                    toast.error(error.message);

            });
    }

    render() {
        var self = this;
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
                            <div className="col-12">
                                <button className="btn btn-primary pull-right" onClick={() => self.Edit(null)}>Нова</button>
                            </div>
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="10%"></th>
                                        <th width="90%">Название</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.groups.map(obj =>
                                                <tr>
                                                    <td>
                                                        {obj.canDel ?
                                                            <button className="btn btn-danger" onClick={() => self.Delete(obj)}><i className="far fa-trash-alt"></i></button>
                                                            : null
                                                        }
                                                        <button className="btn btn-info" onClick={() => self.Edit(obj)}><i class="fas fa-edit"></i></button>
                                                    </td>
                                                    <td>{obj.name}</td>

                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                    :
                    self.state.mode === "edit" ?
                        <div className="container mt-3">
                            <div className="row">
                                <div className="col-2">
                                    <button className="btn btn-success" onClick={self.Save}>Запис</button>
                                </div>
                                <div className="col-2">
                                    <button className="btn btn-danger" onClick={self.LoadData}>Отказ</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label className="control-label">Название</label>
                                    <input type="text" placeholder="Название" value={self.state.obj.name}
                                        className="form-control"
                                        onChange={(e) => { var obj = self.state.obj; obj.name = e.target.value; self.setState({ obj: obj }); }}></input>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <label className="control-label">Права</label>
                                    <ul className="list-group">
                                        {
                                            self.state.rights.map(obj =>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox"
                                                            checked={self.state.obj.rights.indexOf(obj.name) > -1}
                                                            onChange={(e) => self.CheckRight(obj.name, e.target.checked)}
                                                        ></input>
                                                        <label className="form-check-label">
                                                            {obj.description}
                                                        </label>
                                                    </div>
                                                </li>)
                                        }
                                    </ul>
                                </div>
                                <div className="col-4">
                                    <label className="control-label">Достъп до</label>
                                    <ul className="list-group">
                                        {
                                            self.state.parts.map(obj =>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox"
                                                            checked={self.state.obj.parts.indexOf(obj.partKey) > -1}
                                                            onChange={(e) => self.CheckPart(obj.partKey, e.target.checked)}


                                                        ></input>
                                                        <label className="form-check-label" for="defaultCheck1">
                                                            {obj.name}
                                                        </label>
                                                    </div>
                                                </li>)
                                        }
                                    </ul>
                                </div>
                            </div>

                        </div>
                        : null


        )
    }
}

