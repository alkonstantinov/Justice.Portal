import React from 'react';
import BaseComponent from '../basecomponent';
import { ToggleButton } from 'primereact/togglebutton';
import Comm from '../../modules/comm';
import { toast } from 'react-toastify';
import eventClient from '../../modules/eventclient';
import TB from '../editors/tb';

export default class BlockCollection extends BaseComponent {


    constructor(props) {
        super(props);
        eventClient.emit(
            "addbreadcrump",
            [
                {
                    title: "Колекция",
                }
            ]
        );
        this.Validate = this.Validate.bind(this);
        this.GetData = this.GetData.bind(this);
        var state = { lang: "bg" };

        if (this.props.block) {
            var obj = JSON.parse(this.props.block.jsonvalues);
            state.title = obj.title || {};
            state.collectionId = obj.collectionId;
        }
        else {
            state.collectionId = null;
            state.title = {};
        }


        this.state = state;

    }



    Validate() {
        return null;
    }

    GetData() {
        return {
            title: this.state.title,
            collectionId: this.state.collectionId
        };
    }


    componentDidMount() {
        var self = this;
        Comm.Instance().get('part/GetCollections')
            .then(result => {
                self.setState({
                    collections: result.data,
                    collectionId: this.state.collectionId || (result.data.length > 0 ? result.data[0].collectionId : null)
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
                    <div className="col-12">
                        <label className="control-label">Колекция</label>
                        {
                            self.state.collections ?
                                <select className="form-control" value={self.state.collectionId} onChange={(e) => self.setState({ collectionId: e.target.value })}>
                                    {
                                        self.state.collections.map(item => <option value={item.collectionId}>{item.name}</option>)
                                    }
                                </select>
                                : null
                        }
                    </div>

                </div>
            ]

        );
    }




}