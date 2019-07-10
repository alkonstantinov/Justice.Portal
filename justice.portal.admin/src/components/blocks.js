import React from 'react';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';


export default class Blocks extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Части"
            }
            ]
        );
        this.LoadData = this.LoadData.bind(this);
        this.Edit = this.Edit.bind(this);



    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });

        Comm.Instance().get('part/GetBlocks?portalPartId=' + self.state.portalPartId + "&blockTypeId=" + self.state.blockTypeId)
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
                    blockTypes: result.data.blockTypes,
                    blockTypeId: result.data.blockTypes[0].blockTypeId,
                    parts: result.data.parts,
                    portalPartId: result.data.parts[0].portalPartId
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


    Edit(obj) {
        if (!obj)
            obj = {
                portalUserId: null,
                name: "",
                userName: "",
                groups: [],
                parts: [],
                rights: []
            }
        obj.password = "";
        obj.rePassword = "";
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

    CheckGroup(group, checked) {

        var obj = this.state.obj
        if (checked)
            obj.groups.push(group);
        else
            obj.groups.splice(this.state.obj.groups.indexOf(group), 1);
        this.setState({ obj: obj });

    }

    async Save() {
        var self = this;
        if (this.state.obj.name === "") {
            toast.error("Моля, въведете име");
            return;
        }
        if (this.state.obj.userName === "") {
            toast.error("Моля, въведете потребителско име");
            return;
        }
        if (this.state.obj.password === "" && !this.state.obj.portalUserId) {
            toast.error("Моля, въведете парола");
            return;
        }
        if (this.state.obj.password !== this.state.obj.rePassword) {
            toast.error("Въведените пароли не съвпадат");
            return;
        }

        if (!this.state.obj.portalUserId) {
            var nameExists = false;
            await Comm.Instance().get('security/UserNameExists?username=' + self.state.obj.userName)
                .then(result => {
                    nameExists = result.data;
                })
                .catch(error => {
                    if (error.response && error.response.status === 401)
                        toast.error("Липса на права", {
                            onClose: this.Logout
                        });
                    else
                        toast.error(error.message);

                });

            if (nameExists) {
                toast.error("Името е вече използвано");
                return;
            }
        }


        Comm.Instance().post('security/SetUser', self.state.obj)
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
                    toast.error("Липса на права", {
                        onClose: this.Logout
                    });
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
                            <div className="col-3">
                                <select className="form-control" value={self.state.portalPartId} onChange={(e) => self.setState({ portalPartId: e.target.value }, () => self.LoadData())}>
                                    {
                                        self.state.parts.map(x => <option value={x.portalPartId}>{x.name}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <select className="form-control" value={self.state.blockTypeId} onChange={(e) => self.setState({ blockTypeId: e.target.value }, () => self.LoadData())}>
                                    {
                                        self.state.blockTypes.map(x => <option value={x.blockTypeId}>{x.name}</option>)
                                    }
                                </select>
                            </div>

                            <div className="col-3">
                                <button className="btn btn-primary pull-right" onClick={() => self.Edit(null)}>Нов</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="10%"></th>
                                        <th width="45%">Име</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.blocks.map(obj =>
                                                <tr>
                                                    <td>
                                                        {obj.canDel ?
                                                            <button className="btn btn-danger" onClick={() => self.Delete(obj)}><i className="far fa-trash-alt"></i></button>
                                                            : null
                                                        }
                                                        <button className="btn btn-info" onClick={() => self.Edit(obj)}><i class="fas fa-edit"></i></button>
                                                    </td>
                                                    <td>{obj.userName}</td>
                                                    <td>{obj.name}</td>

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

