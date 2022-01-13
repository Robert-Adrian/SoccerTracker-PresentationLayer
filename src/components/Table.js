import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../styles/Table.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { createPlayer } from '../services/createPlayer.service';
import { deletePlayer } from '../services/deletePlayer.service';
import { updatePlayer } from '../services/updatePlayer.service';
import ls from 'local-storage';
import { MultiSelect } from 'primereact/multiselect';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';
import { ScrollPanel } from 'primereact/scrollpanel';
import {InputSwitch} from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Fieldset } from 'primereact/fieldset';
import {Password} from 'primereact/password';
import {InputNumber} from 'primereact/inputnumber';
import moment from 'moment';


class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogProfile1: false,
      dialogProfile2: false,
      dialogProfile3: false,
      dialogDelete: false,
      dialogAdd: false,
      element: {},
      deleteFlag: 0,
      expandedFlag: 0,
      expandedRow: {'1' : null},
      expandedTable: {},
      list: [],
      poz: 0,
      listPlayPost: [],
      foot: 0,
      listPrefferedFoot: [],
      disabledFlds: false,
      startDate: "2021-05-14",
      endDate: "2021-05-14",
      id: '',
      nr: 0,
      username: '',
      password: '',
      nationalitate: '',
      name: '',
      data_nasterii: '',
      accidentat: '',
      domiciliu: '',
      nr_tel: '',
      cnp: '',
      licenta: '',
      greutate: 0,
      inaltime: 0,
      email: '',
      team_history: '',
      coach_history: '',
      teamsOptions: [],
      team: []

    };
    this.bodyTemplate = this.bodyTemplate.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.modifyItem = this.modifyItem.bind(this);
    this.popUpDialogDelete = this.popUpDialogDelete.bind(this);
    this.popUpDialogAdd = this.popUpDialogAdd.bind(this);
    this.expandRows = this.expandRows.bind(this);
    this.popUpDialogModifyProfile1 = this.popUpDialogModifyProfile1.bind(this);
    this.popUpDialogModifyProfile2 = this.popUpDialogModifyProfile2.bind(this);
    this.popUpDialogModifyProfile3 = this.popUpDialogModifyProfile3.bind(this);
    this.closePopWindow = this.closePopWindow.bind(this);
  }

  componentDidMount() {
    this.setState({
      list: this.props.listOfItems,
      listPlayPost: this.props.listOfPlayPost,
      listPrefferedFoot: this.props.listOfPrefferedFoot,
      teamsOptions: this.props.teamsOptions,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listOfItems !== this.props.listOfItems) {
      this.setState({
        list: this.props.listOfItems
      });
    }
    if (prevProps.listOfPlayPost !== this.props.listOfPlayPost) {
      this.setState({
        listPlayPost: this.props.listOfPlayPost
      });
    }
    if (prevProps.listOfPrefferedFoot !== this.props.listOfPrefferedFoot) {
      this.setState({
        listPrefferedFoot: this.props.listOfPrefferedFoot
      });
    }
    if (prevProps.teamsOptions !== this.props.teamsOptions) {
      this.setState({
        teamsOptions: this.props.teamsOptions
      })
    }
  }

  expandRows(rowData) {
    let element = {};
    if (this.state.expandedFlag === 0) {
      element[rowData.id] = true;
      let lists = this.state.list;
      let tableElement = {};
      lists.forEach(function(item) {
        if (item['id'] === rowData['id']) {
            tableElement = item;
            
        }
      });
      this.setState({
          expandedRow: element,
          expandedFlag: 1,
          expandedTable: tableElement,
          id: rowData.id
      });
      

    } else {
      element[rowData.id] = null;
      this.setState({
          expandedRow: element,
          expandedFlag: 0,
          expandedTable: {},
          id: rowData.id
      });
    }
  }

  bodyTemplate(list) {
    const listItems = [list];
    const domTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.domiciliu}
          </React.Fragment>
      );
    }
    const nrTelTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.nr_tel}
          </React.Fragment>
      );
    }
    const cnpTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.cnp}
          </React.Fragment>
      );
    }
    const piciorTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.picior_preferat}
          </React.Fragment>
      );
    }
    const licentaTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.licenta}
          </React.Fragment>
      );
    }
    const greutateTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.greutate}
          </React.Fragment>
      );
    }
    const inaltimeTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.inaltime}
          </React.Fragment>
      );
    }
    const emailTemplate = (rowData) => {
      return (
          <React.Fragment>
              {rowData.email}
          </React.Fragment>
      );
    }
    const editableBodyTemplate1 = (rowData) => {
      return (
        <React.Fragment>
            <Button onClick={() => this.popUpDialogModifyProfile2(rowData)}><i className="fas fa-user-edit"></i></Button>
        </React.Fragment>
      );
    }
    const editableBodyTemplate2 = (rowData) => {
      return (
        <React.Fragment>
            <Button onClick={() => this.popUpDialogModifyProfile3(rowData)}><i className="fas fa-user-edit"></i></Button>
        </React.Fragment>
      );
    }
    return (
      <div className="card">
          <p>Profilul jucatorului</p>
          <DataTable value={listItems} dataKey="cnp" className="p-datatable-responsive-demo">
              <Column field="domiciliu" header="Domiciliu" ></Column>
              <Column field="nr_tel" header="Numar telefon" ></Column>
              <Column field="cnp" header="CNP" ></Column>
              <Column field="picior_preferat" header="Picior preferat" ></Column>
              <Column field="coach_history" header="Antrenori anteriori" ></Column>
              <Column body={editableBodyTemplate1}/>
          </DataTable>
          <br />
          <DataTable value={listItems} dataKey="id" className="p-datatable-responsive-demo">
              <Column field="licenta" header="Licenta" ></Column>
              <Column field="greutate" header="Greutate (Kg)" ></Column>
              <Column field="inaltime" header="Inaltime (Cm)" ></Column>
              <Column field="email" header="Email" ></Column>
              <Column field="team_history" header="Echipe anterioare" ></Column>
              <Column body={editableBodyTemplate2}/>
          </DataTable>
          <br />
      </div>
     );
  }

  //   CRUD functions
  //Create
  addItem(e) {
    if (this.state.disabledFlds === false) {
      if (this.state.team === '' || this.state.nr === 0 || this.state.nationalitate === '' || this.state.name === '' || this.state.data_nasterii === '' || this.state.accidentat === '' || this.state.username === '' || this.state.password === ''
      || this.state.email === '' || this.state.nr_tel === '' || this.state.cnp === '' || this.state.domiciliu === '' || this.state.picior === '' || this.state.poz === '' || this.state.foot === ''
      || this.state.licenta === '' || this.state.greutate === 0 || this.state.inaltime === 0) {
          
          if (this.toastRef !== null) {
            this.toastRef.clear();
            this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Toate campurile sunt obligatorii pentru a adauga un jucator !'});
          }
      } else {
        let pozitia = "", picior = "";
        this.state.listPlayPost.forEach((item) => {
          if (item['value'] === this.state.poz) {
            pozitia = item['label'];
          }
        });
        this.state.listPrefferedFoot.forEach((item) => {
          if (item['value'] === this.state.foot) {
            picior = item['label'];
          }
        });
        const element = {"user_id": 0, "person_id": 0, "team_id": 0, "username": this.state.username, "id": 0, "nr": this.state.nr, "nationalitate": this.state.nationalitate, "varsta": (new Date().getFullYear() - parseInt(this.state.data_nasterii.toLocaleDateString("en-GB").replaceAll("/","-").split("-")[2])), 
        "nume": this.state.name, "pozitie": pozitia, "data_nasterii": this.state.data_nasterii.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), "accidentat": this.state.accidentat, "picior_preferat": picior, "team_history": this.state.team_history, "coach_history": this.state.coach_history,
        "domiciliu" : this.state.domiciliu, "nr_tel" : this.state.nr_tel, "cnp" : this.state.cnp, "licenta" : this.state.licenta, "greutate" : this.state.greutate, "inaltime" : this.state.inaltime, "email" : this.state.email};
        let lists = this.state.list;
        let flag = 0;
        lists.forEach(function(item) {
          if(item['nume'] === element['nume']) {
              flag = 1;
          } else if (item['nr'] === element['nr']) {
              flag = 2;
          }
        });
        if (flag === 0) {
              
              for (var i in this.state.team) {
                element['team_id'] = this.state.team[i];
                this.props.handlePlayers('adaugare', element);
              }
               if (this.props.selectedTeam !== 0 && lists.length === 0) {
                 lists.push(element);
               }
              createPlayer(ls.get('token'), this.state.username, this.state.password, 0, 0,
              this.state.name.substring(0, this.state.name.indexOf(" ")).trim(), this.state.name.substring(this.state.name.indexOf(" "), this.state.name.length).trim(), this.state.email,
              this.state.nr_tel, this.state.cnp, this.state.nationalitate, this.state.data_nasterii.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), this.state.domiciliu, this.state.team_history, this.state.coach_history,
              this.state.licenta, this.state.poz, this.state.foot, this.state.nr, this.state.greutate, this.state.inaltime, this.state.accidentat, this.state.team.toString(), this.state.startDate, this.state.endDate).then((result) => {
                if (this.toastRef !== null) {
                  this.toastRef.clear();
                  this.toastRef.show({life: 5000, severity: 'success', summary: 'Adaugare cu succes !', detail: 'Jucator adaugat cu succes !'});
                  this.setState({
                    username: '',
                    password: '',
                    email: '',
                    licenta: '',
                    weight: '',
                    height: '',
                    team: [],
                    nr: 0,
                    nationalitate: '',
                    name: '',
                    poz: 0,
                    foot: 0,
                    greutate: 0,
                    inaltime: 0,
                    data_nasterii: '',
                    accidentat: '',
                    nr_tel: '',
                    cnp: '',
                    domiciliu: '',
                    team_history: '',
                    coach_history: '',
                    startDate: '',
                    endDate: ''
                  });
                  let inputText = document.querySelectorAll("#input-text");
                  inputText.forEach(function(item) {
                      item.value = '';
                  });
                }
              }).catch(error => {
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
    
          this.setState({list: lists});
          //alert("Utilizator adaugat cu succes !");
        } else if (flag === 1) {
          if (this.toastRef !== null) {
            this.toastRef.clear();
            this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Acest nume exista deja !'});
          }
        } else if (flag === 2) {
          if (this.toastRef !== null) {
            this.toastRef.clear();
            this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Acest numar exista deja !'});
          }
        }
       
      }
    } else if (this.state.disabledFlds === true) {
        let element = {"user_id": 0, "person_id": 0, "team_id": 0, "username": "", "id": 0, "nr": this.state.nr, "nationalitate": this.state.nationalitate, "varsta": 0, 
        "nume": this.state.name, "pozitie": "", "data_nasterii": this.state.data_nasterii, "accidentat": this.state.accidentat, "picior_preferat": "", "team_history": this.state.team_history, "coach_history": this.state.coach_history,
        "domiciliu" : this.state.domiciliu, "nr_tel" : this.state.nr_tel, "cnp" : this.state.cnp, "licenta" : this.state.licenta, "greutate" : this.state.greutate, "inaltime" : this.state.inaltime, "email" : this.state.email};
        let lists = this.state.list;
        let flag = 0;
        lists.forEach(function(item) {
          if(item['nume'].toLowerCase() === element['nume'].toLowerCase()) {
              flag = 1;
          } 
        });

        if (flag === 1) {
              let findPlayer = lists.filter((player) => {
                if (player['nume'].toLowerCase() === element['nume'].toLowerCase())
                  return player; 
              });
              if (findPlayer.length === 1 && this.state.team.length > 0) {
                element = findPlayer[0];

                  for (var i in this.state.team) {
                    element['team_id'] = this.state.team[i];
                    if (element['team_id'] !== this.state.selectedTeam)
                      this.props.handlePlayers('adaugare', element);
                  }
                
                  createPlayer(ls.get('token'), element['username'], "password", 0, 0,
                  element['nume'].substring(0, element['nume'].indexOf(" ")), element['nume'].substring(element['nume'].indexOf(" "), this.state.name.length), this.state.email,
                  this.state.nr_tel, this.state.cnp, this.state.nationalitate, element['data_nasterii'], this.state.domiciliu, this.state.team_history, this.state.coach_history,
                  this.state.licenta, this.state.poz, this.state.foot, this.state.nr, this.state.greutate, this.state.inaltime, this.state.accidentat, this.state.team.toString(), this.state.startDate, this.state.endDate).then((result) => {
                    if (this.toastRef !== null) {
                      this.toastRef.clear();
                      this.toastRef.show({life: 5000, severity: 'success', summary: 'Adaugare cu succes !', detail: 'Jucator adaugat cu succes !'});
                      this.setState({
                        username: '',
                        password: '',
                        email: '',
                        licenta: '',
                        weight: '',
                        height: '',
                        team: [],
                        nr: 0,
                        nationalitate: '',
                        name: '',
                        poz: 0,
                        foot: 0,
                        greutate: 0,
                        inaltime: 0,
                        data_nasterii: '',
                        accidentat: '',
                        nr_tel: '',
                        cnp: '',
                        domiciliu: '',
                        team_history: '',
                        coach_history: '',
                        startDate: '',
                        endDate: ''
                      });
                      let inputText = document.querySelectorAll("#input-text");
                      inputText.forEach(function(item) {
                          item.value = '';
                      });
                    }
                  }).catch(error => {
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
        
                  this.setState({list: lists});



              }
        } else {
          if (this.toastRef !== null) {
            this.toastRef.clear();
            this.toastRef.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Jucatorul nu a fost gasit in lista curenta !'});
          }
        }
    }
  }

  //Delete
  deleteItem(e) {
    
    if (this.state.dialogDelete === true) {
      let delPlayer = {};
      let lists = this.state.list;
      let players = this.state.playersList;
      var index = -1;
      let contor = -1;
      let element = this.state.element['nume'];
      let nr = this.state.element['nr'];
      lists.forEach(function(item) {
       
          contor++;  
        if (item['nume'] === element && item['nr'] === nr) {
          index = contor;
          delPlayer = item;
        }
        
      
      });
       if (index !== -1) {
        deletePlayer(ls.get('token'), delPlayer['person_id'], delPlayer['user_id'], delPlayer['team_id']).then((result) => {
          if (this.toastRef !== null) {
            this.toastRef.clear();
            this.toastRef.show({life: 5000, severity: 'success', summary: 'Stergere cu succes !', detail: 'Jucator sters cu succes !'});
          }
        }).catch((error) => {
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
        this.props.handlePlayers('stergere', delPlayer);
        this.setState({list: lists});  
        this.setState({
          dialogDelete: false
        });
       }
        
        // alert("Utilizator sters cu succes !");
    }
  }

  //Update
  modifyItem(e) {
      let pozitia = '', picior = '';
      this.state.listPlayPost.forEach((item) => {
        if (item['value'] === this.state.poz) {
          pozitia = item['label'];
        }
      });
      this.state.listPrefferedFoot.forEach((item) => {
        if (item['value'] === this.state.foot) {
          picior = item['label'];
        }
      });
      let data = this.state.data_nasterii;
      this.setState({
        data_nasterii: new Date(data).toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-")
      })
      let element = {"user_id": "", "person_id": "", "team_id": "", "id": this.state.id, "nr": this.state.nr, "nationalitate": this.state.nationalitate, "varsta": (new Date().getFullYear() - parseInt(new Date(data).toLocaleDateString("en-GB").replaceAll("/","-").split("-")[2])), 
      "nume": this.state.name, "pozitie": pozitia, "data_nasterii": new Date(this.state.data_nasterii).toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), "accidentat": this.state.accidentat, "picior_preferat": picior, "team_history": this.state.team_history, "coach_history": this.state.coach_history,
      "domiciliu" : this.state.domiciliu, "nr_tel" : this.state.nr_tel, "cnp" : this.state.cnp, "licenta" : this.state.licenta, "greutate" : this.state.greutate, "inaltime" : this.state.inaltime, "email" : this.state.email};
      let lists = this.state.list;
      let modifyPos = -1;
      lists.map((item, index) => {
          if (item['id'] === element['id']) {
            modifyPos = index;
            for (var key in element) {
              if (element.hasOwnProperty(key)) {
                  if (element[key] === '' || element[key] === 0) {
                    element[key] = item[key]; 
                  } 
              }
            }
          }
      });
      element['varsta'] = (new Date().getFullYear() - parseInt(new Date(element['data_nasterii']).toLocaleDateString("en-GB").replaceAll("/","-").split("-")[2]));
      let poz_id = 0;
      this.state.listPlayPost.map((item, index) => {
        if (item['label'] === element['pozitie']) {
         poz_id = item['value'];
        }
      });
      let foot_id = 0;
      this.state.listPrefferedFoot.map((item, index) => {
        if (item['label'] === element['picior_preferat']) {
          foot_id = item['value'];
        }
      });
      if (modifyPos !== -1) {
        updatePlayer(ls.get('token'), element['person_id'], element['nume'].substring(0, element['nume'].indexOf(" ")).trim(), element['nume'].substring(element['nume'].indexOf(" "), element['nume'].length).trim(),
        element['email'], element['nr_tel'], element['cnp'], element['nationalitate'], new Date(element['data_nasterii']).toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), element['domiciliu'], element['team_history'],
        element['coach_history'], element['licenta'], poz_id, foot_id, element['nr'], element['greutate'], element['inaltime'], element['accidentat']).then((result) => {
          if (this.toastRef !== null) {
            this.toastRef.clear();
            this.toastRef.show({life: 5000, severity: 'success', summary: 'Modificare cu succes !', detail: 'Jucator modificat cu succes !'});
           
          }
        }).catch((error) => {
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
        lists.splice(modifyPos, 1, element);
        this.props.handlePlayers('modificare', element);
      }

           
     
  }

  //^^^^^^^^^^^^^^^^^^^^  End of CRUD functions section^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // Show - Close Dialog's section
  popUpDialogModifyProfile1(rowData) {
    //{"user_id": item['user_id'], 
    //"username": item['username'], "person_id": item['person_id'], "team_id": item['team_id'],
    //"id": item['player_id'], "nr": item['shirt_number'],"nationalitate": item['nationality'],
    //"varsta": (new Date().getFullYear() - (moment(item['birthdate']).format("YYYY"))),
    //"nume": item['firstname'] + " " + item['lastname'], "team_history": item['team_history'], 
    //"coach_history": item['coach_history'], "picior_preferat": item['preffered_foot_desc'], 
    //"pozitie": item['play_post_desc'],"data_nasterii": moment(item['birthdate']).format("YYYY-MM-DD"),
    //"accidentat": item['injured'], "domiciliu" : item['full_address'], "nr_tel" : item['phone'], 
    //"cnp" : item['pic_cnp'], "licenta" : item['licence'], "greutate" : item['weight'], "inaltime" : item['height'], "email" : item['email']};

    /* poz: 0,
    listPlayPost: [],
    foot: 0,
    listPrefferedFoot: [],
    disabledFlds: false,
    startDate: "2021-05-14",
    endDate: "2021-05-14",
    id: '',
    nr: 0,
    username: '',
    password: '',
    nationalitate: '',
    name: '',
    data_nasterii: '',
    accidentat: '',
    domiciliu: '',
    nr_tel: '',
    cnp: '',
    licenta: '',
    greutate: 0,
    inaltime: 0,
    email: '',
    team_history: '',
    coach_history: '',
    teamsOptions: [],
    team: []
    */
   let valPoz=0, valFoot=0;
   if (this.state.listPrefferedFoot !== null && this.state.listPrefferedFoot !== undefined && this.state.listPrefferedFoot !== "") {
    this.state.listPrefferedFoot.forEach((item) => {
        if (item['label'] === rowData['picior_preferat']) {
          valFoot = item['value'];
        }
    });
  }
  if ( this.state.listPlayPost !== null &&  this.state.listPlayPost !== undefined &&  this.state.listPlayPost !== "") {
    this.state.listPlayPost.forEach((item) => {
      if (item['label'] === rowData['pozitie']) {
        valPoz = item['value'];
      }
    });
  }
    this.setState({
      dialogProfile1: true,
       id: rowData['id'],
       nr: rowData['nr'],
       username: rowData['username'],
       nationalitate: rowData['nationalitate'],
       name: rowData['nume'],
       data_nasterii: moment(rowData['data_nasterii']).format("YYYY-MM-DD"),
       accidentat: rowData['accidentat'],
       domiciliu: rowData['domiciliu'],
       nr_tel: rowData['nr_tel'],
       cnp: rowData['cnp'],
       licenta: rowData['licenta'],
       greutate: rowData['greutate'],
       inaltime: rowData['inaltime'],
       email: rowData['email'],
       team_history: rowData['team_history'],
       coach_history: rowData['coach_history'],
       foot: valFoot,
       poz: valPoz
    });

  }

  popUpDialogModifyProfile2(rowData) {

    let valPoz=0, valFoot=0;
    if (this.state.listPrefferedFoot !== null && this.state.listPrefferedFoot !== undefined && this.state.listPrefferedFoot !== "") {
      this.state.listPrefferedFoot.forEach((item) => {
          if (item['label'] === rowData['picior_preferat']) {
            valFoot = item['value'];
          }
      });
    }
    if ( this.state.listPlayPost !== null &&  this.state.listPlayPost !== undefined &&  this.state.listPlayPost !== "") {
      this.state.listPlayPost.forEach((item) => {
        if (item['label'] === rowData['pozitie']) {
          valPoz = item['value'];
        }
      });
    }
      this.setState({
        dialogProfile2: true,
        id: rowData['id'],
       nr: rowData['nr'],
       username: rowData['username'],
       nationalitate: rowData['nationalitate'],
       name: rowData['nume'],
       data_nasterii: moment(rowData['data_nasterii']).format("YYYY-MM-DD"),
       accidentat: rowData['accidentat'],
       domiciliu: rowData['domiciliu'],
       nr_tel: rowData['nr_tel'],
       cnp: rowData['cnp'],
       licenta: rowData['licenta'],
       greutate: rowData['greutate'],
       inaltime: rowData['inaltime'],
       email: rowData['email'],
       team_history: rowData['team_history'],
       coach_history: rowData['coach_history'],
       foot: valFoot,
       poz: valPoz
      });
  }

  popUpDialogModifyProfile3(rowData) {
    let valPoz=0, valFoot=0;
    if (this.state.listPrefferedFoot !== null && this.state.listPrefferedFoot !== undefined && this.state.listPrefferedFoot !== "") {
      this.state.listPrefferedFoot.forEach((item) => {
          if (item['label'] === rowData['picior_preferat']) {
            valFoot = item['value'];
          }
      });
    }
    if ( this.state.listPlayPost !== null &&  this.state.listPlayPost !== undefined &&  this.state.listPlayPost !== "") {
      this.state.listPlayPost.forEach((item) => {
        if (item['label'] === rowData['pozitie']) {
          valPoz = item['value'];
        }
      });
    }
    this.setState({
      dialogProfile3: true,
        id: rowData['id'],
        nr: rowData['nr'],
        username: rowData['username'],
        nationalitate: rowData['nationalitate'],
        name: rowData['nume'],
        data_nasterii: moment(rowData['data_nasterii']).format("YYYY-MM-DD"),
        accidentat: rowData['accidentat'],
        domiciliu: rowData['domiciliu'],
        nr_tel: rowData['nr_tel'],
        cnp: rowData['cnp'],
        licenta: rowData['licenta'],
        greutate: rowData['greutate'],
        inaltime: rowData['inaltime'],
        email: rowData['email'],
        team_history: rowData['team_history'],
        coach_history: rowData['coach_history'],
        foot: valFoot,
        poz: valPoz
    });
  }
  popUpDialogDelete(rowData) {
    this.setState({
      dialogDelete: true,
      element: rowData
    });
  }

  popUpDialogAdd(e) {
    
    this.setState({
      dialogAdd: true
    });
  }

  closePopWindow(e) {
    this.setState({
      dialogProfile1: false,
      dialogProfile2: false,
      dialogProfile3: false,
      dialogDelete: false,
      dialogAdd: false,
      username: '',
      password: '',
      email: '',
      licenta: '',
      weight: '',
      height: '',
      nr: 0,
      team: [],
      nationalitate: '',
      name: '',
      poz: 0,
      foot: 0,
      data_nasterii: '',
      accidentat: '',
      domiciliu: '',
      team_history: '',
      coach_history: '',
      element: {}
    });
  }
  //^^^^^^^^^^^^^^^^ End of Show - Close Dialog's section ^^^^^^^^^^^^^^^^^^^^

  render() {
    const editableBodyTemplate = (rowData) => {
      return (
        <React.Fragment>
            <Button onClick={() => this.expandRows(rowData)}><i className="fas fa-chevron-circle-down"></i></Button>
            <Button onClick={() => this.popUpDialogModifyProfile1(rowData)}><i className="fas fa-user-edit"></i></Button>
            <Button onClick={() => this.popUpDialogDelete(rowData)}><i className="fas fa-trash-alt"></i></Button>

        </React.Fragment>
      );
    } 

    const renderFooterAdd = () => {
      return (
        <React.Fragment>
          <Button label="Adaugare" onClick={this.addItem}/>
          <Button label="Anulare" onClick={this.closePopWindow}></Button>
        </React.Fragment>
      );
    }

    const renderFooterDelete = () => {
      return (
        <React.Fragment>
          <Button label="Stergere" onClick={this.deleteItem}/>
          <Button label="Anulare" onClick={this.closePopWindow}></Button>
        </React.Fragment>
      );
    }

    const renderFooterModify = () => {
      return (
        <React.Fragment>
          <Button label="Salvare" onClick={this.modifyItem}/>
          <Button label="Anulare" onClick={this.closePopWindow}></Button>
        </React.Fragment>
      );
    }
    const onHide = () => {
      this.setState({
        dialogProfile1: false,
        dialogProfile2: false,
        dialogProfile3: false,
        dialogDelete: false,
        dialogAdd: false
      });
    }
  return (
      <div id="table" className="datatable-responsive-demo">
          <div className="crud-operations">
            <Button label="Adaugare" onClick={this.popUpDialogAdd}/>
          </div>
          <Toast ref={(ref) => this.toastRef = ref}/>
              <Dialog id="pop-up" header="Ce jucator vrei sa adaugi ?" dismissableMask closable visible={this.state.dialogAdd} footer={renderFooterAdd} onHide={() => onHide()}>
              <div className="p-grid">
                    <div className='p-lg-12 p-md-12 p-sm-12'>
                            <label>Doriti sa adaugati un jucator din lista curenta si la alte echipe ?</label>
                            <br />
                            <label>Nu </label>
                            <InputSwitch checked={this.state.disabledFlds} onChange={(e) => this.setState({disabledFlds: e.value})} />
                            <label> Da </label>
                    </div>
                    
                    <Fieldset legend="Utilizator"
                              className={'p-lg-5 p-md-6 p-sm-12'}>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Nume utilizator</div>
                            <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.username} className="p-col-6"
                                       onChange={(e) => this.setState({ username: e.target.value})}
                                       placeholder="Aa" maxLength={100} required
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Parola</div>
                            <Password id="input-text" value={this.state.password} disabled={this.state.disabledFlds} className="pw-fit" placeholder="Aa"
                                      onChange={(e) => this.setState({password: e.target.value})} toggleMask required={true}/>
                        </div>
                    </Fieldset>
                    <Fieldset legend="Date personale 1"
                              className={'p-lg-5 p-md-6 p-sm-12'}>
                        {/*                        <div className="p-lg-6 p-md-12 p-sm-12">*/}
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Nume si Prenume jucator</div>
                            <InputText id="input-text" value={this.state.name} className="p-col-6"
                                       onChange={(e) => this.setState({name: e.target.value})}
                                       placeholder="Aa" maxLength={100} required
                            />
 
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Email</div>
                            <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.email} className="p-col-6"
                                       onChange={(e) => this.setState({ email: e.target.value})}
                                       placeholder="Aa" maxLength={100} required
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Telefon</div>
                            <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.nr_tel} className="p-col-6"
                                       onChange={(e) => this.setState({nr_tel: e.target.value})}
                                       placeholder="____ ___ ___" maxLength={100}
                            />
                        </div>
                    </Fieldset>
                    <Fieldset legend="Date personale 2"
                              className={'p-lg-5 p-md-6 p-sm-12'}>
                        {/*                        </div>
                        <div className="p-lg-6 p-md-12 p-sm-12">*/}
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">CNP</div>
                            <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.cnp} className="p-col-6"
                                       onChange={(e) => this.setState({cnp: e.target.value})}
                                       placeholder="Aa" maxLength={100}/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Nationalitate</div>
                            <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.nationalitate} className="p-col-6"
                                       onChange={(e) => this.setState({nationalitate: e.target.value})}
                                       placeholder="Aa" maxLength={100}
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Adresa</div>
                            <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.domiciliu} className="p-col-6"
                                       onChange={(e) => this.setState({domiciliu: e.target.value})}
                                       placeholder="Aa" maxLength={100}
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Greutate</div>
                            <InputNumber id="input-text" disabled={this.state.disabledFlds} value={this.state.greutate} className="p-col-6"
                                       onChange={(e) => this.setState({greutate: e.value})}
                                       placeholder="90" maxLength={100}
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Inaltime</div>
                            <InputNumber id="input-text" disabled={this.state.disabledFlds} value={this.state.inaltime} className="p-col-6"
                                       onChange={(e) => this.setState({inaltime: e.value})}
                                       placeholder="180" maxLength={100}
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Ziua de nastere</div>
                            <Calendar id="input-text" disabled={this.state.disabledFlds} value={this.state.data_nasterii} className="p-col-6"
                                      onChange={(e) => this.setState({data_nasterii: e.value})} yearRange="1900:2022"
                                      placeholder="____-__-__" showIcon yearNavigator={true}
                                      monthNavigator dateFormat="yy-mm-dd"/>
                        </div>
                    </Fieldset>
 
                    {/*</div>*/}
 
                   
                        <Fieldset legend="Profesional" className="p-lg-5 p-md-6 p-sm-12">
                            <div className="flex align-items-center p-mb-2">
                              <div className="p-col-6">Numar tricou</div>
                              <InputNumber id="input-text" disabled={this.state.disabledFlds} value={this.state.nr} className="p-col-6"
                                        onChange={(e) => this.setState({nr: e.value})}
                                        placeholder="xx" maxLength={100} required
                              />
 
                             </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Licenta</div>
                                <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.licenta} className="p-col-6"
                                           onChange={(e) => this.setState({licenta: e.target.value})}
                                           placeholder="Aa" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Echipe anterioare</div>
                                <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.team_history} className="p-col-6"
                                           onChange={(e) => this.setState({team_history: e.target.value})}
                                           placeholder="Aa" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Echipe</div>
                                <MultiSelect id="input-text" filter value={this.state.team} options={this.state.teamsOptions}
                                             optionalLabel="label" optionValue="value" className="p-col-6"
                                             onChange={(e) => this.setState({team: e.value})} placeholder="Alege o echipa"/>
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Pozitie de joc</div>
                                <Dropdown id="input-text" disabled={this.state.disabledFlds}  value={this.state.poz} 
                                onChange={(e) => {this.setState({poz: e.value})}} options={this.state.listPlayPost} 
                                className="p-col-6" optionLabel="label" optionValue="value" placeholder="Pozitie de joc" />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Picior preferat</div>
                                <Dropdown id="input-text" disabled={this.state.disabledFlds} value={this.state.foot} 
                                onChange={(e) => {this.setState({foot: e.value})}} options={this.state.listPrefferedFoot} 
                                className="p-col-6" optionLabel="label" optionValue="value" placeholder="Picior preferat"/>
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Este accidentat ?</div>
                                <InputText id="input-text" disabled={this.state.disabledFlds} value={this.state.accidentat}
                                 className="p-col-6" onChange={(e) => {this.setState({accidentat: e.target.value})}} placeholder="Este accidentat ? Da sau Nu"/>
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Data de inceput</div>
                                <Calendar id="icon1" disabled={this.state.disabledFlds} dateFormat="yy-mm-dd" placeholder="____-__-__" value={this.state.startDate}
                                 className="p-col-6" onChange={(e) => this.setState({ startDate: e.value })} showIcon />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Data de sfarsit</div>
                                <Calendar id="icon2" disabled={this.state.disabledFlds} dateFormat="yy-mm-dd" placeholder="____-__-__" value={this.state.endDate}
                                 className="p-col-6" onChange={(e) => this.setState({ endDate: e.value })} showIcon />
                            </div>
                        </Fieldset>
                       
                
              </div>
              </Dialog>
               <Dialog id="pop-up" header="Vrei sa stergi jucatorul ?" dismissableMask closable visible={this.state.dialogDelete} footer={renderFooterDelete} modal onHide={() => onHide()}>
              
                <ScrollPanel style={{width: '30vh', height: '100%'}}>
                  <label>Doresti sa stergi acest jucator ?</label>
                  <br />
                </ScrollPanel>
              </Dialog>
              <Dialog id="pop-up-modify" header="Vrei sa modifici jucatorul ?" dismissableMask closable visible={this.state.dialogProfile1} footer={renderFooterModify} modal onHide={() => onHide()}>
              <div className="p-grid">
                        <Fieldset legend="Profesional" className="p-lg-6 p-md-8 p-sm-12">
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Nume si Prenume jucator</div>
                                <InputText id="input-text" value={this.state.name} className="p-col-6"
                                          onChange={(e) => this.setState({name: e.target.value})}
                                          placeholder="Aa" maxLength={100} required
                                />
    
                            </div>
                            <div className="flex align-items-center p-mb-2">
                              <div className="p-col-6">Numar tricou</div>
                              <InputNumber id="input-text" value={this.state.nr} className="p-col-6"
                                        onChange={(e) => this.setState({nr: e.value})}
                                        placeholder="12" maxLength={100} required
                              />
 
                             </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Nationalitate</div>
                                <InputText id="input-text" value={this.state.nationalitate} className="p-col-6"
                                          onChange={(e) => this.setState({nationalitate: e.target.value})}
                                          placeholder="Aa" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Pozitie de joc</div>
                                <Dropdown id="input-text" value={this.state.poz} 
                                onChange={(e) => {this.setState({poz: e.value})}} options={this.state.listPlayPost} 
                                className="p-col-6" optionLabel="label" optionValue="value" placeholder="Pozitie de joc" />
                            </div>
                           
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Este accidentat ?</div>
                                <InputText id="input-text" value={this.state.accidentat} className="p-col-6"
                                 onChange={(e) => {this.setState({accidentat: e.target.value})}} placeholder="Este accidentat ? Da sau Nu"/>
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Ziua de nastere</div>
                                <Calendar id="input-text" value={this.state.data_nasterii} className="p-col-6"
                                          onChange={(e) => this.setState({data_nasterii: e.value})} yearRange="1900:2021"
                                          placeholder="____-__-__" showIcon yearNavigator={true}
                                          monthNavigator dateFormat="yy-mm-dd"/>
                            </div>
                        </Fieldset> 
              </div>
              </Dialog>
               <Dialog id="pop-up" header="Vrei sa modifici datele ?" dismissableMask closable visible={this.state.dialogProfile2} footer={renderFooterModify} modal onHide={() => onHide()}>
               <div className="p-grid">

                      <Fieldset legend="Subtabel 1" className="p-lg-12 p-md-12 p-sm-12">
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Domiciliu</div>
                                <InputText id="input-text" value={this.state.domiciliu} className="p-col-6"
                                          onChange={(e) => this.setState({domiciliu: e.target.value})}
                                          placeholder="Aa" maxLength={100} required
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Picior preferat</div>
                                <Dropdown id="input-text" value={this.state.foot} 
                                onChange={(e) => {this.setState({foot: e.value})}} options={this.state.listPrefferedFoot} 
                                className="p-col-6" optionLabel="label" optionValue="value" placeholder="Picior preferat"/>
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Telefon</div>
                                <InputText id="input-text" value={this.state.nr_tel} className="p-col-6"
                                          onChange={(e) => this.setState({nr_tel: e.target.value})}
                                          placeholder="____ ___ ___" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">CNP</div>
                                <InputText id="input-text" value={this.state.cnp} className="p-col-6"
                                          onChange={(e) => this.setState({cnp: e.target.value})}
                                          placeholder="Aa" maxLength={100}/>
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Antrenori anteriori</div>
                                <InputText id="input-text" value={this.state.coach_history} className="p-col-6"
                                           onChange={(e) => this.setState({coach_history: e.target.value})}
                                           placeholder="Aa" maxLength={100}
                                />
                            </div>
                    </Fieldset> 
               </div>
              </Dialog>
               <Dialog id="pop-up" header="Vrei sa modifici datele ?" dismissableMask closable visible={this.state.dialogProfile3} footer={renderFooterModify} modal onHide={() => onHide()}>
               <div className="p-grid">

                      <Fieldset legend="Subtabel 2" className="p-lg-12 p-md-12 p-sm-12">
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Licenta</div>
                                <InputText id="input-text" value={this.state.licenta} className="p-col-6"
                                           onChange={(e) => this.setState({licenta: e.target.value})}
                                           placeholder="Aa" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Greutate</div>
                                <InputNumber id="input-text" value={this.state.greutate} className="p-col-6"
                                          onChange={(e) => this.setState({greutate: e.value})}
                                          placeholder="90" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Inaltime</div>
                                <InputNumber id="input-text" value={this.state.inaltime} className="p-col-6"
                                          onChange={(e) => this.setState({inaltime: e.value})}
                                          placeholder="180" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-mr-2 p-col-6">Email</div>
                                <InputText id="input-text" value={this.state.email} className="p-col-6"
                                          onChange={(e) => this.setState({ email: e.target.value})}
                                          placeholder="Aa" maxLength={100} required
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Echipe anterioare</div>
                                <InputText id="input-text" value={this.state.team_history} className="p-col-6"
                                           onChange={(e) => this.setState({team_history: e.target.value})}
                                           placeholder="Aa" maxLength={100}
                                />
                            </div>
                    </Fieldset> 
               </div>
              </Dialog>
          <div className="card">
              <DataTable value={this.state.list} key={this.state.list.nume} rowExpansionTemplate={this.bodyTemplate} expandedRows={this.state.expandedRow} ExpansionTemplate={this.bodyTemplate(this.state.expandedTable)} dataKey="id" className="p-datatable-responsive-demo">
                  <Column field="nr" header="Nr." sortable/>
                  <Column field="nationalitate" header="Nationalitate" sortable/>
                  <Column field="varsta" header="Varsta" sortable/>
                  <Column field="nume" header="Nume Jucator" sortable/>
                  <Column field="pozitie" header="Pozitie" sortable/>
                  <Column field="data_nasterii" header="Data nasterii" sortable/>
                  <Column field="accidentat" header="Accidentat" sortable/>
                  <Column body={editableBodyTemplate} />
              </DataTable>
          </div>
      </div>

    );
  }
}

export default Table;
