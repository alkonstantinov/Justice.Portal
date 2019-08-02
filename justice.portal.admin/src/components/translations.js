import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import uuidv4 from 'uuid/v4';


export default class Translations extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Преводи"
            }
            ]
        );


        this.Save = this.Save.bind(this);
        this.AddRow = this.AddRow.bind(this);
        this.DeleteRow = this.DeleteRow.bind(this);
        this.SetValue = this.SetValue.bind(this);
        this.state = { mode: "loading", saved: false };
    }


    componentDidMount() {
        var self = this;
        this.setState({ mode: "loading" });
        Comm.Instance().get('translate/GetTranslation')
            .then(result => {
                var rows = [];
                Object.keys(result.data.bg).forEach(x => {
                    rows.push({ key: x, bg: result.data.bg[x], en: "", id: uuidv4() })
                });
                Object.keys(result.data.en).forEach(x => {
                    var obj = rows.find(item => item.key === x);
                    if (!obj) {
                        obj = { key: x, bg: "" };
                        rows.push(obj);
                    }
                    obj.en = result.data.en[x];
                }
                );

                rows = rows.sort((a, b) => a.key < b.key ? -1 : 1);

                self.setState({ Rows: rows, mode: "edit" });


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
        var data = { bg: {}, en: {} };
        var self = this;
        this.state.Rows.forEach(x => {
            data.bg[x.key] = x.bg;
            data.en[x.key] = x.en;
        });

        data = { content: JSON.stringify(data) };
        Comm.Instance().post('translate/SetTranslation', data)
            .then(result => {
                self.setState({ saved: true });


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

    AddRow() {
        var rows = this.state.Rows;
        rows = [{ bg: "", en: "", key: uuidv4(), id: uuidv4() }].concat(rows);

        this.setState({ Rows: rows });
    }

    DeleteRow(id) {
        var rows = this.state.Rows;
        var row = rows.find(x => x.id === id);
        rows.splice(rows.indexOf(row), 1);
        this.setState({ Rows: rows });
    }

    SetValue(id, key, value) {
        var rows = this.state.Rows;
        var row = rows.find(x => x.id === id);
        row[key] = value;
        this.setState({ Rows: rows });
    }



    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.saved)
            return (
                <Redirect to={"/mainmenu/" + this.state.EditPageId}>
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
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-12 pull-right">
                            <button className="btn btn-light" onClick={self.AddRow}>+</button>
                            <button className="btn btn-primary" onClick={self.Save}>Запис</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-striped">
                                <thead>
                                    <th width="20%">Ключ</th>
                                    <th width="35%">БГ</th>
                                    <th width="45%">EN</th>
                                    <th width="10%"></th>
                                </thead>
                                <tbody>
                                    {
                                        self.state.Rows.map(obj =>
                                            <tr key={obj.id}>
                                                <td>
                                                    <input type="text" className="form-control" value={obj.key} onChange={(e) => self.SetValue(obj.id, "key", e.target.value)}></input>
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" value={obj.bg} onChange={(e) => self.SetValue(obj.id, "bg", e.target.value)}></input>
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" value={obj.en} onChange={(e) => self.SetValue(obj.id, "en", e.target.value)}></input>
                                                </td>
                                                <td>
                                                    <button className="btn btn-danger" onClick={() => self.DeleteRow(obj.id)}>X</button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

        )
    }
}

