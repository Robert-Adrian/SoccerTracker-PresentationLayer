import React from 'react'
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import '../styles/UserCard.css';
import '../styles/Common.css';
import {ConfirmPopup} from 'primereact/confirmpopup';
import {confirmPopup} from 'primereact/confirmpopup';
import {Toast} from 'primereact/toast';
import {
    showSuccessWithMessage,
    showErrorWithMessage,
    showInfoWithMessage,
    showWarnWithMessage,
    showSuccess,
    showError
} from "../services/toast.service";
import ls from 'local-storage';

import {
    changeUserPassword,
    createUserTeamMap,
    deleteAllOfUser,
    deleteUser,
    updateAcademy_Leader,
    updateAdmin,
    updateCoach,
    updatePhysical_Trainer,
    updatePsychologist
} from '../services/administration.service';
import {Dialog} from "primereact/dialog";
import {TabPanel} from "@material-ui/lab";
import {TabView} from "primereact/tabview";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {InputSwitch} from "primereact/inputswitch.js";
import {isNullOrEmpty} from "../services/array.service";
import {MultiSelect} from "primereact/multiselect";
import {Fieldset} from "primereact/fieldset";
import {Password} from "primereact/password";
import moment from 'moment';
/*
 * Props: userData containing all data from users, person and coach/admin/academy_leader/pshychologist/physical_trainer
 * Props: notificationRef: toast object to print message
 * Props: allUsers state to update the page component when deleting
 */
