import React from 'react';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';


export default class Users extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Потребители"
            }
            ]
        );
        this.LoadData = this.LoadData.bind(this);
        this.Edit = this.Edit.bind(this);
        this.CheckPart = this.CheckPart.bind(this);
        this.CheckRight = this.CheckRight.bind(this);
        this.Save = this.Save.bind(this);
        this.Delete = this.Delete.bind(this);
        this.CheckGroup = this.CheckGroup.bind(this);
        this.CheckRubric = this.CheckRubric.bind(this);

        this.state.mode = "loading";


    }

    TestPassword(pass) {

        return pass !== null &&
            pass.length >= 6 &&
            pass.match(/[A-ZА-Я]{1}/) &&
            pass.match(/[a-zа-я]{1}/) &&
            pass.match(/[0-9]{1}/) &&
            pass.match(/[_@!%()#*+\-./:=?$;^]{1}/)

    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });

        Comm.Instance().get('security/GetUsersForAdmin')
            .then(result => {
                self.setState({
                    users: result.data.users,
                    groups: result.data.groups,
                    parts: result.data.parts,
                    rights: result.data.rights,
                    rubrics: result.data.rubrics,

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
        this.LoadData();
    }


    Edit(obj) {
        if (!obj)
            obj = {
                portalUserId: null,
                name: "",
                userName: "",
                groups: [],
                parts: [],
                rights: [],
                rubrics: []
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
    CheckRubric(rubric, checked) {

        var obj = this.state.obj
        if (checked)
            obj.rubrics.push(rubric);
        else
            obj.rubrics = obj.rubrics.filter(x => x != rubric);
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
        if (!this.TestPassword(this.state.obj.password) && !this.state.obj.portalUserId) {
            toast.error("Паролата за вход трябва да съдържа минимум 6 символа, от които поне една малка буква, една главна буква и цифра.Разрешени специални символи са _ @ ! % ( ) # * + - . / : = ?$; ^");
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
        console.log("self.state.obj", self.state.obj);
        console.log("self.state.rights", self.state.rights);

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
                            <div className="col-12">
                                <button className="btn btn-primary pull-right" onClick={() => self.Edit(null)}>Нов</button>
                            </div>
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="10%"></th>
                                        <th width="45%">Потребителско име</th>
                                        <th width="45%">Име</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.users.map(obj =>
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
                                    <label className="control-label">Име</label>
                                    <input type="text" placeholder="Име" value={self.state.obj.name}
                                        className="form-control"
                                        onChange={(e) => { var obj = self.state.obj; obj.name = e.target.value; self.setState({ obj: obj }); }}></input>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label className="control-label">Потребителско име</label>
                                    <input type="text" placeholder="Потребителско име" value={self.state.obj.userName}
                                        className="form-control"
                                        onChange={(e) => { var obj = self.state.obj; obj.userName = e.target.value; self.setState({ obj: obj }); }}></input>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label className="control-label">Парола</label>
                                    <input type="password" value={self.state.obj.password}
                                        className="form-control"
                                        onChange={(e) => { var obj = self.state.obj; obj.password = e.target.value; self.setState({ obj: obj }); }}></input>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label className="control-label">Повтаряне на паролата</label>
                                    <input type="password" value={self.state.obj.rePassword}
                                        className="form-control"
                                        onChange={(e) => { var obj = self.state.obj; obj.rePassword = e.target.value; self.setState({ obj: obj }); }}></input>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                            checked={self.state.obj.active}
                                            onChange={(e) => { var obj = self.state.obj; obj.active = e.target.checked; self.setState({ obj: obj }); }}
                                        ></input>
                                        <label className="form-check-label">
                                            Активен
                                        </label>
                                    </div>
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
                                                            checked={self.state.obj.rights.indexOf(obj.userRightId) > -1}
                                                            onChange={(e) => self.CheckRight(obj.userRightId, e.target.checked)}
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
                                                            checked={self.state.obj.parts.indexOf(obj.portalPartId) > -1}
                                                            onChange={(e) => self.CheckPart(obj.portalPartId, e.target.checked)}


                                                        ></input>
                                                        <label className="form-check-label" for="defaultCheck1">
                                                            {obj.name}
                                                        </label>
                                                        <ul className="list-group">
                                                            {
                                                                self.state.rubrics.filter(x => x.portalPartId == obj.portalPartId).map(
                                                                    rub =>
                                                                        <li className="list-group-item">
                                                                            <div className="form-check">
                                                                                <input className="form-check-input" type="checkbox"
                                                                                    checked={self.state.obj.rubrics.indexOf(rub.rubricId) > -1}
                                                                                    onChange={(e) => self.CheckRubric(rub.rubricId, e.target.checked)}


                                                                                ></input>
                                                                                <label className="form-check-label">
                                                                                    {rub.titleBg}
                                                                                </label>
                                                                            </div>
                                                                        </li>


                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                </li>)
                                        }
                                    </ul>
                                </div>
                                <div className="col-4">
                                    <label className="control-label">Групи</label>
                                    <ul className="list-group">
                                        {
                                            self.state.groups.map(obj =>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox"
                                                            checked={self.state.obj.groups.indexOf(obj.portalGroupId) > -1}
                                                            onChange={(e) => self.CheckGroup(obj.portalGroupId, e.target.checked)}


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

