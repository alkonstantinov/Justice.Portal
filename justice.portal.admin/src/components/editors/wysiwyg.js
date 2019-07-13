import React from 'react';
import BaseComponent from '../basecomponent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ServerData from '../../data/serverdata.json';
import Comm from '../../modules/comm';
import { Dialog } from 'primereact/dialog';
import SelectPage from '../selectpage';
import renderHTML from 'react-render-html';


const Toolbar = ({ onClickLinkDoc, onClickLinkPage }) => (

    <div id="toolbar">
        <select className="ql-size"></select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <select className="ql-color"></select>
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>
        <button className="ql-image"></button>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button onClick={onClickLinkDoc}>Док</button>
        <button onClick={onClickLinkPage}>Стр</button>
    </div>
);




export default class WYSIWYG extends BaseComponent {

    modules = {
        toolbar:
        {
            container: '#toolbar',
            // container: [
            //     [{ 'header': '1' }, { 'header': '2' }],
            //     [{ size: [] }],
            //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            //     [{ 'list': 'ordered' }, { 'list': 'bullet' },
            //     { 'indent': '-1' }, { 'indent': '+1' }],
            //     ['link', 'image'],
            //     ['clean']
            // ],
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
        this.imageHandler = this.imageHandler.bind(this);
        this.ClickLinkDoc = this.ClickLinkDoc.bind(this);
        this.ChoosePage = this.ChoosePage.bind(this);

        this.state = {
            ShowSelectPageDialog: false
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

        const link = ServerData.url + "part/GetPage?pageId=" + pageId;


        var delta = {
            ops: [
                { insert: pageTitle, attributes: { link: link } }
            ]
        };
        this.refs["QL"].editor.updateContents(delta);
        this.setState({ ShowSelectPageDialog: false });
    }

    render() {
        var self = this;
        return (
            [
                <Toolbar onClickLinkDoc={this.ClickLinkDoc} onClickLinkPage={() => self.setState({ ShowSelectPageDialog: true })} />,
                <ReactQuill value={self.props.getData(self.props.stateId)}
                    onChange={(e) => self.props.setData(e, self.props.stateId)}
                    theme="snow"
                    modules={self.modules}
                    formats={self.formats}
                    ref="QL"

                />,
                <Dialog header="Избор страница" visible={self.state.ShowSelectPageDialog} style={{ width: '50vw' }} modal={true} onHide={() => { }}>
                    <SelectPage choosePage={self.ChoosePage}></SelectPage>
                </Dialog>,

                <textarea value={this.state.html} onChange={(e) => this.setState({ html: e.target.value })}></textarea>,
                <div>
                    {this.state.html ? renderHTML(this.state.html) : null}
                </div>



            ]

        );
    }




}