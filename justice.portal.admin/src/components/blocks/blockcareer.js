import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import Comm from '../../modules/comm'
import uuidv4 from 'uuid/v4';
import WYSIWYG from '../editors/wysiwyg';
import TB from '../editors/tb';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { Dialog } from 'primereact/dialog';
import eventClient from '../../modules/eventclient';
import { toast } from 'react-toastify';


export default class BlockCareer extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Кариери",
                }
            ]
        );
        this.wysiwyg = React.createRef();
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.EditData = this.EditData.bind(this);
        this.SetData = this.SetData.bind(this);
        this.AddDoc = this.AddDoc.bind(this);
        this.DelDoc = this.DelDoc.bind(this);
        this.SetDocData = this.SetDocData.bind(this);
        this.DeleteData = this.DeleteData.bind(this);
        this.SaveData = this.SaveData.bind(this);
        this.UploadDoc = this.UploadDoc.bind(this);



        var state = {
            lang: "bg",
            showDialog: false
        };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || {};
            state.data = obj.data || [];
        }
        else {
            state.title = {};
            state.body = {};
            state.data = [];
        }


        this.state = state;

    }

    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            body: this.wysiwyg.current.GetData(),
            data: this.state.data
        };
    }

    EditData(id) {
        var rec;
        if (id) {
            rec = JSON.parse(JSON.stringify(this.state.data.find(x => x.id == id)));

        }
        else {
            rec = {
                id: null,
                type: {
                    bg: "",
                    en: ""
                },
                title: {
                    bg: '',
                    en: ''
                },
                body: {
                    bg: '',
                    en: ''
                },
                date: moment().format("YYYY-MM-DD"),
                canceled: false,
                docs: []
            }
        }


        this.setState({
            rec: rec,
            showDialog: true
        });


    }




    SaveData() {
        var self = this;
        var rec;
        var data = self.state.data;
        if (this.state.rec.id) {
            rec = data.find(x => x.id == self.state.rec.id);

        }
        else {
            rec = { id: uuidv4() };
            data.push(rec);
        }


        rec.type = JSON.parse(JSON.stringify(this.state.rec.type));;
        rec.title = JSON.parse(JSON.stringify(this.state.rec.title));
        rec.body = JSON.parse(JSON.stringify(this.state.rec.body));
        rec.docs = JSON.parse(JSON.stringify(this.state.rec.docs));
        rec.date = this.state.rec.date;
        rec.canceled = this.state.rec.canceled;
        this.setState({ data: data, showDialog: false });
    }




    DeleteData(id) {
        var data = this.state.data;
        var toDel = data.find(x => x.id === id);
        var i = data.indexOf(toDel);
        data.splice(i, 1);
        this.setState({
            data: data
        });
    }

    componentDidMount() {

    }

    SetData(property, value) {
        var rec = this.state.rec;
        if (property === "title" || property === "body" || property === "type")
            rec[property][this.state.lang] = value;
        else
            rec[property] = value;
        this.setState({ rec: rec });
    }

    AddDoc() {
        var rec = this.state.rec;
        rec.docs.push({
            id: uuidv4(),
            title: { bg: '', en: '' },
            link: null
        });
        this.setState({ rec: rec });
    }

    DelDoc(id) {
        var rec = this.state.rec;

        var toDel = rec.docs.find(x => x.id === id);
        var i = rec.docs.indexOf(toDel);
        rec.docs.splice(i, 1);
        this.setState({ rec: rec });
    }


    SetDocData(id, property, value) {
        var rec = this.state.rec;
        var doc = rec.docs.find(x => x.id == id);
        doc[property][this.state.lang] = value;

        this.setState({ rec: rec });
    }

    UploadDoc(id, docId) {
        var rec = this.state.rec;
        rec.docs.find(x => x.id === id).link = docId;
        this.setState({ rec: rec });
    }




    render() {
        var self = this;
        return (
            [
                <div className="row">
                    <div className="col-2">
                        <ToggleButton checked={self.state.lang === "bg"} onChange={(e) => this.setState({ lang: "bg" })} onLabel="БГ" offLabel="БГ"></ToggleButton>
                        <ToggleButton checked={self.state.lang === "en"} onChange={(e) => this.setState({ lang: "en" })} onLabel="EN" offLabel="EN"></ToggleButton>
                    </div>
                    <div className="col-10">
                        <label className="control-label">Заглавие</label>
                        <TB
                            getData={self.GetStateMLData}
                            setData={self.SetStateMLData}
                            stateId="title"
                        ></TB>

                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">

                        <WYSIWYG
                            lang={self.state.lang}
                            data={self.state.body}
                            ref={this.wysiwyg}
                        ></WYSIWYG>

                    </div>
                </div>,
                <div className="row">
                    <div className="col-2">
                        <button className="btn btn-light" onClick={() => self.EditData()}>+</button>
                    </div>
                    <div className="col-10">
                        {
                            self.state.rec ?
                                <Dialog header="Обявление" visible={this.state.showDialog} style={{ width: '75vw' }} modal={true} onHide={() => { self.setState({ showDialog: false }) }}>
                                    <div className="row">
                                        <div className="col-2">
                                            <label className="control-label">Тип</label>
                                            <input className="form-control" rows="5" value={self.state.rec.type[self.state.lang]} onChange={(e) => self.SetData("type", e.target.value)}></input>
                                        </div>
                                        <div className="col-5">
                                            <label className="control-label">Заглавие</label>
                                            <textarea className="form-control" rows="5" value={self.state.rec.title[self.state.lang]} onChange={(e) => self.SetData("title", e.target.value)}></textarea>
                                        </div>
                                        <div className="col-5">
                                            <label className="control-label">Текст</label>
                                            <textarea className="form-control" rows="5" value={self.state.rec.body[self.state.lang]} onChange={(e) => self.SetData("body", e.target.value)}></textarea>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox"
                                                    checked={self.state.rec.canceled}
                                                    onChange={(e) => self.SetData("canceled", e.target.checked)}></input>
                                                <label className="form-check-label">Прекратена</label>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <label className="control-label">Дата</label>
                                            <Calendar dateFormat="dd.mm.yy" value={moment(self.state.rec.date, "YYYY-MM-DD").toDate()}
                                                onChange={(e) => self.SetData("date", moment(e.value).format("YYYY-MM-DD"))}
                                                readOnlyInput="true" inputClassName="form-control"></Calendar>
                                        </div>
                                        <div className="col-6">
                                            <div className="row">
                                                <div className="col-12">
                                                    <button className="btn btn-light" onClick={self.AddDoc}>+</button>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    {
                                                        self.state.rec.docs.map(i =>
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <input className="form-control" value={i.title[self.state.lang]} onChange={(e) => self.SetDocData(i.id, "title", e.target.value)}></input>
                                                                </div>
                                                                <div className="col-4">
                                                                    {
                                                                        i.link ? <a href={Comm.url + "part/getblob?hash=" + i.link} target="_blank">документ</a> : null
                                                                    }
                                                                    <button className="btn btn-light" onClick={() => self.UploadBlob((docId) => self.UploadDoc(i.id, docId))} key={'b3' + i.date}>...</button>
                                                                </div>
                                                                <div className="col-4">
                                                                    <button className="btn btn-light" onClick={() => self.DelDoc(i.id)}>-</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-1">
                                            <button className="btn btn-light pull-right" onClick={() => self.SaveData()}>Запис</button>
                                        </div>
                                    </div>
                                </Dialog>
                                : null
                        }
                        {
                            self.state.data.map((i, no) =>
                                <div className="row" key={no}>
                                    <div className="col-3">
                                        {i.type[self.state.lang]}
                                    </div>
                                    <div className="col-7">
                                        {i.title[self.state.lang]}
                                    </div>
                                    <div className="col-2">
                                        <button className="btn btn-light" onClick={() => self.DeleteData(i.id)}>-</button>
                                        <button className="btn btn-light" onClick={() => self.EditData(i.id)}><i className="fas fa-edit"></i></button>
                                    </div>
                                </div>
                            )

                        }


                    </div>
                </div>

            ]

        );
    }




}