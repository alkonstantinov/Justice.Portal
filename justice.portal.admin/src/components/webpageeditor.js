import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import Comm from '../modules/comm';
import Loader from 'react-loader-spinner';
import { TabView, TabPanel } from 'primereact/tabview';
import { toast } from 'react-toastify';
import eventClient from '../modules/eventclient';

export default class WebPageEditor extends BaseComponent {
    portalPartId;

    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Страници",
                href: "webpages"
            },
            {
                title: "Страница",
            }
            ]
        );
        this.Save = this.Save.bind(this);
        this.Cancel = this.Cancel.bind(this);
        this.ChangePage = this.ChangePage.bind(this);
        this.LoadData = this.LoadData.bind(this);
        this.DesignSources = this.DesignSources.bind(this);
        this.SetSourceValue = this.SetSourceValue.bind(this);

        this.state = { mode: "loading", activeIndex: 0, templateChanged: false };

    }

    async LoadData() {
        var self = this;
        var sources = [];
        await Comm.Instance().get('part/GetTemplate?templateId=' + self.props.match.params.id)
            .then(result => {
                self.setState({
                    template: result.data.templateJson
                });

                if (result.data.sources)
                    sources = JSON.parse(result.data.sources);
                self.portalPartId = result.data.portalPartId;
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права", {
                        onClose: this.Logout
                    });
                else
                    toast.error(error.message);

            });

        await Comm.Instance().get('part/GetBlocksPerPortalPart?portalPartId=' + self.portalPartId)
            .then(result => {
                self.blocks = result.data.data;
            })
            .catch(error => {
                if (error.response && error.response.status === 401)
                    toast.error("Липса на права", {
                        onClose: this.Logout
                    });
                else
                    toast.error(error.message);

            });



        self.setState({
            sources: self.DesignSources(sources),
            mode: "edit"
        });

    }


    DesignSources(sources) {
        //id
        //blocktype
        //value
        //options
        var self = this;
        var prevSources = this.state.sources;
        sources.forEach(element => {
            element.options = self.blocks[element.blocktype] || [];
            console.log(element);
            console.log(self.blocks[element.blocktype]);

            var prev = prevSources ? prevSources.find(x => x.id === element.id) : null;
            if (prev)
                element.value = prev.value;
        });
        return sources;

    }

    GetProp(content, propname) {
        return content.match("\\s+" + propname + "\\s*=\\s*('|\\\")([\\w\\W]+?)('|\\\")")[2]
    }

    GetSourcesFromTemplate() {
        let array = [...this.state.template.matchAll('<div[^<]*mjblocktypeid[^>]*?>')];
        let sources = [];
        array.forEach(
            x => {

                let blockId = this.GetProp(x[0], "id");
                let blockTypeId = this.GetProp(x[0], "mjblocktypeid");



                sources.push({
                    id: blockId,
                    blocktype: blockTypeId
                });
            });
        return sources;

    }



    componentDidMount() {
        this.LoadData();
    }




    Save() {
        var self = this;
        var sources = [];
        this.state.sources.forEach(x => sources.push({
            id: x.id,
            blocktype: x.blocktype,
            value: x.value
        }));
        var data = {
            TemplateId: self.props.match.params.id,
            templateJson: self.state.template,
            sources: JSON.stringify(sources)
        };
        Comm.Instance().post('part/SetTemplate', data)
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

    ChangePage(index) {
        var sources = this.state.sources;
        console.log("1", sources);
        if (index === 1 && this.state.templateChanged) {
            sources = this.GetSourcesFromTemplate();
            console.log("2", sources);
            sources = this.DesignSources(sources);
            console.log("3", sources);
        }
        this.setState({ activeIndex: index, sources: sources, templateChanged: false })
    }

    SetSourceValue(id, value) {
        var sources = this.state.sources;
        sources.find(x => x.id === id).value = value;
        this.setState({ sources: sources });
    }

    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.Saved)
            return (
                <Redirect to={"/webpages"}>
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
                            {
                                self.state.templateChanged ? null : <button className="btn btn-primary" onClick={self.Save}>Запис</button>
                            }

                        </div>
                        <div className="col-2">
                            <button className="btn btn-danger" onClick={self.Cancel}>Отказ</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <TabView
                                activeIndex={self.state.activeIndex}
                                onTabChange={e => self.ChangePage(e.index)}
                            >
                                <TabPanel header="Темплейт">
                                    <div className="row">
                                        <div className="col-12">
                                            <textarea className="form-control" rows="50" value={self.state.template}
                                                onChange={(e) => self.setState({ template: e.target.value, templateChanged: true })}></textarea>
                                        </div>
                                    </div>

                                </TabPanel>
                                <TabPanel header="Части в страницата">
                                    {self.state.sources.map(s =>

                                        <div className="row">
                                            <div className="col-11">
                                                {s.id}
                                            </div>
                                            <div className="col-11">
                                                <select className="form-control" value={s.value} onChange={(e) => self.SetSourceValue(s.id, e.target.value)}>
                                                    <option></option>
                                                    {
                                                        s.options.map(v => <option value={v.blockId}>{v.name}</option>)
                                                    }
                                                </select>

                                            </div>
                                        </div>

                                    )}

                                </TabPanel>
                            </TabView>
                        </div>
                    </div>
                </div>
        );
    }




}