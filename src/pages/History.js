import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
import ls from 'local-storage';

import { getAllTeams } from '../services/getAllTeams.service';
import { getPersonsByUserId } from '../services/getPersonsByUserId.service';
import { getAllUsersByTeamId } from '../services/getAllUsersByTeamId.service';
import { getDocumentsByPlayerId } from '../services/getDocumentsByPlayerId.service';
import { createDocument } from '../services/createDocument.service';
import { editDocument } from '../services/editDocument.service';
import { deleteDocument } from '../services/deleteDocument.service';
import { getAllPlayers } from '../services/getAllPlayers.service';

import NavBar from '../components/NavBar';
import ButtonBar from '../components/ButtonBar';
import MainPanel from '../components/MainPanel';
import Infopanel from '../components/InfoPanel'; 
import InfoButton from '../components/InfoButton';
import { makeStyles } from '@material-ui/core/styles';
import '../styles/History.css';

const useStyles = makeStyles({
	navpanel: {
		position: 'fixed',
		height: '68.5%',
		width: '75%',
		bottom: '115px',
		left: '120px',
		display: 'flex',
		border: '2px solid #a0a0c3',
		background: '#ffffff',
	},
	buttons: {
		position: 'fixed',
		height: '46px',
		width: '75%',
		bottom: '70px',
		left: '120px',
		display: 'flex',
		borderRight: '2px solid #a0a0c3',
	},
});

