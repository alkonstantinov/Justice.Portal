import React from 'react';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Comm from '../modules/comm';
import { toast } from 'react-toastify';


class MainMenu extends BaseComponent {
    constructor(props) {
        super(props);
        this.Reindex = this.Reindex.bind(this);
        eventClient.emit(
            "breadcrump",
            [{
                title: "Начало"
            }]
        )




    }

    Reindex() {
        var self = this;
        Comm.Instance(true).get('search/Reindex')
            .then(result => {
                toast.info("Преиндексирането е приключило");
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

        var session = self.SM.GetSession();
        console.log("session.rights", session.rights.find(x => x === "adminusers"));

        return (

            <div className="container mt-3">
                <div className="row">
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "adminusers") ?
                                <Link className="btn btn-default fillSpace" to='/users'>
                                    <i className="fas fa-user"></i>
                                    <p>Потребители</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "adminusers") ?
                                <Link className="btn btn-default fillSpace" to='/groups'>
                                    <i className="fas fa-users"></i>
                                    <p>Групи</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">

                        <Link className="btn btn-default fillSpace" to='/changepassword'>
                            <i className="fas fa-unlock"></i>
                            <p>Смяна парола</p>
                        </Link>

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
                            session.rights.find(x => x === "admintemplates") ?
                                <Link className="btn btn-default fillSpace" to='/webpages'>
                                    <i className="far fa-file-alt"></i>
                                    <p>Страници</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "admincollections") ?
                                <Link className="btn btn-default fillSpace" to='/collections'>
                                    <i className="fas fa-file-alt"></i>
                                    <p>Колекции</p>
                                </Link>
                                : null
                        }
                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "adminheaders") ?
                                <Link className="btn btn-default fillSpace" to='/headers'>
                                    <i className="fas fa-file-alt"></i>
                                    <p>Заглавни части</p>
                                </Link>
                                : null
                        }


                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "admintranslations") ?
                                <Link className="btn btn-default fillSpace" to='/translations'>
                                    <i className="fas fa-globe-europe"></i>
                                    <p>Преводи</p>
                                </Link>
                                : null
                        }


                    </div>
                    <div className="col-3">
                        <Link className="btn btn-default fillSpace" to='/uploader'>
                            <i className="fas fa-globe-europe"></i>
                            <p>Електронни оригинали</p>
                        </Link>


                    </div>
                    <div className="col-3">
                        <span className="btn btn-default fillSpace" style={{ 'cursor': 'pointer' }} onClick={self.Reindex}>
                            <i className="fab fa-battle-net"></i>
                            <p>Преиндексиране</p>
                        </span>

                    </div>
                    <div className="col-3">
                        <Link className="btn btn-default fillSpace" to='/insidedocs'>
                            <i className="far fa-file-word"></i>
                            <p>Вътрешни документи</p>
                        </Link>


                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "audit") ?
                                <Link className="btn btn-default fillSpace" to='/audit'>
                                    <i className="fas fa-bug"></i>
                                    <p>Одит</p>
                                </Link>
                                : null
                        }


                    </div>
                    <div className="col-3">
                        {
                            session.rights.find(x => x === "rubricedit") ?
                                <Link className="btn btn-default fillSpace" to='/rubric'>
                                    <i className="fas fa-project-diagram"></i>
                                    <p>Рубрики</p>
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