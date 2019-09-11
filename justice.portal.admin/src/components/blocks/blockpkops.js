import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import eventClient from '../../modules/eventclient';
import TB from '../editors/tb';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';

export default class BlockPKOps extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Обществени поръчки",
                }
            ]
        );
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.fromDate = obj.fromDate || "";
            state.toDate = obj.toDate || "";
        }
        else {
            state.title = {};
            state.fromDate = "";
            state.toDate = "";
        }


        this.state = state;

    }



    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title || {},
            fromDate: this.state.fromDate,
            toDate: this.state.toDate
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
                    <div className="col-2">
                        <label className="control-label" htmlFor="Date">От дата</label>

                        <Calendar dateFormat="dd.mm.yy" value={(this.state.fromDate || "") === "" ? "" : moment(this.state.fromDate, "YYYY-MM-DD").toDate()}
                            onChange={(e) => this.setState({ fromDate: moment(e.value).format("YYYY-MM-DD") })}
                            readOnlyInput="true" inputClassName="form-control" monthNavigator={true} yearNavigator={true} yearRange="2000:2030"></Calendar>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-2">
                        <label className="control-label" htmlFor="Date">До дата</label>

                        <Calendar dateFormat="dd.mm.yy" value={(this.state.toDate || "") === "" ? "" : moment(this.state.toDate, "YYYY-MM-DD").toDate()}
                            onChange={(e) => this.setState({ toDate: moment(e.value).format("YYYY-MM-DD") })}
                            readOnlyInput="true" inputClassName="form-control" monthNavigator={true} yearNavigator={true} yearRange="2000:2030"></Calendar>
                    </div>
                </div>
            ]

        );
    }




}