//TODO Decouple allUsers and setAllUsers to another class/function component
//TODO add picture change in update
export default function UserCard(props) {

    const [visibleDelDlg, setVisibleDelDlg] = React.useState(false);
    const [visibleViewDlg, setVisibleViewDlg] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const [viewOrUpdate, setViewOrUpdate] = React.useState(false);

    let username = props.userData.username;
    let active_desc = props.userData.active_desc;
    let role_desc = props.userData.role_desc;

    const [firstname, setFirstname] = React.useState(props.userData.firstname);
    const [lastname, setLastname] = React.useState(props.userData.lastname);
    const [email, setEmail] = React.useState(props.userData.email);
    const [phone, setPhone] = React.useState(props.userData.phone);
    const [pic_cnp, setPic_cnp] = React.useState(props.userData.pic_cnp);
    const [nationality, setNationality] = React.useState(props.userData.nationality);
    const [birthdate, setBirthdate] = React.useState(new Date(props.userData.birthdate));
    const [full_address, setFull_address] = React.useState(props.userData.full_address);
    const [teams, setTeams] = React.useState(props.teams);
    /*
     * Here will be all attributes for all roles
     */
    const [team_history, setTeam_history] = React.useState(props.userData.team_history);
    const [licence, setLicence] = React.useState(props.userData.licence);

    const [newPassword, setNewPassword] = React.useState();
    const [showNewPwDlg, setShowNewPwDlg] = React.useState(false);

    const deleteFromUsersArray = () => {
        const user_id = props.userData.user_id;
        const usersArray = props.allUsers;
        const newArray = [];
        if (!isNullOrEmpty(usersArray)) {
            usersArray.filter(item => item.user_id !== user_id).map(item => newArray.push(item))
            //console.log(newArray);
        }
        props.setAllUsers(newArray);
    }

    const updateInUsersArray = () => {
        const user_id = props.userData.user_id;
        const usersArray = props.allUsers;

        if (isNullOrEmpty(usersArray)) {
            usersArray.forEach(user => {
                if (user.user_id === user_id)
                    user = getNewUpdatedObject();
            });
        }
    }


    const execDeleteUser = () => {
        deleteUser(ls.get('token'), props.userData.user_id)
            .then(res => {
                if (res == null || res == undefined || res == '')
                    showWarnWithMessage(props.notificationRef, "Nu s-a putut sterge!");
                else {
                    showSuccess(props.notificationRef);
                    deleteFromUsersArray();
                }
            }).catch(err => {
            showError(props.notificationRef);
            console.log(err);
        })
    }

    const getNewUpdatedObject = () => {
        const currentObj = props.userData;

        currentObj.firstname = firstname;
        currentObj.lastname = lastname;
        currentObj.email = email;
        currentObj.phone = phone;
        currentObj.pic_cnp = pic_cnp;
        currentObj.nationality = nationality;
        currentObj.birthdate = birthdate != null ? moment(birthdate).format() : null;
        currentObj.full_address = full_address;
        /*TODO change if with switch for each role (in case table with specific roles will have different columns)*/
        if (currentObj.role_id !== 5) {
            currentObj.team_history = team_history;
            currentObj.licence = licence;
        }
        return currentObj;
    }

    const execUpdateUser = () => {
        switch (props.userData.role_id) {
            case 1:
                updateCoach(ls.get('token'), getNewUpdatedObject())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(props.notificationRef, "Nu s-a putut modifica!");
                        else {
                            showSuccess(props.notificationRef);
                            deleteAllOfUser(ls.get('token'), props.userData.user_id)
                                .then(res => {
                                    console.log(res);
                                    addInTeamUserMap(props.userData.user_id);
                                }).catch(err => {
                                console.log(err);
                                showError(props.notificationRef);
                            });

                            //updateInUsersArray();
                        }
                    }).catch(err => {
                    showError(props.notificationRef);
                    console.log(err);
                });
                break;
            case 2:
                updatePhysical_Trainer(ls.get('token'), getNewUpdatedObject())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(props.notificationRef, "Nu s-a putut modifica!");
                        else {
                            showSuccess(props.notificationRef);
                            deleteAllOfUser(ls.get('token'), props.userData.user_id)
                                .then(res => {
                                    console.log(res);
                                    addInTeamUserMap(props.userData.user_id);
                                }).catch(err => {
                                console.log(err);
                                showError(props.notificationRef);
                            });

                            //updateInUsersArray();
                        }
                    }).catch(err => {
                    showError(props.notificationRef);
                    console.log(err);
                });
                break;
            case 3:
                updatePsychologist(ls.get('token'), getNewUpdatedObject())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(props.notificationRef, "Nu s-a putut modifica!");
                        else {
                            showSuccess(props.notificationRef);
                            deleteAllOfUser(ls.get('token'), props.userData.user_id)
                                .then(res => {
                                    console.log(res);
                                    addInTeamUserMap(props.userData.user_id);
                                }).catch(err => {
                                console.log(err);
                                showError(props.notificationRef);
                            });

                            //updateInUsersArray();
                        }
                    }).catch(err => {
                    showError(props.notificationRef);
                    console.log(err);
                });
                break;
            case 4:
                updateAcademy_Leader(ls.get('token'), getNewUpdatedObject())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(props.notificationRef, "Nu s-a putut modifica!");
                        else {
                            showSuccess(props.notificationRef);
                            deleteAllOfUser(ls.get('token'), props.userData.user_id)
                                .then(res => {
                                    console.log(res);
                                    addInTeamUserMap(props.userData.user_id);
                                }).catch(err => {
                                console.log(err);
                                showError(props.notificationRef);
                            });

                            //updateInUsersArray();
                        }
                    }).catch(err => {
                    showError(props.notificationRef);
                    console.log(err);
                });
                break;
            case 5:
                updateAdmin(ls.get('token'), getNewUpdatedObject())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(props.notificationRef, "Nu s-a putut modifica!");
                        else {
                            showSuccess(props.notificationRef);
                            deleteAllOfUser(ls.get('token'), props.userData.user_id)
                                .then(res => {
                                    console.log(res);
                                    addInTeamUserMap(props.userData.user_id);
                                }).catch(err => {
                                console.log(err);
                                showError(props.notificationRef);
                            });

                            //updateInUsersArray();
                        }
                    }).catch(err => {
                    showError(props.notificationRef);
                    console.log(err);
                });
                break;
        }
    }

    const header = (
        <img alt="Card" src="showcase/demo/images/usercard.png"
             style={{borderRadius: "50%", width: "50%", height: "50%"}}
             onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}/>
    );
    const footer = (
        <span className="p-grid display-block">
                <Button id={'viewBtn_' + props.userData.user_id} label="Vizualizeaza"
                        onClick={() => setVisibleViewDlg(true)} className="p-col-8 p-mb-2"
                        icon="pi pi-eye"/>
                <Button id={'delBtn_' + props.userData.user_id} label="Sterge" icon="pi pi-trash"
                        className="p-col-8 p-mb-2 p-button-danger "
                        onClick={() => setVisibleDelDlg(true)}/>
                <Button id={'changepw_' + props.userData.user_id} label="Schimba parola"
                        icon="pi pi-lock"
                        onClick={() => setShowNewPwDlg(true)}
                        className="p-col-8 p-button-warning"/>
            </span>
    );

    const addInTeamUserMap = (user_id) => {
        teams.forEach(team_id => {
            createUserTeamMap(ls.get('token'), getTeamUserMapObj(user_id, team_id))
                .then(res => {
                    console.log(res);
                    //showSuccess(notificationRef);
                }).catch(err => {
                showError(props.notificationRef);
                console.log(err);
            })
        });
    }

    const getTeamUserMapObj = (user_id, team_id) => {
        return {
            team_id: team_id,
            user_id: user_id
        }
    }

    const execChangeUserPw = () => {
        changeUserPassword(ls.get('token'), changePwObj())
            .then(res => {
                if (res.data == null || res.data == undefined || res.data === '') {
                    showWarnWithMessage(props.notificationRef, "Nu s-a putut modifica parola!");
                } else {
                    changeUserPwInAllUserArray();
                    showSuccess(props.notificationRef);
                }
            }).catch(err => {
            showError(props.notificationRef);
            console.log(err);
        })
    }

    const changeUserPwInAllUserArray = () => {
        const newArray = props.allUsers;

        newArray.forEach(user => {
            if (user.username == username) {
                user.password = newPassword;
                props.setAllUsers(newArray);
                return;
            }
        })
    }

    const changePwObj = () => {
        return {
            username: username,
            password: newPassword
        }
    }

    return (
        <>
            <Card title={props.userData.firstname + ' ' + props.userData.lastname}
                  subTitle={props.userData.role_desc}
                  className="p-lg-2 p-md-4 p-sm-12 p-ml-3 shortTitle centeredFooter centeredCard p-m-2"
                  header={header} footer={footer}>
            </Card>
            <ConfirmPopup target={document.getElementById('delBtn_' + props.userData.user_id)} visible={visibleDelDlg}
                          onHide={() => setVisibleDelDlg(false)}
                          acceptLabel="Sterge" rejectLabel="Inapoi" className="confirm-popup-del-header"
                          acceptClassName="p-button-danger"
                          message={"Esti sigur ca vrei sa stergi utilizatorul " + props.userData.firstname + ' ' + props.userData.lastname + "? Odata sters, toate datele asociate lui vor disparea complet!"}
                          icon="pi pi-exclamation-triangle" accept={() => execDeleteUser()}
                          reject={() => setVisibleDelDlg(false)}/>

            <Dialog header="Vizualizare si modificare" visible={visibleViewDlg} modal closable={true} draggable={true}
                    onHide={() => setVisibleViewDlg(false)} className="dlg-update-color-header">
                <div className="float-right p-mb-5 p-pb-2 txt-align-webkit-right bottom-line-separator">
                    <span className="vertical-align-super font-size-18">Vizualizeaza</span>
                    <InputSwitch className="p-mr-2 p-ml-2" checked={viewOrUpdate}
                                 onChange={(e) => setViewOrUpdate(e.value)}/>
                    <span className="vertical-align-super font-size-18">Modifica</span>
                </div>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}
                         className="usercard-tabview">
                    <TabPanel header="Utilizator">
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Nume utilizator</div>
                            <InputText id="username" className="p-col-6" value={username || ''} readOnly={true}
                                       disabled={!viewOrUpdate}/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Statut cont</div>
                            <InputText id="active_desc" className="p-col-6" value={active_desc || ''} readOnly={true}
                                       disabled={!viewOrUpdate}/>
                        </div>
                        <div className="flex align-items-center">
                            <div className="p-mr-2 p-col-6">Rol</div>
                            <InputText id="role" className="p-col-6" value={role_desc || ''} readOnly={true}
                                       disabled={!viewOrUpdate}/>
                        </div>
                    </TabPanel>
                    <TabPanel header="Personal" className="display-block p-grid">
                        {/*                        <div className="p-lg-6 p-md-12 p-sm-12">*/}
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Prenume</div>
                            <InputText id="firstname" value={firstname || ''} className="p-col-6"
                                       onChange={(e) => setFirstname(e.target.value)}
                                       placeholder="Aa" maxLength={100} required
                                       disabled={!viewOrUpdate}/>

                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Nume</div>
                            <InputText id="lastname" value={lastname || ''} className="p-col-6"
                                       onChange={(e) => setLastname(e.target.value)}
                                       placeholder="Aa" maxLength={100} required disabled={!viewOrUpdate}/>
                        </div>

                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Email</div>
                            <InputText id="email" value={email || ''} className="p-col-6"
                                       onChange={(e) => setEmail(e.target.value)}
                                       placeholder="Aa" maxLength={100} required disabled={!viewOrUpdate}/>
                        </div>

                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Telefon</div>
                            <InputText id="phone" value={phone || ''} className="p-col-6"
                                       onChange={(e) => setPhone(e.target.value)}
                                       placeholder="____ ___ ___" maxLength={100} required
                                       disabled={!viewOrUpdate}/>
                        </div>
                        {/*                        </div>
                        <div className="p-lg-6 p-md-12 p-sm-12">*/}
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">CNP</div>
                            <InputText id="pic_cnp" value={pic_cnp || ''} className="p-col-6"
                                       onChange={(e) => setPic_cnp(e.target.value)}
                                       placeholder="Aa" maxLength={100} required disabled={!viewOrUpdate}/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Nationalitate</div>
                            <InputText id="nationality" value={nationality || ''} className="p-col-6"
                                       onChange={(e) => setNationality(e.target.value)}
                                       placeholder="Aa" maxLength={100} required
                                       disabled={!viewOrUpdate}/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Adresa</div>
                            <InputText id="full_address" value={full_address || ''} className="p-col-6"
                                       onChange={(e) => setFull_address(e.target.value)}
                                       placeholder="Aa" maxLength={100} required
                                       disabled={!viewOrUpdate}/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Data nasterii</div>
                            <Calendar id="birthdate" value={birthdate || ''} className="p-col-6"
                                      onChange={(e) => setBirthdate(e.value)} yearRange="1900:2021"
                                      placeholder="__/__/____" required showIcon yearNavigator={true}
                                      monthNavigator disabled={!viewOrUpdate}/>
                        </div>
                        {/*</div>*/}
                    </TabPanel>
                    <TabPanel header="Profesional">
                        {(props.userData.role_id !== 5 &&
                            <div>
                                <div className="flex align-items-center p-mb-2">
                                    <div className="p-col-6">Licenta</div>
                                    <InputText id="licence" value={licence || ''} className="p-col-6"
                                               onChange={(e) => setLicence(e.target.value)}
                                               placeholder="Aa" maxLength={100} required
                                               disabled={!viewOrUpdate}/>
                                </div>
                                <div className="flex align-items-center p-mb-2">
                                    <div className="p-col-6">Echipe anterioare</div>
                                    <InputText id="team_history" value={team_history || ''} className="p-col-6"
                                               onChange={(e) => setTeam_history(e.target.value)}
                                               placeholder="Aa" maxLength={100} required
                                               disabled={!viewOrUpdate}/>
                                </div>
                                <div className="flex align-items-center p-mb-2">
                                    <div className="p-col-6">Echipe</div>
                                    <MultiSelect value={teams} options={props.allTeams} className="width-50-p"
                                                 onChange={(e) => setTeams(e.value)} disabled={!viewOrUpdate}
                                                 optionLabel="team_name" optionValue="team_id" placeholder="Alege"/>
                                </div>

                            </div>
                        ) || (<div>Administratorul nu contine date profesionale</div>)}
                    </TabPanel>


                </TabView>
                <Button className="center" icon="pi pi-user-edit" disabled={!viewOrUpdate}
                        label="Modifica"
                        onClick={() => {
                            execUpdateUser();
                            setVisibleViewDlg(false);
                        }}/>
            </Dialog>
            <Dialog header="Schimba parola" visible={showNewPwDlg} modal closable={true} draggable={true}
                    onHide={() => setShowNewPwDlg(false)} className="dlg-warn-color-header">
                <Fieldset legend="Date noi">
                    <div className="flex align-items-center p-mb-2">
                        <div className="p-mr-2 p-col-6">Parola noua</div>
                        <Password value={newPassword} className="pw-fit" placeholder="Aa"
                                  onChange={(e) => setNewPassword(e.target.value)} toggleMask required={true}/>

                    </div>
                </Fieldset>
                <Button className="center" icon="pi pi-lock"
                        label="Modifica"
                        onClick={() => {
                            execChangeUserPw();
                            setShowNewPwDlg(false);
                        }}/>
            </Dialog>
        </>
    )
}