import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import eventClient from '../../modules/eventclient';
import TB from '../editors/tb';
import FileTable from '../editors/filetable';
import Comm from '../../modules/comm';
import { toast } from 'react-toastify';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';
import WYSIWYG from '../editors/wysiwyg';

export default class BlockPkOffer extends BaseComponent {


    constructor(props) {
        super(props);
        this.wysiwyg = React.createRef();
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Обява за събиране на оферти",
                }
            ]
        );
        this.wysiwyg = React.createRef();
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || {};
            state.files = obj.files || [];

            state.enddate = obj.enddate;

        }
        else {
            state.title = {};
            state.body = {};
            state.files = [];
        }


        this.state = state;

    }



    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title || {},
            files: this.state.files || [],
            body: this.wysiwyg.current.GetData(),
            enddate: this.state.enddate

        };
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
                    <div className="col-12">
                        <label className="control-label">Краен срок за подаване на оферти</label>
                        <Calendar dateFormat="dd.mm.yy" value={(this.state.enddate || "") === "" ? "" : moment(this.state.enddate, "YYYY-MM-DD").toDate()}
                            onChange={(e) => this.setState({ enddate: moment(e.value).format("YYYY-MM-DD") })}
                            readOnlyInput="true" inputClassName="form-control"></Calendar>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <FileTable
                            lang={self.state.lang}
                            setRows={self.SetSpecific}
                            files={self.state.files}
                        >

                        </FileTable>
                    </div>
                </div>

            ]

        );
    }




}