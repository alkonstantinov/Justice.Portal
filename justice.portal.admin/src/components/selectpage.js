import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';


export default class SelectPage extends BaseComponent {
    constructor(props) {
        super(props);
        this.LoadData = this.LoadData.bind(this);
        


    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });

        Comm.Instance().get('part/GetPagesForLinking')
            .then(result => {
                self.setState({
                    pages: result.data,
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
        this.LoadData();
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
                /> :
                self.state.mode === "list" ?
                    <div className="container mt-3">                        
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="100%">Име</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.pages.map(obj =>
                                                <tr>
                                                    <td><a href="#" onClick={()=>self.props.choosePage(obj.pageId, obj.title)}>{obj.title}</a></td>
                                                    

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

