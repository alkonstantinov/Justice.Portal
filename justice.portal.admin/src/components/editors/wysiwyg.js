import React from 'react';
import BaseComponent from '../basecomponent';
import Comm from '../../modules/comm';
import { Dialog } from 'primereact/dialog';
import renderHTML from 'react-render-html';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Blocks from '../blocks';
//import ClassicEditor from '../../ckeditor/build/ckeditor';




export default class WYSIWYG extends BaseComponent {


    constructor(props) {
        super(props);
        this.InsertLinkToPage = this.InsertLinkToPage.bind(this);
        this.ChoosePage = this.ChoosePage.bind(this);
        this.InsertImage = this.InsertImage.bind(this);
        this.InsertDocument = this.InsertDocument.bind(this);
        this.GetSelectedText = this.GetSelectedText.bind(this);
        this.ShowHtml = this.ShowHtml.bind(this);

        var data = this.props.getData(this.props.stateId);

        this.state = {
            ShowSelectPageDialog: false,
            ShowHtml: false,
            htmlcode: false,
            Data: data
        };
    }



    InsertLinkToPage() {
        this.setState({ ShowSelectPageDialog: true });
    }

    ChoosePage(pageId, pageTitle) {


        var selContent = this.GetSelectedText();
        if (selContent === "")
            selContent = "link";

        const content = '<a href="/home/index/' + pageId + '">' + selContent + '</a>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
        this.setState({ ShowSelectPageDialog: false });
    }



    InsertImage(id) {



        const content = '<img alt="" src="' + Comm.url + "part/GetBlob?hash=" + id + '"/>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
    }


    GetSelectedText() {
        var text = "";
        var activeEl = document.activeElement;
        var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (
            (activeElTagName == "textarea") || (activeElTagName == "input" &&
                /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
            (typeof activeEl.selectionStart == "number")
        ) {
            text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        } else if (window.getSelection) {
            text = window.getSelection().toString();
        }
        return text;
    }

    InsertDocument(id) {

        var selContent = this.GetSelectedText();
        if (selContent === "")
            selContent = "link";

        const content = '<a href="' + Comm.url + "part/GetBlob?hash=" + id + '">' + selContent + '</a>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
    }

    shouldComponentUpdate(nextProps, nextState) {

        var propData = nextProps.getData(this.props.stateId)
        var updText = propData !== this.editor.getData();
        var updDialog = this.state.ShowSelectPageDialog !== nextProps.ShowSelectPageDialog;


        if (updText) this.editor.setData(propData);
        return updText || updDialog;
    }

    ShowHtml() {
        this.setState({ ShowHtmlDialog: true, Html: this.editor.getData() });
    }

    SaveHtml() {
        this.editor.setData(this.state.Html);
        this.setState({ ShowHtmlDialog: false });
    }



    render() {
        var self = this;
        return (
            <div>
                <button className="btn btn-light" onClick={() => self.UploadBlob(self.InsertImage)}>Изображение</button>
                <button className="btn btn-light" onClick={() => self.UploadBlob(self.InsertDocument)}>Документ</button>
                <button className="btn btn-light" onClick={() => self.InsertLinkToPage()}>Към страница</button>
                <button className="btn btn-light" onClick={() => self.ShowHtml()}>HTML</button>

                <Dialog header="Избор страница" visible={this.state.ShowSelectPageDialog} style={{ width: '50vw', height: '60vh', 'overflow-y': 'scroll' }} modal={true} onHide={() => { self.setState({ ShowSelectPageDialog: false }) }}>
                    <Blocks selectFunc={this.ChoosePage} mode="select"></Blocks>
                </Dialog>
                <Dialog header="HTML" visible={this.state.ShowHtmlDialog} style={{ width: '50vw' }} modal={true} onHide={() => { self.setState({ ShowHtmlDialog: false }) }}>
                    <textarea className="form-control" value={self.state.Html} onChange={(e) => self.setState({ Html: e.target.value })}></textarea>
                    <button className="btn btn-light pull-right" onClick={() => self.SaveHtml()}>Запис</button>
                </Dialog>


                <CKEditor
                    id="ckEditor"
                    config={{

                        toolbar: ['heading', '|', 'alignment', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'insertTable', 'undo',
                            'alignment',
                            'redo',
                            'imageStyle:full',
                            'imageStyle:side'
                        ]
                    }}
                    ref="CKEditor"
                    editor={ClassicEditor}
                    data={self.state.Data}
                    onInit={editor => {
                        self.editor = editor;
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        self.props.setData(data, self.props.stateId)

                    }}

                />


            </div>
        );
    }




}

