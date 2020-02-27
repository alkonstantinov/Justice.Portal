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


export default class BlockCiela extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Връзка със Сиела",
                }
            ]
        );
        this.wysiwyg = React.createRef();
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.EditLink = this.EditLink.bind(this);
        this.SetLinkTitle = this.SetLinkTitle.bind(this);
        this.SetLink = this.SetLink.bind(this);
        this.DeleteLink = this.DeleteLink.bind(this);
        this.SetOrder = this.SetOrder.bind(this);
        this.SaveLink = this.SaveLink.bind(this);


        var state = {
            lang: "bg",
            showDialog: false
        };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || {};
            state.links = obj.links || [];
            state.links = state.links.sort((a, b) => a.order - b.order);
        }
        else {
            state.title = {};
            state.body = {};
            state.links = [];
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
            links: this.state.links
        };
    }

    EditLink(id) {
        var rec;
        if (id) {
            rec = JSON.parse(JSON.stringify(this.state.links.find(x => x.id == id)));

        }
        else {
            rec = {
                id: null,
                order: 0,
                title: {
                    bg: '',
                    en: ''
                },
                link: this.state.docs[0].id
            }
        }

        console.log(this.state.links);

        this.setState({
            rec: rec,
            showDialog: true
        });


    }

    SaveLink() {
        var self = this;
        var rec;
        var links = self.state.links;
        if (this.state.rec.id) {
            rec = links.find(x => x.id == self.state.rec.id);

        }
        else {
            rec = { id: uuidv4() };
            links.push(rec);
        }
        rec.order = this.state.rec.order;
        rec.title = JSON.parse(JSON.stringify(this.state.rec.title));
        rec.link = this.state.rec.link;
        links = links.sort((a, b) => a.order - b.order);
        this.setState({ links: links, showDialog: false });
    }

    SetLinkTitle(value) {
        var rec = this.state.rec;
        rec.title[this.state.lang] = value;
        this.setState({ rec: rec });

    }
    SetLink(value) {
        var rec = this.state.rec;
        rec.link = value;
        this.setState({ rec: rec });

    }

    SetOrder(value) {
        var rec = this.state.rec;
        rec.order = value;
        this.setState({ rec: rec });

    }

    DeleteLink(id) {
        var links = this.state.links;
        var toDel = links.find(x => x.id === id);
        var i = links.indexOf(toDel);
        links.splice(i, 1);
        this.setState({
            links: links
        });
    }

    componentDidMount() {
        var self = this;
        Comm.Instance().get('ciela/GetDocLIst')
            .then(result => {
                self.setState({
                    docs: result.data
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
                        <button className="btn btn-light" onClick={() => self.EditLink()}>+</button>
                    </div>
                    <div className="col-10">
                        {
                            self.state.rec ?
                                <Dialog header="Нормативен акт" visible={this.state.showDialog} style={{ width: '75vw' }} modal={true} onHide={() => { self.setState({ showDialog: false }) }}>
                                    <div className="row">
                                        <div className="col-1">
                                            <label className="control-label" htmlFor="Date">No</label>
                                            <input type="number" min="0" className="form-control" value={self.state.rec.order}
                                                onChange={(e) => self.SetOrder(e.target.value)}></input>
                                        </div>
                                        <div className="col-4">
                                            <label className="control-label" htmlFor="Date">Заглавие</label>

                                            <input type="text" className="form-control" value={self.state.rec.title[self.state.lang]}
                                                onChange={(e) => self.SetLinkTitle(e.target.value)}></input>
                                        </div>
                                        <div className="col-6">
                                            <label className="control-label" htmlFor="Date">Връзка към правната система</label>

                                            <select className="form-control" value={self.state.rec.link}
                                                onChange={(e) => self.SetLink(e.target.value)}>
                                                {

                                                    (this.state.docs || []).map(x => <option value={x.id}>{x.name}</option>)
                                                }


                                            </select>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-1">
                                            <button className="btn btn-light pull-right" onClick={() => self.SaveLink()}>Запис</button>
                                        </div>
                                    </div>
                                </Dialog>
                                : null
                        }
                        {
                            self.state.links.map((i, no) =>
                                <div className="row" key={no}>
                                    <div className="col-1">
                                        {i.order}
                                    </div>
                                    <div className="col-4">
                                        {i.title[self.state.lang]}
                                    </div>
                                    <div className="col-6">
                                        {
                                            this.state.docs ?
                                                this.state.docs.find(x => x.id === parseInt(i.link)).name
                                                : null
                                        }

                                    </div>
                                    <div className="col-1">
                                        <button className="btn btn-light" onClick={() => self.DeleteLink(i.id)}>-</button>
                                        <button className="btn btn-light" onClick={() => self.EditLink(i.id)}><i className="fas fa-edit"></i></button>
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