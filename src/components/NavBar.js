import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import { 
	LocalHospitalRounded,
	SportsKabaddiRounded,
	InsertEmoticonRounded,
	SportsSoccer } from '@material-ui/icons';

const useStyles = makeStyles({
	navbar: {
		background: 'linear-gradient(260deg, #7474bf, #348ac7)',
		padding: '0',
		top: '12.5%',
		left: '120px',
		width: '75%',
	},
});

function NavBar(props) {
	const classes = useStyles();
	const { selectedPanel, handleTabChange } = props;

	return (
		<AppBar position='absolute' className={classes.navbar}>
			<Tabs value={selectedPanel}
				onChange={handleTabChange}
				variant='fullWidth'
				indicatorColor='primary'
			>
				<Tab label='MEDICAL'
					icon={<LocalHospitalRounded />}    
					onClick={() => {return 0;}} />
				<Tab label='FIZIC'
					icon={<SportsKabaddiRounded />}
					onClick={() => {return 1;}} />
				<Tab label='PSIHOLOGIC'
					icon={<InsertEmoticonRounded />}
					onClick={() => {return 2;}} />
				<Tab label='ECHIPĂ/JUCĂTOR'
					icon={<SportsSoccer />}
					disabled />
			</Tabs>
		</AppBar>
	); 
}

export default NavBar;