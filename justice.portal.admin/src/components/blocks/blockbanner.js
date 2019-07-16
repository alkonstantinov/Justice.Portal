import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import ServerData from '../../data/serverdata.json';
import WYSIWYG from '../editors/wysiwyg';
import TB from '../editors/tb';

export default class BlockBanner extends BaseComponent {


    constructor(props) {
        super(props);
        this.AddImage = this.AddImage.bind(this);
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        var state = { lang: "bg" };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.body = obj.body || {};
            state.imageId = obj.imageId;
        }
        else {
            state.title = {};
            state.body = {};
            state.image = null;
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
            body: this.state.body,
            imageId: this.state.imageId
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
                            getData={self.GetStateMLData}
                            
                            setData={self.SetStateMLData}
                            stateId="body"
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
                        <img src={self.state.imageId ? ServerData.url + "part/GetBlob?hash=" + self.state.imageId : null} alt="" style={{'max-width':'300px'}}>

                        </img>
                    </div>
                </div>

            ]

        );
    }




}