import React from 'react';
import BaseComponent from '../basecomponent';
import ServerData from '../../data/serverdata.json';
import Comm from '../../modules/comm';
import { Dialog } from 'primereact/dialog';
import SelectPage from '../selectpage';
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

        var data = this.props.getData(this.props.stateId);

        this.state = {
            ShowSelectPageDialog: false,
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

        const content = '<a href="' + ServerData.url + "part/GetPage?pageId=" + pageId + '">' + selContent + '</a>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
        this.setState({ ShowSelectPageDialog: false });
    }



    InsertImage(id) {



        const content = '<img alt="" src="' + ServerData.url + "part/GetBlob?hash=" + id + '"/>';

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

        const content = '<a href="' + ServerData.url + "part/GetBlob?hash=" + id + '">' + selContent + '</a>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
    }

    shouldComponentUpdate(nextProps, nextState) {
        var propData = nextProps.getData(this.props.stateId)
        var upd = propData !== this.editor.getData();
        if (upd) this.editor.setData(propData);
        return upd;
    }

    render() {
        var self = this;
        return (
            [

                <button className="btn btn-light" onClick={() => self.UploadBlob(self.InsertImage)}>Изображение</button>,
                <button className="btn btn-light" onClick={() => self.UploadBlob(self.InsertDocument)}>Документ</button>,
                <button className="btn btn-light" onClick={() => self.InsertLinkToPage()}>Към страница</button>,

                <Dialog header="Избор страница" visible={self.state.ShowSelectPageDialog} style={{ width: '50vw' }} modal={true} onHide={() => { }}>
                    <SelectPage choosePage={self.ChoosePage}></SelectPage>
                </Dialog>,
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



            ]

        );
    }




}

