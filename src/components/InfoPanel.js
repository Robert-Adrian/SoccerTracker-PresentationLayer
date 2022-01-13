import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Avatar, 
	List,
	ListItem,
	ListItemAvatar,
	ListItemText } from '@material-ui/core';

const useStyles = makeStyles({
	infoPanel: {
		width: '25%',
		borderLeft: '2px solid #a0a0c3',
		overflow: 'auto',
		padding: '20px 0 0',
	},
	list: {
		padding: '0',
	},
	listElement: {
		'&:hover': {
			background: '#adadad',
			cursor: 'pointer',
		},
		background: props => props.selected === true ? '#adadad' : '#ffffff',
	},
	avatar: {
		backgroundColor: 'linear-gradient(260deg, #7474bf, #348ac7)',
		color: '#ffffff',
	}
});

function Listitem(props) {
	const classes = useStyles(props);
	const { player, handleListItemClick } = props;

	return 	(
		<ListItem
			onClick={(event) => handleListItemClick(event, player.player_id)}
			className={classes.listElement}
		>
			<ListItemAvatar>
				<Avatar className={classes.avatar}>
					{player.person_name[0].concat(player.person_name[player.person_name.indexOf(' ') + 1])}
				</Avatar>
			</ListItemAvatar>
			<ListItemText primary={player.person_name}/>
		</ListItem>
	);
}

function Infopanel(props) {
	const classes = useStyles();
	const { players, handleListItemClick } = props;

	return (
		<div className={classes.infoPanel}>
			<List className={classes.list}>
			{players.map(player => {
				return <Listitem
					key={player.person_id} 
					player={player}
					handleListItemClick={handleListItemClick}
					selected={player.selected} />
				})
			}
			</List>
		</div>
	);
}

export default Infopanel;