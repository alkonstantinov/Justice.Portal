import React from 'react';
import BaseComponent from '../basecomponent';
import Comm from '../../modules/comm';
import { Dialog } from 'primereact/dialog';
import renderHTML from 'react-render-html';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Blocks from '../blocks';
import { toast } from 'react-toastify';
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
        this.PutNormLink = this.PutNormLink.bind(this);


        var data = this.props.data;

        console.log("initial data", data);

        this.state = {
            ShowSelectPageDialog: false,
            ShowHtml: false,
            htmlcode: false,
            Data: data,
            lang: this.props.lang
        };
    }

    componentDidMount() {
        var self = this;
        Comm.Instance().get('ciela/GetDocLIst')
            .then(result => {
                self.setState({
                    normDocs: result.data
                })
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права", {
                        onClose: this.Logout
                    });
                else
                    toast.error(error.message);

            });
    }



    InsertLinkToPage() {
        this.setState({ ShowSelectPageDialog: true });
    }

    ChoosePage(pageId, pageTitle) {

        this.editor.editing.view.focus();
        var selContent = this.GetSelectedText();
        if (selContent === "")
            selContent = "link";

        const content = '<a href="/home/index/' + pageId + '">' + selContent + '</a>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
        this.setState({ ShowSelectPageDialog: false });
    }

    PutNormLink() {
        var self = this;
        this.editor.editing.view.focus();
        var selContent = this.GetSelectedText();
        if (selContent === "")
            selContent = "link";

        var id = self.state.normId || self.state.normDocs.filter(x => x.name.toLowerCase().indexOf(self.state.normSS || "") > -1)[0].id;

        const content = '<a href="/home/normdoc/' + id + '">' + selContent + '</a>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
        this.setState({ ShowNormDialog: false });
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
        this.editor.editing.view.focus()
        var selContent = this.GetSelectedText();
        if (selContent === "")
            selContent = "link";

        const content = '<a href="' + Comm.url + "part/GetBlob?hash=" + id + '">' + selContent + '</a>';

        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.lang !== this.state.lang) {
            var data = this.state.Data;
            data[this.state.lang] = this.editor.getData();
            this.setState({ lang: nextProps.lang, Data: data });

        }
        return true;
    }



    ShowHtml() {
        this.setState({ ShowHtmlDialog: true, Html: this.editor.getData() });
    }

    SaveHtml() {
        this.editor.setData(this.state.Html);
        this.setState({ ShowHtmlDialog: false });
    }

    GetData() {
        var data = this.state.Data;
        data[this.state.lang] = this.editor.getData();
        return data;
    }



    render() {
        var self = this;
        return (
            <div>
                <button className="btn btn-light" onClick={() => self.UploadBlob(self.InsertImage)}>Изображение</button>
                <button className="btn btn-light" onClick={() => self.UploadBlob(self.InsertDocument)}>Документ</button>
                <button className="btn btn-light" onClick={() => self.InsertLinkToPage()}>Към страница</button>
                <button className="btn btn-light" onClick={() => self.ShowHtml()}>HTML</button>
                <button className="btn btn-light" onClick={() => self.setState({ ShowNormDialog: true })}>Нормативен документ</button>

                <Dialog header="Избор страница" visible={this.state.ShowSelectPageDialog} style={{ width: '50vw', height: '60vh', 'overflow-y': 'scroll' }} modal={true} onHide={() => { self.setState({ ShowSelectPageDialog: false }) }}>
                    <Blocks selectFunc={this.ChoosePage} mode="select"></Blocks>
                </Dialog>
                <Dialog header="HTML" visible={this.state.ShowHtmlDialog} style={{ width: '50vw' }} modal={true} onHide={() => { self.setState({ ShowHtmlDialog: false }) }}>
                    <textarea className="form-control" value={self.state.Html} onChange={(e) => self.setState({ Html: e.target.value })}></textarea>
                    <button className="btn btn-light pull-right" onClick={() => self.SaveHtml()}>Запис</button>
                </Dialog>
                <Dialog header="Връзка към правен документ" visible={this.state.ShowNormDialog} style={{ width: '50vw' }} modal={true} onHide={() => { self.setState({ ShowNormDialog: false }) }}>
                    <div className="row">
                        <div className="col-12">
                            <input type="text" className="form-control" value={self.state.normSS}
                                onChange={(e) => self.setState({ normSS: e.target.value })}></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <select className="form-control" value={self.state.normId} onChange={(e) => self.setState({ normId: e.target.value })}>
                                {
                                    self.state.normDocs ?
                                        self.state.normDocs.filter(x => x.name.toLowerCase().indexOf(self.state.normSS || "") > -1).map(x => <option value={x.id}>{x.name}</option>)
                                        : null
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-light pull-right" onClick={self.PutNormLink}>Запис</button>
                        </div>
                    </div>

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
                    data={self.state.Data[self.state.lang] || ""}
                    onInit={editor => {
                        self.editor = editor;
                    }}
                // onChange={(event, editor) => {
                //     const data = editor.getData();
                //     self.props.setData(data, self.props.stateId)

                // }}

                />


            </div>
        );
    }




}