function History() {
	const classes = useStyles();
	
	const [selectedPanel, setSelectedPanel] = React.useState(0);
	const [teams, setTeams] = React.useState([]);
	const [selectedTeam, setSelectedTeam] = React.useState(0);

	const [addAvail, setAddAvail] = React.useState(true);
	const [editAvail, setEditAvail] = React.useState(true);
	const [delAvail, setDelAvail] = React.useState(true);

	const [addFormVisibility, setAddFormVisiblity] = React.useState(false);
	const [editFormVisibility, setEditFormVisibility] = React.useState(false);
	const [deleteFormVisibility, setDeleteFormVisibility] = React.useState(false);
	const [failedFormVisibility, setFailedFormVisibility] = React.useState(false);
	const [formData, setFormData] = React.useState({
		document_name: '',
		document_path: '',
	});
	
	const [files, setFiles] = React.useState([]);

	useEffect(() => {
		files.some(file => (file.selected === true)) 
		? setDelAvail(false)
		: setDelAvail(true);

		files.filter(file => (file.selected === true)).length === 1
		? setEditAvail(false)
		: setEditAvail(true);
	}, [files]);

	const [selectedPlayers, setSelectedPlayers] = React.useState([]);
	
	useEffect(() => {
		selectedPlayers.some(player => (player.selected === true))
		? setAddAvail(false)
		: setAddAvail(true);
	}, [selectedPlayers]);
	
	useEffect(() => {
		getTeams();
	}, []);
	
	const getTeams = () => {
		getAllTeams(ls.get('token')).then(response => setTeams(response));
	}

	const handleTabChange = (event, newPanel) => {
		setFiles(files.map(file => ({...file, selected: false})));
		setSelectedPanel(newPanel);
	}

	const handleTeamChange = (event) => {
		setSelectedTeam(event.target.value);


		if (event.target.value !== 0) {
			getAllPlayers(ls.get('token')).then(response =>
				{
					if (response !== null && response !== undefined && response !== "") {
						let newPlayers = [];

						response.forEach(player => {
							if (player.team_id === event.target.value) {
								newPlayers.push({
									player_id: player.player_id,
									person_id: player.person_id,
									person_name: player.firstname.concat(' ').concat(player.lastname.toUpperCase()),
									selected: false
								})
							}
						});
						setSelectedPlayers(newPlayers);
					}
				}
			);
		}
		else {
			setSelectedPlayers([]);
		}
		setFiles([]);	
	}

	const handleListItemClick = (event, new_player_id) => {
		setSelectedPlayers(selectedPlayers.map(player => {
			if (player.player_id === new_player_id)
				return {...player, selected: !player.selected};
			return {...player, selected: false};
		}));

		getDocumentsByPlayerId(ls.get('token'), new_player_id).then(
			response => setFiles(response.map(file => ({
				document_id: file.document_id,
				document_type_id: file.document_type_id,
				document_path: file.document_path,
				document_name: file.document_name,
				creation_date: moment(file.creation_date).format("YYYY-MM-DD hh:mm:ss"),
				selected: false
			})
		)));
	}

	const handleOnClick = (event, index) => {
		var file = files.find(item => item.document_id === index);
		window.open(file.document_path);
	}

	const handleOnContextMenu = (event, index) => {
		event.preventDefault();
		setFiles(files.map(item => {
			if (item.document_id === index)
				return {...item, selected: !item.selected};
			return item;
		}));
	}

	const handleAddClick = () => {
		setAddFormVisiblity(true);
	}

	const handleAddFormSubmit = () => {
		const isValidURL = (string) => {
  			var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  			return (res !== null)
		}; 

		if (formData.document_name !== '' && isValidURL(formData.document_path)) {
			createDocument(ls.get('token'), {
				player_id: selectedPlayers.find(player => player.selected === true).player_id,
				document_type_id: selectedPanel,
				document_name: formData.document_name,
				document_path: formData.document_path,
				creation_date: moment().format(),
				team_id: selectedTeam
			}).then(response => response && setFiles([...files, {...response,
					creation_date: moment(response.creation_date).format("YYYY-MM-DD hh:mm:ss"),
					selected: false
				}])
			);
			setAddFormVisiblity(false);
		}
		else {
			setAddFormVisiblity(false);
			setFailedFormVisibility(true);
		}
	}

	const handleFailedFormClose = () => {
		setFailedFormVisibility(false);
	}

	const handleAddFormClose = () => {
		setAddFormVisiblity(false);
	}

	const handleEditClick = () => {
		setEditFormVisibility(true);

		const editFile = files.find(file => file.selected === true);
		setFormData({
			document_name: editFile.document_name,
			document_path: editFile.document_path
		});
	}

	const handleFormChange = (event) => {
		setFormData({...formData, [event.target.name]: event.target.value});
	}

	const handleEditFormSubmit = () => {
		const editedFile = files.find(file => file.selected === true);

		editDocument(ls.get('token'), editedFile, formData).then(
			response => {
				if (response === false) {
					console.log('ERROR: Coressponding file not found, deleting ghost file.');
					setFiles(files.filter(file => file !== editedFile));
				}
				else {
					setFiles(files.map(file => {
						if (file === editedFile)
							return {...response, 
								creation_date: moment(response.creation_date).format("YYYY-MM-DD hh:mm:ss"),
								selected: false };
						return file;
					}));
				}
			}
		);
		setEditFormVisibility(false);
	}

	const handleEditFormClose = () => {
		setEditFormVisibility(false);
	}

	const handleDeleteClick = () => {
		setDeleteFormVisibility(true);
	}

	const handleDeleteFormConfirm = () => {
		setDeleteFormVisibility(false);

		files.forEach(file => {
			if (file.selected) {
				deleteDocument(ls.get('token'), file.document_id).then(
					isDeleted => {
						if(!isDeleted)
							console.log('ERROR: Deleted file did not exist.');
					})
				}
			}
		);
		setFiles(files.filter(file => file.selected !== true));
	}

	const handleDeleteFormCancel = () => {
		setDeleteFormVisibility(false);
	}

	return (
		<div id='history' className='History'>
			<NavBar selectedPanel={selectedPanel}
				handleTabChange={handleTabChange} />
			<div className={classes.navpanel}>
				<MainPanel selectedPanel={selectedPanel}
					files={files}
					handleOnClick={handleOnClick}
					handleOnContextMenu={handleOnContextMenu} />
				<Infopanel players={selectedPlayers}
					handleListItemClick={handleListItemClick} />
			</div>
			<div className={classes.buttons}>
				<ButtonBar handleAddClick={handleAddClick}
					handleEditClick={handleEditClick}
					handleDeleteClick={handleDeleteClick}
					handleFormChange={handleFormChange}
					handleAddFormSubmit={handleAddFormSubmit}
					handleAddFormClose={handleAddFormClose}
					handleEditFormClose={handleEditFormClose}
					handleEditFormSubmit={handleEditFormSubmit}
					handleDeleteFormConfirm={handleDeleteFormConfirm}
					handleDeleteFormCancel={handleDeleteFormCancel}
					handleFailedFormClose={handleFailedFormClose}
					failedAddFormVisibility={failedFormVisibility}
					editFormVisibility={editFormVisibility}
					addFormVisibility={addFormVisibility}
					formData={formData}
					deleteFormVisibility={deleteFormVisibility}
					addAvail={addAvail}
					delAvail={delAvail}
					editAvail={editAvail} />
				<InfoButton teams={teams} 
					selectedTeam={selectedTeam}
					onTeamChange={handleTeamChange} />
			</div>
		</div>
	);
}

export default withRouter(History);