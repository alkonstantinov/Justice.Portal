import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import ServerData from '../../data/serverdata.json';
import uuidv4 from 'uuid/v4';
import WYSIWYG from '../editors/wysiwyg';
import TB from '../editors/tb';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';

export default class BlockDocList extends BaseComponent {


    constructor(props) {
        super(props);
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.AddDoc = this.AddDoc.bind(this);
        this.SetDocTitle = this.SetDocTitle.bind(this);
        this.SetDocDate = this.SetDocDate.bind(this);
        this.UploadDoc = this.UploadDoc.bind(this);
        this.DeleteDoc = this.DeleteDoc.bind(this);

        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || {};
            state.docs = obj.docs || [];
            state.docs = state.docs.sort((a, b) => a.date > b.date ? 1 : -1);
        }
        else {
            state.title = {};
            state.body = {};
            state.docs = [];
        }


        this.state = state;

    }


    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            body: this.state.body,
            docs: this.state.docs
        };
    }

    AddDoc() {
        var newDoc = {
            id: uuidv4(),
            title: {
                bg: '',
                en: ''
            },
            docId: null,
            date: new Date()
        }

        var docs = this.state.docs;
        docs = [newDoc].concat(docs);
        this.setState({ docs: docs });
    }

    SetDocTitle(id, value) {
        var docs = this.state.docs;
        docs.find(x => x.id === id).title[this.state.lang] = value;
        this.setState({ docs: docs });

    }
    SetDocDate(id, value) {
        var docs = this.state.docs;
        docs.find(x => x.id === id).date = value;
        this.setState({ docs: docs });

    }

    UploadDoc(id, docId) {
        var docs = this.state.docs;
        docs.find(x => x.id === id).docId = docId;
        this.setState({ docs: docs });
    }

    DeleteDoc(id) {
        var docs = this.state.docs;
        var toDel = docs.find(x => x.id === id);
        var i = docs.indexOf(toDel);
        docs.splice(i, 1);
        this.setState({ docs: docs });
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
                            getData={self.GetStateMLData}

                            setData={self.SetStateMLData}
                            stateId="body"
                        ></WYSIWYG>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-2">
                        <button className="btn btn-light" onClick={self.AddDoc}>+</button>
                    </div>
                    <div className="col-10">
                        {
                            self.state.docs.map((i, no) =>
                                <div className="row" key={no}>
                                    <div className="col-3">
                                        <label className="control-label" htmlFor="Date">Заглавие</label>

                                        <input type="text" className="form-control" value={i.title[self.state.lang]}
                                            onChange={(e) => self.SetDocTitle(i.id, e.target.value)}></input>
                                    </div>
                                    <div className="col-3">
                                        <label className="control-label" htmlFor="Date">Дата</label>

                                        <Calendar dateFormat="dd.mm.yy" value={moment(i.date, "YYYY-MM-DD").toDate()}
                                            onChange={(e) => self.SetDocDate(i.id, moment(e.value).format("YYYY-MM-DD"))}
                                            readOnlyInput="true" inputClassName="form-control" baseZIndex="0"></Calendar>
                                    </div>
                                    <div className="col-4">
                                        {
                                            i.docId ? <a href={ServerData.url + "part/getblob?hash=" + i.docId} target="_blank">документ</a> : null
                                        }
                                        <button className="btn btn-light" onClick={() => self.UploadBlob((docId) => self.UploadDoc(i.id, docId))}>...</button>
                                    </div>
                                    <div className="col-2">
                                        <button className="btn btn-light" onClick={() => self.DeleteDoc(i.id)}>-</button>
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