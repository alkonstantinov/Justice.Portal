import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import TB from '../editors/tb';
import eventClient from '../../modules/eventclient';
import Comm from '../../modules/comm';

export default class BlockLive extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Емисия",
                }
            ]
        );
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.AddImage = this.AddImage.bind(this);


        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.url = obj.url;
            state.imageId = obj.imageId;
        }
        else {
            state.title = {};
            state.url = "";
            state.imageId = null;
        }


        this.state = state;

    }



    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            url: this.state.url,
            imageId: this.state.imageId
        };
    }

    AddImage(id) {
        this.setState({ imageId: id });
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
                        <label className="control-label">Линк към живото предаване</label>
                        <input type="url" className="form-control" value={self.state.url} onChange={(e) => self.setState({ url: e.target.value })}></input>
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
                </div>
            ]

        );
    }




}