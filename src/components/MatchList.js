import React, { useEffect } from 'react';
import ls from 'local-storage';

import { Accordion, AccordionTab } from 'primereact/accordion';
import { getAllPlayerResultsByGameId } from '../services/getAllPlayerResultsByGameId.service';
import { getAllPlayers } from '../services/getAllPlayers.service';

function MainPlayers(props) {
	const { gameId, selectedPlayers } = props;
	const [playerResults, setPlayerResults] = React.useState([]);

	useEffect(() => {
		getAllPlayerResultsByGameId(ls.get('token'), gameId).then(
			response => {
				var structuredResults = [];

				getAllPlayers(ls.get('token')).then(players => {
					if (players) {
						response.forEach(player => {
							const isPlayerThere = players.find(obj => obj.player_id === player.player_id);
							
							if (isPlayerThere) {
								structuredResults.push({
									name: isPlayerThere.firstname + ' ' + isPlayerThere.lastname,
									player_id: isPlayerThere.player_id,
									yellow_card: player.yellow_card,
									red_card: player.red_card,
									goals: player.goal,
									assists: player.assist,
									played_time: player.played_time,
									realization: player.realization,
									attitude: player.attitude,
									effort: player.effort,
								})
							}
						})
						setPlayerResults(structuredResults);
					}
				})
			}
		);
	}, []);

	return (
		<>
			<div className='main-players'>
				{playerResults.map(player => {
					if (player.goals >= 1) {
						if (player.red_card) {
							return (
								<div key={player.id} className='individual-player'>
									<p className='individual-details'>{player.name}</p>
									<div className='scored'>
										<span className='red-dot'></span>
										<p className='individual-details'>{player.goals}</p>
									</div>
								</div>
							);
						}
						else if (player.yellow_card) {
							return (
								<div key={player.id} className='individual-player'>
									<p className='individual-details'>{player.name}</p>
									<div className='scored'>
										<span className='yellow-dot'></span>
										<p className='individual-details'>{player.goals}</p>
									</div>
								</div>
							);
						}
						else {
							return (
								<div key={player.id} className='individual-player'>
									<p key='name' className='individual-details'>{player.name}</p>
									<p key='goals' className='individual-details'>{player.goals}</p>
								</div>
							);
						}
					}
					else if (player.red_card) {
						return (
							<div key={player.id} className='individual-player'>
								<p className='individual-details'>{player.name}</p>
								<div className='scored'>
									<span className='red-dot'></span>
									<p className='individual-details'>0</p>
								</div>
							</div>
						);
					}
					else if (player.yellow_card) {
						return (
							<div key={player.id} className='individual-player'>
								<p className='individual-details'>{player.name}</p>
								<div className='scored'>
									<span className='yellow-dot'></span>
									<p className='individual-details'>0</p>
								</div>
							</div>
						);
					}
				})}
			</div>
			<div className='team-players-background'>
				<div className='types-of-training'>
					<p key='minutes' className='training-type'>
						Minute jucate
					</p>
					<p key='assists' className='training-type'>
						Assisturi
					</p>
					<p key='goals' className='training-type'>
						Goluri
					</p>
					<p key='realization' className='training-type'>
						Realizări
					</p>
					<p key='attitude' className='training-type'>
						Atitudine
					</p>
					<p key='effort' className='training-type'>
						Efort
					</p>
				</div>
				{playerResults.map(player => {
					return (
						<div key={player.player_id} className='player-details'>
							<div key='background_icon' className='icon-background'>
								<p>
									{player.name[0].toUpperCase() + player.name[player.name.indexOf(' ') + 1]}
								</p>
							</div>
							<div key='player_name' className='player-name'>
								<h4>{player.name.substr(0, player.name.indexOf(' '))} <span>{player.name[player.name.indexOf(' ') + 1].concat('.')}</span></h4>
							</div>
							<p key='minutes' className='training-points'>
								{player.played_time}	
							</p>
							<p key='assists' className='training-points'>
								{player.assists}	
							</p>
							<p key='goals' className='training-points'>
								{player.goals}	
							</p>
							<p key='realization' className='training-points'>
								{player.realization}	
							</p>
							<p key='attitude' className='training-points'>
								{player.attitude}	
							</p>
							<p key='effort' className='training-points'>
								{player.effort}	
							</p>
						</div>
					);
				})}
			</div>
		</>
	);
}

function GetHeader(props) {
	const { hostName, oppositeName, hostScore, oppositeScore } = props;

	return (
		<div className='game-accordion'>
			<p key='host-name'>{hostName}</p>
			<p key='score'>{hostScore + ' - ' + oppositeScore}</p>
			<p key='opposite-name'>{oppositeName}</p>
		</div>
	);
}

function MatchList(props) {
	const { selectedGames, selectedPlayers } = props;

	return (
		<div className='accordion'>
			<Accordion>
				{selectedGames.map(playedGame => {
					return ( 
						<AccordionTab key={playedGame.game_id}
							header={<GetHeader hostName={playedGame.host_team}
							oppositeName={playedGame.opposite_team}
							hostScore={playedGame.host_score}
							oppositeScore={playedGame.opposite_score}/>}>
							<p className='main-details'>Statistici</p>
							<MainPlayers gameId={playedGame.game_id} 
								selectedPlayers={selectedPlayers}/>
						</AccordionTab>
					);
				})}
			</Accordion>
		</div>
	);
}

export default MatchList;