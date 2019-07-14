import React from 'react';
import BaseComponent from '../basecomponent';
import ServerData from '../../data/serverdata.json';
import Comm from '../../modules/comm';
import { Dialog } from 'primereact/dialog';
import SelectPage from '../selectpage';
import renderHTML from 'react-render-html';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//import ClassicEditor from '../../ckeditor/build/ckeditor';




export default class WYSIWYG extends BaseComponent {


    constructor(props) {
        super(props);
        this.imageHandler = this.imageHandler.bind(this);
        this.ClickLinkDoc = this.ClickLinkDoc.bind(this);
        this.ChoosePage = this.ChoosePage.bind(this);
        this.Test = this.Test.bind(this);
        var data = this.props.getData(this.props.stateId);

        this.state = {
            ShowSelectPageDialog: false,
            Data: data
        };
    }

    async imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async function () {
            const file = input.files[0];

            var id = null;
            const data = new FormData();
            data.append('image', file, file.name);

            await Comm.Instance().post("part/AddBlob", data)
                .then(result => id = result.data);



            //await uploadFile(file); // I'm using react, so whatever upload function
            const range = this.quill.getSelection();
            const link = ServerData.url + "part/GetBlob?hash=" + id;

            // this part the image is inserted
            // by 'image' option below, you just have to put src(link) of img here. 
            this.quill.insertEmbed(range.index, 'image', link);
        }.bind(this); // react thing
    }


    ClickLinkDoc() {
        this.ShowDialog();
    }

    ChoosePage(pageId, pageTitle) {
        const range = this.refs["QL"].editor.getSelection();
        var index = range ? range.index : 0;

        const link = ServerData.url + "part/GetPage?pageId=" + pageId;
        this.refs["QL"].editor.clipboard.dangerouslyPasteHTML('raw html');
        this.setState({ ShowSelectPageDialog: false });
    }


    Test() {

        const content = 'A paragraph with <a href="https://ckeditor.com">some link</a>.</p>';
        const viewFragment = this.editor.data.processor.toView(content);
        const modelFragment = this.editor.data.toModel(viewFragment);

        this.editor.model.insertContent(modelFragment);
    }

    render() {
        var self = this;
        return (
            [

                <button className="btn btn-primary" onClick={self.Test}>xxxx</button>,
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
                        // You can store the "editor" and use when it is needed.
                        console.log('Editor is ready to use!', editor);
                        self.editor = editor;
                        console.log('names', Array.from( editor.ui.componentFactory.names() ) );
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

