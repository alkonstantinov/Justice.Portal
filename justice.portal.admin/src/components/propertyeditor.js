import React from 'react';
import BaseComponent from './basecomponent';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';

export default class PropertyEditor extends BaseComponent {
    constructor(props) {
        super(props);
        this.GetPropertyElement = this.GetPropertyElement.bind(this);
        this.GetCheck = this.GetCheck.bind(this);
        this.GetDate = this.GetDate.bind(this);
        this.Validate = this.Validate.bind(this);


        this.InitializeState();

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
        return (

            [
                // <Calendar dateFormat="dd.mm.yy" onChange={(e) => this.setState({dddd:e.value}) }
                // readOnlyInput="true" inputClassName="form-control" value={this.state.dddd}></Calendar>,
                <label className="control-label" htmlFor="Date">{item.name}</label>,

                <Calendar dateFormat="dd.mm.yy" value={(this.state[item.propertyId] || "")===""?"":moment(this.state[item.propertyId],"YYYY-MM-DD").toDate()} 
                onChange={(e) => this.setState({ [item.propertyId]: moment(e.value).format("YYYY-MM-DD") })}
                    readOnlyInput="true" inputClassName="form-control"></Calendar>
            ]

        );
    }


    GetPropertyElement(item) {
        switch (item.propertyType) {
            case "check": return this.GetCheck(item);
            case "date": return this.GetDate(item);
            default: return null;
        }
    }

    Validate() {
        return null;
    }


    GetValues() {
        return this.state;
    }

    render() {
        var self = this;
        return (
            <div className="row">
                {self.props.properties.map((item, i) =>

                    <div className="col-4">
                        {this.GetPropertyElement(item)}
                    </div>


                )}
            </div>
        )
    }




}