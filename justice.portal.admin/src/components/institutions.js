import React from 'react';
import { Redirect } from 'react-router-dom';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import Loader from 'react-loader-spinner';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';
import UIContext from '../modules/context'


export default class Institutions extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало",
                href: ""
            },
            {
                title: "Институция"
            }
            ]
        );


        this.LoadData = this.LoadData.bind(this);
        this.EditInstitution = this.EditInstitution.bind(this);



    }

    LoadData() {
        var self = this;
        this.setState({ mode: "loading" });



        Comm.Instance().get('part/GetInstitutions')
            .then(result => {
                self.setState({
                    institutions: result.data,
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
        self.LoadData();

    }


    EditInstitution(institutionId) {
        this.setState({
            EditInstitutionId: institutionId,
            ShowEdit: true
        })
    }




    render() {
        var self = this;
        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }
        if (self.state.ShowEdit)
            return (
                <Redirect to={"/editinstitution/" + (this.state.EditInstitutionId || "")}>
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
                            <div className="col-12">
                                <table className="table table-striped">
                                    <thead>
                                        <th width="10%"></th>
                                        <th width="90%">Име</th>
                                    </thead>
                                    <tbody>
                                        {
                                            self.state.institutions.map(obj =>
                                                <tr>
                                                    <td>
                                                        <button className="btn btn-light" onClick={() => self.EditInstitution(obj.institutionId)}><i className="fas fa-edit"></i></button>

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

