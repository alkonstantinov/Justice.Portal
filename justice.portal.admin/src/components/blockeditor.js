import React from 'react';
import BaseComponent from './basecomponent';
import Comm from '../modules/comm';
import PropertyEditor from './propertyeditor';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import BlockNew from './blocknew';

export default class BlockEditor extends BaseComponent {
    constructor(props) {
        super(props);
        this.GetEditor = this.GetEditor.bind(this);
        this.GetNew = this.GetNew.bind(this);

        this.state = { mode: "loading" };

    }


    GetNew() {
        return (
            <BlockNew block={this.state.block} />
        );

    }


    GetEditor() {
        switch (this.props.match.params.blockTypeId) {
            case "new": return this.GetNew();
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
                    properties: result.data.properties,
                    values: result.data.value,
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

    render() {
        var self = this;
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
                        <div className="col-12">
                            <PropertyEditor properties={self.state.properties}></PropertyEditor>
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