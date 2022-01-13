import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React, {useRef} from 'react';
import '../styles/Administration.css';
import '../styles/Common.css';
import '../styles/DropDownDemo.css';
import {Panel} from "primereact/panel";
import {
    createAcademy_Leader,
    createAdmin,
    createCoach, createPhysical_Trainer, createPsychologist, createUserTeamMap,
    getAllActiveStatus,
    getAllRoles,
    getAllUsers, getAllUserTeamMapOfUserId, getFullUserDataByUserId, updateAcademy_Leader, updateAdmin,
    updateCoach,
    updatePhysical_Trainer, updatePsychologist
} from '../services/administration.service';
import {createTeam, getAllTeams} from '../services/team.service';
import {isNullOrEmpty} from '../services/array.service';
import UserCard from '../components/UserCard';
import ls from 'local-storage';
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {TabView} from "primereact/tabview";
import {TabPanel} from "@material-ui/lab";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {showError, showSuccess, showWarnWithMessage} from "../services/toast.service";
import {Password} from "primereact/password";
import SkeletonUserCard from '../components/SkeletonUserCard';
import {Fieldset} from "primereact/fieldset";
import TeamCard from "../components/TeamCard";
import SkeletonTeamCard from "../components/SkeletonTeamCard";
import '../styles/MultiSelect.css'
import {MultiSelect} from "primereact/multiselect";
import moment from 'moment';

