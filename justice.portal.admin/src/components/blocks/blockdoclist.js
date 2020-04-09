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
import eventClient from '../../modules/eventclient';
import { Dialog } from 'primereact/dialog';


export default class BlockDocList extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Списък документи",
                }
            ]
        );
        this.wysiwyg = React.createRef();
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.AddDoc = this.AddDoc.bind(this);
        this.SetDocTitle = this.SetDocTitle.bind(this);
        this.SetDocDate = this.SetDocDate.bind(this);
        this.UploadDoc = this.UploadDoc.bind(this);
        this.DeleteDoc = this.DeleteDoc.bind(this);
        this.ShowAddHtml = this.ShowAddHtml.bind(this);
        this.SaveHtml = this.SaveHtml.bind(this);
        var state = { lang: "bg", ShowHtmlDialog: false };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || obj.text || {};
            state.docs = obj.docs || [];
            state.docs = state.docs.sort((a, b) => a.date > b.date ? 1 : -1);
        }
        else {
            state.title = {};
            state.body = {};
            state.docs = [];
        }

        var yearsSet = new Set(state.docs.map(i => new Date(i.date).getFullYear()));
        //if (!yearsSet.has(new Date().getFullYear()))
        yearsSet.add(new Date().getFullYear());

        state.years = [...yearsSet];
        state.currentYear = state.years[0];
        state.currentMonth = 1;

        this.state = state;

    }


    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            body: this.wysiwyg.current.GetData(),
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
            date: this.FormatDate(new Date())
        }

        var docs = this.state.docs;
        docs = [newDoc].concat(docs);
        var years = this.state.years;
        var currentYear = new Date().getFullYear();
        if (!years.find(y => y == currentYear))
            years.push(currentYear);
        var month = new Date().getMonth() + 1;



        this.setState({
            docs: docs,
            years: years,
            currentYear: currentYear,
            currentMonth: month
        });
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

    ShowAddHtml(id) {
        var docs = this.state.docs;
        var el = docs.find(x => x.id === id);

        this.CurrentDocId = id;
        this.setState({
            ShowHtmlDialog: true,
            Html: el.html ? (el.html[this.state.lang] || "") : "",
            docs: docs
        });

    }



    SaveHtml() {
        var docs = this.state.docs;
        var el = docs.find(x => x.id === this.CurrentDocId);
        if (!el.html)
            el.html = {
                bg: "",
                en: ""
            };
        el.html[this.state.lang] = this.state.Html;
        this.setState({ ShowHtmlDialog: false, docs: docs });
        console.log("афтер сейв", docs);
    }

    render() {
        var self = this;
        var cy = self.state.docs.filter(x => new Date(x.date).getFullYear() === parseInt(self.state.currentYear) && new Date(x.date).getMonth() === parseInt(self.state.currentMonth) - 1);
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

                        <Dialog header="HTML" visible={this.state.ShowHtmlDialog} style={{ width: '50vw' }} modal={true} onHide={() => { self.setState({ ShowHtmlDialog: false }) }}>
                            <textarea className="form-control" value={self.state.Html} onChange={(e) => self.setState({ Html: e.target.value })}></textarea>
                            <button className="btn btn-light pull-right" onClick={() => self.SaveHtml()}>Запис</button>
                        </Dialog>
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
                        <button className="btn btn-light" onClick={self.AddDoc}>+</button>
                    </div>
                    <div className="col-2">
                        <select className="form-control" value={self.state.currentYear} onChange={(e) => self.setState({ currentYear: e.target.value })}>
                            {
                                self.state.years.map(item => <option value={item}>{item}</option>)
                            }

                        </select>
                    </div>
                    <div className="col-2">
                        <select className="form-control" value={self.state.currentMonth} onChange={(e) => self.setState({ currentMonth: e.target.value })}>
                            <option value="1">Януари</option>
                            <option value="2">Февруари</option>
                            <option value="3">Март</option>
                            <option value="4">Април</option>
                            <option value="5">Май</option>
                            <option value="6">Юни</option>
                            <option value="7">Юли</option>
                            <option value="8">Август</option>
                            <option value="9">Септември</option>
                            <option value="10">Октомври</option>
                            <option value="11">Ноември</option>
                            <option value="12">Декември</option>

                        </select>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        {
                            cy.map((i, no) =>
                                <div className="row" key={'r' + i.date}>
                                    <div className="col-3" key={'d1' + i.date}>
                                        <label className="control-label" htmlFor="Date" key={'l1' + i.date}>Заглавие</label>

                                        <input type="text" className="form-control" value={i.title[self.state.lang]} key={'i1' + i.date}
                                            onChange={(e) => self.SetDocTitle(i.id, e.target.value)}></input>
                                    </div>
                                    <div className="col-3" key={'d2' + i.date}>
                                        <label className="control-label" htmlFor="Date" key={'l2' + i.date}>Дата</label>

                                        <Calendar dateFormat="dd.mm.yy" value={moment(i.date, "YYYY-MM-DD").toDate()} key={'c2' + i.date}
                                            onChange={(e) => self.SetDocDate(i.id, moment(e.value).format("YYYY-MM-DD"))}
                                            readOnlyInput="true" inputClassName="form-control" baseZIndex="0" yearNavigator={true} yearRange="2010:2030"></Calendar>
                                    </div>
                                    <div className="col-4" key={'d3' + i.date}>
                                        {
                                            i.docId ? <a href={Comm.url + "part/getblob?hash=" + i.docId} target="_blank" key={'a3' + i.date}>документ</a> : null
                                        }
                                        <button className="btn btn-light" onClick={() => self.UploadBlob((docId) => self.UploadDoc(i.id, docId))} key={'b3' + i.date}>...</button>
                                    </div>
                                    <div className="col-1" key={'d4' + i.date}>
                                        <button className="btn btn-light" onClick={() => self.ShowAddHtml(i.id)}>html</button>
                                    </div>
                                    <div className="col-1" key={'d4' + i.date}>
                                        <button className="btn btn-light" onClick={() => self.DeleteDoc(i.id)} key={'b4' + i.date}>-</button>
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