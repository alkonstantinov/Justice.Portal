import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import TB from '../editors/tb';
import uuidv4 from 'uuid/v4';
import { Dialog } from 'primereact/dialog';
import SelectPage from '../selectpage';
import ServerData from '../../data/serverdata.json';

export default class BlockMenu extends BaseComponent {


    constructor(props) {
        super(props);
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        this.ChoosePage = this.ChoosePage.bind(this);
        this.AddItem = this.AddItem.bind(this);
        this.DeleteItem = this.DeleteItem.bind(this);
        this.SetArrayValue = this.SetArrayValue.bind(this);
        this.SetUrl = this.SetUrl.bind(this);
        var state = { lang: "bg", ShowSelectPageDialog: false };
        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.elements = obj.elements || [];
        }
        else {
            state.title = {};
            state.elements = [];
        }


        this.state = state;

    }



    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            elements: this.state.elements
        };
    }

    AddItem() {
        var elements = this.state.elements;
        elements.push({
            id: uuidv4(),
            column: 1,
            text: { bg: "", en: "" },
            url: "",
            urlCaption: ""
        });
        this.setState({ elements: elements });
    }

    DeleteItem(id) {
        var elements = this.state.elements;
        var i = elements.indexOf(elements.find(x => x.id === id));
        elements.splice(i, 1);
        this.setState({ elements: elements });
    }

    SetArrayValue(id, prop, isLang, value) {
        var elements = this.state.elements;
        var element = elements.find(x => x.id === id);
        if (isLang)
            element[prop][this.state.lang] = value;
        else
            element[prop] = value;
        this.setState({ elements: elements });
    }


    ChoosePage(id) {
        this.currentId = id;
        this.setState({ ShowSelectPageDialog: true });
    }

    SetUrl(pageId, pageTitle) {
        const content = ServerData.url + "part/GetPage?pageId=" + pageId;
        var elements = this.state.elements;
        var element = elements.find(x => x.id === this.currentId);
        element.url = content;
        element.urlCaption = pageTitle;
        this.setState({ elements: elements, ShowSelectPageDialog: false });
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
                    <div className="col-2">
                        <button className="btn btn-light" onClick={self.AddItem}>+</button>
                    </div>
                    <div className="col-10">
                        {
                            self.state.elements.map((x,i) =>
                                <div className="row" key={i}>
                                    <div className="col-2">
                                        <label className="control-label">Колона</label>
                                        <select className="form-control" value={x.column} onChange={(e) => self.SetArrayValue(x.id, "column", false, e.target.value)}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        <label className="control-label">Текст</label>
                                        <input type="text" className="form-control" value={x.text[self.state.lang]} onChange={(e) => self.SetArrayValue(x.id, "text", true, e.target.value)}></input>
                                    </div>
                                    <div className="col-5">
                                        <label className="control-label">Цел</label>
                                        <input type="text" className="form-control" value={x.urlCaption} readOnly="true" onClick={() => self.ChoosePage(x.id)}></input>
                                    </div>
                                    <div className="col-1">
                                        <button className="btn btn-light" onClick={()=>self.DeleteItem(x.id)}>-</button>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                    <Dialog header="Избор страница" visible={self.state.ShowSelectPageDialog} style={{ width: '50vw' }} modal={true} onHide={() => { }}>
                        <SelectPage choosePage={self.SetUrl}></SelectPage>
                    </Dialog>
                </div>
            ]

        );
    }




}