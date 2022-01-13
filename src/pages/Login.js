import React from 'react';
import '../styles/Login.css';
import '../img/home_img.png';
import logo from '../img/logo.png';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {authUser} from '../services/auth.service';
import {withRouter} from 'react-router-dom';
import {
    showSuccessWithMessage,
    showErrorWithMessage,
    showInfoWithMessage,
    showWarnWithMessage,
    showSuccess,
    showError
} from "../services/toast.service";
import {Toast} from "primereact/toast";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            user_id: 0,
            token: '',
            role_id: 0,
            active_id: 0,
            authSucc: false
        };
        this.notificationRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    onKeyPressed(e) {
        if (e.key === 'Enter') {
            let userName = document.getElementById("username");
            let passWord = document.getElementById("password");
            if (userName.value === '' && passWord.value === '') {
                showErrorWithMessage(this.notificationRef, "Te rog sa completezi numele de utilizator si parola !");
            } else if (userName.value === '') {
                showErrorWithMessage(this.notificationRef, "Te rog sa completezi numele de utilizator !");
            } else if (passWord.value === '') {
                showErrorWithMessage(this.notificationRef, "Te rog sa completezi parola !");
            } else {
                let respond = authUser(userName.value, passWord.value).then(result => {

                    if (result && result[1]['token'] !== null && result[0]['active_id'] === 1) {
                        this.setState({
                            username: userName.value,
                            user_id: result[0]['user_id'],
                            role_id: result[0]['role_id'],
                            active_id: result[0]['active_id'],
                            token: result[1]['token'],
                            authSucc: true
                        });
                        this.props.customProp(this.state);
                        window.location.reload();
                    } else {
                        showErrorWithMessage(this.notificationRef, "Nume de utilizator sau parola incorect !");

                    }
                }).catch(error => {
                    if (error.response) {
                        if (error.response.status === 401) {
                            showErrorWithMessage(this.notificationRef, "Contul nu există!");
                        }
                    }
                });
            }
        }
    }

    handleClick(e) {
        let userName = document.getElementById("username");
        let passWord = document.getElementById("password");
        if (userName.value === '' && passWord.value === '') {
            showErrorWithMessage(this.notificationRef, "Te rog sa completezi numele de utilizator si parola !");
        } else if (userName.value === '') {
            showErrorWithMessage(this.notificationRef, "Te rog sa completezi numele de utilizator!");
        } else if (passWord.value === '') {
            showErrorWithMessage(this.notificationRef, "Te rog sa completezi parola !");
        } else {
            let respond = authUser(userName.value, passWord.value).then(result => {

                if (result && result[1]['token'] !== null && result[0]['active_id'] === 1) {
                    this.setState({
                        username: userName.value,
                        user_id: result[0]['user_id'],
                        role_id: result[0]['role_id'],
                        active_id: result[0]['active_id'],
                        token: result[1]['token'],
                        authSucc: true
                    });
                    this.props.customProp(this.state);
                    window.location.reload();
                } else {
                    if (result[0]['active_id'] === 0) {
                        showErrorWithMessage(this.notificationRef, "Utilizatorul este dezactivat !");
                    } else {
                        showErrorWithMessage(this.notificationRef, "Nume de utilizator sau parola incorect !");
                    }
                }
            }).catch(error => {
                if (error.response) {
                    if (error.response.status === 401) {
                        showErrorWithMessage(this.notificationRef, "Contul nu există!");
                    }
                }
            });
        }
    }

    render() {
        return (
            <div className="Login">
                <Toast ref={this.notificationRef} position="top-right"/>
                <div className="Form">
                    <div className="Logo">
                        <img src={logo} alt=""></img>
                        <p><b>SoccerTracker</b></p>
                    </div>

                    <div className="Container-form">
                        <h1>Conectare</h1>
                        <p>Bun venit, te rugam sa te conectezi</p>
                        <span>
                                <InputText id="username" onClick={this.onKeyPressed} onKeyPress={this.onKeyPressed}
                                           placeholder="Nume de utilizator"/>
                                <i className="fas fa-user icon"></i>
                            </span>
                        <span>
                                <InputText id="password" onClick={this.onKeyPressed} onKeyPress={this.onKeyPressed}
                                           placeholder="Parola" type="password"/>
                                <i className="fas fa-lock icon"></i>
                            </span>
                        <Button label="Conectare" onClick={this.handleClick}></Button>
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(Login);