//TODO Add activate/deactivate btn
export default function Administration() {
    const notificationRef = useRef(null);
    const [allUsers, setAllUsers] = React.useState([]);
    //const [usersComponents,setUserComponents] = React.useState([]);
    const [allTeams, setAllTeams] = React.useState([]);
    const newUsers = [];
    const newTeams = [];
    const [addUserDlg, setAddUserDlg] = React.useState(false);
    const [addTeamDlg, setAddTeamDlg] = React.useState(false);
    const [allRoles, setAllRoles] = React.useState([]);
    const allRolesAsOption = [];
    const [allActiveStatus, setAllActiveStatus] = React.useState([]);
    const allActiveStatusAsOption = [];

    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [activeId, setActiveId] = React.useState(1);
    const [roleId, setRoleId] = React.useState(1);

    const [firstname, setFirstname] = React.useState();
    const [lastname, setLastname] = React.useState();
    const [email, setEmail] = React.useState();
    const [phone, setPhone] = React.useState();
    const [pic_cnp, setPic_cnp] = React.useState();
    const [nationality, setNationality] = React.useState();
    const [birthdate, setBirthdate] = React.useState();
    const [full_address, setFull_address] = React.useState();

    /*
     * Here will be all attributes for all roles
     */
    const [team_history, setTeam_history] = React.useState();
    const [licence, setLicence] = React.useState();
    const [selectedTeams, setSelectedTeams] = React.useState([]);

    const [teamName, setTeamName] = React.useState();

    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        const clonedAllRoles = [];
        const clonedAllActiveStatus = []

        getAllRoles(ls.get('token')).then(res => {
            if (res != null && res.length !== 0 && res[0] !== undefined) {
                res.forEach(item => {
                    clonedAllRoles.push(item);
                });
                for (let i = 0; i < clonedAllRoles.length; i++) {
                    if (clonedAllRoles[i].role_id === 0) {
                        clonedAllRoles.splice(i, 1);
                        break;
                    }
                }
                setAllRoles(clonedAllRoles);
            }
        });

        getAllActiveStatus(ls.get('token')).then(res => {
            if (res != null && res.length !== 0 && res[0] !== undefined) {
                res.forEach(item => {
                    clonedAllActiveStatus.push(item);
                })
                setAllActiveStatus(clonedAllActiveStatus);
            }

        });

        getAllUsers(ls.get('token'))
            .then(data => {
                data.forEach(roleArray => {
                    if (!isNullOrEmpty(roleArray)) {
                        roleArray.forEach(singleUser => {
                            newUsers.push(singleUser);
                        });
                    }
                });
                setAllUsers(newUsers);
            })
            .catch(err => {
                console.log(err);
            });


        getAllTeams(ls.get('token'))
            .then(data => {
                data.forEach(team => {
                    newTeams.push(team);
                });
                setAllTeams(newTeams);

            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    React.useEffect(() => {
        clearTimeout(ls.get('timeOut'));
    });

    const getObjectToAddWithUserId = (user_id) => {
        //TODO with switch for each role, in case some roles gets another columns
        if (roleId !== 5)
            return {
                user_id: user_id,
                username: username,
                password: password,
                active_id: activeId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                pic_cnp: pic_cnp,
                nationality: nationality,
                birthdate: birthdate,
                full_address: full_address,
                team_history: team_history,
                licence: licence
            };
        else
            return {
                user_id: user_id,
                username: username,
                password: password,
                active_id: activeId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                pic_cnp: pic_cnp,
                nationality: nationality,
                birthdate: birthdate,
                full_address: full_address
            };
    }

    const getObjectToAdd = () => {
        if (roleId !== 5)
            return {
                username: username,
                password: password,
                active_id: activeId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                pic_cnp: pic_cnp,
                nationality: nationality,
                birthdate: birthdate != null ? moment(birthdate).format() : null,
                full_address: full_address,
                team_history: team_history,
                licence: licence
            };

        else
            return {
                username: username,
                password: password,
                active_id: activeId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                pic_cnp: pic_cnp,
                nationality: nationality,
                birthdate: birthdate != null ? moment(birthdate).format() : null,
                full_address: full_address
            };
    }

    const execCreateUser = () => {
        switch (roleId) {
            case 1:
                createCoach(ls.get('token'), getObjectToAdd())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(notificationRef, "Nu s-a putut adauga!");
                        else {
                            showSuccess(notificationRef);
                            addInTeamUserMap(res.data);
                            addInAllUsersArrayAndReinit(res.data);
                            //reinitAddUserFields();
                        }
                    }).catch(err => {
                    showError(notificationRef);
                    console.log(err);
                });
                break;
            case 2:
                createPhysical_Trainer(ls.get('token'), getObjectToAdd())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(notificationRef, "Nu s-a putut adauga!");
                        else {

                            showSuccess(notificationRef);
                            addInTeamUserMap(res.data);
                            addInAllUsersArrayAndReinit(res.data);
                            //reinitAddUserFields();
                        }
                    }).catch(err => {
                    showError(notificationRef);
                    console.log(err);
                });
                break;
            case 3:
                createPsychologist(ls.get('token'), getObjectToAdd())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(notificationRef, "Nu s-a putut adauga!");
                        else {

                            showSuccess(notificationRef);
                            addInTeamUserMap(res.data);
                            addInAllUsersArrayAndReinit(res.data);
                            //reinitAddUserFields();
                        }
                    }).catch(err => {
                    showError(notificationRef);
                    console.log(err);
                });
                break;
            case 4:
                createAcademy_Leader(ls.get('token'), getObjectToAdd())
                    .then((res) => {
                        if (res == null || res == undefined || res === '')
                            showWarnWithMessage(notificationRef, "Nu s-a putut adauga!");
                        else {
                            showSuccess(notificationRef);
                            addInTeamUserMap(res.data);
                            addInAllUsersArrayAndReinit(res.data);
                            //reinitAddUserFields();
                        }
                    }).catch(err => {
                    showError(notificationRef);
                    console.log(err);
                });
                break;
            case 5:
                createAdmin(ls.get('token'), getObjectToAdd())
                    .then((res) => {
                        if (res == null || res == undefined || res == '')
                            showWarnWithMessage(notificationRef, "Nu s-a putut adauga!");
                        else {

                            showSuccess(notificationRef);
                            addInTeamUserMap(res.data);
                            addInAllUsersArrayAndReinit(res.data);
                            //reinitAddUserFields();
                        }
                    }).catch(err => {
                    showError(notificationRef);
                    console.log(err);
                });
                break;

        }
    }

    const addInTeamUserMap = (user_id) => {
        selectedTeams.forEach(team_id => {
            createUserTeamMap(ls.get('token'), getTeamUserMapObj(user_id, team_id))
                .then(res => {
                    //console.log(res);
                    //showSuccess(notificationRef);
                }).catch(err => {
                showError(notificationRef);
                console.log(err);
            })
        });
    }

    const reinitAddUserFields = () => {
        setUsername(null);
        setPassword(null);
        setRoleId(1);
        setActiveId(1);
        setFirstname(null);
        setLastname(null);
        setEmail(null);
        setPhone(null);
        setPic_cnp(null);
        setNationality(null);
        setFull_address(null);
        setBirthdate(null);
        setTeam_history(null);
        setLicence(null);
        setSelectedTeams([]);
    }

    const addInAllUsersArrayAndReinit = (user_id) => {
        const newArray = allUsers;
        getFullUserDataByUserId(ls.get('token'), user_id)
            .then(res => {
                newArray.push(res);
                setAllUsers(newArray);
                reinitAddUserFields();
            }).catch(err => {
            showError(notificationRef);
            console.log(err);
        });
        /*        newArray.push(getObjectToAddWithUserId(user_id));
                setAllUsers(newArray);*/
    }

    /*    const createUserCards = () => {
            usersComponents = [];
            allUsers.map(user=>{
                usersComponents.push(<UserCard userData={user} notificationRef={notificationRef}
                                               allUsers={allUsers} setAllUsers={setAllUsers}/>);
            })
        }*/
    const reinitTeamFields = () => {
        setTeamName(null);
    }

    const getTeamObjToAdd = () => {
        return {
            team_name: teamName
        }
    }

    const addInTeamArray = (team_id, team_name) => {
        const newTeamArray = allTeams;
        newTeamArray.push({team_id: team_id, team_name: team_name});

        setAllTeams(newTeamArray);
    }

    const execCreateTeam = () => {
        createTeam(ls.get('token'), getTeamObjToAdd())
            .then((res) => {
                if (res == null || res == undefined || res == '')
                    showWarnWithMessage(notificationRef, "Nu s-a putut adauga!");
                else {
                    showSuccess(notificationRef);
                    addInTeamArray(res.team_id, teamName);
                    reinitTeamFields();
                }
            }).catch(err => {
            showError(notificationRef);
            console.log(err);
        })
    }

    const getTeamUserMapObj = (user_id, team_id) => {
        return {
            team_id: team_id,
            user_id: user_id
        }
    }
    return (
        <div className="Administration p-grid">
            <Toast ref={notificationRef} position="top-right"></Toast>
            <Panel header="Utilizatori" className="p-col-12">
                <div className="p-grid">
                    {
                        allUsers.map(user => {
                            const teams = [];
                            getAllUserTeamMapOfUserId(ls.get('token'), user.user_id)
                                .then(res => {
                                    if (res == null || res == undefined || res == '') {
                                    } else {
                                        res.forEach(item => {
                                            teams.push(item.team_id);

                                        });
                                    }

                                }).catch(err => {
                                console.log(err);
                            })
                            return <UserCard userData={user} notificationRef={notificationRef} key={user.user_id}
                                             allUsers={allUsers} setAllUsers={setAllUsers}
                                             teams={teams} allTeams={allTeams}/>
                        })

                    }

                    <SkeletonUserCard ClickFunction={() => setAddUserDlg(true)}/>
                </div>
            </Panel>
            <Panel header="Echipe" className="p-col-12">
                <div className="p-grid">
                    <>
                        {allTeams.map(team => {
                            return <TeamCard team={team} allTeams={allTeams} setAllTeams={setAllTeams}
                                             key={team.team_id}
                                             notificationRef={notificationRef}/>
                        })
                        }
                    </>

                    <SkeletonTeamCard ClickFunction={() => setAddTeamDlg(true)}/>
                </div>
            </Panel>

            <Dialog header="Adauga utilizator" visible={addUserDlg} modal closable={true}
                    className="add_user_dlg dlg-add-color-header"
                    draggable={true}
                    onHide={() => setAddUserDlg(false)}>
                <div className="p-grid">
                    <Fieldset legend="Utilizator"
                              className={roleId !== 5 ? 'p-lg-5 p-md-6 p-sm-12' : 'p-lg-5 p-md-6 p-sm-12'}>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Nume utilizator</div>
                            <InputText id="username" value={username || ''} className="p-col-6"
                                       onChange={(e) => setUsername(e.target.value)}
                                       placeholder="Aa" maxLength={100} required
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Parola</div>
                            <Password value={password} className="pw-fit" placeholder="Aa"
                                      onChange={(e) => setPassword(e.target.value)} toggleMask required={true}/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Tip cont</div>
                            <Dropdown value={activeId} options={allActiveStatus}
                                      onChange={e => setActiveId(e.value)}
                                      optionValue="active_id"
                                      optionLabel="active_desc"
                                      placeholder="Alege"
                                      required/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-mr-2 p-col-6">Rol</div>
                            <Dropdown value={roleId} options={allRoles}
                                      onChange={e => setRoleId(e.value)}
                                      required
                                      optionValue="role_id"
                                      optionLabel="role_desc"
                                      placeholder="Alege"/>
                        </div>
                    </Fieldset>
                    <Fieldset legend="Personal 1"
                              className={roleId !== 5 ? 'p-lg-5 p-md-6 p-sm-12' : 'p-lg-5 p-md-6 p-sm-12'}>
                        {/*                        <div className="p-lg-6 p-md-12 p-sm-12">*/}
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Prenume</div>
                            <InputText id="firstname" value={firstname || ''} className="p-col-6"
                                       onChange={(e) => setFirstname(e.target.value)}
                                       placeholder="Aa" maxLength={100} required
                            />

                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Nume</div>
                            <InputText id="lastname" value={lastname || ''} className="p-col-6"
                                       onChange={(e) => setLastname(e.target.value)}
                                       placeholder="Aa" maxLength={100} required/>
                        </div>

                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Email</div>
                            <InputText id="email" value={email || ''} className="p-col-6"
                                       onChange={(e) => setEmail(e.target.value)}
                                       placeholder="Aa" maxLength={100}/>
                        </div>

                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Telefon</div>
                            <InputText id="phone" value={phone || ''} className="p-col-6"
                                       onChange={(e) => setPhone(e.target.value)}
                                       placeholder="____ ___ ___" maxLength={100}
                            />
                        </div>
                    </Fieldset>
                    <Fieldset legend="Personal 2"
                              className={roleId !== 5 ? 'p-lg-5 p-md-6 p-sm-12' : 'p-lg-5 p-md-6 p-sm-12'}>
                        {/*                        </div>
                        <div className="p-lg-6 p-md-12 p-sm-12">*/}
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">CNP</div>
                            <InputText id="pic_cnp" value={pic_cnp || ''} className="p-col-6"
                                       onChange={(e) => setPic_cnp(e.target.value)}
                                       placeholder="Aa" maxLength={100}/>
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Nationalitate</div>
                            <InputText id="nationality" value={nationality || ''} className="p-col-6"
                                       onChange={(e) => setNationality(e.target.value)}
                                       placeholder="Aa" maxLength={100}
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Adresa</div>
                            <InputText id="full_address" value={full_address || ''} className="p-col-6"
                                       onChange={(e) => setFull_address(e.target.value)}
                                       placeholder="Aa" maxLength={100}
                            />
                        </div>
                        <div className="flex align-items-center p-mb-2">
                            <div className="p-col-6">Data nasterii</div>
                            <Calendar id="birthdate" value={birthdate || ''} className="p-col-6"
                                      onChange={(e) => setBirthdate(e.value)} yearRange="1900:2021"
                                      placeholder="__/__/____" showIcon yearNavigator={true}
                                      monthNavigator/>
                        </div>
                    </Fieldset>

                    {/*</div>*/}

                    {(roleId !== 5 &&
                        <Fieldset legend="Profesional" className="p-lg-5 p-md-6 p-sm-12">
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Licenta</div>
                                <InputText id="licence" value={licence || ''} className="p-col-6"
                                           onChange={(e) => setLicence(e.target.value)}
                                           placeholder="Aa" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Echipe anterioare</div>
                                <InputText id="team_history" value={team_history || ''} className="p-col-6"
                                           onChange={(e) => setTeam_history(e.target.value)}
                                           placeholder="Aa" maxLength={100}
                                />
                            </div>
                            <div className="flex align-items-center p-mb-2">
                                <div className="p-col-6">Echipe</div>
                                <MultiSelect value={selectedTeams} options={allTeams} className="width-50-p"
                                             onChange={(e) => setSelectedTeams(e.value)}
                                             optionLabel="team_name" optionValue="team_id" placeholder="Alege"/>
                            </div>
                        </Fieldset>
                    )}
                </div>
                <Button className="center" icon="pi pi-plus"
                        label="Adauga"
                        onClick={() => {
                            execCreateUser();
                            setAddUserDlg(false);
                        }}/>
            </Dialog>
            <Dialog header="Adauga echipa" visible={addTeamDlg} modal closable={true}
                    className="add_user_dlg dlg-add-color-header"
                    draggable={true}
                    onHide={() => setAddTeamDlg(false)}>
                <Fieldset legend="General" className="p-mb-2">
                    <div className="flex align-items-center p-mb-2">
                        <div className="p-mr-2 p-col-6 align-self-center">Nume echipa</div>
                        <InputText id="teamName" value={teamName || ''} className="p-col-6"
                                   onChange={(e) => setTeamName(e.target.value)}
                                   placeholder="Aa" maxLength={50} required
                        />
                    </div>
                </Fieldset>
                <Button className="center" icon="pi pi-plus"
                        label="Adauga"
                        onClick={() => {
                            execCreateTeam();
                            setAddTeamDlg(false);
                        }}/>
            </Dialog>
        </div>
    )
}