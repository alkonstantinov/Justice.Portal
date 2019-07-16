import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import Comm from '../modules/comm';
import PropertyEditor from './propertyeditor';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import BlockNew from './blocks/blocknew';
import BlockAd from './blocks/blockad';
import BlockText from './blocks/blocktext';
import BlockLive from './blocks/blocklive';
import eventClient from '../modules/eventclient';
import BlockBanner from './blocks/blockbanner';
import BlockBio from './blocks/blockbio';

export default class BlockEditor extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Части",
                href: "blocks"
            },
            {
                title: "Част",
            }
            ]
        );
        this.Save = this.Save.bind(this);
        this.GetEditor = this.GetEditor.bind(this);
        this.GetNew = this.GetNew.bind(this);
        this.GetAd = this.GetAd.bind(this);
        this.GetText = this.GetText.bind(this);
        this.GetBanner = this.GetBanner.bind(this);
        this.GetBio = this.GetBio.bind(this);
        this.Cancel = this.Cancel.bind(this);
                
        this.state = { mode: "loading" };

    }


    GetNew() {
        return (
            <BlockNew block={this.state.block} ref="Editor" />
        );

    }

    GetLive() {
        return (
            <BlockLive block={this.state.block} ref="Editor" />
        );

    }

    GetAd() {
        return (
            <BlockAd block={this.state.block} ref="Editor" />
        );

    }
    GetText() {
        return (
            <BlockText block={this.state.block} ref="Editor" />
        );

    }

    GetBanner() {
        return (
            <BlockBanner block={this.state.block} ref="Editor" />
        );

    }
    
    GetBio() {
        return (
            <BlockBio block={this.state.block} ref="Editor" />
        );

    }

    GetEditor() {
        switch (this.props.match.params.blockTypeId) {
            case "new": return this.GetNew();
            case "ad": return this.GetAd();
            case "text": return this.GetText();
            case "live": return this.GetLive();
            case "banner": return this.GetBanner();
            case "bio": return this.GetBio();
            default: return null;
        }
    }


    GetValues() {
        return this.state;
    }

    componentDidMount() {
        var self = this;
        Comm.Instance().get('part/GetBlockData?blockTypeId=' + self.props.match.params.blockTypeId + (self.props.match.params.blockId ? "&blockId=" + self.props.match.params.blockId : ""))
            .then(result => {
                self.setState({
                    Name: result.data.block ? result.data.block.name : "",
                    properties: result.data.properties,
                    values: result.data.values,
                    block: result.data.block,
                    mode: "edit"
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

    Save() {
        var ok = (this.state.Name || "") !== "";
        if (!ok) {
            toast.error("Моля, въведете название");
        }
        var val = this.refs["Props"].Validate();
        ok = ok && (val === null);
        if (val) {
            val.array.forEach(element => {
                toast.error(element);
            });
        }
        val = this.refs["Editor"].Validate();
        ok = ok && (val === null);
        if (val) {
            val.array.forEach(element => {
                toast.error(element);
            });
        }

        if (!ok)
            return;

        var partData = this.refs["Editor"].GetData();
        var propData = this.refs["Props"].GetValues();
        var propArray = [];
        Object.keys(propData).forEach(x => propArray.push(
            {
                PropertyId: x,
                Value: propData[x]
            }
        ));
        var data = {
            block: {
                BlockId: this.props.match.params.blockId,
                portalPartId: this.props.match.params.portalPartId,
                BlockTypeId: this.props.match.params.blockTypeId,
                Name: this.state.Name,
                Jsonvalues: JSON.stringify(partData)
            },
            Values: propArray
        };

        var self = this;
        Comm.Instance().post('part/SetBlock', data)
            .then(result => {
                self.setState({ Saved: true });
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

    Cancel(){
        this.setState({ Saved: true });
    }

    render() {
        var self = this;
        if(this.SM.IsSessionExpired()){
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.Saved)
            return (
                <Redirect to={"/blocks"}>
                </Redirect>
            );
        return (
            self.state.mode === "loading" ?
                <Loader
                    type="ThreeDots"
                    color="#00BFFF"

                    height="100"
                    width="100"
                />
                :
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-2">
                            <button className="btn btn-primary" onClick={self.Save}>Запис</button>
                        </div>
                        <div className="col-2">
                            <button className="btn btn-danger" onClick={self.Cancel}>Отказ</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <label className="control-label" htmlFor="Date">Заглавие</label>
                            <input type="text" className="form-control" value={this.state.Name} onChange={(e) => self.setState({ Name: e.target.value })}></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <PropertyEditor properties={self.state.properties} ref="Props" values={self.state.values}></PropertyEditor>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            {this.GetEditor()}
                        </div>
                    </div>
                </div>
        );
    }




}