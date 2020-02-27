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


export default class BlockBuyer extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Профил на купувача",
                }
            ]
        );
        this.wysiwyg = React.createRef();
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.AddLink = this.AddLink.bind(this);
        this.SetLinkTitle = this.SetLinkTitle.bind(this);
        this.SetLink = this.SetLink.bind(this);
        this.DeleteLink = this.DeleteLink.bind(this);
        this.SetOrder = this.SetOrder.bind(this);


        var state = { lang: "bg" };
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

    AddLink() {
        var newDoc = {
            id: uuidv4(),
            order: 0,
            title: {
                bg: '',
                en: ''
            },
            link: ""
        }

        var links = this.state.links;
        links = [newDoc].concat(links);
        this.setState({ links: links });
    }

    SetLinkTitle(id, value) {
        var links = this.state.links;
        links.find(x => x.id === id).title[this.state.lang] = value;
        this.setState({ links: links });

    }
    SetLink(id, value) {
        var links = this.state.links;
        links.find(x => x.id === id).link = value;
        this.setState({ links: links });

    }

    SetOrder(id, value) {
        var links = this.state.links;
        value = parseInt(value || "0");
        links.find(x => x.id === id).order = value;


        this.setState({ links: links });

    }


    DeleteLink(id) {
        var links = this.state.links;
        var toDel = links.find(x => x.id === id);
        var i = links.indexOf(toDel);
        links.splice(i, 1);
        this.setState({ links: links });
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
                        <button className="btn btn-light" onClick={self.AddLink}>+</button>
                    </div>
                    <div className="col-10">
                        {
                            self.state.links.map((i, no) =>
                                <div className="row" key={no}>
                                    <div className="col-1">
                                        <label className="control-label" htmlFor="Date">No</label>
                                        <input type="number" min="0" className="form-control" value={i.order}
                                            onChange={(e) => self.SetOrder(i.id, e.target.value)}></input>
                                    </div>
                                    <div className="col-4">
                                        <label className="control-label" htmlFor="Date">Заглавие</label>

                                        <input type="text" className="form-control" value={i.title[self.state.lang]}
                                            onChange={(e) => self.SetLinkTitle(i.id, e.target.value)}></input>
                                    </div>
                                    <div className="col-6">
                                        <label className="control-label" htmlFor="Date">Връзка към правната система</label>
                                        <input type="text" className="form-control" value={i.link}
                                            onChange={(e) => self.SetLink(i.id, e.target.value)}></input>
                                    </div>
                                    <div className="col-1">
                                        <button className="btn btn-light" onClick={() => self.DeleteLink(i.id)}>-</button>
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