import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import Comm from '../../modules/comm'
import WYSIWYG from '../editors/wysiwyg';
import TB from '../editors/tb';
import eventClient from '../../modules/eventclient';


export default class BlockHtml extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "HTML",
                }
            ]
        );
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.html = obj.html || {};
        }
        else {
            state.html = {};
        }


        this.state = state;

    }



    Validate() {
        return null;
    }

    GetData() {
        return {
            html: this.state.html
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
                        <label className="control-label">HTML</label>
                        <textarea className="form-control" rows="50" value={self.state.html[self.state.lang] || ""}
                            onChange={(e) => {
                                var html = this.state.html;
                                html[self.state.lang] = e.target.value;
                                self.setState({ html: html });


                            }}
                        >

                        </textarea>
                    </div>
                </div>

            ]

        );
    }




}