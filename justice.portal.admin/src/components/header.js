import React from 'react';
import BaseComponent from './basecomponent';
import eventClient from '../modules/eventclient';
import { Link } from 'react-router-dom';
import Comm from '../modules/comm';
import UIContext from '../modules/context';

class Header extends BaseComponent {
    constructor(props) {
        super(props);
        this.Logout = this.Logout.bind(this);
        this.SetBreadcrump = this.SetBreadcrump.bind(this);
        this.AddBreadcrump = this.AddBreadcrump.bind(this);
        this.state = {
            breadcrumbs: [],
            logout: false

        };


    }

    SetBreadcrump(data) {
        this.setState({ breadcrumbs: data })
    }

    AddBreadcrump(data) {
        var bc = this.state.breadcrumbs;
        data.forEach(element => {
            bc.push(element);
        });
        this.setState({ breadcrumbs: bc });
    }


    componentWillMount() {
        eventClient.on('breadcrump', this.SetBreadcrump);
        eventClient.on('addbreadcrump', this.AddBreadcrump);
    }

    componentWillUnmount() {
        eventClient.removeEventListener('breadcrump', this.SetBreadcrump);
    }



    Logout() {
        UIContext.LastPortalPartId = null;
        UIContext.LastBlockTypeId = null;
        UIContext.LastRubricId = null;
        UIContext.SS = null;

        Comm.Instance().get('security/logout');
        this.SM.Logout();
        window.document.location.href = "/login";


    }

    render() {
        var self = this;
        var user = self.SM.GetSession();
        return (
            <header className="navbar">
                <div className="col-7">
                    {
                        user === null ? null :
                            self.state.breadcrumbs.map((obj, i) =>
                                <span key={i}>
                                    {
                                        obj.href !== undefined ?
                                            <Link to={'/' + obj.href} key={i}>
                                                {obj.title}
                                            </Link>
                                            :
                                            obj.title
                                    }
                                    &nbsp;



                                {i === self.state.breadcrumbs.length ? null : <i className="fas fa-chevron-right fa-xs"></i>}

                                </span>

                            )}
                </div>

                <div className="col-4 pull-right">
                    {
                        user === null ? null : user.name
                    }
                </div>
                <div className="col-1">
                    {
                        user === null ? null : <i className="fas fa-power-off" onClick={self.Logout}></i>
                    }


                </div>
            </header>
        )
    }
}

export default Header;