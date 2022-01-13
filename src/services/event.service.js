import axios from "../helpers/axios"
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";
export const getAllMeetings = (token) => {

    return axiosInstance.get('/meeting/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const getAllTrainings = (token) => {
    return axiosInstance.get('/training/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e)
    });
}

export const getAllGames = (token) => {
    return axiosInstance.get('/game/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const getAllEvents = (token) => {
    const trainings = getAllTrainings(token);
    const meetings = getAllMeetings(token);
    const games = getAllGames(token);

    return Promise.all([trainings, meetings, games]);

}

export const getEventsByTeamIdAndDates = async (token, id, startDate, endDate) => {
    const trainings = getTrainingsByTeamIdAndDates(token, id, startDate, endDate);
    const meetings = getMeetingsByTeamIdAndDates(token, id, startDate, endDate);
    const games = getGamesByTeamIdAndDates(token, id, startDate, endDate);

    return Promise.all([trainings, meetings, games]);
}

export const getGTByTeamIdAndDates = async (token, id, startDate, endDate) => {
    const trainings = getTrainingsByTeamIdAndDates(token, id, startDate, endDate);
    const games = getGamesByTeamIdAndDates(token, id, startDate, endDate);

    return Promise.all([trainings, games]);
}

export const createTraining = (token, trainingObject) => {
    return axiosInstance.post('/training/create', trainingObject, {
        headers: getDefaultHeader(token)
    });
}

export const createMeeting = (token, meetingObject) => {
    return axiosInstance.post('/meeting/create', meetingObject, {
        headers: getDefaultHeader(token)
    });
}

export const createGame = (token, gameObject) => {
    return axiosInstance.post('/game/create', gameObject, {
        headers: getDefaultHeader(token)
    });
}

export const updateTraining = (token, trainingObject) => {
    return axiosInstance.put('/training/update', trainingObject, {
        headers: getDefaultHeader(token)
    });
}

export const updateMeeting = (token, meetingObject) => {
    return axiosInstance.put('/meeting/update', meetingObject, {
        headers: getDefaultHeader(token)
    });
}

export const updateGame = (token, gameObject) => {
    return axiosInstance.put('/game/update', gameObject, {
        headers: getDefaultHeader(token)
    });
}

export const deleteTraining = (token, eventId) => {
    return axiosInstance.delete('/training/delete/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const deleteMeeting = (token, eventId) => {
    return axiosInstance.delete('/meeting/delete/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const deleteGame = (token, eventId) => {
    return axiosInstance.delete('/game/delete/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const isEventOverlapping = (token, dateRange) => {
    return axiosInstance.post('/event/isOverlapping', dateRange, {
        headers: getDefaultHeader(token)
    });
}

export const getTrainingById = (token, event_id) => {
    return axiosInstance.get('/training/getById/' + event_id, {
        headers: getDefaultHeader(token)
    });
}

export const getMeetingById = (token, event_id) => {
    return axiosInstance.get('/meeting/getById/' + event_id, {
        headers: getDefaultHeader(token)
    });
}

export const getGameById = (token, event_id) => {
    return axiosInstance.get('/game/getById/' + event_id, {
        headers: getDefaultHeader(token)
    });
}

export const getTrainingsByTeamIdAndDates = async (token, id, startDate, endDate) => {
    return axiosInstance.get('/training/getByTeamIdAndDates/' + id + "/" + startDate + "/" + endDate, {
        headers: getDefaultHeader(token)
    });
}

export const getMeetingsByTeamIdAndDates = async (token, id, startDate, endDate) => {
    return axiosInstance.get('/meeting/getByTeamIdAndDates/' + id + "/" + startDate + "/" + endDate, {
        headers: getDefaultHeader(token)
    });
}

export const getGamesByTeamIdAndDates = async (token, id, startDate, endDate) => {
    return axiosInstance.get('/game/getByTeamIdAndDates/' + id + "/" + startDate + "/" + endDate, {
        headers: getDefaultHeader(token)
    });
}

export const setStatesFromMeetingObj = (meetingObj, setStartMeetingDate, setEndMeetingDate, setSelectedMeetingTeam, setTopic) => {
    setStartMeetingDate(new Date(meetingObj.start_date));
    setEndMeetingDate(new Date(meetingObj.end_date));
    setSelectedMeetingTeam(meetingObj.team_id);
    setTopic(meetingObj.topic);
}

export const setStatesFromTrainingObj = (trainingObj, setStartTrainingDate, setEndTrainingDate, setSelectedTrainingTeam, setPrincipalObjective, setPrincipleSubprinciple, setObjectiveTask, setEffortRegime, setDuration, setVolume) => {
    setStartTrainingDate(new Date(trainingObj.start_date));
    setEndTrainingDate(new Date(trainingObj.end_date));
    setSelectedTrainingTeam(trainingObj.team_id);
    setPrincipalObjective(trainingObj.principal_objective);
    setPrincipleSubprinciple(trainingObj.principle_subprinciple);
    setObjectiveTask(trainingObj.objective_task);
    setEffortRegime(trainingObj.effort_regime);
    setDuration(trainingObj.duration);
    setVolume(trainingObj.volume);
}

export const setStatesFromGameObj = (gameObj, setStartGameDate, setEndGameDate, setSelectedGameTeam, setGameType, setFormation, setOppositeTeam) => {
    setStartGameDate(new Date(gameObj.start_date));
    setEndGameDate(new Date(gameObj.end_date));
    setSelectedGameTeam(gameObj.team_id);
    setGameType(gameObj.game_type_id);
    setFormation(gameObj.formation_id);
    setOppositeTeam(gameObj.opposite_team);
}

export const createConvened_User = (token, obj) => {
    return axiosInstance.post('/convened_user/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const createPresent_User = (token, obj) => {
    return axiosInstance.post('/present_user/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const getAllConvened_UserOfEventId = (token, eventId) => {
    return axiosInstance.get('/convened_user/getAllOfEvent/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const getAllPresent_UserOfEventId = (token, eventId) => {
    return axiosInstance.get('/present_user/getAllOfEvent/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const deleteAllConvened_UserOfEventId = (token, eventId) => {
    return axiosInstance.delete('/convened_user/deleteAllofEvent/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const deleteAllPresent_UserOfEventId = (token, eventId) => {
    return axiosInstance.delete('/present_user/deleteAllofEvent/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const deleteConvened_UserOfEventIdAndUserId = (token, eventId, userId) => {
    return axiosInstance.delete(`/convened_user/deleteByEventIdAndUserId/${eventId}/${userId}`, {
        headers: getDefaultHeader(token)
    });
}

export const deletePresent_UserOfEventIdAndUserId = (token, eventId, userId) => {
    return axiosInstance.delete(`/present_user/deleteByEventIdAndUserId/${eventId}/${userId}`, {
        headers: getDefaultHeader(token)
    });
}

export const getRAETrainingsOfEventId = (token, eventId) => {
    return axiosInstance.get('/raetrainings/getRAEOfEvent/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const getRAEGamesOfEventId = (token, eventId) => {
    return axiosInstance.get('/raegames/getRAEOfEvent/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const getAllTColor = (token) => {
    return axiosInstance.get('/t_color/getAll/', {
        headers: getDefaultHeader(token)
    });
}

export const createRAEGame = (token, obj) => {
    return axiosInstance.post('/raegames/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const createRAETraining = (token, obj) => {
    return axiosInstance.post('/raetrainings/create', obj, {
        headers: getDefaultHeader(token)
    });
}


export const updateRAEGame = (token, obj) => {
    return axiosInstance.put('/raegames/update', obj, {
        headers: getDefaultHeader(token)
    });
}

export const updateRAETraining = (token, obj) => {
    return axiosInstance.put('/raetrainings/update', obj, {
        headers: getDefaultHeader(token)
    });
}

export const getTrainingGameMeetingIdByEventId = (token, eventId) => {
    return axiosInstance.get('/event/getTrainingMeetingGameIdOfEventId/' + eventId, {
        headers: getDefaultHeader(token)
    });
}

export const deleteRAEGameByRaeID = (token, raeId) => {
    return axiosInstance.delete('/raegames/delete/' + raeId, {
        headers: getDefaultHeader(token)
    });
}

export const deleteRAETrainingByRaeID = (token, raeId) => {
    return axiosInstance.delete('/raetrainings/delete/' + raeId, {
        headers: getDefaultHeader(token)
    });
}
export const getTeamsOfUserIdLink = (token, user_id) => {
    return axiosInstance.get('/usermap/getTeamsOfUserId/' + user_id, {
        headers: getDefaultHeader(token)
    });
}

export const updateScoreOfGame = (token, obj) => {
    return axiosInstance.post('/game/updateScore', obj, {
        headers: getDefaultHeader(token)
    });
}