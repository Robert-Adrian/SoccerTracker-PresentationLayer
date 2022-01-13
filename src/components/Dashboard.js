import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import logo from '../img/logo.svg';
import '../styles/Dashboard.css';
import ls from 'local-storage';
import Home from '../pages/Home';
import Players from '../pages/Players';
import Profile from '../pages/Profile';
import History from '../pages/History';
import Analitics from '../pages/Analitics';
import Settings from '../pages/Settings';
import Formation from '../pages/Formation';
import {Button} from 'primereact/button';
import 'primeflex/primeflex.css';
import Administration from "../pages/Administration";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef(null);
        this.state = {
            countClick: 0,
            countSubClick: 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.hoverMenu = this.hoverMenu.bind(this);
        this.subHoverMenu = this.subHoverMenu.bind(this);
    }

    componentDidMount() {


    }

    handleClick(e) {
        ls.set('token', '');
        ls.set('username', '');
        ls.set('authSucc', false);
        ls.set('dataLoad', false);
        window.location.reload();
    }

    hoverMenu() {
        let menuPhone = document.getElementById('menu-phone');
        let subMenu = document.getElementById('sub-menu-scales');
        if (this.state.countClick === 0) {
            menuPhone.animate([
                {left: '-100%'},
                {left: '0'}
            ], {
                duration: 1000,
                easing: 'ease-in-out',
                fill: 'forwards'

            });
            this.setState({
                countClick: 1
            });
        } else if (this.state.countClick === 1) {
            menuPhone.animate([
                {left: '0'},
                {left: '-100%'}
            ], {
                duration: 1000,
                easing: 'ease-in-out',
                fill: 'backwards'

            });
            menuPhone.animate([
                {left: '0'},
                {left: '-100%'}
            ], {
                duration: 1000,
                easing: 'ease-in-out',
                fill: 'forwards'

            });
            this.setState({
                countClick: 0
            });

            if (subMenu.checked == true)
                subMenu.checked = false;

        }


    }

    subHoverMenu() {
        let subMenuLarge = document.getElementById('sub-menu-scales-large');
        let menuPhone = document.getElementById('menu-phone');
        let subMenu = document.getElementById('sub-menu-scales');

        menuPhone.animate([
            {left: '0'},
            {left: '-100%'}
        ], {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'backwards'

        });
        menuPhone.animate([
            {left: '0'},
            {left: '-100%'}
        ], {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'

        });
        this.setState({
            countClick: 0
        });


        if (subMenu.checked === true)
            subMenu.checked = false;
        if (subMenuLarge.checked === true)
            subMenuLarge.checked = false;

    }


    render() {
        return (
            <Router>

                <div className="Dashboard">
                    <ul id="dashboard-up" className="up-dashboard">
                        <li>
                            <img src={logo}/>
                        </li>
                        <li>
                            <h2>SoccerTracker</h2>
                        </li>
                        <li>
                            <Link onClick={this.subHoverMenu} to="/profile"><i
                                className="fas fa-user-circle profile-icon"></i></Link>
                            {/* <Link onClick={this.subHoverMenu} to="/settings"><i className="fas fa-cog settings-icon"></i></Link> */}
                            <Button className="logOut" onClick={this.handleClick}><i
                                className="fas fa-sign-out-alt"></i></Button>
                            <Button className="toggle_menu" onClick={this.hoverMenu}><i id="toggle"
                                                                                        className="fas fa-bars icon-menu"></i></Button>
                        </li>
                    </ul>
                    <ul id="menu-phone" className="phone-menu z-index-100">
{/*                        <li>
                            <Link onClick={this.subHoverMenu} to="/administration"><i id="icon"
                                                                            className="fas fa-calendar-alt"> Administrare</i></Link>
                        </li>*/}
                        <li>
                            <Link onClick={this.subHoverMenu} to="/home"><i id="icon"
                                                                            className="fas fa-calendar-alt"> Acasa</i></Link>
                        </li>
                        <li>
                            <input type="checkbox" id="sub-menu-scales" name="sub-menu-scales"></input>
                            <label for="sub-menu-scales"><i className="fas fa-futbol"> Echipa</i></label>

                            <ul id="phone-sub-menu" className="sub-menu-phone">
                                <li>
                                    <Link onClick={this.subHoverMenu} to="/players"><i
                                        className="fas fa-users"> Jucatori</i></Link>
                                </li>
                                <li>
                                    <Link onClick={this.subHoverMenu} to="/formation"><i
                                        className="fas fa-sitemap"> Formatie</i></Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link onClick={this.subHoverMenu} to="/history"><i id="icon"
                                                                               className="fas fa-history"> Istoric</i></Link>
                        </li>
                        <li>
                            <Link onClick={this.subHoverMenu} to="/analitics"><i id="icon"
                                                                                 className="fas fa-chart-bar"> Analiza</i></Link>
                        </li>
                        <li>
                            <Link onClick={this.subHoverMenu} to="/profile"><i id="icon"
                                                                               className="fas fa-user-circle"> Profil</i></Link>
                        </li>
                        <li>
                            <Link onClick={this.subHoverMenu} to="/settings"><i id="icon"
                                                                                className="fas fa-cog"> Setari</i></Link>
                        </li>
                        <li>
                            <Button onClick={this.handleClick}><i
                                className="fas fa-sign-out-alt"> Deconectare</i></Button>
                        </li>
                    </ul>

                    <ul id="dashboard-left" className="left-dashboard z-index-100">

                        <li>
                            <Link onClick={this.subHoverMenu} to="/profile"><img/></Link>
                        </li>
{/*                        <li>
                            <Link onClick={this.subHoverMenu} to="/administration"><i id="icon"
                                                                                      className="fas fa-calendar-alt"> Administrare</i></Link>
                        </li>*/}
                        <li>
                            <Link onClick={this.subHoverMenu} to="/home"><i id="icon"
                                                                            className="fas fa-calendar-alt"></i></Link>
                        </li>
                        <li>
                            <input type="checkbox" id="sub-menu-scales-large" name="sub-menu-scales-large"></input>
                            <label for="sub-menu-scales-large"><i className="fas fa-futbol"></i></label>

                            <ul id="phone-sub-menu" className="sub-menu-large">
                                <li>
                                    <span onClick={this.subHoverMenu} to=""><i
                                        className="fas fa-futbol icon">&nbsp;Echipa</i></span>
                                </li>
                                <li>
                                    <Link onClick={this.subHoverMenu} to="/players"><i
                                        className="fas fa-users icon">&nbsp;Jucatori</i></Link>
                                </li>
                                <li>
                                    <Link onClick={this.subHoverMenu} to="/formation"><i
                                        className="fas fa-sitemap icon">&nbsp;Formatie</i></Link>
                                </li>
                            </ul>

                        </li>
                        <li>
                            <Link onClick={this.subHoverMenu} to="/history"><i id="icon" className="fas fa-history"></i></Link>
                        </li>
                        <li>
                            <Link onClick={this.subHoverMenu} to="/analitics"><i id="icon"
                                                                                 className="fas fa-chart-bar"></i></Link>
                        </li>
                    </ul>


                    <Switch>
                        <Route path="/profile">
                            <Profile/>
                        </Route>
                        <Route exact path="/home">
                            <Home/>
                        </Route>
                        <Route path="/players">
                            <Players/>
                        </Route>
                        <Route path="/formation">
                            <Formation/>
                        </Route>
                        <Route path="/history">
                            <History/>
                        </Route>
                        <Route path="/analitics">
                            <Analitics/>
                        </Route>
                        <Route path="/settings">
                            <Settings/>
                        </Route>
                        <Route path="/administration">
                            <Administration/>
                        </Route>
                    </Switch>


                </div>

            </Router>

        );
    }

}

export default Dashboard;