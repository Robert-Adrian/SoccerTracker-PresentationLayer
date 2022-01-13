import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
	AddCircleRounded,
	IndeterminateCheckBoxTwoTone,
	Edit } from '@material-ui/icons';
import { 
	Button, 
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions } from '@material-ui/core';

const useStyles = makeStyles({
	buttoncontainer: {
		background: 'linear-gradient(260deg, #7474bf, #348ac7)',
		boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
		width: '75.8%',
		display: 'flex',
		overflow: 'hidden',
		
		'& > *': {
			flex: '0 0 33.3%',
			overflow: 'hidden',
			color: '#e8e8e8',
		},
	},
});

function ButtonBar(props) {
	const classes = useStyles();
	const { 
		handleAddClick,
		handleEditClick,
		handleDeleteClick, 
		handleAddFormClose, 
		handleAddFormSubmit,
		handleEditFormClose,
		handleEditFormSubmit,
		handleDeleteFormConfirm,
		handleDeleteFormCancel,
		handleFormChange,
		handleFailedFormClose,
		failedAddFormVisibility,
		addFormVisibility,
		editFormVisibility,
		deleteFormVisibility, 
		addAvail, editAvail, delAvail, formData } = props;
	
	return ( 
		<div className={classes.buttoncontainer}>
			<Button onClick={handleAddClick} 
				startIcon={<AddCircleRounded/>}
				disabled={addAvail}>
				ADĂUGARE
			</Button>
			<Dialog open={addFormVisibility} 
				onClose={handleAddFormClose}>
				<DialogTitle>
					Introducere nouă
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Introduceți link-ul înspre document împreună cu numele acestuia.
					</DialogContentText>
					<TextField autoFocus
						name='document_name'
						type='string'
						margin='dense'
						label='Numele fișierului'
						onChange={handleFormChange}
					/>
					<br/>
						<TextField 
						name='document_path'
						type='string'
						margin='dense'
						label='Link-ul către document'
						onChange={handleFormChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAddFormClose} 
						color='primary'>
						Anulare
					</Button>
					<Button onClick={handleAddFormSubmit} 
						color='primary'>
						Finalizează
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={failedAddFormVisibility}
				onClose={handleFailedFormClose}>
				<DialogTitle>
					Introducere eșuată
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Link-ul introdus nu este valid. Utilizați link-ul copiat direct din browser.
					</DialogContentText>
					<DialogActions>
						<Button onClick={handleFailedFormClose}
							color='primary'>
							Ok
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
			<Button onClick={handleDeleteClick}
				startIcon={<IndeterminateCheckBoxTwoTone/>}
				disabled={delAvail}>
				ȘTERGERE
			</Button>
			<Dialog open={deleteFormVisibility} 
					onClose={handleDeleteFormCancel}>
				<DialogTitle>
					Ștergere
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Ștergeți link-ul/urile către document/e?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteFormCancel} 
						color='primary'>
						Anulare
					</Button>
					<Button onClick={handleDeleteFormConfirm} 
						color='primary'>
						Finalizează
					</Button>
				</DialogActions>
			</Dialog>
			<Button onClick={handleEditClick}
				startIcon={<Edit/>}
				disabled={editAvail}>
				EDITARE FIȘIER
			</Button>
				<Dialog open={editFormVisibility} 
				onClose={handleEditFormClose}>
				<DialogTitle>
					Editare
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Editați link-ul înspre document sau numele acestuia.
					</DialogContentText>
					<TextField autoFocus
						name='document_name'
						type='string'
						margin='dense'
						label='Numele fișierului'
						onChange={handleFormChange}
						defaultValue={formData.document_name}
					/>
					<br/>
					<TextField 
						name='document_path'
						type='string'
						margin='dense'
						label='Link-ul către document'
						onChange={handleFormChange}
						defaultValue={formData.document_path}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditFormClose} 
						color='primary'>
						Anulare
					</Button>
					<Button onClick={handleEditFormSubmit} 
						color='primary'>
						Salvează noile modificări
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ButtonBar;