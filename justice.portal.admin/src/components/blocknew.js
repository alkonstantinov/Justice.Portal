import React from 'react';
import BaseComponent from './basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';


export default class BlockNew extends BaseComponent {

    modules = {
        toolbar:
        {
            container: [
                [{ 'header': '1' }, { 'header': '2' }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: { "image": this.imageHandler }


        }

    };

    formats = [
        'header', 'color', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    constructor(props) {
        super(props);

        var state = { lang: "bg" };
        if (this.props.block) {
            state.title = this.props.block.title || {};
            state.body = this.props.block.body || {};
            state.image = this.props.block.image;
        }
        else {
            state.title = {};
            state.body = {};
            state.image = null;
        }


        this.state = state;

    }



    render() {
        var self = this;
        console.log("state", self.state.title[self.state.lang]);
        return (
            [
                <div className="row">
                    <div className="col-2">
                        <ToggleButton checked={self.state.lang === "bg"} onChange={(e) => this.setState({ lang: "bg" })} onLabel="БГ" offLabel="БГ"></ToggleButton>
                        <ToggleButton checked={self.state.lang === "en"} onChange={(e) => this.setState({ lang: "en" })} onLabel="EN" offLabel="EN"></ToggleButton>
                    </div>
                    <div className="col-10">
                        <label className="control-label">Заглавие</label>
                        <input type="text" placeholder="Заглавие" value={self.state.title[self.state.lang] || ""}
                            className="form-control"
                            onChange={(e) => { var obj = self.state.title; obj[this.state.lang] = e.target.value; self.setState({ title: obj }); }}></input>

                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">

                        <ReactQuill value={self.state.body[self.state.lang] || ""}
                            onChange={(e) => { var obj = self.state.body; obj[this.state.lang] = e; self.setState({ body: obj }); }}
                            theme="snow"
                            modules={self.modules}
                            formats={self.formats}
                            ref={this.qlEditor}

                        />

                    </div>
                </div>
            ]

        );
    }




}