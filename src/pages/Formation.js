import React from 'react';
import '../styles/Formation.css';
import { withRouter } from 'react-router-dom';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import 'primeflex/primeflex.css';
import field from '../img/field.jpg';
import vlad from '../img/vlad.jpg';
import SoccerLineUp from 'react-soccer-lineup';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { getAllPlayers } from '../services/getAllPlayers.service';
import { getAllFormations } from '../services/getAllFormations.service';
import ls from 'local-storage';
import { createFormation } from '../services/createFormation.service';
import { updateFormation } from '../services/updateFormation.service';
import { deleteFormation } from '../services/deleteFormation.service';
import { Toast } from 'primereact/toast';
import moment from 'moment';


class Formation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: '',
            teamsOptions: [],
            formation: {squad: {}},
            visibleAdd: false,
            visibleModify: false,
            visibleDelete: false,
            formationList: [[]],
            teamList: [[]],
            lastChild: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.addDialog = this.addDialog.bind(this);
        this.modifyDialog = this.modifyDialog.bind(this);
        this.deleteDialog = this.deleteDialog.bind(this);
        this.saveOperation = this.saveOperation.bind(this);
        this.setFormation = this.setFormation.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
    }


    componentDidMount() {
        const listForm = [];

        let list = [];
        let teamsOption = [];
        getAllPlayers(ls.get('token')).then((result) => {
            if (result !== null && result !== undefined && result !== '') {
                result.forEach((item) => {
               
                    if (list.length === 0) {
                     let newElement = {
                         "echipa" : item['team_name'],
                         "jucatori" : [
                            {"id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),"nume": item['firstname'] + " " + item['lastname'],"pozitie": item['play_post_desc'],"data_nasterii": moment(item['birthdate']).format("YYYY-MM-DD"),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'] + " Kg", "inaltime" : item['height'] + " cm", "email" : item['email']}                         
                         ] 
                     };
                     let newOption = {
                        "label" : item['team_name'], "value" : item['team_name']
                     };
                     teamsOption.push(newOption);
                     list.push(newElement);
                   } else {
                       let flagNewPlayer = false;
                       list.forEach((element) => {
                            if (element['echipa'] === item['team_name']) {
                                let player = {"id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),"nume": item['firstname'] + " " + item['lastname'],"pozitie": item['play_post_desc'],"data_nasterii": moment(item['birthdate']).format("YYYY-MM-DD"),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'] + " Kg", "inaltime" : item['height'] + " cm", "email" : item['email']};
                                flagNewPlayer = true;
                                element['jucatori'].push(player);
                            }
                       });
    
                       if (flagNewPlayer === false) {
                            let newElement = {
                                "echipa" : item['team_name'],
                                "jucatori" : [
                                {"id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),"nume": item['firstname'] + " " + item['lastname'],"pozitie": item['play_post_desc'],"data_nasterii": moment(item['birthdate']).format("YYYY-MM-DD"),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'] + " Kg", "inaltime" : item['height'] + " cm", "email" : item['email']}                         
                                ] 
                            };
                            let option = {"label" : item['team_name'], "value" : item['team_name']};
                            list.push(newElement);
                            teamsOption.push(option);
                       }
                   }
                   this.setState({
                    teamList: list,
                    teamsOptions: teamsOption
                   });
                });
    
            } else {
                if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista jucatori in baza de date !'});
                }
            }
           
        }).catch((error) => {
            
            if(error.response.status === 401) {
                ls.set('token', '');
                ls.set('username', '');
                ls.set('authSucc', false);
                ls.set('dataLoad', false);
                window.location.reload();
            }
        });
       
        getAllFormations(ls.get('token')).then((result) => {
            if (result !== null && result !== undefined && result !== '') {
                result.forEach((item) => {
                    listForm.push({"id" : item['formation_id'], "desc" : item['formation_desc']});
                    this.setState({
                        formationList: listForm
                    });
                });
            } else {
                if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista formatii in baza de date !'});
                }
            }
        }).catch(function(error) {
            if(error.response.status === 401) {
                ls.set('token', '');
                ls.set('username', '');
                ls.set('authSucc', false);
                ls.set('dataLoad', false);
                window.location.reload();
            }
        });

        const players = {
            squad: {
          
            },
            style: {
                color: "#f08080",
                numberColor: "#ffffff"
            }
        };

        this.setState({
            formation: players
        });
    }

    handleChange(e) {
        this.setState({
            team: e.target.value
        })
    }

    addPlayer(e, player) {
        const form = this.state.formation;
        const list = Object.keys(this.state.formation['squad']);
        let newPlayer = {
                    name: player['nume'],
                    number: player['nr']
                };
        var k = false;
        for (var i = 0; i < list.length && k === false; i++) {
            if (list[i] === 'gk' && form['squad'][list[i]]['name'] === newPlayer['name']) {
                k = true;
            } else {
                for (var j = 0; j < form['squad'][list[i]].length; j++) {
                    if (form['squad'][list[i]][j]['name'] === newPlayer['name'])
                        k = true;
                }
            }
        }

        for (i = 0; i < list.length && k === false; i++) {
            if (list[i] === 'gk' && form['squad'][list[i]].hasOwnProperty("name") === false) {
                form['squad'][list[i]] = newPlayer;
                e.nativeEvent.path[3].style.backgroundColor = "rgba(131, 77, 155, 0.5)";
                k = true;
            } else {
                for (j = 0; j < form['squad'][list[i]].length && k === false; j++) {
                    if (form['squad'][list[i]][j].hasOwnProperty("name") === false) {
                        form['squad'][list[i]][j] = newPlayer;
                        e.nativeEvent.path[3].style.backgroundColor = "rgba(131, 77, 155, 0.5)";
                        k = true;
                    }
                }
            }
        }
        this.setState({
            formation: form
        })
    }

    deletePlayer(e, player) {
        e.nativeEvent.path[3].style.backgroundColor = "white";
        const form = this.state.formation;
        const list = Object.keys(this.state.formation['squad']);
        var k = false;
        for (var i = 0; i < list.length && k === false; i++) {
            if (list[i] === 'gk' && form['squad'][list[i]]['name'] === player['nume']) {
                form['squad'][list[i]] = {};
                k = true;
            } else {
                for (var j = 0; j < form['squad'][list[i]].length && k === false; j++) {
                    if (form['squad'][list[i]][j]['name'] === player['nume']) {
                        form['squad'][list[i]][j] = {};
                        k = true;
                    }
                }
            }
        }

        this.setState({
            formation: form
        })
    }


    setFormation(e) {
        let cardPlayer = document.getElementsByClassName("p-card p-component card-player");
        for (var i = 0; i < cardPlayer.length; i++) {
            cardPlayer[i].style.backgroundColor = "white";
        }

        if (this.state.lastChild !== '')
            this.state.lastChild.style.backgroundColor = "white";

        e.nativeEvent.path[2].style.backgroundColor = "rgba(131, 77, 155, 0.5)";
        let formationGroup = e.nativeEvent.path[2].innerText.split("-");
        let df = [];
        let cdm = [];
        let cm = [];
        let cam = [];
        let fw = [];
        let list;
        let players = {
            squad: {
                gk: {}
            },
            style: {
                color: "#834d9b",
                numberColor: "#ffffff"
            }
        };
        if (formationGroup.length === 4) {
          
            list = [df, cdm, cam, fw];
            for (i = 0; i < formationGroup.length; i++) {
                for (var j = 0; j < parseInt(formationGroup[i]); j++) {
                    list[i].push({});
                }
            }
            players['squad']['df'] = list[0];
            players['squad']['cdm'] = list[1];
            players['squad']['cam'] = list[2];
            players['squad']['fw'] = list[3];
            
        } else if (formationGroup.length === 3) {
            list = [df, cm, fw];
            for (i = 0; i < formationGroup.length; i++) {
                for (j = 0; j < parseInt(formationGroup[i]); j++) {
                    list[i].push({});
                }
            }
            players['squad']['df'] = list[0];
            players['squad']['cm'] = list[1];
            players['squad']['fw'] = list[2];
            

        }
        this.setState({
            lastChild:  e.nativeEvent.path[2],
            formation: players            
        });

    }

    saveOperation(e) {
        if (this.state.visibleAdd === true) {
            let inputTxt = document.getElementById('input-text1');
            let flag = false;
            let correctAdd = inputTxt.value.split("-");
            if (correctAdd.length >= 3) {
                this.state.formationList.map(item => {
               
                    if (item['desc'] === inputTxt.value) {
                        flag = true;
                    }
             
                });
                if (flag === false) {
                    let newFormation = {"id" : this.state.formationList.length + 1, "desc" : inputTxt.value};
                    createFormation(ls.get('token'), newFormation['id'], newFormation['desc']);
                    let list = this.state.formationList;
                    list.push(newFormation);
                    this.setState({
                        formationList: list
                    });
                    if (this.toastRef !== null) {
                        this.toastRef.clear();
                        this.toastRef.show({life: 5000, severity: 'success', summary: 'Introducere cu succes !', detail: 'Formatia a fost introdusa cu succes !'});
                    }
                } else {
                    if (this.toastRef !== null) {
                        this.toastRef.clear();
                        this.toastRef.show({life: 5000, severity: 'warn', summary: 'Formatie existenta !', detail: 'Formatia este deja introdusa !'});
                    }
                }
            } else {
                 if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'error', summary: 'Format invalid !', detail: 'Formatia trebuie sa contina caracterul - ! (Ex: 1-3-2)'});
                }
            }
        
        } else if (this.state.visibleDelete === true) {
            let inputTxt = document.getElementById('input-text4');
            let findFormation = "";
            let indexFormation = -1;
            let correctAdd = inputTxt.value.split("-");
            if (correctAdd.length >= 3) {
                this.state.formationList.map((item,index) => {
                    if (item['desc'] === inputTxt.value) {
                        findFormation = item;
                        indexFormation = index;
                    }
                    
                });
                if (indexFormation !== -1) {
                    let elementDel = this.state.formationList[indexFormation];

                    deleteFormation(ls.get('token'), elementDel['desc']);

                    let list = this.state.formationList;
                    list.splice(indexFormation, 1);
                    this.setState({
                        formationList: list
                    });
                    if (this.toastRef !== null) {
                        this.toastRef.clear();
                        this.toastRef.show({life: 5000, severity: 'success', summary: 'Stergere cu succes !', detail: 'Formatia a fost stearsa cu succes !'});
                    }
                } else {
                    if (this.toastRef !== null) {
                        this.toastRef.clear();
                        this.toastRef.show({life: 5000, severity: 'warn', summary: 'Formatie inexistenta !', detail: 'Formatia nu se afla in lista !'});
                    }
                }
            } else {
                if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'error', summary: 'Format invalid !', detail: 'Formatia trebuie sa contina caracterul - ! (Ex: 1-3-2)'});
                }
            }
        } else if (this.state.visibleModify === true) {
            let inputTxt2 = document.getElementById('input-text2');
            let inputTxt3 = document.getElementById('input-text3');
            let indexOldFormation = -1;
            let correctAdd2 = inputTxt2.value.split("-");
            let correctAdd3 = inputTxt3.value.split("-");
            if (correctAdd2.length >= 3 && correctAdd3.length >= 3) {
                this.state.formationList.map((item, index) => {
                    if (item['desc'] === inputTxt2.value) {
                            indexOldFormation = index;
                    }
                });

                if (indexOldFormation !== -1) {
                    let elementMod = this.state.formationList[indexOldFormation];
                    updateFormation(ls.get('token'), elementMod['id'], inputTxt3.value);
                    let list = this.state.formationList;
                    list.splice(indexOldFormation, 1, {"id" : elementMod["id"], "desc" : inputTxt3.value});
                    this.setState({
                        formationList: list
                    });
                    if (this.toastRef !== null) {
                        this.toastRef.clear();
                        this.toastRef.show({life: 5000, severity: 'success', summary: 'Modificare cu succes !', detail: 'Formatia a fost modificata cu succes !'});
                    }
                } else {
                    if (this.toastRef !== null) {
                        this.toastRef.clear();
                        this.toastRef.show({life: 5000, severity: 'warn', summary: 'Formatie inexistenta !', detail: 'Formatia nu se afla in lista !'});
                    }
                }
            } else {
                if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'error', summary: 'Format invalid !', detail: 'Formatia trebuie sa contina caracterul - ! (Ex: 1-3-2)'});
                }
            }
        }
        this.setState({
            visibleAdd: false,
            visibleModify: false,
            visibleDelete: false
        });
    }
    

    addDialog(e) {
        this.setState({
            visibleAdd: true
        });

    }

    modifyDialog(e) {
        this.setState({
            visibleModify: true
        });
    }

    deleteDialog(e) {
        this.setState({
            visibleDelete: true
        });
    }

    closeDialog(e) {
        this.setState({
            visibleAdd: false,
            visibleModify: false,
            visibleDelete: false
        });
    }

    render() {
       
        const footerDialog = () => {
            return (
                <Button label="Salvare" onClick={this.saveOperation}/>
            );
        }

        return (
                 <div id="formation" className="Formation">
                     <div id="dropdown" className="p-grid p-dir-col">
                        <div className="p-col">
                            <Dropdown id="pr_id_2" value={this.state.team} options={this.state.teamsOptions} onChange={(e) => this.handleChange(e)} placeholder="Alege o echipa"/>
                        </div>
                    </div>
                    <Toast ref={(ref) => {this.toastRef = ref}}/>
                    <div className="p-grid nested-grid">
                        <div className="p-col-4">
                            <ScrollPanel style={{height: '100%'}}>
                                <div className="p-grid">
                                    {
                                        this.state.formationList.map((item, index) => {
                                            return (<div key={index} className="p-col-6">
                                                            <Card key={index} className="card-field" subTitle={item['desc']}>
                                                                <img key={index} src={field} alt="field" onClick={this.setFormation}/>
                                                            </Card>
                                                    </div>)
                                        })
                                    } 
                               </div>
                                <div className="p-grid" style={{display: 'flex', justifyContent: 'center'}}>
                                         <Button label="Modificare" onClick={this.modifyDialog} style={{margin: '5px', padding: '5px'}}/>
                                         <Button label="Adaugare" onClick={this.addDialog} style={{margin: '5px', padding: '5px'}}/>
                                         <Button label="Stergere" onClick={this.deleteDialog} style={{margin: '5px', padding: '5px'}}/>
                                   
                                </div>
                            </ScrollPanel>
                        </div>
                        <div className="p-col-8">
                            <div className="p-grid">
                                <div className="p-col-12">
                                    <SoccerLineUp id="field-map" size="fill" pattern="lines" homeTeam={this.state.formation}/>
                                </div>
                                <div className="p-col-12">
                                <ScrollPanel style={{height: '100%'}}>
                                     <div className="p-grid">
                                    {
                                        this.state.teamList.map((item) => {
                                            if (item.hasOwnProperty('jucatori') === true) {
                                                if (item['echipa'] === this.state.team) {
                                                    return item['jucatori'].map((item2) => {
                                                        return (
                                                            <div key={item2['id'] } className="p-col-3">
                                                                <Card key={item2['id']} id="player" className="card-player" subTitle={item2['nume']}>
                                                                    <Avatar key={item['id']} label="P" className="p-mr-2" size="xlarge" shape="circle" />
                                                                    <p>Pozitie: {item2['pozitie']}</p>
                                                                    <p>Nr tricou: {item2['nr']}</p>
                                                             
                                                                    <Button key={item2['id']} style={{fontSize: '12px'}} label="Adaugare" onClick={(e) => this.addPlayer(e, item2)}/>
                                                                   
                                                                    <Button key={item2['id'] + 1} style={{fontSize: '12px'}} label="Stergere" onClick={(e) => this.deletePlayer(e, item2)}/>
                                                                
                                                                </Card>
                                                            </div>
                                                        )
                                                    })
        
                                                }

                                            }
                                        })
                                     }
                                       </div>
                                    </ScrollPanel>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vertical orientation */}
                    <div className="p-grid p-dir-col">
                        <div className="p-col">
                            <SoccerLineUp id="field-map" size="fill" pattern="lines" homeTeam={this.state.formation}/>
                        </div>
                        <div className="p-col">
                                    <ScrollPanel style={{height: '100%'}}>
                                    <div className="p-grid">
                                    {
                                        this.state.teamList.map((item) => {
                                            if (item.hasOwnProperty('jucatori') === true) {
                                                if (item['echipa'] === this.state.team) {
                                                    return item['jucatori'].map((item2) => {
                                                        return (
                                                            <div key={item2['id'] } className="p-col-3">
                                                                <Card key={item2['id']} id="player" className="card-player" subTitle={item2['nume']}>
                                                                    <Avatar key={item['id']} label="P" className="p-mr-2" size="xlarge" shape="circle" />
                                                                    <p>Pozitie: {item2['pozitie']}</p>
                                                                    <p>Nr tricou: {item2['nr']}</p>
                                                             
                                                                    <Button key={item2['id']} style={{fontSize: '12px'}} label="Adaugare" onClick={(e) => this.addPlayer(e, item2)}/>
                                                                   
                                                                    <Button key={item2['id'] + 1} style={{fontSize: '12px'}} label="Stergere" onClick={(e) => this.deletePlayer(e, item2)}/>
                                                                
                                                                </Card>
                                                            </div>
                                                        )
                                                    })
        
                                                }

                                            }
                                        })
                                     }
                                       </div>
                                    </ScrollPanel>
                        </div>
                        <div className="p-col">
                            <ScrollPanel style={{height: '100%'}}>
                                <div className="p-grid">
                                {
                                    this.state.formationList.map((item, index) => {
                                        return (<div key={index} className="p-col-6">
                                                        <Card key={index} className="card-field" subTitle={item['desc']}>
                                                            <img key={index} src={field} alt="field" onClick={this.setFormation}/>
                                                        </Card>
                                                </div>)
                                    })
                                } 
                                </div>
                               <div className="p-grid" style={{display: 'flex', justifyContent: 'center'}}>
                                         <Button label="Modificare" onClick={this.modifyDialog} style={{margin: '5px', padding: '5px'}}/>
                                         <Button label="Adaugare" onClick={this.addDialog} style={{margin: '5px', padding: '5px'}}/>
                                         <Button label="Stergere" onClick={this.deleteDialog} style={{margin: '5px', padding: '5px'}}/>
                                   
                                </div>
                            </ScrollPanel>
                        </div>
                       

                    </div>
                    <Dialog header="Vrei sa adaugi o formatie?&nbsp;&nbsp;" footer={footerDialog} visible={this.state.visibleAdd} onHide={this.closeDialog}>
                       <span>
                           <label htmlFor="input-text1">Formatie:&nbsp;&nbsp;</label>
                           <InputText id="input-text1" onInput={this.handleOnInput} placeholder="Introdu o formatie"/>
                       </span>
                    </Dialog>
                    <Dialog header="Vrei sa modifici o formatie?&nbsp;&nbsp;" footer={footerDialog} visible={this.state.visibleModify} onHide={this.closeDialog}>
                       <span>
                           <label htmlFor="input-text2">Formatia veche:&nbsp;&nbsp;</label>
                           <InputText id="input-text2" onInput={this.handleOnInput} placeholder="Introdu formatia veche"/>
                       </span>
                       <br />
                       <span>
                           <label htmlFor="input-text3">Formatia noua:&nbsp;&nbsp;</label>
                           <InputText id="input-text3" onInput={this.handleOnInput} placeholder="Introdu formatia noua"/>
                       </span>
                    </Dialog>
                    <Dialog header="Vrei sa stergi o formatie?&nbsp;&nbsp;" footer={footerDialog} visible={this.state.visibleDelete} onHide={this.closeDialog}>
                       <span>
                           <label htmlFor="input-text4">Formatie:&nbsp;&nbsp;</label>
                           <InputText id="input-text4" onInput={this.handleOnInput} placeholder="Introdu o formatie"/>
                       </span>
                    </Dialog>
                 </div>
        );
    }

}

export default withRouter(Formation);