import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
	FormControl,
	InputLabel,
	Select,
	MenuItem } from '@material-ui/core';

const useStyles = makeStyles({
	formControl: {
		width: '25%',
		textAlign: 'center',
		paddingTop: '2px',
	},
	select: {
		background: '#ffffff',
		height: '44.5px',
	}
});

function InfoButton(props) {
	const classes = useStyles();
	const { teams, selectedTeam, onTeamChange } = props;

	return (
		<FormControl className={classes.formControl}
			variant="filled">
			<InputLabel>Echipă</InputLabel>
				<Select className={classes.select} 
					value={selectedTeam}
					onChange={onTeamChange}
				>
				{ (teams != null && teams.length !== 0) && teams.map(team => {
					return <MenuItem key={team.team_id}
							value={team.team_id}>
						{team.team_name}
					</MenuItem>}
				)}
				<MenuItem value={0}>...</MenuItem>
			</Select>
		</FormControl>
	);		
}

export default InfoButton;