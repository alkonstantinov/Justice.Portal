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



export default class BlockPkOp extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Обществена поръчка",
                }
            ]
        );
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.PBName = obj.PBName || {};
            state.Subject = obj.Subject || {};
            state.files = obj.files || [];

            state.AOPNum = obj.AOPNum;
            state.ElNum = obj.ElNum;
            state.proctype = obj.proctype || {};
            state.procobject = obj.procobject || {};
            state.procstatus = obj.procstatus || {};
            state.novatprognosis = obj.novatprognosis;
            state.cpv = obj.cpv;
            state.teritorry = obj.teritorry;
            state.novat = obj.novat;
            state.enddate = new Date(obj.enddate);
            state.business = obj.business || {};

        }
        else {
            state.title = {};
            state.PBName = {};
            state.Subject = {};
            state.files = [];
            state.proctype = {};
            state.procobject = {};
            state.procstatus = {};
            state.business = {};
        }


        this.state = state;

    }


    async componentDidMount() {
        // var self = this;
        // var pts = []
        // await Comm.Instance().get('part/GetPKLabels?group=pt')
        //     .then(result => {
        //         pts = result.data;
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.status === 401)
        //             toast.error("Липса на права", {
        //                 onClose: this.Logout
        //             });
        //         else
        //             toast.error(error.message);

        //     });

        // var objs = []
        // await Comm.Instance().get('part/GetPKLabels?group=obj')
        //     .then(result => {
        //         objs = result.data;
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.status === 401)
        //             toast.error("Липса на права", {
        //                 onClose: this.Logout
        //             });
        //         else
        //             toast.error(error.message);

        //     });

        // var stas = []
        // await Comm.Instance().get('part/GetPKLabels?group=sta')
        //     .then(result => {
        //         stas = result.data;
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.status === 401)
        //             toast.error("Липса на права", {
        //                 onClose: this.Logout
        //             });
        //         else
        //             toast.error(error.message);

        //     });

        // var nuts = []
        // await Comm.Instance().get('part/GetPKLabels?group=nuts')
        //     .then(result => {
        //         nuts = result.data;
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.status === 401)
        //             toast.error("Липса на права", {
        //                 onClose: this.Logout
        //             });
        //         else
        //             toast.error(error.message);

        //     });

        // var bus = [];
        // await Comm.Instance().get('part/GetPKLabels?group=bus')
        //     .then(result => {
        //         bus = result.data;
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.status === 401)
        //             toast.error("Липса на права", {
        //                 onClose: this.Logout
        //             });
        //         else
        //             toast.error(error.message);

        //     });

        // this.setState({
        //     pts: pts,
        //     objs: objs,
        //     stas: stas,
        //     nuts: nuts,
        //     bus: bus
        // });
    }

    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title || {},
            files: this.state.files || [],
            PBName: this.state.PBName,
            AOPNum: this.state.AOPNum,
            ElNum: this.state.ElNum,
            proctype: this.state.proctype,
            procobject: this.state.procobject,
            Subject: this.state.Subject,
            procstatus: this.state.procstatus,
            novatprognosis: this.state.novatprognosis,
            cpv: this.state.cpv,
            teritorry: this.state.teritorry,
            novat: this.state.novat,
            enddate: this.state.enddate,
            business: this.state.business

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
                        <label className="control-label">Име</label>
                        <TB
                            getData={self.GetStateMLData}
                            setData={self.SetStateMLData}
                            stateId="PBName"
                        ></TB>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">AOP Номер</label>
                        <input type="text" className="form-control" value={this.state.AOPNum || ""} onChange={(e) => self.setState({ AOPNum: e.target.value })}></input>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Номер на електронна преписка</label>
                        <input type="text" className="form-control" value={this.state.ElNum || ""} onChange={(e) => self.setState({ ElNum: e.target.value })}></input>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Вид процедура</label>
                        <TB
                            getData={self.GetStateMLData}
                            setData={self.SetStateMLData}
                            stateId="proctype"
                        ></TB>

                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Обект на поръчка</label>
                        <TB
                            getData={self.GetStateMLData}
                            setData={self.SetStateMLData}
                            stateId="procobject"
                        ></TB>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Предмет</label>
                        <TB
                            getData={self.GetStateMLData}
                            setData={self.SetStateMLData}
                            stateId="Subject"
                        ></TB>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Статус на поръчка</label>
                        <TB
                            getData={self.GetStateMLData}
                            setData={self.SetStateMLData}
                            stateId="procstatus"
                        ></TB>

                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Прогнозна стойност без ДДС</label>
                        <input type="number" className="form-control" value={this.state.novatprognosis || "0"} onChange={(e) => self.setState({ novatprognosis: e.target.value })}></input>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">CPV кодове</label>
                        <input type="number" className="form-control" value={this.state.cpv || ""} onChange={(e) => self.setState({ cpv: e.target.value })}></input>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Териториален код</label>
                        <input type="number" className="form-control" value={this.state.teritorry || ""} onChange={(e) => self.setState({ teritorry: e.target.value })}></input>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Стойност без ДДС</label>
                        <input type="number" className="form-control" value={this.state.novat || "0"} onChange={(e) => self.setState({ novat: e.target.value })}></input>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Краен срок за подаване на оферти</label>
                        <Calendar showTime={true} hourFormat="24" dateFormat="dd.mm.yy" value={(this.state.enddate || "") === "" ? "" : this.state.enddate}
                            onChange={(e) => {
                                this.setState({ enddate: e.value });

                            }
                            }
                            readOnlyInput="true" inputClassName="form-control"></Calendar>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Бизнес отрасъл</label>
                        <TB
                            getData={self.GetStateMLData}
                            setData={self.SetStateMLData}
                            stateId="business"
                        ></TB>
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