import React from 'react';
import BaseComponent from '../basecomponent';

export default class TB extends BaseComponent {


    render() {
        var self = this;
        return (

            <input type="text" value={self.props.getData(self.props.stateId)}
                onChange={(e) => self.props.setData(e.target.value, self.props.stateId)}
                className="form-control"></input>


        );
    }




}