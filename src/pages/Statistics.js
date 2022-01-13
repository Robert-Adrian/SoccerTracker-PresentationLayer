import React, { useEffect } from 'react';
import ls from 'local-storage';
import moment from 'moment';

import { withRouter } from 'react-router';
import { getAllTeams } from '../services/getAllTeams.service'; 
import { getAllGames } from '../services/getAllGames.service';
import { getPersonsByUserId } from '../services/getPersonsByUserId.service';
import { getAllUsersByTeamId } from '../services/getAllUsersByTeamId.service';
import { getCoachByUserId } from '../services/getCoachByUserId.service';
import { getAllPlayers } from '../services/getAllPlayers.service';

import Filter  from '../components/Filter';
import Graph from "../components/Graph";
import MatchList from '../components/MatchList';

import '../styles/Statistics.css';

function Statistics() {
	const [teams, setTeams] = React.useState([]);
	const [games, setGames] = React.useState([]);
	const [selectedGames, setSelectedGames] = React.useState([]);
	const [selectedPlayers, setSelectedPlayers] = React.useState([]);
	const [selectedTeam, setSelectedTeam] = React.useState(null);
	const [selectedCoach, setSelectedCoach] = React.useState(null);
	const [month, setMonth] = React.useState(null);
	const [graphData, setGraphData] = React.useState(null);

	const handleRangeChange = (event) => {
		setMonth(event.value);
	}

	const handleTeamChange = (event) => {
		setSelectedTeam(event.value);
		getAllUsersByTeamId(ls.get('token'), event.value).then(
			response => getPersonsByUserId(ls.get('token'), response).then(
				response => setSelectedPlayers(response.map(person => {
						return {
							person_id: person.person_id,
							person_name: person.firstname.concat(' ').concat(person.lastname.toUpperCase()),
							user_id: person.user_id
						};
					}
				))
			)
		);
	}

	const getTeams = () => {
		getAllTeams(ls.get('token')).then(response => 
			setTeams(response.map(team => {
				return {label: team.team_name, value: team.team_id}
			}))
		);
	}

	const getGames = () => {
		var unsortedGames = [];

		getAllGames(ls.get('token')).then(response => { 
			unsortedGames = response.map(game => {
				return {
					game_id: game.game_id,
					team_id: game.team_id,
					date: moment(game.end_date).format("YYYY-MM-DD"),
					host_team: game.team_name,
					opposite_team: game.opposite_team,
					host_score: game.host_score,
					opposite_score: game.opposite_score
				}
			});

			setGames(unsortedGames.sort((first, second) => {
				return new Date(first.date) - new Date(second.date)
			}))
		});
	}

	useEffect(() => {
		var labels = [];
		var datasets = [
			{
				label: 'Meciuri câștigate',
				data: [],
				fill: false,
				borderColor: '#90EE90',
			},
			{
				label: 'Meciuri pierdute',
				data: [],
				fill: false,
				borderColor: '#FF9999'
			},
			{
				label: 'Egaluri',
				data: [],
				fill: false,
				borderColor: '#F0E68C'
			}
		];

		var wins, loses, equals, onTimeGames;
		wins = loses = equals = 0;
		onTimeGames = [];

		if (month && month[0] && month[1]) {
			let minYearRaw = month[0].toString().substr(4, 11);		
			const minYearMonthMMM = minYearRaw.toString().substr(0, 3);
			minYearRaw = minYearRaw.replace(minYearMonthMMM, moment().month(minYearMonthMMM).format('MM')).split(' ');
			let minYear = minYearRaw[2] + '-' + minYearRaw[0] + '-' + minYearRaw[1];
			
			games.forEach(game => {
				if (selectedTeam === game.team_id && moment(game.date).isSameOrAfter(minYear) && moment(game.date).isSameOrBefore(moment().format("YYYY-MM-DD")) && game.host_score !== -1) {
					onTimeGames.push(game);
					labels.push(game.date.substr(5, 10).split('-').reverse().join('/'));

					if (game.host_score > game.opposite_score) {
						datasets[0].data.push(wins += 1);
						datasets[1].data.push(loses);
						datasets[2].data.push(equals);
					}
					else if (game.host_score < game.opposite_score) {
						datasets[0].data.push(wins);
						datasets[1].data.push(loses += 1);
						datasets[2].data.push(equals);
					}
					else {
						datasets[0].data.push(wins);
						datasets[1].data.push(loses);
						datasets[2].data.push(equals += 1);
					}
				}
			});
			setSelectedGames(onTimeGames);
		}

		let data = {
			labels: labels,
			datasets: datasets
		};

		setGraphData(data);
	}, [selectedTeam, month]);
	
	useEffect(() => {
		selectedPlayers.forEach(player => {
			getCoachByUserId(ls.get('token'), player.user_id).then(response => {
				if (response)
					setSelectedCoach(player.person_name);
			});
		})
	}, [selectedPlayers]);

	useEffect(() => {
		getTeams();
		getGames();
	}, []);

	return (
		<div className='wrapper'>
			<div className='background'>
				<div className='statistics'>
					<Filter 
						teams={teams}
						month={month}
						selectedCoach={selectedCoach}
						selectedTeam={selectedTeam}
						handleTeamChange={handleTeamChange}
						handleRangeChange={handleRangeChange}
					/>
					<Graph graphData={graphData} />
					<p className='game-history'>Istoricul meciurilor</p>
					<MatchList selectedGames={selectedGames}
						selectedPlayers={selectedPlayers}/>
				</div>
			</div>
		</div>
	)
}

export default withRouter(Statistics);