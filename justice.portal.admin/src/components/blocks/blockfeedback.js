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


export default class BlockFeedback extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Обратна връзка",
                }
            ]
        );
        this.wysiwyg = React.createRef();
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.AddData = this.AddData.bind(this);
        this.SetDataTitle = this.SetDataTitle.bind(this);
        this.SetDataMandatory = this.SetDataMandatory.bind(this);
        this.SetDataType = this.SetDataType.bind(this);

        this.DeleteData = this.DeleteData.bind(this);
        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || {};
            state.sendTo = obj.sendTo || "";
            state.datas = obj.datas || [];
        }
        else {
            state.title = {};
            state.body = {};
            state.sendTo = "";
            state.datas = [];
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
            datas: this.state.datas,
            sendTo: this.state.sendTo
        };
    }

    AddData() {
        var newData = {
            id: uuidv4(),
            title: {
                bg: '',
                en: ''
            },
            mandatory: false,
            type: 1
        }

        var datas = this.state.datas;
        datas.push(newData);


        this.setState({
            datas: datas
        });
    }

    SetDataMandatory(id, value) {
        var datas = this.state.datas;
        datas.find(x => x.id === id).mandatory = value;
        this.setState({ datas: datas });

    }

    SetDataType(id, value) {
        var datas = this.state.datas;
        datas.find(x => x.id === id).type = value;
        this.setState({ datas: datas });

    }

    SetDataTitle(id, value) {
        var datas = this.state.datas;
        datas.find(x => x.id === id).title[this.state.lang] = value;
        this.setState({ datas: datas });

    }

    DeleteData(id) {
        var datas = this.state.datas;
        var el = datas.find(x => x.id === id);
        var pos = datas.indexOf(el);
        datas.splice(pos, 1);
        this.setState({ datas: datas });
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
                    <div className="col-10">
                        <label className="control-label">Изпращане на</label>
                        <input type="text" className="form-control" value={self.state.sendTo}
                            onChange={(e) => self.setState({ sendTo: e.target.value })}></input>

                    </div>
                </div>,

                <div className="row">
                    <div className="col-2">
                        <button className="btn btn-light" onClick={self.AddData}>+</button>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        {
                            self.state.datas.map((i, no) =>
                                <div className="row">
                                    <div className="col-3">
                                        <label className="control-label">Заглавие</label>

                                        <input type="text" className="form-control" value={i.title[self.state.lang]}
                                            onChange={(e) => self.SetDataTitle(i.id, e.target.value)}></input>
                                    </div>
                                    <div className="col-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                checked={i.mandatory}
                                                onChange={(e) => self.SetDataMandatory(i.id, e.target.checked)}
                                            ></input>
                                            <label className="form-check-label">
                                                Задължителен
                                        </label>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <label className="control-label">Тип</label>
                                        <select className="form-control" value={i.type} onChange={(e) => self.SetDataType(i.id, e.target.value)}>
                                            <option value="1">Едноредов текст</option>
                                            <option value="2">Многоредов текст</option>
                                            <option value="3">Прикачен файл</option>
                                        </select>

                                    </div>
                                    <div className="col-1">

                                        <button className="btn btn-light" onClick={() => self.DeleteData(i.id)}>-</button>
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