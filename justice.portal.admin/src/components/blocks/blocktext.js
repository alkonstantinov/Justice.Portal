import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import Comm from '../../modules/comm'
import WYSIWYG from '../editors/wysiwyg';
import TB from '../editors/tb';
import eventClient from '../../modules/eventclient';

export default class BlockText extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Свободен текст",
                }
            ]
        );
        this.wysiwyg = React.createRef();
        this.AddImage = this.AddImage.bind(this);
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || {};
            state.imageId = obj.imageId;
            state.others = obj.others || "";
        }
        else {
            state.title = {};
            state.body = {};
            state.image = null;
            state.others = "";
        }


        this.state = state;

    }


    AddImage(id) {
        this.setState({ imageId: id });
    }

    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            body: this.wysiwyg.current.GetData(),
            imageId: this.state.imageId,
            others: this.state.others
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
                    <div className="col-2">
                        <button className="btn btn-success" onClick={() => self.UploadBlob(self.AddImage)}>Изображение</button>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-danger" onClick={() => self.setState({ imageId: null })}>Изчистване</button>
                    </div>
                    <div className="col-8">
                        <img src={self.state.imageId ? Comm.url + "part/GetBlob?hash=" + self.state.imageId : null} alt="" style={{ 'max-width': '300px' }}>

                        </img>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        <label className="control-label">Други(HTML)</label>
                        <textarea className="form-control" value={self.state.others} onChange={(e) => self.setState({ others: e.target.value })} rows="10"></textarea>
                    </div>
                </div>

            ]

        );
    }




}