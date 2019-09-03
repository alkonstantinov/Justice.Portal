import React from 'react';
import BaseComponent from './basecomponent';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
const notForExport = ["institutions", "headers"];
export default class PropertyEditor extends BaseComponent {
    constructor(props) {
        super(props);
        this.GetPropertyElement = this.GetPropertyElement.bind(this);
        this.GetCheck = this.GetCheck.bind(this);
        this.GetDate = this.GetDate.bind(this);
        this.GetInstitution = this.GetInstitution.bind(this);
        this.Validate = this.Validate.bind(this);


        this.InitializeState();

    }

    componentDidMount() {
        var self = this;
        Comm.Instance().get('part/GetHeaders')
            .then(result => {
                self.setState({
                    headers: result.data,
                    header: self.state.header || result.data[0].headerId
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

    InitializeState() {

        var state = {};
        if (this.props.values) {
            this.props.values.forEach(element => {
                state[element.propertyId] = element.value;
            });
        }
        this.state = state;

    }

    GetCheck(item) {
        return (

            <div className="form-check">
                <input className="form-check-input" type="checkbox"
                    checked={this.state[item.propertyId]}
                    onChange={(e) => this.setState({ [item.propertyId]: e.target.checked })}
                ></input>
                <label className="form-check-label" for="defaultCheck1">
                    {item.name}
                </label>
            </div>
        );
    }


    GetDate(item) {

        if ((this.state.date || "") === "")
            this.setState({ date: moment().format("YYYY-MM-DD") });

        return (

            [
                // <Calendar dateFormat="dd.mm.yy" onChange={(e) => this.setState({dddd:e.value}) }
                // readOnlyInput="true" inputClassName="form-control" value={this.state.dddd}></Calendar>,
                <label className="control-label" htmlFor="Date">{item.name}</label>,

                <Calendar dateFormat="dd.mm.yy" value={(this.state[item.propertyId] || "") === "" ? "" : moment(this.state[item.propertyId], "YYYY-MM-DD").toDate()}
                    onChange={(e) => this.setState({ [item.propertyId]: moment(e.value).format("YYYY-MM-DD") })}
                    readOnlyInput="true" inputClassName="form-control"></Calendar>
            ]

        );
    }

    GetInstitution(item) {
        var self = this;
        return (

            [
                // <Calendar dateFormat="dd.mm.yy" onChange={(e) => this.setState({dddd:e.value}) }
                // readOnlyInput="true" inputClassName="form-control" value={this.state.dddd}></Calendar>,
                <label className="control-label" htmlFor="Date">{item.name}</label>,
                <select className="form-control" value={this.state[item.propertyId]}
                    onChange={(e) => this.setState({ [item.propertyId]: e.target.value })}>
                    <option></option>
                    {
                        self.state.institutions ?
                            self.state.institutions.map(x => <option value={x.institutionId}>{x.name}</option>)
                            : null
                    }
                </select>
            ]

        );
    }

    GetHeader(item) {
        var self = this;

        return (

            [
                <label className="control-label" htmlFor="Date">{item.name}</label>,
                <select className="form-control" value={this.state[item.propertyId]}
                    onChange={(e) => this.setState({ [item.propertyId]: e.target.value })}>
                    {
                        self.state.headers ?
                            self.state.headers.map(x => <option value={x.headerId}>{x.title}</option>)
                            : null
                    }
                </select>
            ]

        );
    }


    GetPropertyElement(item) {
        switch (item.propertyType) {
            case "check": return this.GetCheck(item);
            case "date": return this.GetDate(item);
            case "institution": return this.GetInstitution(item);
            case "header": return this.GetHeader(item);
            default: return null;
        }
    }

    Validate() {
        return null;
    }


    GetValues() {
        var data = {};
        var self = this;
        Object.keys(this.state).forEach(x => {
            if (notForExport.indexOf(x) === -1)
                data[x] = self.state[x]
        });
        return data;
    }

    render() {
        var self = this;
        return (
            <div className="row">
                {self.props.properties.map((item, i) =>

                    <div className="col-4" key={i}>
                        {this.GetPropertyElement(item)}
                    </div>


                )}
            </div>
        )
    }




}