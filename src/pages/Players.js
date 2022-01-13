import React from 'react';
import '../styles/Players.css';
import ls from 'local-storage';
import { Dropdown } from 'primereact/dropdown';
import Table from '../components/Table';
import { withRouter } from 'react-router-dom';
import { getAllPlayers } from '../services/getAllPlayers.service';
import { getAllPlayPost } from '../services/getAllPlayPost.service';
import { getAllPrefferedFoot } from '../services/getAllPrefferedFoot.service';
import { getAllTeams } from '../services/getAllTeams.service';
import SearchBar from '../components/SearchBar';
import { Toast } from 'primereact/toast';
import moment from 'moment';

class Players extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,    
            teams: 0,
            teamsOptions: [],
            player: '',
            teamList: [],
            playerList: [],
            searchQuery: '',
            listPlayPost: [],
            listPrefferedFoot: []
        };
        this.handlePlayers = this.handlePlayers.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.findPlayer = this.findPlayer.bind(this);
        this.setSearchQuery = this.setSearchQuery.bind(this);
    }

    componentDidMount() {
        let list = [];
        let teamsOption = [];
       
        getAllTeams(ls.get('token')).then((result) => {
            if (result !== "" && result !== null && result !== undefined) {
                result.forEach((item) => {
                    let newOption = {
                        label : item['team_name'], value : item['team_id']
                    };
                    teamsOption.push(newOption);
                });
            } else {
                if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista nicio echipa !'});
                }
            }
        }).catch((error) => {
            if(error.response) {
                if (error.response.status === 401) {
                    ls.set('token', '');
                    ls.set('username', '');
                    ls.set('authSucc', false);
                    ls.set('dataLoad', false);
                    window.location.reload();
                }
            }
        });

         getAllPlayers(ls.get('token')).then((result) => {
             if (result !== "" && result !== null && result !== undefined) {
                result.forEach((item, index1) => {
                  
                    if (list.length === 0) {
                     let newElement = {
                         "echipa" : item['team_id'],
                         "jucatori" : [
                            {"user_id": item['user_id'], "username": item['username'], "person_id": item['person_id'], "team_id": item['team_id'], "id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))), "nume": item['firstname'] + " " + item['lastname'], "team_history": item['team_history'], "coach_history": item['coach_history'], "picior_preferat": item['preffered_foot_desc'], "pozitie": item['play_post_desc'],"data_nasterii": moment(item['birthdate']).format("YYYY-MM-DD"),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'], "inaltime" : item['height'], "email" : item['email']}                         
                         ] 
                     };
                     
                     list.push(newElement);
                     
                   } else {
                       let flagNewPlayer = false;
                      
                       list.forEach((element) => {
                        
                            if (element['echipa'] === item['team_id']) {
                        
                                let player = {"user_id": item['user_id'], "username": item['username'], "person_id": item['person_id'], "team_id": item['team_id'],"id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),"nume": item['firstname'] + " " + item['lastname'], "team_history": item['team_history'], "coach_history": item['coach_history'], "picior_preferat": item['preffered_foot_desc'], "pozitie": item['play_post_desc'],"data_nasterii": moment(item['birthdate']).format("YYYY-MM-DD"),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'], "inaltime" : item['height'], "email" : item['email']};
                                flagNewPlayer = true;
                                element['jucatori'].push(player);
                            }
                       });
    
                       if (flagNewPlayer === false) {
                            let newElement = {
                                "echipa" : item['team_id'],
                                "jucatori" : [
                                {"user_id": item['user_id'], "username": item['username'], "person_id": item['person_id'], "team_id": item['team_id'], "id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),"nume": item['firstname'] + " " + item['lastname'], "team_history": item['team_history'], "coach_history": item['coach_history'], "picior_preferat": item['preffered_foot_desc'], "pozitie": item['play_post_desc'],"data_nasterii": moment(item['birthdate']).format("YYYY-MM-DD"),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'], "inaltime" : item['height'], "email" : item['email']}                         
                                ] 
                            };
                           
                            list.push(newElement);
                       }
                   }
                });
             } else {
                if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista niciun jucator !'});
                }
             }
               
    
            //}
           
        }).catch(function(error) {
            if(error.response) {
                if (error.response.status === 401) {
                    ls.set('token', '');
                    ls.set('username', '');
                    ls.set('authSucc', false);
                    ls.set('dataLoad', false);
                    window.location.reload();
                }
            }
        });
        let listPosts = [];
        getAllPlayPost(ls.get('token')).then(result => {
           if (result !== null && result !== "" && result !== undefined) {
            result.forEach(item => {
                listPosts.push({label: item['play_post_desc'], value: item['play_post_id']});
            });
        } else {
            if (this.toastRef !== null) {
                this.toastRef.clear();
                this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista niciun post de joc !'});
            }
        }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 401) {
                    ls.set('token', '');
                    ls.set('username', '');
                    ls.set('authSucc', false);
                    ls.set('dataLoad', false);
                    window.location.reload();
                }
            }
        });
        let listFoot = [];
        getAllPrefferedFoot(ls.get('token')).then(result => {
           if (result !== null && result !== undefined && result !== "") {
                result.forEach(item => {
                    listFoot.push({label: item['preffered_foot_desc'], value: item['preffered_foot_id']});
                });
            } else {
                if (this.toastRef !== null) {
                    this.toastRef.clear();
                    this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista niciun picior preferat de jucatori !'});
                }
            }
        }).catch(error => {
            console.log(error);
            if (error.response) {
                if (error.response.status === 401) {
                    ls.set('token', '');
                    ls.set('username', '');
                    ls.set('authSucc', false);
                    ls.set('dataLoad', false);
                    window.location.reload();
                }
            }
        });

        this.setState({
            teamList: list,
            teamsOptions: teamsOption,
            listPrefferedFoot: listFoot,
            listPlayPost: listPosts
        });
    }

    handlePlayers(type, player) {
        let list = this.state.teamList;
        if (type === 'adaugare') {
            list.forEach((item) => {
                if (player['team_id'] === item['echipa']) {
                    let players = item['jucatori'];
                    let flag = 0;
                    if (players.filter((element) => element['nume'].toLowerCase() === player['nume'].toLowerCase()).length > 0) {
                        flag = 1;
                    }
                    if (flag === 0)
                        players.push(player);
                    item['jucatori'] = players;
                }    
            });
        } else if (type === 'modificare') {
            let deletePos = -1;
            list.forEach((item) => {
                if (player['team_id'] === item['echipa']) {
                    let players = item['jucatori'];
                    players.map((item2, index2) => {
                        if (item2['user_id'] === player['user_id']) {
                            deletePos = index2;
                        }
                    });
                    if (deletePos !== -1) {
                        players.splice(deletePos, 1, player);
                    }
                    item['jucatori'] = players;
                }    
            });
        } else if (type === 'stergere') {
            let deletePos = -1;
            list.forEach((item) => {
                if (player['team_id'] === item['echipa']) {
                    let players = item['jucatori'];
                    players.map((item2, index2) => {
                        if (item2['user_id'] === player['user_id']) {
                            deletePos = index2;
                        }
                    });
                    if (deletePos !== -1) {
                        players.splice(deletePos, 1);
                    }
                    item['jucatori'] = players;
                }    
            });
            
        }
        this.setState({
            teamList: list
        });
    }

    handleChange(e) {
        this.setState({
            teams: e.value
        });
        let element = [];
        this.state.teamList.forEach(function (team) {
            if (team['echipa'] === e.value) {
                element = team['jucatori'];
            
            }
        });
        this.setState({
            playerList: element
        });
    }

    setSearchQuery(value) {
        this.setState({
            player: value
        })
    }

    findPlayer() {
        if (this.state.player === '')
            return this.state.playerList;
            
        return this.state.playerList.filter((player) => {
            const playerName = player['nume'].toLowerCase();
        
            return playerName.includes(this.state.player.toLowerCase());
        });
    }
    render() {
         return (
                        <div id="players" className="Players">
                            <div className="operations">
                                <Dropdown id="pr_id_2" value={this.state.teams} options={this.state.teamsOptions} optionLabel="label" optionValue="value" onChange={(e) => this.handleChange(e)} placeholder="Alege o echipa"/>
                                <SearchBar searchQuery={this.state.searchQuery} setSearchQuery={this.setSearchQuery}/>
                            </div>
                            <Toast ref={(ref) => this.toastRef = ref} />
                            <div className="data">
                                <Table className="custom-table" handlePlayers={this.handlePlayers} listOfItems={this.findPlayer()} listOfPlayPost={this.state.listPlayPost} listOfPrefferedFoot={this.state.listPrefferedFoot} selectedTeam={this.state.teams} teamsOptions={this.state.teamsOptions}/>
                            </div>
                        </div>
              
        );
    }

}

export default withRouter(Players);