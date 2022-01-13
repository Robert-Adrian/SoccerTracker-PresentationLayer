import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DescriptionTwoTone } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
	mainpanel: {
		width: '75%',
		overflow: 'auto',
		padding: '20px 0 0',
	},
	name: {
		margin: '0',
		fontSize: '0.9rem',
		fontFamily: '"Courier New", monospace',
		fontWeight: 'bold',
	},
	datetime: {
		fontSize: '0.65rem',
		fontStyle: 'italic',
	},
	gridcontainer: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	grid: {		
		padding: '10px',
		borderRadius: '50px',
		flex: '0 0 33.3%',
		'&:hover': {
			background: '#adadad',
			cursor: 'pointer',
		},
		background: props => props.selected === true ? '#adadad' : '#ffffff',
	},
});

function MyGrid(props) {
	const classes = useStyles(props);
	const { 
		name, 
		index, 
		datetime, handleOnClick, handleOnContextMenu } = props;

	return (
		<Grid container
			direction='column'
			justify='center'
			alignItems='center'
			className={classes.grid}
			onClick={event => handleOnClick(event, index)}
			onContextMenu={event => handleOnContextMenu(event, index)}
		>
			<DescriptionTwoTone fontSize='large' style={{fill: '#575757'}}/>
			<p className={classes.datetime}>{datetime}</p>
			<p className={classes.name}>{name}</p>
		</Grid>
	);
}

function MainPanel(props) {
	const classes = useStyles();
	const { 
		files, 
		selectedPanel, 
		handleOnClick, handleOnContextMenu } = props;

	return (
		<div className={classes.mainpanel}>
			<div className={classes.gridcontainer}> 
				{files.map(file => ( file.document_type_id === selectedPanel &&
					<MyGrid key={file.document_id} 
						selected={file.selected}
						index={file.document_id}
						name={file.document_name}
						datetime={file.creation_date}
						handleOnClick={handleOnClick}
						handleOnContextMenu={handleOnContextMenu} />
					))
				}
			</div>
		</div>	
	);
}

export default MainPanel;