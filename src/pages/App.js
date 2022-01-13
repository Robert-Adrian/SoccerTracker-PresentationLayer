import React from 'react';
import '../styles/App.css';
import Login from '../pages/Login';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { User } from '../hooks/user.hook';
import ls from 'local-storage';
import '../styles/Main.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import PrimeReact from 'primereact/api';
import { verifyToken } from '../services/verifyToken.service';
import Home from '../pages/Home';
import Players from '../pages/Players';
import Profile from '../pages/Profile';
import History from '../pages/History';
import Analitics from '../pages/Analitics';
import Formation from '../pages/Formation';
import Schematics from './Schematics';
import Menu from '../components/Menu';
import Statistics from '../pages/Statistics';
import Administration from "./Administration";

PrimeReact.ripple = true;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authSucc: false,
        username: '',
        token: '',
        role_id:0,
        active_id:0
    };
    this.handleData = this.handleData.bind(this);
  }

  static contextType = User;

  componentDidMount() {
    window.onbeforeunload = function(e) {
        e.preventDefault();
    }
    console.log(this.context);
    this.setState({
        authSucc: ls.get('authSucc'),
          username: ls.get('username'),
          token: ls.get('token'),
        role_id: ls.get('role_id'),
        active_id: ls.get('active_id')
    });
  }

  handleData(value) {
    if (value.token != null && value.token != '') {
      this.setState({
        authSucc: true,
        username: value.username,
        token: value.token,
          role_id:value.role_id,
          active_id:value.active_id
      });
      ls.set('token', value.token);
      ls.set('username', value.username);
      ls.set('user_id', value.user_id);
      ls.set('role_id',value.role_id);
      ls.set('active_id',value.active_id);
      ls.set('authSucc', value.authSucc);
      ls.set('dataLoad', false);

    }
  }

  render() {

    return (
      <User.Provider value={this.state} >
        <Router>
          
        <Redirect to={this.state.authSucc ? "/home" : "/login"} />
        {this.state.authSucc ? <Menu /> : ""}

        <Switch>
            <Route exact path="/login">
                <Login customProp={this.handleData}/>
            </Route>
            <Route path="/administration">
                <Administration />
            </Route>
            <Route path="/home">
                <Home />
            </Route>
            <Route path="/profil">
                <Profile />
            </Route>
            <Route path="/player">
                <Players />
            </Route>
            <Route path="/formation">
                <Formation />
            </Route>
            <Route path="/drawboard">
                <Schematics />
            </Route>
            <Route path="/history">
                <History />
            </Route>
            <Route path="/analitics">
                <Analitics />
            </Route>
            <Route path="/statistics">
                <Statistics />
            </Route>
        </Switch>

    </Router>
  </User.Provider>
    );
  }
}


export default App;
