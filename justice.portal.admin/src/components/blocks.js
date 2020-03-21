import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context'


export default class Blocks extends BaseComponent {
    constructor(props) {
        super(props);
        if (this.props.mode !== "select")
            eventClient.emit(
                "breadcrump",
                [{
                    title: "Начало",
                    href: ""
                },
                {
                    title: "Части"
                }
                ]
            );


        this.LoadData = this.LoadData.bind(this);
        this.EditBlock = this.EditBlock.bind(this);
        this.DeleteBlock = this.DeleteBlock.bind(this);




    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });

        if (this.props.mode !== "select") {
            UIContext.LastBlockTypeId = this.state.blockTypeId;
            UIContext.LastPortalPartId = this.state.portalPartId;
            UIContext.SS = this.state.ss;
        }


        Comm.Instance().get('part/GetBlocks?portalPartId=' + self.state.portalPartId + "&blockTypeId=" + self.state.blockTypeId + "&ss=" + (self.state.ss || ""))
            .then(result => {
                self.setState({
                    blocks: result.data,
                    mode: "list"
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
    componentDidMount() {
        var self = this;
        this.setState({ mode: "loading" });

        Comm.Instance().get('part/GetBlockRequisites')
            .then(result => {
                self.setState({
                    blockTypes: result.data.blockTypes,
                    blockTypeId: UIContext.LastBlockTypeId || result.data.blockTypes[0].blockTypeId,
                    parts: result.data.parts,
                    portalPartId: (UIContext.LastPortalPartId || result.data.parts[0].portalPartId),
                    ss: UIContext.SS
                }, () => self.LoadData());
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


    EditBlock(blockId, blockTypeId) {
        this.setState({
            EditBlockId: blockId,
            blockTypeId: blockTypeId,
            ShowEdit: true
        })
    }

    DeleteBlock(blockId) {
        if (!window.confirm("Моля, потвърдете"))
            return;
        var self = this;
        Comm.Instance().delete('part/DeleteBlock/' + blockId)
            .then(result => {
                self.LoadData();
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
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.ShowEdit)
            return (
                <Redirect to={"/editblock/" + this.state.blockTypeId + "/" + this.state.portalPartId + "/" + (this.state.EditBlockId || "")}>
                </Redirect>
            );


        return (
            self.state.mode === "loading" ?
                <Loader
                    type="ThreeDots"
                    color="#00BFFF"

                    height="100"
                    width="100"
                /> :
                self.state.mode === "list" ?
                    <div className="container mt-3">
                        <div className="row">
                            <div className="col-4">
                                <select className="form-control" value={self.state.portalPartId} onChange={(e) => self.setState({ portalPartId: e.target.value }, () => self.LoadData())}>
                                    {
                                        self.state.parts.map(x => <option value={x.portalPartId}>{x.name}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-4">
                                <select className="form-control" value={self.state.blockTypeId} onChange={(e) => self.setState({ blockTypeId: e.target.value }, () => self.LoadData())}>
                                    <option value="0"></option>
                                    {
                                        self.state.blockTypes.map(x => <option value={x.blockTypeId}>{x.name}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <input className="form-control" value={self.state.ss} onChange={(e) => self.setState({ ss: e.target.value })}></input>
                            </div>
                            <div className="col-1">
                                <button className="btn btn-primary pull-right" onClick={() => self.LoadData()}>Търси</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                {
                                    self.state.blockTypeId != "0" ?
                                        <button className="btn btn-primary pull-right" onClick={() => self.EditBlock(null, self.state.blockTypeId)}>Нов</button>
                                        : null
                                }

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="10%"></th>
                                        <th width="90%">Име</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.blocks.map(obj =>
                                                <tr>
                                                    <td>
                                                        {
                                                            self.props.mode === "select" ?
                                                                <button className="btn btn-light" onClick={() => self.props.selectFunc(obj.url, obj.name)}><i className="fas fa-check"></i></button>
                                                                :

                                                                [
                                                                    <button className="btn btn-danger" onClick={() => self.DeleteBlock(obj.blockId)}><i className="far fa-trash-alt"></i></button>,
                                                                    <button className="btn btn-light" onClick={() => self.EditBlock(obj.blockId, obj.blockTypeId)}><i className="fas fa-edit"></i></button>
                                                                ]
                                                        }
                                                    </td>
                                                    <td>{obj.name}</td>

                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    : null


        )
    }
}

