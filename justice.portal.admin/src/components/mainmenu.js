import React from 'react';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';


class MainMenu extends BaseComponent {
    constructor(props) {
        super(props);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало"
            }]
        )




    }






    render() {
        var self = this;

        if (this.SM.IsSessionExpired()) {
            this.Logout();
            return (<Redirect to="/login"></Redirect>)
        }

        var session = self.SM.GetSession();
        return (

            <div className="container mt-3">
                <div className="row">
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "adminusers") !== null ?
                                <Link className="btn btn-default fillSpace" to='/users'>
                                    <i className="fas fa-user"></i>
                                    <p>Потребители</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "adminusers") !== null ?
                                <Link className="btn btn-default fillSpace" to='/groups'>
                                    <i className="fas fa-users"></i>
                                    <p>Групи</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.parts.length !== 0 ?
                                <Link className="btn btn-default fillSpace" to='/changepassword'>
                                    <i className="fas fa-unlock"></i>
                                    <p>Смяна парола</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.parts.length !== 0 ?
                                <Link className="btn btn-default fillSpace" to='/blocks'>
                                    <i className="fas fa-th"></i>
                                    <p>Части</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "admintemplates") !== null ?
                                <Link className="btn btn-default fillSpace" to='/webpages'>
                                    <i className="far fa-file-alt"></i>
                                    <p>Страници</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "admincollections") !== null ?
                                <Link className="btn btn-default fillSpace" to='/collections'>
                                    <i className="fas fa-file-alt"></i>
                                    <p>Колекции</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "adminheaders") !== null ?
                                <Link className="btn btn-default fillSpace" to='/headers'>
                                    <i className="fas fa-file-alt"></i>
                                    <p>Заглавни части</p>
                                </Link>
                                : null
                        }


                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "admintranslations") !== null ?
                                <Link className="btn btn-default fillSpace" to='/translations'>
                                    <i className="fas fa-globe-europe"></i>
                                    <p>Преводи</p>
                                </Link>
                                : null
                        }


                    </div>



                </div>

            </div>

        )
    }
}

export default MainMenu;