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

class App extends BaseComponent {

  constructor(props) {
    super(props);
    this.LoginEvent = this.LoginEvent.bind(this);
    this.state = {
      dt: new Date().getMilliseconds()
    };
    var user =this.SM.GetSession();
    if(user){
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
        <ToastContainer position={toast.POSITION.TOP_LEFT} autoClose={2000} hideProgressBar={true}/>

        <main>
          {
            self.SM.GetSession() === null ?
              <Login></Login>
              :
              <Switch>
                <Route exact path='/mainmenu' component={MainMenu} />
                <Route exact path='/groups' component={Groups} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/blocks' component={Blocks} />
                <Route exact path='/editblock/:blockTypeId/:portalPartId/:blockId?' component={BlockEditor} />
                
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
