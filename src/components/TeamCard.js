import React from 'react'
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import '../styles/TeamCard.css';
import '../styles/Common.css';
import {ConfirmPopup} from "primereact/confirmpopup";
import {deleteTeam, updateTeam} from "../services/team.service";
import ls from "local-storage";
import {showError, showSuccess, showWarnWithMessage} from "../services/toast.service";
import {isNullOrEmpty} from "../services/array.service";
import {Dialog} from "primereact/dialog";
import {InputSwitch} from "primereact/inputswitch";
import {InputText} from "primereact/inputtext";

export default function TeamCard(props) {

    const [visibleDelDlg, setVisibleDelDlg] = React.useState(false);
    const [visibleViewDlg, setVisibleViewDlg] = React.useState(false);

    const [viewOrUpdate, setViewOrUpdate] = React.useState(false);

    const [teamName, setTeamName] = React.useState(props.team.team_name);

    const header = (
        <img alt="Card" src="asu-poli-icon.png" style={{width: "50px", height: "70px"}}
             onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}/>
    );

    const title = (
        <div>
            {props.team.team_name}
        </div>
    )

    const footer = (
        <span className="p-grid flex justify-content-center align-itms-baseline">
            <Button id={'viewTeamBtn_' + props.team.team_id} tooltip="Vizualizeaza" tooltipOptions={{position: 'top'}}
                    onClick={() => setVisibleViewDlg(true)} className="p-col-2"
                    icon="pi pi-eye"/>
            <Button id={'delTeamBtn_' + props.team.team_id} icon="pi pi-trash" className="p-col-2"
                    onClick={() => setVisibleDelDlg(true)} tooltip="Sterge" tooltipOptions={{position: 'top'}}
                    className="p-button-danger p-ml-2"/>
        </span>
    )

    const execDeleteTeam = () => {
        deleteTeam(ls.get('token'), props.team.team_id)
            .then(res => {
                if (res == null || res == undefined || res == '')
                    showWarnWithMessage(props.notificationRef, "Nu s-a putut sterge!");
                else {
                    showSuccess(props.notificationRef);
                    deleteFromTeamsArray();
                }
            }).catch(err => {
            showError(props.notificationRef);
            console.log(err);
        })
    }

    const deleteFromTeamsArray = () => {
        const team_id = props.team.team_id;
        const teamsArray = props.allTeams;
        const newArray = [];
        if (!isNullOrEmpty(teamsArray)) {
            teamsArray.filter(item => item.team_id !== team_id).map(item => newArray.push(item))
        }
        props.setAllTeams(newArray)
        //console.log(newArray);
        //console.log(props.allTeams);
    }
    const execUpdateTeam = () => {
        updateTeam(ls.get('token'), getNewUpdatedObject())
            .then((res) => {
                if (res == null || res == undefined || res == '')
                    showWarnWithMessage(props.notificationRef, "Nu s-a putut modifica!");
                else {
                    showSuccess(props.notificationRef);
                    //updateInUsersArray();
                }
            }).catch(err => {
            showError(props.notificationRef);
            console.log(err);
        });
    }

    const getNewUpdatedObject = () => {
        const currentTeam = props.team;

        currentTeam.team_name = teamName;
        return currentTeam;
    }

    return (
        <>
            <Card className="p-lg-1 p-md-2 p-sm-6 p-ml-3 shortTitle centeredFooter centeredCard p-m-2" header={header}
                  title={title} footer={footer}/>
            <ConfirmPopup target={document.getElementById('delTeamBtn_' + props.team.team_id)} visible={visibleDelDlg}
                          onHide={() => setVisibleDelDlg(false)}
                          acceptLabel="Sterge" rejectLabel="Inapoi"
                          acceptClassName="p-button-danger" className="confirm-popup-del-header"
                          message={"Esti sigur ca vrei sa stergi echipa " + props.team.team_name + "? Odata ce a fost stearsa, datele asociate ei vor disparea complet!"}
                          icon="pi pi-exclamation-triangle" accept={() => execDeleteTeam()}
                          reject={() => setVisibleDelDlg(false)}/>
            <Dialog header="Vizualizare si modificare" visible={visibleViewDlg} modal closable={true} draggable={true}
                    onHide={() => setVisibleViewDlg(false)} className="dlg-update-color-header">
                <div className="float-right p-mb-5 p-pb-2 txt-align-webkit-right bottom-line-separator">
                    <span className="vertical-align-super font-size-18">Vizualizeaza</span>
                    <InputSwitch className="p-mr-2 p-ml-2" checked={viewOrUpdate}
                                 onChange={(e) => setViewOrUpdate(e.value)}/>
                    <span className="vertical-align-super font-size-18">Modifica</span>
                </div>
                <div className="flex align-items-center p-mb-2">
                    <div className="p-col-6">Nume echipa</div>
                    <InputText id="team_name" value={teamName || ''} className="p-col-6"
                               onChange={(e) => setTeamName(e.target.value)}
                               placeholder="Aa" maxLength={50} required
                               disabled={!viewOrUpdate}/>
                </div>
                <Button className="center" icon="pi pi-user-edit" disabled={!viewOrUpdate}
                        label="Modifica"
                        onClick={() => {
                            execUpdateTeam();
                            setVisibleViewDlg(false);
                        }}/>
            </Dialog>
        </>
    )
}