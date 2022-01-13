import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

function Filter(props) {
	const { 
		month,
		teams,
		selectedTeam,
		selectedCoach,
		handleTeamChange,
		handleRangeChange } = props;

	return (
		<div className='filter'>
			<div className='grade'>
				<p>{'Antrenor: ' + (selectedCoach !== null ? selectedCoach : '')}</p>
			</div>
			<Calendar id='timepicker'
				value={month}
				onChange={event => handleRangeChange(event)}
				dateFormat='dd/mm/yy'
				selectionMode='range'
				placeholder='Perioada de timp'
				readOnlyInput
				showIcon
			/>
			<Dropdown id='teamfilter'
				value={selectedTeam}
				options={teams}
				onChange={event => handleTeamChange(event)}
				placeholder='Alege o echipă'
			/>
		</div>
	);
}

export default Filter;