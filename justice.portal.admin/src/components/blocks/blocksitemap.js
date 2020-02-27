import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import eventClient from '../../modules/eventclient';
import WYSIWYG from '../editors/wysiwyg';
import TB from '../editors/tb';

export default class BlockSitemap extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Обявления",
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

        }
        else {
            state.title = {};
            state.body = {};

        }


        this.state = state;

    }



    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            body: this.wysiwyg.current.GetData()

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
                    </div><div className="col-10">
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
                </div>
            ]

        );
    }




}