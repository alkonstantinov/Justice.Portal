import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseComponent from './components/basecomponent';
import Header from './components/header';
import eventClient from './modules/eventclient';
import MainMenu from './components/mainmenu';
import Comm from './modules/comm';
import Groups from './components/groups';
import Users from './components/users';
import Blocks from './components/blocks';
import BlockEditor from './components/blockeditor';
import WebPages from './components/webpages';
import WebPageEditor from './components/webpageeditor';
import ChangePassword from './components/changepassword';
import Collections from './components/collections';
import CollectionEditor from './components/collectioneditor';
import Headers from './components/headers';
import HeaderEditor from './components/headereditor';
import Translations from './components/translations';
import Uploader from './components/uploader';
import InsideDocs from './components/insidedocs';
import Audit from './components/audit';
import Rubric from './components/rubric';

class App extends BaseComponent {

  constructor(props) {
    super(props);


    //this.SM.Logout()


    this.LoginEvent = this.LoginEvent.bind(this);
    this.state = {
      dt: new Date().getMilliseconds()
    };
    var user = this.SM.GetSession();
    if (user) {
      Comm.Instance().defaults.headers.common['Authorization'] = user.token;

    }
  }



  LoginEvent(data) {
    this.setState({ user: this.SM.GetSession() });
  }

  componentWillMount() {
    eventClient.on('loginchange', this.LoginEvent);
    eventClient.on('language', this.Refresh);
  }

  componentWillUnmount() {
    eventClient.removeEventListener('loginchange', this.LoginEvent);
    eventClient.removeEventListener('language', this.Refresh);
  }



  render() {
    var self = this;


    return (

      <div className="container-fluid">
        <Header></Header>
        <ToastContainer position={toast.POSITION.TOP_LEFT} autoClose={2000} hideProgressBar={true} />

        <main>
          {
            self.SM.GetSession() === null ?
              <Login></Login>
              :
              <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/mainmenu' component={MainMenu} />
                <Route exact path='/groups' component={Groups} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/blocks' component={Blocks} />
                <Route exact path='/webpages' component={WebPages} />
                <Route exact path='/editblock/:blockTypeId/:portalPartId/:blockId?' component={BlockEditor} />
                <Route exact path='/editwebpage/:id?' component={WebPageEditor} />
                <Route exact path='/changepassword' component={ChangePassword} />
                <Route exact path='/collections' component={Collections} />
                <Route exact path='/editcollection/:id?' component={CollectionEditor} />
                <Route exact path='/headers' component={Headers} />
                <Route exact path='/translations' component={Translations} />
                <Route exact path='/editheader/:id?' component={HeaderEditor} />
                <Route exact path='/uploader' component={Uploader} />
                <Route exact path='/insidedocs' component={InsideDocs} />
                <Route exact path='/audit' component={Audit} />
                <Route exact path='/rubric' component={Rubric} />
                <Route component={MainMenu} />
              </Switch>
          }
        </main>





        {/* <footer className="navbar fixed-bottom">
          footer
        </footer> */}
      </div>


    );
  }
}

export default App;
