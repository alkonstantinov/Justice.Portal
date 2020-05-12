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
import BlockInfo from './blocks/blockinfo';
import BlockDocList from './blocks/blockdoclist';
import BlockMain from './blocks/blockmain';
import BlockBioCabinet from './blocks/blockbiocabinet';
import BlockBioMain from './blocks/blockbiomain';
import BlockNews from './blocks/blocknews';
import BlockAds from './blocks/blockads';
import BlockMenu from './blocks/blockmenu';
import BlockCollection from './blocks/blockcollection';
import BlockCiela from './blocks/blockciela';
import uuidv4 from 'uuid/v4';
import BlockBuyer from './blocks/blockbuyer';
import BlockAdsSq from './blocks/blockadssq';
import BlockNewsSq from './blocks/blocknewssq';
import BlockSearch from './blocks/blocksearch';
import BlockSitemap from './blocks/blocksitemap';
import BlockHtml from './blocks/blockhtml';
import BlockPkOp from './blocks/blockpkop';
import BlockPkOffer from './blocks/blockpkoffer';
import BlockPkMessage from './blocks/blockpkmessage';
import BlockPkConsult from './blocks/blockpkconsult';
import BlockPKConsults from './blocks/blockpkconsults';
import BlockPKMessages from './blocks/blockpkmessages';
import BlockPKOffers from './blocks/blockpkoffers';
import BlockPKOps from './blocks/blockpkops';
import BlockPK from './blocks/blockpk';
import BlockCareer from './blocks/blockcareer';
import BlockFeedback from './blocks/blockfeedback';

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
            }
                // ,
                // {
                //     title: "Част",
                // }
            ]
        );
        this.Save = this.Save.bind(this);
        this.GetEditor = this.GetEditor.bind(this);
        this.GetNew = this.GetNew.bind(this);
        this.GetAd = this.GetAd.bind(this);
        this.GetText = this.GetText.bind(this);
        this.GetBanner = this.GetBanner.bind(this);
        this.GetBio = this.GetBio.bind(this);
        this.GetInfo = this.GetInfo.bind(this);
        this.GetDocList = this.GetDocList.bind(this);
        this.GetCiela = this.GetCiela.bind(this);
        this.GetMain = this.GetMain.bind(this);
        this.Cancel = this.Cancel.bind(this);
        this.GetBioCabinet = this.GetBioCabinet.bind(this);
        this.GetBioMain = this.GetBioMain.bind(this);
        this.GetNews = this.GetNews.bind(this);
        this.GetAds = this.GetAds.bind(this);
        this.GetNewsSq = this.GetNewsSq.bind(this);
        this.GetAdsSq = this.GetAdsSq.bind(this);
        this.GetMenu = this.GetMenu.bind(this);
        this.GetCollection = this.GetCollection.bind(this);
        this.GetBuyer = this.GetBuyer.bind(this);
        this.GetSearch = this.GetSearch.bind(this);
        this.GetSitemap = this.GetSitemap.bind(this);
        this.GetHtml = this.GetHtml.bind(this);
        this.GetPkOp = this.GetPkOp.bind(this);
        this.GetPkOffer = this.GetPkOffer.bind(this);
        this.GetPkMessage = this.GetPkMessage.bind(this);
        this.GetPkConsult = this.GetPkConsult.bind(this);
        this.GetPkOps = this.GetPkOps.bind(this);
        this.GetPkOffers = this.GetPkOffers.bind(this);
        this.GetPkMessages = this.GetPkMessages.bind(this);
        this.GetPkConsults = this.GetPkConsults.bind(this);
        this.GetCareer = this.GetCareer.bind(this);
        this.GetFeedback = this.GetFeedback.bind(this);

        this.state = { mode: "loading" };

    }

    GetMenu() {
        return (<BlockMenu block={this.state.block} ref="Editor" />
        );

    }

    GetAds() {
        return (<BlockAds block={this.state.block} ref="Editor" />
        );

    }
    GetNews() {
        return (<BlockNews block={this.state.block} ref="Editor" />
        );

    }


    GetAdsSq() {
        return (<BlockAdsSq block={this.state.block} ref="Editor" />
        );

    }
    GetNewsSq() {
        return (<BlockNewsSq block={this.state.block} ref="Editor" />
        );

    }


    GetBioMain() {
        return (<BlockBioMain block={this.state.block} ref="Editor" />
        );

    }
    GetBioCabinet() {
        return (<BlockBioCabinet block={this.state.block} ref="Editor" />
        );

    }

    GetMain() {
        return (<BlockMain block={this.state.block} ref="Editor" />
        );

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

    GetInfo() {
        return (
            <BlockInfo block={this.state.block} ref="Editor" />
        );

    }

    GetDocList() {
        return (
            <BlockDocList block={this.state.block} ref="Editor" />
        );

    }

    GetCiela() {
        return (
            <BlockCiela block={this.state.block} ref="Editor" />
        );

    }

    GetBuyer() {
        return (
            <BlockBuyer block={this.state.block} ref="Editor" />
        );

    }


    GetCollection() {
        return (
            <BlockCollection block={this.state.block} ref="Editor" portalPartId={this.props.match.params.portalPartId} />
        );

    }

    GetSearch() {
        return (<BlockSearch block={this.state.block} ref="Editor" />
        );

    }

    GetSitemap() {
        return (<BlockSitemap block={this.state.block} ref="Editor" />
        );

    }

    GetHtml() {
        return (<BlockHtml block={this.state.block} ref="Editor" />
        );

    }

    GetPkOp() {
        return (<BlockPkOp block={this.state.block} ref="Editor" />
        );

    }

    GetPkOffer() {
        return (<BlockPkOffer block={this.state.block} ref="Editor" />
        );

    }
    GetPkMessage() {
        return (<BlockPkMessage block={this.state.block} ref="Editor" />
        );

    }
    GetPkConsult() {
        return (<BlockPkConsult block={this.state.block} ref="Editor" />
        );

    }


    GetPkOps() {
        return (<BlockPKOps block={this.state.block} ref="Editor" />
        );

    }
    GetPkOffers() {
        return (<BlockPKOffers block={this.state.block} ref="Editor" />
        );

    }
    GetPkMessages() {
        return (<BlockPKMessages block={this.state.block} ref="Editor" />
        );

    }
    GetPkConsults() {
        return (<BlockPKConsults block={this.state.block} ref="Editor" />
        );

    }
    GetPk() {
        return (<BlockPK block={this.state.block} ref="Editor" />
        );

    }

    GetCareer() {
        return (
            <BlockCareer block={this.state.block} ref="Editor" />
        );

    }

    GetFeedback() {
        return (
            <BlockFeedback block={this.state.block} ref="Editor" />
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
            case "info": return this.GetInfo();
            case "doclist": return this.GetDocList();
            case "ciela": return this.GetCiela();
            case "main": return this.GetMain();
            case "biocabinet": return this.GetBioCabinet();
            case "biomain": return this.GetBioMain();
            case "news": return this.GetNews();
            case "ads": return this.GetAds();
            case "newssq": return this.GetNewsSq();
            case "adssq": return this.GetAdsSq();
            case "menu": return this.GetMenu();
            case "collection": return this.GetCollection();
            case "buyer": return this.GetBuyer();
            case "search": return this.GetSearch();
            case "sitemap": return this.GetSitemap();
            case "html": return this.GetHtml();
            case "pkop": return this.GetPkOp();
            case "pkoffer": return this.GetPkOffer();
            case "pkmessage": return this.GetPkMessage();
            case "pkconsult": return this.GetPkConsult();
            case "pkops": return this.GetPkOps();
            case "pkoffers": return this.GetPkOffers();
            case "pkmessages": return this.GetPkMessages();
            case "pkconsults": return this.GetPkConsults();
            case "pk": return this.GetPk();
            case "career": return this.GetCareer();
            case "feedback": return this.GetFeedback();

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
                    Active: result.data.block ? result.data.block.isActive : true,
                    IsMain: result.data.block ? result.data.block.isMain : false,
                    properties: result.data.properties,
                    values: result.data.values,
                    block: result.data.block,
                    Url: result.data.block ? result.data.block.url : uuidv4(),
                    rubricId: result.data.block ? result.data.block.rubricId : result.data.rubrics.filter(x => x.portalPartId == self.props.match.params.portalPartId)[0].rubricId,
                    rubrics: result.data.rubrics,
                    CanBePage: result.data.canBePage,
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

    async Save() {
        var ok = (this.state.Name || "") !== "";
        if (!ok) {
            toast.error("Моля, въведете название");
        }
        if ((this.state.Url || "") === "") {
            ok = false;
            toast.error("Моля, въведете URL");
        }


        var urlExists = false;
        await Comm.Instance().get('part/UrlExists?url=' + this.state.Url + (this.props.match.params.blockId ? "&blockId=" + this.props.match.params.blockId : ""))
            .then(result => {
                urlExists = result.data;
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права", {
                        onClose: this.Logout
                    });
                else
                    toast.error(error.message);

            });
        if (urlExists) {
            toast.error("URL вече е използвано");
            ok = false;
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
                RubricId: this.state.rubricId,
                IsActive: this.state.Active,
                IsMain: this.state.IsMain,
                Url: this.state.Url,
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

    Cancel() {
        this.setState({ Saved: true });
    }

    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
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
                        <div className="col-8">
                            <label className="control-label" htmlFor="Date">Заглавие</label>
                            <input type="text" className="form-control" value={this.state.Name} onChange={(e) => self.setState({ Name: e.target.value })} maxLength="199"></input>
                        </div>
                        <div className="col-2">
                            <input className="form-check-input" type="checkbox"
                                checked={self.state.Active}
                                onChange={(e) => self.setState({ Active: e.target.checked })}
                            ></input>
                            <label className="form-check-label">
                                Активен
                                </label>
                        </div>
                        <div className="col-2">
                            <input className="form-check-input" type="checkbox"
                                checked={self.state.IsMain}
                                onChange={(e) => self.setState({ IsMain: e.target.checked })}
                            ></input>
                            <label className="form-check-label">
                                Главна страница
                                        </label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <label className="control-label">Рубрика</label>
                            <select className="form-control" value={self.state.rubricId} onChange={(e) => self.setState({ rubricId: e.target.value }, () => self.LoadData())}>
                                {
                                    self.state.rubrics.filter(x => x.portalPartId == self.props.match.params.portalPartId).map(x => <option value={x.rubricId}>{x.titleBg}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    {
                        self.state.CanBePage ?
                            <div className="row">
                                <div className="col-12">
                                    <label className="control-label" htmlFor="Date">URL</label>
                                    <input type="text" className="form-control" value={this.state.Url} onChange={(e) => self.setState({ Url: e.target.value })}></input>
                                </div>
                            </div>
                            : null
                    }
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