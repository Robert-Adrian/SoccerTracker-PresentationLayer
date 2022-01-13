import React, {useState, useEffect, useRef} from 'react';
import '../styles/Analitics.css';
import { withRouter } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { Dropdown } from 'primereact/dropdown';
import { TableAnalitics } from '../components/TableAnalitics';
import { Toast } from 'primereact/toast';
import '../styles/Analitics.css';
import { getAllPlayers } from '../services/getAllPlayers.service';
import { getAllTeams } from '../services/getAllTeams.service';
import ls from 'local-storage';
import moment from 'moment';

function Analitics() {
        const [searchQuery, setSearchQuery] = useState('');    
        const [playersList, setPlayersList] = useState([]);
        const [teamsList, setTeamsList] = useState([]);
        const [teamsOptions, setTeamsOptions] = useState([]);
        const [teamSelected, setTeamSelected] = useState("");
        const toast = useRef(null);

        useEffect(() => {
            let list = [];
            let teamsOption = [];
       
            getAllTeams(ls.get('token')).then((result) => {
                if (result !== null && result !== undefined && result !== "") {
                    result.forEach((item) => {
                        let newOption = {
                            label : item['team_name'], value : item['team_id']
                        };
                        teamsOption.push(newOption);
                    });
                } else {
                    toast.current.clear();
                    toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista echipe in baza de date !'});
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
                               {"user_id": item['user_id'],"person_id": item['person_id'], "team_id": item['team_id'], "id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))), "nume": item['firstname'] + " " + item['lastname'], "team_history": item['team_history'], "coach_history": item['coach_history'], "picior_preferat": item['preffered_foot_desc'], "pozitie": item['play_post_desc'],"data_nasterii": (moment(item['birthdate']).format("YYYY-MM-DD")),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'] + " Kg", "inaltime" : item['height'] + " cm", "email" : item['email']}                         
                            ] 
                        };
                        
                        list.push(newElement);
                        
                      } else {
                          let flagNewPlayer = false;
                         
                          list.forEach((element) => {
                           
                               if (element['echipa'] === item['team_id']) {
                           
                                   let player = {"user_id": item['user_id'],"person_id": item['person_id'], "team_id": item['team_id'],"id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),"nume": item['firstname'] + " " + item['lastname'], "team_history": item['team_history'], "coach_history": item['coach_history'], "picior_preferat": item['preffered_foot_desc'], "pozitie": item['play_post_desc'],"data_nasterii": (moment(item['birthdate']).format("YYYY-MM-DD")),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'] + " Kg", "inaltime" : item['height'] + " cm", "email" : item['email']};
                                   flagNewPlayer = true;
                                   element['jucatori'].push(player);
                               }
                          });
       
                          if (flagNewPlayer === false) {
                               let newElement = {
                                   "echipa" : item['team_id'],
                                   "jucatori" : [
                                   {"user_id": item['user_id'],"person_id": item['person_id'], "team_id": item['team_id'], "id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),"nume": item['firstname'] + " " + item['lastname'], "team_history": item['team_history'], "coach_history": item['coach_history'], "picior_preferat": item['preffered_foot_desc'], "pozitie": item['play_post_desc'],"data_nasterii": (moment(item['birthdate']).format("YYYY-MM-DD")),"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], "cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'] + " Kg", "inaltime" : item['height'] + " cm", "email" : item['email']}                         
                                   ] 
                               };
                              
                               list.push(newElement);
                          }
                      }
                   });
                } else {
                    toast.current.clear();
                    toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista jucatori in baza de date !'});
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
           setTeamsOptions(teamsOption);
           setTeamsList(list);
           
        }, []);


        const handleChange = (e) => {
          setTeamSelected(e.value);
            let element = [];
            teamsList.forEach(function (team) {
                if (team['echipa'] === e.value) {
                    element = team['jucatori'];
                
                }
            });
           setPlayersList(element);
           
        }
    
    
        const findPlayer = () => {
            if (searchQuery === '')
                return playersList;
                
            return playersList.filter((player) => {
                const playerName = player['nume'].toLowerCase();
            
                return playerName.includes(searchQuery.toLowerCase());
            });
        }


        return (
                 <div id="analitics" className="Analitics">
                     <div className="team-operations">
                                <Dropdown id="pr_id_2" optionLabel="label" optionValue="value" value={teamSelected} options={teamsOptions} onChange={(e) => handleChange(e)} placeholder="Alege o echipa"/>
                                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                     </div>
                     <Toast ref={toast} />
                     <div className="analitics_data">
                         <TableAnalitics filter={findPlayer()}/>
                     </div>
                 </div>
        );
}

export default withRouter(Analitics);