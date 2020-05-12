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

export default class CollectionEditor extends BaseComponent {

    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Колекции",
                href: "collections"
            },
            {
                title: "Колекция",
            }
            ]
        );

        this.AddStructure = this.AddStructure.bind(this);
        this.AddContent = this.AddContent.bind(this);
        this.SetValue = this.SetValue.bind(this);
        this.DelRow = this.DelRow.bind(this);
        this.GetEditElement = this.GetEditElement.bind(this);
        this.Cancel = this.Cancel.bind(this);
        this.ClearContent = this.ClearContent.bind(this);
        this.Save = this.Save.bind(this);




        this.state = { mode: "loading", activeIndex: 0, lang: "bg" };

    }

    SetValue(arr, id, prop, isLang, value) {
        var data = this.state[arr];
        var el = data.find(x => x.id == id);
        if (isLang) {
            if (!el[prop])
                el[prop] = {};
            el[prop][this.state.lang] = value;
        }
        else
            el[prop] = value;

        this.setState({ [arr]: data });
    }

    DelRow(arr, id) {
        var data = this.state[arr];
        var el = data.find(x => x.id == id);
        data.splice(data.indexOf(el), 1);
        this.setState({ [arr]: data });
    }

    async LoadData() {
        var self = this;
        var sources = [];
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
        if (self.props.match.params.id)
            await Comm.Instance().get('part/GetCollection?collectionId=' + self.props.match.params.id)
                .then(result => {
                    self.setState({
                        structure: JSON.parse(result.data.structure),
                        content: JSON.parse(result.data.content),
                        name: result.data.name,
                        portalPartId: result.data.portalPartId,
                        mode: "edit"
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
        else
            self.setState({
                structure: [],
                content: [],
                name: '',
                mode: "edit"
            });



    }


    componentDidMount() {
        this.LoadData();
    }



    ClearContent() {

        var content = this.state.content;
        var structure = this.state.structure;
        content.forEach(x =>
            Object.keys(x).forEach(
                k => {
                    if (k !== "id" && !structure.find(c => c.id == k))
                        delete x[k];
                }
            )
        )

        return content;

    }

    Save() {
        var self = this;
        var content = this.ClearContent();
        var data = {
            CollectionId: self.props.match.params.id,
            Name: this.state.name,
            Structure: JSON.stringify(this.state.structure),
            Content: JSON.stringify(content),
            PortalPartId: self.state.portalPartId
        };
        Comm.Instance().post('part/SaveCollection', data)
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

    AddStructure() {
        var structure = this.state.structure;
        structure.push({
            id: uuidv4(),
            name: { en: '', bg: '' },
            type: 1
        });
        this.setState({ structure: structure });
    }

    AddContent() {
        var content = this.state.content;
        content = [{
            id: uuidv4()
        }].concat(content);
        this.setState({ content: content });
    }


    GetEditElement(structure, data) {
        var self = this;
        switch (parseInt(structure.type)) {
            case 1: return (<input type="text" className="form-control" value={data[structure.id] || ""} onChange={(e) => self.SetValue("content", data.id, structure.id, false, e.target.value)}></input>);
            case 2: return (<input type="text" className="form-control" value={data[structure.id] ? data[structure.id][self.state.lang] || "" : ""} onChange={(e) => self.SetValue("content", data.id, structure.id, true, e.target.value)}></input>);
            case 3: return (<Calendar dateFormat="dd.mm.yy" value={(data[structure.id] || "") === "" ? "" : moment(data[structure.id], "YYYY-MM-DD").toDate()}
                onChange={(e) => self.SetValue("content", data.id, structure.id, false, moment(e.value).format("YYYY-MM-DD"))}
                readOnlyInput="true" inputClassName="form-control"></Calendar>);
            case 4: return (<input type="text" className="form-control" readOnly="true" value={data[structure.id] || ""}


                onClick={() => self.UploadBlob((blobId) => self.SetValue("content", data.id, structure.id, false, blobId))}></input>)

            case 5: return (<input type="text" className="form-control" value={data[structure.id] || ""} onChange={(e) => self.SetValue("content", data.id, structure.id, false, e.target.value)}></input>);

            default: return null;
        }




    }

    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.Saved)
            return (
                <Redirect to={"/collections"}>
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
                        <div className="col-2">
                            <ToggleButton checked={self.state.lang === "bg"} onChange={(e) => this.setState({ lang: "bg" })} onLabel="БГ" offLabel="БГ"></ToggleButton>
                            <ToggleButton checked={self.state.lang === "en"} onChange={(e) => this.setState({ lang: "en" })} onLabel="EN" offLabel="EN"></ToggleButton>
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
                            <label className="control-label">Наименование</label>
                            <input type="text" className="form-control" value={self.state.name} onChange={(e) => self.setState({ name: e.target.value })}></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <TabView activeIndex={self.state.activeIndex}>
                                <TabPanel header="Структура">
                                    <div className="row">
                                        <div className="col-2 offset-10">
                                            <button className="btn btn-primary pull-right" onClick={self.AddStructure}>+</button>
                                        </div>
                                    </div>
                                    {
                                        self.state.structure.map(item =>
                                            <div className="row">
                                                <div className="col-4">
                                                    <label className="control-label">Наименование</label>
                                                    <input type="text" className="form-control" value={item.name[self.state.lang]} onChange={(e) => self.SetValue("structure", item.id, "name", true, e.target.value)}></input>
                                                </div>
                                                <div className="col-4">
                                                    <label className="control-label">Тип</label>
                                                    <select className="form-control" value={item.type} onChange={(e) => self.SetValue("structure", item.id, "type", false, e.target.value)}>
                                                        <option value="1">Текст</option>
                                                        <option value="2">Преводим текст</option>
                                                        <option value="3">Дата</option>
                                                        <option value="4">Документ</option>
                                                        <option value="5">Страница</option>
                                                    </select>
                                                </div>
                                                <div className="col-2">
                                                    <button className="btn btn-danger" onClick={() => self.DelRow("structure", item.id)}>-</button>
                                                </div>
                                            </div>
                                        )
                                    }

                                </TabPanel>
                                <TabPanel header="Записи">
                                    <div className="row">
                                        <div className="col-2 offset-10">
                                            <button className="btn btn-primary pull-right" onClick={self.AddContent}>+</button>
                                        </div>
                                    </div>
                                    {
                                        self.state.content.map(content =>
                                            <div className="row">
                                                {
                                                    self.state.structure.map(structure =>
                                                        <div className="col-2">
                                                            <label className="control-label">{structure.name[self.state.lang]}</label>
                                                            {self.GetEditElement(structure, content)}
                                                        </div>
                                                    )
                                                }
                                                <div className="col-2">
                                                    <button className="btn btn-danger" onClick={() => self.DelRow("content", content.id)}>-</button>
                                                </div>
                                            </div>

                                        )
                                    }
                                </TabPanel>
                            </TabView>
                        </div>
                    </div>
                </div>
        );
    }




}