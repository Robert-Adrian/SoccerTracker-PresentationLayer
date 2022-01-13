import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import React, {useEffect, useRef} from 'react';
import '../styles/Home.css';
import '../styles/Common.css'
import ls from 'local-storage';
import {FullCalendar} from 'primereact/fullcalendar';
import {Calendar as FCCalendar} from '@fullcalendar/core';
import {Panel} from 'primereact/panel';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/core';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/interaction'
import '@fullcalendar/daygrid'
import '@fullcalendar/timegrid'
import allLocales from '@fullcalendar/core/locales-all';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {InputSwitch} from 'primereact/inputswitch.js';
import {PickList} from 'primereact/picklist';
import '../styles/PickList.css'
import {
    getAllEvents,
    createTraining,
    createMeeting,
    createGame,
    updateTraining,
    updateMeeting,
    updateGame,
    deleteTraining,
    deleteMeeting,
    deleteGame,
    isEventOverlapping,
    getGameById,
    getMeetingById,
    getTrainingById,
    setStatesFromMeetingObj,
    setStatesFromTrainingObj,
    setStatesFromGameObj,
    createConvened_User,
    getAllConvened_UserOfEventId,
    deleteAllConvened_UserOfEventId,
    deleteConvened_UserOfEventIdAndUserId,
    getAllPresent_UserOfEventId,
    getRAETrainingsOfEventId,
    getRAEGamesOfEventId,
    getAllTColor,
    createPresent_User,
    deletePresent_UserOfEventIdAndUserId,
    createRAEGame,
    getTrainingGameMeetingIdByEventId,
    updateRAEGame,
    deleteRAEGameByRaeID,
    createRAETraining,
    updateRAETraining,
    deleteRAETrainingByRaeID, getTeamsOfUserIdLink, updateScoreOfGame
} from '../services/event.service';
import {Editor} from "primereact/editor";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {getAllFormations} from '../services/getAllFormations.service';
import {getAllTeams} from "../services/team.service";
import {getAllGameTypes} from "../services/gametype_service";
import {Toast} from 'primereact/toast'

import {
    showSuccessWithMessage,
    showErrorWithMessage,
    showInfoWithMessage,
    showWarnWithMessage,
    showSuccess,
    showError
} from "../services/toast.service";
import {getDateTimeAsString} from "../services/dateutils.service";
import 'primeflex/primeflex.css'
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ConfirmPopup} from "primereact/confirmpopup";
import {getAllFullDataUsers} from "../services/users.service";
import {MultiSelect} from "primereact/multiselect";
import {Chip} from "primereact/chip";
import {isNullOrEmpty} from "../services/array.service";
import {getFullUserDataByUserId} from "../services/administration.service";
import {Card} from "primereact/card";
import {Checkbox} from "primereact/checkbox";
import {Chart} from "primereact/chart";
import {InputTextarea} from "primereact/inputtextarea";
import moment from 'moment';
//TODO
// -> Mesaj custom de eroare pentru fiecare casuta care nu respecta anumite cerinte

//TODO
// -> Adaugare excel cu evenimente
// -> Adaugare excel cu evaluari

//FIXME
// -> Linechart la onHover are probleme
/** You can have an assessment without presence, and a presence without assessment.  */
export default function Home(props) {
    const monthsRo = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    const monthsRoShort = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"];
    const [events, setEvents] = React.useState([]);
    const notificationRef = useRef(null);
    const [allGameTypes, setAllGameTypes] = React.useState([]);
    const [allFormations, setAllFormations] = React.useState([]);
    const [allTeams, setAllTeams] = React.useState([]);
    const [allUsers, setAllUsers] = React.useState([]);
    const [allColors, setAllColors] = React.useState([]);
    const [selectedEvent, setSelectedEvent] = React.useState({});

    const [startCalendarDate, setStartCalendarDate] = React.useState();
    const [endCalendarDate, setEndCalendarDate] = React.useState();

    let trainingColor = '#5499C7';
    let gameColor = '#CD6155';
    let meetingColor = '#52BE80';
    //let startCalendarDate;
    //let endCalendarDate
    let eventsBarChartRef;
    let durationBarChartRef;
    let eventsLineChartRef;

    const [eventsBarChartData, setEventsBarChartData] = React.useState();
    const [durationBarChartData, setDurationBarChartData] = React.useState();
    const [eventsLineChartData, setEventsLineChartData] = React.useState();

    const [loggedUserTeams, setLoggedUserTeams] = React.useState();
    const [loggedUserSelectedTeam, setLoggedUserSelectedTeam] = React.useState();

    const [calendarRef, setCalendarRef] = React.useState();

    const [editRows, setEditRows] = React.useState();

    const [filteredTeam, setFilteredTeam] = React.useState();

    const [showEventAssessment, setShowEventAssessment] = React.useState(false);


    const [uploadExcelDlgVisible, setUploadExcelDlgVisible] = React.useState(false);

    const [addMeetingDlg, setAddMeetingDlg] = React.useState(false);
    const [addTrainingDlg, setAddTrainingDlg] = React.useState(false);
    const [addGameDlg, setAddGameDlg] = React.useState(false);

    const [updateMeetingDlg, setUpdateMeetingDlg] = React.useState(false);
    const [updateTrainingDlg, setUpdateTrainingDlg] = React.useState(false);
    const [updateGameDlg, setUpdateGameDlg] = React.useState(false);

    const [viewOrUpdateMeetingDlg, setViewOrUpdateMeetingDlg] = React.useState(false);
    const [viewOrUpdateTrainingDlg, setViewOrUpdateTrainingDlg] = React.useState(false);
    const [viewOrUpdateGameDlg, setViewOrUpdateGameDlg] = React.useState(false);

    const [eventCategoryDlgVisible, setEventCategoryDlgVisible] = React.useState(false);
    const [updateOrDeleteDlgVisible, setUpdateOrDeleteDlgVisible] = React.useState(false)

    const [startMeetingDate, setStartMeetingDate] = React.useState();
    const [endMeetingDate, setEndMeetingDate] = React.useState();
    const [selectedMeetingTeam, setSelectedMeetingTeam] = React.useState();
    const [topic, setTopic] = React.useState("");
    const [selectedMeetingUsers, setSelectedMeetingUsers] = React.useState([]);
    const [cloneSelectedMeetingUsers, setCloneSelectedMeetingUsers] = React.useState([]);
    const [playerMeetingPresences, setPlayerMeetingPresences] = React.useState([]);
    const [meetingOriginalRows, setMeetingOriginalRows] = React.useState({});

    const [startTrainingDate, setStartTrainingDate] = React.useState();
    const [endTrainingDate, setEndTrainingDate] = React.useState();
    const [selectedTrainingTeam, setSelectedTrainingTeam] = React.useState();
    const [principalObjective, setPrincipalObjective] = React.useState();
    const [principleSubprinciple, setPrincipleSubprinciple] = React.useState();
    const [objectiveTask, setObjectiveTask] = React.useState();
    const [effortRegime, setEffortRegime] = React.useState();
    const [duration, setDuration] = React.useState();
    const [volume, setVolume] = React.useState();
    const [selectedTrainingUsers, setSelectedTrainingUsers] = React.useState([]);
    const [cloneSelectedTrainingUsers, setCloneSelectedTrainingUsers] = React.useState([]);
    const [playerTrainingsResults, setPlayerTrainingResults] = React.useState([]);
    const [raeTrainingOriginalRows, setRaeTrainingOriginalRows] = React.useState({});

    const [startGameDate, setStartGameDate] = React.useState();
    const [endGameDate, setEndGameDate] = React.useState();
    const [selectedGameTeam, setSelectedGameTeam] = React.useState();
    const [gameType, setGameType] = React.useState();
    const [formation, setFormation] = React.useState();
    const [oppositeTeam, setOppositeTeam] = React.useState();
    const [ourTeamScore, setOurTeamScore] = React.useState(0);
    const [oppositeScore, setOppositeScore] = React.useState(0);
    const [selectedGameUsers, setSelectedGameUsers] = React.useState([]);
    const [cloneSelectedGameUsers, setCloneSelectedGameUsers] = React.useState([]);
    const [playerGameResults, setPlayerGameResults] = React.useState([]);
    const [raeGameOriginalRows, setRaeGameOriginalRows] = React.useState({});

    const [loadingTable, setLoadingTable] = React.useState(false);
    const [delEventConfirmDlg, setDelEventConfirmDlg] = React.useState(false);

    let maxTrainingDate;
    let maxMeetingDate;
    let maxGameDate;

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const eventsNoOptions = {
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#495057'
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    fontColor: '#495057',
                    precision: 0
                }
            }]
        },
        tooltips: {
            enabled: true
        }
    };

    const eventsDurationOptions = {
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#495057'
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    fontColor: '#495057'
                }
            }]
        },
        tooltips: {
            enabled: true
        }
    };


    let basicLineOptions = {
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#495057'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: '#495057',
                    min: 0,
                    precision: 0
                }
            }]
        },
        tooltips: {
            enabled: true
        }
    };

    const compareByRoleId = (a, b) => {
        return a.role_id - b.role_id;
    }

    const getClassnameBySelectedEvent = selectedEvent => {
        if (selectedEvent != null && selectedEvent.classNames != null)
            if (selectedEvent.classNames.includes("training"))
                return "training";
            else if (selectedEvent.classNames.includes("game"))
                return "game";
            else if (selectedEvent.classNames.includes("meeting"))
                return "meeting";
        return "";
    }

    const getByEventId = (event_id) => {
        let eventObj;
        if (events != null && events.length !== 0 && events[0] !== undefined)
            eventObj = events.filter(item => item.id == event_id)

        return eventObj[0];
    }

    const getUserByUserId = (user_id) => {
        if (allUsers != null && allUsers.length !== 0 && allUsers[0] !== undefined) {

            for (const user in allUsers) {
                if (allUsers[user].user_id == user_id)
                    return allUsers[user];
            }
        }
    }

    const getElementFromArrayByAttribute = (array, attribute, attributeValue) => {
        if (array != null && array != undefined && array.length !== 0 && array[0] !== undefined) {
            //console.log(attributeValue);
            for (const element in array) {
                //console.log(array[element][attribute]);
                if (array[element][attribute] === attributeValue) {
                    return array[element];
                }
            }
        }
    }


    const deleteFromEventArray = (eventId) => {
        const newArray = []
        if (events != null && events.length !== 0 && events[0] !== undefined) {
            events.filter(item => item.id != eventId).map(item => newArray.push(item))
        }
        setEvents(newArray)
    }

    const deleteEvent = (event) => {

        if (event.classNames.includes("training")) {
            deleteTraining(ls.get('token'), event.id)
                .then(() => deleteFromEventArray(event.id))
                .then(() => showSuccess(notificationRef)).catch(e => {
                showError(notificationRef)
            });
        } else if (event.classNames.includes("meeting")) {
            deleteMeeting(ls.get('token'), event.id)
                .then(() => deleteFromEventArray(event.id))
                .then(() => showSuccess(notificationRef)).catch(e => {
                showError(notificationRef)
            });
        } else if (event.classNames.includes("game")) {
            deleteGame(ls.get('token'), event.id)
                .then(() => deleteFromEventArray(event.id))
                .then(showSuccess(notificationRef)).catch(e => {
                showError(notificationRef)
            });
        }

    }

    const initTrainings = () => {
        setStartTrainingDate(null);
        setEndTrainingDate(null);
        setSelectedTrainingTeam(0);
        setPrincipalObjective("");
        setPrincipleSubprinciple("");
        setObjectiveTask("");
        setEffortRegime("");
        setDuration("");
        setVolume(0);
        setSelectedTrainingUsers([]);
        setCloneSelectedTrainingUsers([]);
    };

    const initMeetings = () => {
        setStartMeetingDate(null);
        setEndMeetingDate(null);
        setSelectedMeetingTeam(0);
        setTopic("");
        setSelectedMeetingUsers([]);
        setCloneSelectedMeetingUsers([]);
    }

    const initGames = () => {
        setStartGameDate(null);
        setEndGameDate(null);
        setSelectedGameTeam(0);
        setGameType(0);
        setFormation("");
        setOppositeTeam(null);
        setSelectedGameUsers([]);
        setCloneSelectedGameUsers([]);
    }

    const getLatestTrainingDate = allEvents => {
        const trainings = allEvents.filter(item => item.classNames.includes("training") && new Date(item.start) > new Date())
        const trainingsDate = []
        if (trainings.length !== 0) {
            trainings.map(item => trainingsDate.push(new Date(item.start)));
            maxTrainingDate = new Date(Math.min.apply(null, trainingsDate));
            return getDateTimeAsString(maxTrainingDate);
        }

        return new String("Niciun eveniment");
    };

    const getLatestMeetingDate = allEvents => {
        const meetings = allEvents.filter(item => (item.classNames.includes("meeting")) && (new Date(item.start) > new Date()));
        const meetingsDate = [];


        if (meetings.length !== 0) {
            meetings.map(item => meetingsDate.push(new Date(item.start)));
            maxMeetingDate = new Date(Math.min.apply(null, meetingsDate));
            return getDateTimeAsString(maxMeetingDate);
        }
        return new String("Niciun eveniment");
    };

    const getLatestGameDate = allEvents => {
        const games = allEvents.filter(item => item.classNames.includes("game") && new Date(item.start) > new Date());
        const gamesDate = [];


        if (games.length !== 0) {
            games.map(item => gamesDate.push(new Date(item.start)));
            maxGameDate = new Date(Math.min.apply(null, gamesDate));
            return getDateTimeAsString(maxGameDate);
        }
        return new String("Niciun eveniment");
    };

    const execCreateTraining = () => {
        let newEventId;
        const trainingObject = {
            team_id: selectedTrainingTeam,
            principal_objective: principalObjective,
            principle_subprinciple: principleSubprinciple,
            objective_task: objectiveTask,
            effort_regime: effortRegime,
            duration: duration,
            volume: volume,
            start_date: moment(startTrainingDate).format(),
            end_date: moment(endTrainingDate).format()
        };
        createTraining(ls.get('token'), trainingObject)
            .then((res) => {
                const created_team_name = getElementFromArrayByAttribute(allTeams, 'team_id', selectedTrainingTeam).team_name;
                newEventId = res.data
                const newEvents = [...events];
                newEvents.push({
                    id: newEventId,
                    title: 'Antrenament: '+created_team_name,
                    start: startTrainingDate,
                    end: endTrainingDate,
                    classNames: 'training calendar-event',
                    team_id: selectedTrainingTeam,
                    team_name: created_team_name
                });
                setEvents(newEvents);
                return res;
            })
            .then(res => {
                selectedTrainingUsers.forEach(user => {
                    createConvened_User(ls.get('token'), {event_id: res.data, user_id: user.user_id});
                });
            })
            .then(() => initTrainings())
            .then(() => showSuccess(notificationRef))
            .catch(err => {
                console.log(err);
                showError(notificationRef);
            });
        /*        isEventOverlapping(ls.get('token'), {
                    startDate: startTrainingDate,
                    endDate: endTrainingDate
                }).then(res => {
                    if (res.data == true) {
                        showErrorWithMessage(notificationRef, "S-a gasit un eveniment in aceasta data");
                    } else
                        createTraining(ls.get('token'), trainingObject)
                            .then((res) => {
                                newEventId = res.data
                                const newEvents = [...events];
                                newEvents.push({
                                    id: newEventId,
                                    title: 'Antrenament',
                                    start: startTrainingDate,
                                    end: endTrainingDate,
                                    classNames: 'training calendar-event'
                                });
                                setEvents(newEvents);
                            })
                            .then(() => initTrainings())
                            .then(() => showSuccess(notificationRef))
                            .catch(err => {
                                console.log(err);
                                showError(notificationRef);
                            });
                });*/
    };

    const execCreateMeeting = () => {
        let newEventId;
        const meetingObject = {
            team_id: selectedMeetingTeam,
            topic: topic,
            start_date: moment(startMeetingDate).format(),
            end_date: moment(endMeetingDate).format()
        };

        createMeeting(ls.get('token'), meetingObject)
            .then((res) => {
                const created_team_name = getElementFromArrayByAttribute(allTeams, 'team_id', selectedMeetingTeam).team_name;
                newEventId = res.data
                const newEvents = [...events];
                newEvents.push({
                    id: newEventId,
                    title: 'Sedinta: '+created_team_name,
                    start: startMeetingDate,
                    end: endMeetingDate,
                    classNames: 'meeting calendar-event',
                    team_id: selectedMeetingTeam,
                    team_name: created_team_name

                });
                setEvents(newEvents);
                return res;
            }).then(res => {
            selectedMeetingUsers.forEach(user => {
                createConvened_User(ls.get('token'), {event_id: res.data, user_id: user.user_id});
            });
        })
            .then(() => initMeetings())
            .then(() => showSuccess(notificationRef))
            .catch(err => {
                console.log(err);
                showError(notificationRef);
            });

        /*        isEventOverlapping(ls.get('token'), {
                    startDate: startMeetingDate,
                    endDate: endMeetingDate
                }).then(res => {
                    if (res.data == true) {
                        showErrorWithMessage(notificationRef, "S-a gasit un eveniment in aceasta data");
                    } else
                        createMeeting(ls.get('token'), meetingObject)
                            .then((res) => {
                                newEventId = res.data
                                const newEvents = [...events];
                                newEvents.push({
                                    id: newEventId,
                                    title: 'Intalnire',
                                    start: startMeetingDate,
                                    end: endMeetingDate,
                                    classNames: 'meeting calendar-event'
                                });
                                setEvents(newEvents);
                            })
                            .then(() => initMeetings())
                            .then(() => showSuccess(notificationRef))
                            .catch(err => {
                                console.log(err);
                                showError(notificationRef);
                            });
                });*/
    };

    const execCreateGame = () => {
        let newEventId;
        const gameObject = {
            team_id: selectedGameTeam,
            game_type_id: gameType,
            formation_id: formation,
            opposite_team: oppositeTeam,
            start_date: moment(startGameDate).format(),
            end_date: moment(endGameDate).format()
        };
        createGame(ls.get('token'), gameObject)
            .then((res) => {
                const created_team_name = getElementFromArrayByAttribute(allTeams, 'team_id', selectedGameTeam).team_name;
                newEventId = res.data
                const newEvents = [...events];
                newEvents.push({
                    id: newEventId,
                    title: 'Meci: '+created_team_name,
                    start: startGameDate,
                    end: endGameDate,
                    classNames: 'game calendar-event',
                    opposite_team: oppositeTeam,
                    host_score: -1,
                    opposite_score: -1,
                    team_id: selectedGameTeam,
                    team_name: created_team_name

                });
                setEvents(newEvents);
                return res;
            }).then(res => {
            selectedGameUsers.forEach(user => {
                createConvened_User(ls.get('token'), {event_id: res.data, user_id: user.user_id});
            });
        })
            .then(() => initGames())
            .then(() => showSuccess(notificationRef))
            .catch(err => {
                console.log(err);
                showError(notificationRef);
            });

        /*        isEventOverlapping(ls.get('token'), {
                    startDate: startGameDate,
                    endDate: endGameDate
                }).then(res => {
                    if (res.data == true) {
                        showErrorWithMessage(notificationRef, "S-a gasit un eveniment in aceasta data");
                    } else
                        createGame(ls.get('token'), gameObject)
                            .then((res) => {
                                newEventId = res.data
                                const newEvents = [...events];
                                newEvents.push({
                                    id: newEventId,
                                    title: 'Joc',
                                    start: startGameDate,
                                    end: endGameDate,
                                    classNames: 'game calendar-event'
                                });
                                setEvents(newEvents);
                            })
                            .then(() => initGames())
                            .then(() => showSuccess(notificationRef))
                            .catch(err => {
                                console.log(err);
                                showError(notificationRef);
                            });
                });*/
    };

    /** Carefull on "locales" */
    const options = {
        plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin, listPlugin],
        initialView: "timeGridWeek",
        initialDate: new Date(),
        headerToolbar: {
            left: "prev,next,today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        },
        locales: allLocales,
        locale: 'ro',
        editable: false,
        height: "90vh",
        selectMirror: true,
        allDaySlot: false,
        showNonCurrentDates: false,
        datesSet: (e) => {
            forceUpdate();
        },
        eventClick: (e) => {
            e.jsEvent.preventDefault();
            console.log(calendarRef);
            setUpdateOrDeleteDlgVisible(true);
            setSelectedEvent(getByEventId(e.event._def.publicId));
        }

    };

    React.useEffect(() => {
        const newEvents = [];
        const clonedAllUsers = [];
        const clonedAllTeams = [];
        const clonedAllFormations = [];
        const clonedAllGameTypes = [];
        const clonedAllTColors = [];
        const clonedLoggedUserTeamsLinked = [];

        getAllFullDataUsers(ls.get('token')).then(res => {
            if (res != null && res.length !== 0 && res[0] !== undefined) {
                res.forEach(user => {
                    clonedAllUsers.push(user);
                });
                clonedAllUsers.sort(compareByRoleId);
                setAllUsers(clonedAllUsers);
            }
        });

        getAllTeams(ls.get('token')).then(res => {
            if (res != null && res.length !== 0 && res[0] !== undefined) {
                res.forEach(item => {
                    clonedAllTeams.push(item);
                });
                setAllTeams(clonedAllTeams);

                //bypass if admin
                if (ls.get('role_id') === 5) {
                    setLoggedUserTeams([getAllTeamObject(), ...clonedAllTeams]);
                    setLoggedUserSelectedTeam(0);
                }
            }
        });

        getAllFormations(ls.get('token')).then(res => {
            if (res != null && res.length !== 0 && res[0] !== undefined) {
                res.forEach(item => {
                    clonedAllFormations.push(item);
                });
                setAllFormations(clonedAllFormations);
            }
        });


        getAllGameTypes(ls.get('token')).then(res => {
            if (res != null && res.length !== 0 && res[0] !== undefined) {
                res.forEach(item => {
                    clonedAllGameTypes.push(item);
                });
                setAllGameTypes(clonedAllGameTypes);
            }
        });

        getAllTColor(ls.get('token')).then(res => {
            if (res.data != null && res.data.length !== 0 && res.data[0] !== undefined) {
                res.data.forEach(t_color => {
                    switch (t_color.color_id) {
                        case 1:
                            clonedAllTColors.push({
                                ...t_color,
                                value: "Bun",
                                icon: "pi pi-chevron-circle-up",
                                className: "Green"
                            });
                            break;
                        case 2:
                            clonedAllTColors.push({
                                ...t_color,
                                value: "Mediu",
                                icon: "pi pi-circle-off",
                                className: "Yellow"
                            });
                            break;
                        case 3:
                            clonedAllTColors.push({
                                ...t_color,
                                value: "Slab",
                                icon: "pi pi-chevron-circle-down",
                                className: "Red"
                            });
                            break;

                    }

                });
                setAllColors(clonedAllTColors);
            }
        });

        if (ls.get('role_id') !== 5)
            getTeamsOfUserIdLink(ls.get('token'), ls.get('user_id')).then(res => {
                if (res.data != null && res.data.length !== 0 && res.data[0] !== undefined) {
                    res.data.forEach(team => {
                        clonedLoggedUserTeamsLinked.push(team);
                    });
                    setLoggedUserTeams([getAllTeamObject(), ...clonedLoggedUserTeamsLinked]);
                    setLoggedUserSelectedTeam(0);
                }
            }).catch(err => {
                console.log(err);
            })

        const eventsPromises = getAllEvents(ls.get('token'));
        eventsPromises.then(res => {
            if (res != null && res.length !== 0 && res[0] !== undefined)
                res.map(item => {
                    if (item != null && item.length !== 0 && item[0] !== undefined)
                        item.map(eventItem => {
                            const newEvent = {
                                id: eventItem.event_id,
                                title: eventItem.event_type_desc + ': ' + eventItem.team_name,
                                start: eventItem.start_date,
                                end: eventItem.end_date,
                                classNames: eventItem.event_type_id === 1 ? 'training calendar-event' : eventItem.event_type_id === 2 ? 'game calendar-event' : 'meeting calendar-event',
                                team_id: eventItem.team_id,
                                team_name: eventItem.team_name
                            };
                            if (newEvent.classNames.includes("game")) {
                                newEvent.opposite_team = eventItem.opposite_team;
                                newEvent.team_name = eventItem.team_name;
                                newEvent.host_score = eventItem.host_score;
                                newEvent.opposite_score = eventItem.opposite_score;
                            }
                            newEvents.push(newEvent);

                        });
                });
            setEvents(newEvents);

        });


    }, []);

    useEffect(() => {
    });

    const getUpdateFunctionForEvent = thisEvent => {
        if (thisEvent.classNames.includes("meeting"))
            return setUpdateMeetingDlg;
        else if (thisEvent.classNames.includes("training"))
            return setUpdateTrainingDlg;
        else if (thisEvent.classNames.includes("game"))
            return setUpdateGameDlg;
    };

    const getVisibleEvaluationForEvent = thisEvent => {
        if (thisEvent == null || thisEvent.id == null) return false;
        if (thisEvent.classNames.includes("meeting"))
            return false;
        else if (thisEvent.classNames.includes("game") || thisEvent.classNames.includes("training"))
            return true;
    }

    const setUpdateFunctionForEvent = thisEvent => {
        if (thisEvent.classNames.includes("meeting")) {
            initMeetings();
            getMeetingById(ls.get('token'), selectedEvent.id).then(res => {
                setStatesFromMeetingObj(res.data, setStartMeetingDate, setEndMeetingDate, setSelectedMeetingTeam, setTopic)
                getAllConvened_UserOfEventId(ls.get('token'), selectedEvent.id).then(res => {
                    if (res.data != null && res.data.length !== 0 && res.data[0] !== undefined) {
                        const convenedMeetingUsers = []
                        res.data.forEach(convened_user => {
                            convenedMeetingUsers.push(getUserByUserId(convened_user.user_id));
                        });
                        setSelectedMeetingUsers(convenedMeetingUsers);
                        setCloneSelectedMeetingUsers(convenedMeetingUsers);
                    }
                });
            }).then(() => {
                setUpdateMeetingDlg(true);
            });


        } else if (thisEvent.classNames.includes("training")) {
            initTrainings();

            getTrainingById(ls.get('token'), selectedEvent.id).then(res => {


                setStatesFromTrainingObj(res.data,
                    setStartTrainingDate,
                    setEndTrainingDate,
                    setSelectedTrainingTeam,
                    setPrincipalObjective,
                    setPrincipleSubprinciple,
                    setObjectiveTask,
                    setEffortRegime,
                    setDuration,
                    setVolume);

                getAllConvened_UserOfEventId(ls.get('token'), selectedEvent.id).then(res => {

                    if (res.data != null && res.data.length !== 0 && res.data[0] !== undefined) {
                        const convenedTrainingUsers = []
                        res.data.forEach(convened_user => {
                            convenedTrainingUsers.push(getUserByUserId(convened_user.user_id));
                        });
                        //console.log(convenedTrainingUsers);
                        setSelectedTrainingUsers(convenedTrainingUsers);
                        setCloneSelectedTrainingUsers(convenedTrainingUsers);
                    }
                });
            }).then(() => {
                setUpdateTrainingDlg(true);
            });

        } else if (thisEvent.classNames.includes("game")) {
            initGames();
            getGameById(ls.get('token'), selectedEvent.id).then(res => {
                setStatesFromGameObj(res.data, setStartGameDate, setEndGameDate, setSelectedGameTeam, setGameType, setFormation, setOppositeTeam);
                getAllConvened_UserOfEventId(ls.get('token'), selectedEvent.id).then(res => {

                    if (res.data != null && res.data.length !== 0 && res.data[0] !== undefined) {
                        const convenedGameUsers = []
                        res.data.forEach(convened_user => {
                            convenedGameUsers.push(getUserByUserId(convened_user.user_id));
                        });
                        setSelectedGameUsers(convenedGameUsers);
                        setCloneSelectedGameUsers(convenedGameUsers);
                        //DEEP COPY
                        //cloneSelectedGameUsers = JSON.parse(JSON.stringify(convenedGameUsers));

                    }
                });
            }).then(() => {
                setUpdateGameDlg(true);
            });

        }
        setUpdateOrDeleteDlgVisible(false);
    }

    const execUpdateMeeting = () => {
        const meetingObject = {
            event_id: selectedEvent.id,
            team_id: selectedMeetingTeam,
            topic: topic,
            start_date: moment(startMeetingDate).format(),
            end_date: moment(endMeetingDate).format()
        };
        updateMeeting(ls.get('token'), meetingObject).then(() => {
            const team_name = getElementFromArrayByAttribute(allTeams, 'team_id', selectedMeetingTeam).team_name;
            changeEventOfEventId(meetingObject.event_id, meetingObject.start_date, meetingObject.end_date, "Sedinta", "meeting calendar-event", selectedMeetingTeam, team_name);

            const obj = getTheAddAndDeleteArraysOfConvened_Users(cloneSelectedMeetingUsers, selectedMeetingUsers);

            obj.add.forEach(userId => {
                createConvened_User(ls.get('token'), {event_id: meetingObject.event_id, user_id: userId})
                    .catch(err => {
                        console.log(err);
                    });
            });

            /**deleting convened_users will also trigger deleting present_users and rae_games_results (cuz' there shouldn't be rae_results for unconvened users)*/
            obj.delete.forEach(userId => {
                deleteConvened_UserOfEventIdAndUserId(ls.get('token'), meetingObject.event_id, userId)
                    .catch(err => {
                        console.log(err);
                    });
            })

            /*            deleteAllConvened_UserOfEventId(ls.get('token'), selectedEvent.id);
                        selectedMeetingUsers.forEach(user => {
                            createConvened_User(ls.get('token'), {event_id: selectedEvent.id, user_id: user.user_id});
                        });*/
        }).then(() => {
            showSuccess(notificationRef);
        }).catch(err => {
            showError(notificationRef);
            console.log(err);
        });

    }

    const execUpdateTraining = () => {
        const trainingObject = {
            event_id: selectedEvent.id,
            team_id: selectedTrainingTeam,
            start_date: moment(startTrainingDate).format(),
            end_date: moment(endTrainingDate).format(),
            principal_objective: principalObjective,
            principle_subprinciple: principleSubprinciple,
            objective_task: objectiveTask,
            effort_regime: effortRegime,
            duration: duration,
            volume: volume
        };
        updateTraining(ls.get('token'), trainingObject).then(() => {
            const team_name = getElementFromArrayByAttribute(allTeams, 'team_id', selectedTrainingTeam).team_name;
            changeEventOfEventId(trainingObject.event_id, trainingObject.start_date, trainingObject.end_date, "Antrenament", "training calendar-event", selectedTrainingTeam, team_name);
            const obj = getTheAddAndDeleteArraysOfConvened_Users(cloneSelectedTrainingUsers, selectedTrainingUsers);
            //console.log(obj);
            obj.add.forEach(userId => {
                createConvened_User(ls.get('token'), {
                    event_id: trainingObject.event_id,
                    user_id: userId
                }).catch(err => console.log(err));
            });

            /**deleting convened_users will also trigger deleting present_users and rae_training_results (cuz' there shouldn't be rae_results for unconvened users)*/
            obj.delete.forEach(userId => {
                deleteConvened_UserOfEventIdAndUserId(ls.get('token'), trainingObject.event_id, userId)
                    .catch(err => {
                        console.log(err);
                    });
            })

            /*            deleteAllConvened_UserOfEventId(ls.get('token'), selectedEvent.id);
                        selectedTrainingUsers.forEach(user => {
                            createConvened_User(ls.get('token'), {event_id: selectedEvent.id, user_id: user.user_id});
                        });*/
        }).then(() => {
            showSuccess(notificationRef);
        }).catch(err => {
            showError(notificationRef);
            console.log(err);
        });

    }

    const execUpdateGame = () => {
        const gameObject = {
            event_id: selectedEvent.id,
            team_id: selectedGameTeam,
            start_date: moment(startGameDate).format(),
            end_date: moment(endGameDate).format(),
            game_type_id: gameType,
            formation_id: formation,
            opposite_team: oppositeTeam
        };

        updateGame(ls.get('token'), gameObject).then(() => {
            const team_name = getElementFromArrayByAttribute(allTeams, 'team_id', selectedGameTeam).team_name;
            changeEventOfEventId(gameObject.event_id, gameObject.start_date, gameObject.end_date, "Meci", "game calendar-event", selectedGameTeam, team_name);
            const obj = getTheAddAndDeleteArraysOfConvened_Users(cloneSelectedGameUsers, selectedGameUsers);
            //console.log(obj);
            obj.add.forEach(userId => {
                createConvened_User(ls.get('token'), {event_id: gameObject.event_id, user_id: userId})
                    .catch(err => {
                        console.log(err);
                    });
            });

            /**deleting convened_users will also trigger deleting present_users and rae_games_results (cuz' there shouldn't be rae_results for unconvened users)*/
            obj.delete.forEach(userId => {
                deleteConvened_UserOfEventIdAndUserId(ls.get('token'), gameObject.event_id, userId)
                    .catch(err => {
                        console.log(err);
                    });
            })

            /*            deleteAllConvened_UserOfEventId(ls.get('token'), selectedEvent.id);
                        selectedGameUsers.forEach(user => {
                            createConvened_User(ls.get('token'), {event_id: selectedEvent.id, user_id: user.user_id});
                        });*/
        }).then(() => {
            showSuccess(notificationRef);
        }).catch(err => {
            showError(notificationRef);
            console.log(err);
        });

    }

    const changeEventOfEventId = (event_id, start_date, end_date, title, classNames, team_id, team_name) => {
        let newEvents = [...events];
        newEvents.forEach(item => {
            if (item.id == event_id) {
                const index = newEvents.indexOf(item)
                newEvents.splice(index, 1);

                if (classNames.includes("game")) {
                    const obj = createNewCalendarEvent(event_id, start_date, end_date, classNames, title, team_id, team_name);
                    obj.team_name = getElementFromArrayByAttribute(allTeams, 'team_id', selectedGameTeam).team_name;
                    obj.opposite_team = oppositeTeam;

                    obj.host_score = item.host_score;
                    obj.opposite_score = item.opposite_score;
                    newEvents.push(obj);
                } else
                    newEvents.push(createNewCalendarEvent(event_id, start_date, end_date, classNames, title, team_id, team_name));
                setEvents(newEvents);
                return;
            }
        })
    }

    const createNewCalendarEvent = (event_id, start, end, classNames, title, team_id, team_name) => {
        return {
            id: event_id,
            start: start,
            end: end,
            classNames: classNames,
            title: title+": "+team_name,
            team_id: team_id,
            team_name: team_name
        }
    }

    const userMultiSelTemplate = option => {
        return (
            <div><b>{option.role_desc}</b> {option.firstname} {option.lastname}</div>
        );
    }

    const selectedUserMultiSelTemplate = option => {
        if (option) {
            return (
                <Chip label={option.lastname} className="custom-chip"/>
            );
        }
    }

    const getTheAddAndDeleteArraysOfConvened_Users = (oldArray, newArray) => {
        let toAddArray = [];
        let toDeleteArray = [];
        const oldConvenedUsers = [...oldArray];
        const newConvenedUsers = [...newArray];
        if (oldConvenedUsers != null && oldConvenedUsers != undefined) {

            /**
             * Eliminate all common user_ids. In the end,
             * the oldConvenedUsers should have the deletion userIds,
             * and the newConvenedUsers should have the addition userIds in convened_users
             */
            /*            for (const old_conv_user in oldConvenedUsers) {
                            for (const new_conv_user in newConvenedUsers) {
                                if (newConvenedUsers[new_conv_user].user_id == oldConvenedUsers[old_conv_user].user_id) {
                                    newConvenedUsers.splice(parseInt(new_conv_user), 1);
                                    oldConvenedUsers.splice(parseInt(old_conv_user), 1);
                                    break;
                                }
                            }
                        }
                        newConvenedUsers.forEach(item => {
                            toAddArray.push({event_id: eventId, user_id: item.user_id});
                        });
                        oldConvenedUsers.forEach(item => {
                            toDeleteArray.push({event_id: eventId, user_id: item.user_id});
                        });*/
            toDeleteArray = oldConvenedUsers.map(item => item.user_id).filter(x => !(newConvenedUsers.map(item => item.user_id)).includes(x));
            toAddArray = newConvenedUsers.map(item => item.user_id).filter(x => !(oldConvenedUsers.map(item => item.user_id)).includes(x));

        }
        return {add: toAddArray, delete: toDeleteArray};
    }

    const getUserPresenceFromPresenceUserOfEvent = (presenceArray, userId) => {
        if (!isNullOrEmpty(presenceArray))
            for (const presentUser in presenceArray) {
                if (presenceArray[presentUser].user_id === userId) {
                    return true;
                }
            }
        return false;
    }

    const getAllPresencesAndAssessmentsOfEvent = async () => {
        setLoadingTable(true);
        /** Gets convened_users and present_users of event*/
        const convenedUsersOfEventId = await getAllConvened_UserOfEventId(ls.get('token'), selectedEvent.id);
        const presentUsersOfEventId = await getAllPresent_UserOfEventId(ls.get('token'), selectedEvent.id);
        // console.table(convenedUsersOfEventId.data);
        // console.table(presentUsersOfEventId.data);

        if (selectedEvent.classNames.includes("training")) {
            setRaeTrainingOriginalRows({});
            setPlayerTrainingResults([]);
            const raeTrainingRows = [];
            const raeTrainingsOfEventId = await getRAETrainingsOfEventId(ls.get('token'), selectedEvent.id);

            /** Gets all the convened_users of event to display them in the table*/
            if (!isNullOrEmpty(convenedUsersOfEventId.data)) {
                for (const convened_user in convenedUsersOfEventId.data) {
                    let present = false;

                    const raeTraining = {
                        rae_id: 0,
                        realization: 0,
                        attitude: 0,
                        effort: 0,
                        existentResultInDB: false
                    };
                    const user = await getFullUserDataByUserId(ls.get('token'), convenedUsersOfEventId.data[convened_user].user_id);
                    present = getUserPresenceFromPresenceUserOfEvent(presentUsersOfEventId.data, user.user_id);

                    //getRAETrainingFromRaeTrainingsOfEvent
                    if (!isNullOrEmpty(raeTrainingsOfEventId.data) && user.role_id === 0)
                        for (const raeTrainingIndex in raeTrainingsOfEventId.data) {
                            if (raeTrainingsOfEventId.data[raeTrainingIndex].player_id === user.player_id) {
                                raeTraining.rae_id = raeTrainingsOfEventId.data[raeTrainingIndex].rae_id;
                                raeTraining.realization = raeTrainingsOfEventId.data[raeTrainingIndex].realization;
                                raeTraining.attitude = raeTrainingsOfEventId.data[raeTrainingIndex].attitude;
                                raeTraining.effort = raeTrainingsOfEventId.data[raeTrainingIndex].effort;
                                raeTraining.existentResultInDB = true;
                                break;
                            }
                        }

                    raeTrainingRows.push({...user, ...raeTraining, present, existentPresenceInDB: present});
                }
                setPlayerTrainingResults(raeTrainingRows);
                //console.log(raeTrainingRows);
            } else {
                setPlayerTrainingResults([]);
            }
        } else if (selectedEvent.classNames.includes("meeting")) {
            setMeetingOriginalRows({});
            setPlayerMeetingPresences([]);
            const meetingRows = [];

            /** Gets all the convened_users of event to display them in the table*/
            if (!isNullOrEmpty(convenedUsersOfEventId.data)) {
                for (const convened_user in convenedUsersOfEventId.data) {
                    let present = false;

                    const user = await getFullUserDataByUserId(ls.get('token'), convenedUsersOfEventId.data[convened_user].user_id);
                    present = getUserPresenceFromPresenceUserOfEvent(presentUsersOfEventId.data, user.user_id);

                    meetingRows.push({...user, present, existentPresenceInDB: present});
                }
                setPlayerMeetingPresences(meetingRows);
                //console.log(meetingRows);
            } else {
                setPlayerMeetingPresences([]);
            }

        } else if (selectedEvent.classNames.includes("game")) {
            setOurTeamScore(selectedEvent.host_score);
            setOppositeScore(selectedEvent.opposite_score);
            setRaeGameOriginalRows({});
            setPlayerGameResults([]);
            const raeGameRows = [];
            const raeGamesOfEventId = await getRAEGamesOfEventId(ls.get('token'), selectedEvent.id);

            /** Gets all the convened_users of event to display them in the table*/
            if (!isNullOrEmpty(convenedUsersOfEventId.data)) {
                for (const convened_user in convenedUsersOfEventId.data) {
                    let present = false;

                    const raeGame = {
                        rae_id: 0,
                        realization: 0,
                        attitude: 0,
                        effort: 0,
                        yellow_card: false,
                        red_card: false,
                        played_time: 0,
                        goal: 0,
                        assist: 0,
                        existentResultInDB: false
                    };

                    const user = await getFullUserDataByUserId(ls.get('token'), convenedUsersOfEventId.data[convened_user].user_id);
                    present = getUserPresenceFromPresenceUserOfEvent(presentUsersOfEventId.data, user.user_id);

                    //getRAEGameFromRaeTrainingsOfEvent
                    if (!isNullOrEmpty(raeGamesOfEventId.data) && user.role_id === 0)
                        for (const raeGameIndex in raeGamesOfEventId.data) {
                            if (raeGamesOfEventId.data[raeGameIndex].player_id === user.player_id) {
                                raeGame.rae_id = raeGamesOfEventId.data[raeGameIndex].rae_id;
                                raeGame.realization = raeGamesOfEventId.data[raeGameIndex].realization;
                                raeGame.attitude = raeGamesOfEventId.data[raeGameIndex].attitude;
                                raeGame.effort = raeGamesOfEventId.data[raeGameIndex].effort;
                                raeGame.yellow_card = raeGamesOfEventId.data[raeGameIndex].yellow_card === 1 ? true : false;
                                raeGame.red_card = raeGamesOfEventId.data[raeGameIndex].red_card === 1 ? true : false;
                                raeGame.played_time = raeGamesOfEventId.data[raeGameIndex].played_time;
                                raeGame.goal = raeGamesOfEventId.data[raeGameIndex].goal;
                                raeGame.assist = raeGamesOfEventId.data[raeGameIndex].assist;
                                raeGame.existentResultInDB = true;
                                break;
                            }
                        }

                    raeGameRows.push({...user, ...raeGame, present, existentPresenceInDB: present});
                }
                setPlayerGameResults(raeGameRows);
                //console.log(raeGameRows);
            } else {
                setPlayerGameResults([]);
            }
        }
        setLoadingTable(false);
    }
    const onEditorValueChange = (setTableFn, props, value) => {
        let updatedProducts = [...props.value];
        updatedProducts[props.rowIndex][props.field] = value;
        setTableFn(updatedProducts);
    }

    const checkboxBody = (rowData, checkedAtt, responsiveText) => {
        return (
            <>
                <span className="p-column-title width-100-p">{responsiveText}</span>
                <Checkbox checked={rowData[checkedAtt]} disabled={true}></Checkbox>

            </>
        );
    }

    const checkboxEditor = (setTableFn, props, checkedAtt, responsiveText) => {
        return (
            <>
                <span className="p-column-title width-100-p">{responsiveText}</span>
                <Checkbox checked={props.rowData[checkedAtt]}
                          onChange={e => onEditorValueChange(setTableFn, props, e.checked)}></Checkbox>

            </>
        );
    }

    const checkboxYellowRedCardBody = (rowData, checkedAtt, responsiveText) => {
        return (
            <>
                {
                    rowData.role_id === 0 &&
                    <>
                        <span className="p-column-title width-100-p">{responsiveText}</span>
                        <Checkbox checked={rowData[checkedAtt]} disabled={true}></Checkbox>

                    </>
                }
            </>
        );
    }

    const checkboxYellowRedCardEditor = (setTableFn, props, checkedAtt, responsiveText) => {
        return (
            <>
                {
                    props.rowData.role_id === 0 &&
                    <>
                        <span className="p-column-title width-100-p">{responsiveText}</span>
                        <Checkbox checked={props.rowData[checkedAtt]}
                                  onChange={e => onEditorValueChange(setTableFn, props, e.checked)}></Checkbox>

                    </>
                }
            </>
        );
    }


    const colorBody = (rowData, valueAtt, responsiveText) => {
        return (
            <>
                {
                    rowData.role_id === 0 &&
                    <>
                        <span className="p-column-title width-100-p">{responsiveText}</span>
                        {/*                        <MultiStateCheckbox disabled={true} value={rowData[valueAtt]} optionValue="color_id"
                                            className={getColorOfId(rowData[valueAtt]) + ' raeMultiState'}
                                            options={allColors}/>*/}
                        <Dropdown value={rowData[valueAtt]} options={allColors} disabled={true}
                                  optionValue="color_id" optionLabel="value"
                                  className={getColorOfId(rowData[valueAtt]) + ' raeMultiState'}
                                  appendTo={document.body}/>

                    </>
                }
            </>
        );
    }

    const colorEditor = (setTableFn, props, valueAtt, responsiveText) => {
        return (
            <>
                {
                    props.rowData.role_id === 0 &&
                    <>
                        <span className="p-column-title width-100-p">{responsiveText}</span>
                        {/*                        <MultiStateCheckbox value={props.rowData[valueAtt]} options={allColors}
                                            className={getColorOfId(props.rowData[valueAtt]) + ' raeMultiState'}
                                            onChange={(e) => onEditorValueChange(setTableFn, props, e.value)}
                                            optionValue="color_id"/>*/}
                        <Dropdown value={props.rowData[valueAtt]} options={allColors}
                                  optionValue="color_id" optionLabel="value" autoWidth={false}
                                  itemTemplate={colorTemplate}
                                  onChange={e => onEditorValueChange(setTableFn, props, e.value)}
                                  className={getColorOfId(props.rowData[valueAtt]) + ' raeMultiState'}
                                  placeholder="" appendTo={document.body}/>

                    </>
                }
            </>
        );
    }

    const inputNumberBody = (rowData, valueAtt, responsiveText) => {
        return (
            <>
                {
                    rowData.role_id === 0 &&
                    <>
                        <span className="p-column-title width-100-p">{responsiveText}</span>
                        <InputNumber className="input-width-100" value={rowData[valueAtt] || 0} disabled={true}
                                     mode="decimal"/>

                    </>
                }
            </>
        );
    }

    const inputNumberEditor = (setTableFn, props, valueAtt, max, responsiveText) => {
        return (
            <>
                {
                    props.rowData.role_id === 0 &&
                    <>
                        <span className="p-column-title width-100-p">{responsiveText}</span>
                        <InputNumber className="input-width-100" value={props.rowData[valueAtt] || 0} mode="decimal"
                                     min={0}
                                     max={max}
                                     onValueChange={(e) => onEditorValueChange(setTableFn, props, e.value)}/>

                    </>
                }
            </>
        );
    }

    const textBody = (rowData, valueAtt, responsiveText) => {
        return (
            <>
                <span className="p-column-title width-100-p">{responsiveText}</span>
                <div>{rowData[valueAtt]}</div>
            </>
        );
    }

    const editBody = (ev, colProps, responsiveText) => {
        //console.log(colProps);
        return (
            <>
                <span className="p-column-title width-100-p">{responsiveText}</span>
            </>
        );
    }

    const getColorOfId = (colorId) => {
        for (const color in allColors) {
            if (allColors[color].color_id === colorId)
                return allColors[color].color_desc;
        }
        return "white";
    }

    /** Interesting fact: if you editInit one row, then you delete it and cancel, you will get the previous values, but in DB, they are deleted*/
    const rowEditInit = (event, raeOriginalRows, setOriginalRows, tableRows) => {
        const obj = {...raeOriginalRows};
        obj[event.index] = {...tableRows[event.index]};

        setOriginalRows(obj);
    }

    const rowEditCancel = (event, originalRows, setOriginalRows, tableRows, setTableRows) => {
        const values = [...tableRows];
        values[event.index] = originalRows[event.index];

        const obj = {...originalRows};
        delete obj[event.index];

        setOriginalRows(obj);
        setTableRows(values);
    }

    const rowEditSave = (event, addResultFn, updateResultFn, beforeAddOrUpdFn, table, setTable) => {
        //console.log(event);
        const userData = event.data;

        //XOR
        if ((userData.present ^ userData.existentPresenceInDB) && userData.present === true) {
            createPresent_User(ls.get('token'), {event_id: selectedEvent.id, user_id: userData.user_id})
                .then(() => {
                    userData.existentPresenceInDB = true;
                    showSuccessWithMessage(notificationRef, "Prezenta adaugata!");
                })
                .catch(err => {
                    console.log(err);
                    showError(notificationRef);
                });
        } else if ((userData.present ^ userData.existentPresenceInDB) && userData.present === false) {
            deletePresent_UserOfEventIdAndUserId(ls.get('token'), selectedEvent.id, userData.user_id)
                .then(() => {
                    userData.existentPresenceInDB = false;
                    showSuccessWithMessage(notificationRef, "Prezenta eliminata!");
                })
                .catch(err => {
                    console.log(err);
                    showError(notificationRef);
                });
        }

        if (userData.role_id === 0) {
            beforeAddOrUpdFn(userData);

            if (userData.existentResultInDB) {
                updateResultFn(userData);
            } else {
                addResultFn(userData);
            }
        }
        updateTableWithRow(table, setTable, userData, event.index);
    }

    const fixRAEValues = (userData) => {
        if (userData.realization === 0 || userData.realization == null)
            userData.realization = 2;
        if (userData.attitude === 0 || userData.attitude == null)
            userData.attitude = 2;
        if (userData.effort === 0 || userData.effort == null)
            userData.effort = 2;
    }

    const fixMeetingValues = (userData) => {

    }

    const execAddRAEGame = async (userData) => {
        const obj = await getTrainingGameMeetingIdByEventId(ls.get('token'), selectedEvent.id);
        createRAEGame(ls.get('token'), {
            game_id: obj.data.game_id,
            player_id: userData.player_id,
            realization: userData.realization,
            attitude: userData.attitude,
            effort: userData.effort,
            yellow_card: userData.yellow_card ? 1 : 0,
            red_card: userData.red_card ? 1 : 0,
            played_time: userData.played_time,
            goal: userData.goal,
            assist: userData.assist
        }).then((res) => {
            userData.rae_id = res.data;
            userData.existentResultInDB = true;
            showSuccessWithMessage(notificationRef, "Evaluare adaugata!");
        }).catch(err => {
            console.log(err);
            showError(notificationRef);
        });
    }

    const execUpdateRAEGame = async (userData) => {
        const obj = await getTrainingGameMeetingIdByEventId(ls.get('token'), selectedEvent.id);
        updateRAEGame(ls.get('token'), {
            rae_id: userData.rae_id,
            game_id: obj.data.game_id,
            player_id: userData.player_id,
            realization: userData.realization,
            attitude: userData.attitude,
            effort: userData.effort,
            yellow_card: userData.yellow_card ? 1 : 0,
            red_card: userData.red_card ? 1 : 0,
            played_time: userData.played_time,
            goal: userData.goal,
            assist: userData.assist
        }).then(() => {
            userData.existentResultInDB = true;
            showSuccessWithMessage(notificationRef, "Evaluare modificata!");
        }).catch(err => {
            console.log(err);
            showError(notificationRef);
        });
    }

    const execAddRAETraining = async (userData) => {
        const obj = await getTrainingGameMeetingIdByEventId(ls.get('token'), selectedEvent.id);
        createRAETraining(ls.get('token'), {
            training_id: obj.data.training_id,
            player_id: userData.player_id,
            realization: userData.realization,
            attitude: userData.attitude,
            effort: userData.effort
        }).then((res) => {
            userData.rae_id = res.data;
            userData.existentResultInDB = true;
            showSuccessWithMessage(notificationRef, "Evaluare adaugata!");
        }).catch(err => {
            console.log(err);
            showError(notificationRef);
        });
    }

    const execUpdateRAETraining = async (userData) => {
        const obj = await getTrainingGameMeetingIdByEventId(ls.get('token'), selectedEvent.id);
        updateRAETraining(ls.get('token'), {
            rae_id: userData.rae_id,
            training_id: obj.data.training_id,
            player_id: userData.player_id,
            realization: userData.realization,
            attitude: userData.attitude,
            effort: userData.effort
        }).then(() => {
            userData.existentResultInDB = true;
            showSuccessWithMessage(notificationRef, "Evaluare modificata!");
        }).catch(err => {
            console.log(err);
            showError(notificationRef);
        });
    }

    const execAddMeetingResult = (userData) => {

    }

    const execUpdateMeetingResult = (userData) => {

    }

    const delAssessmentBody = (rowData, colProps, delPresentUsersFn, delResultFn, resetRowFn, table, setTable, originalRow, setOriginalRow, responsiveText) => {
        return (
            <>
                <span className="p-column-title width-100-p">{responsiveText}</span>
                <Button icon="pi pi-trash" type="button"
                        onClick={(e) => {
                            delPresentUsersFn(rowData);
                            delResultFn(rowData);
                            resetOriginalRow(originalRow, setOriginalRow, colProps.rowIndex, resetRowFn);
                            updateTableWithRow(table, setTable, resetRowFn(rowData), colProps.rowIndex);

                        }}
                        className="p-button-rounded p-button-danger p-button-text"/>

            </>
        );
    }

    const deletePresentUser = (rowData) => {
        if (rowData.existentPresenceInDB) {
            deletePresent_UserOfEventIdAndUserId(ls.get('token'), selectedEvent.id, rowData.user_id)
                .then((res) => {
                    rowData.existentPresenceInDB = false;
                    rowData.present = false;
                    showSuccessWithMessage(notificationRef, "Prezenta eliminata!");
                })
                .catch(err => {
                    console.log(err);
                    showError(notificationRef);
                });

        }
    }

    const deleteRaeGame = (rowData) => {
        if (rowData.existentResultInDB && rowData.role_id === 0) {
            deleteRAEGameByRaeID(ls.get('token'), rowData.rae_id)
                .then(res => {
                    if (res.data != null && res.data != undefined && res.data !== '') {
                        rowData.existentResultInDB = false;
                        rowData.realization = 0;
                        rowData.attitude = 0;
                        rowData.effort = 0;
                        rowData.yellow_card = false;
                        rowData.red_card = false;
                        rowData.played_time = 0;
                        rowData.goal = 0;
                        rowData.assist = 0;
                        showSuccessWithMessage(notificationRef, "Evaluarea eliminata!");
                    }
                })
                .catch(err => {
                    console.log(err);
                    showError(notificationRef);
                })
        }
    }

    const deleteRaeTraining = (rowData) => {
        if (rowData.existentResultInDB && rowData.role_id === 0) {
            deleteRAETrainingByRaeID(ls.get('token'), rowData.rae_id)
                .then(res => {
                    if (res.data != null && res.data != undefined && res.data !== '') {
                        rowData.existentResultInDB = false;
                        rowData.realization = 0;
                        rowData.attitude = 0;
                        rowData.effort = 0;
                        showSuccessWithMessage(notificationRef, "Evaluarea eliminata!");
                    }
                })
                .catch(err => {
                    console.log(err);
                    showError(notificationRef);
                })
        }
    }

    const deleteMeetingResult = (rowData) => {

    }

    const updateTableWithRow = (table, setTable, row, rowIndex) => {
        const rows = [...table];

        rows[rowIndex] = row;

        setTable(rows);
    }


    const resetOriginalRow = (originalRow, setOriginalRow, index, resetFn) => {
        const rows = {...originalRow};
        if (rows[index] != undefined) {
            resetFn(rows[index]);
            setOriginalRow(rows);
        }
    }

    const getResettedRowForRaeGame = (rowData) => {
        rowData.rae_id = 0;
        rowData.present = false;
        rowData.existentResultInDB = false;
        rowData.existentPresenceInDB = false;
        rowData.realization = 0;
        rowData.attitude = 0;
        rowData.effort = 0;
        rowData.yellow_card = false;
        rowData.red_card = false;
        rowData.played_time = 0;
        rowData.goal = 0;
        rowData.assist = 0;

        return rowData;
    }

    const getResettedRowForRaeTraining = (rowData) => {
        rowData.rae_id = 0;
        rowData.present = false;
        rowData.existentResultInDB = false;
        rowData.existentPresenceInDB = false;
        rowData.realization = 0;
        rowData.attitude = 0;
        rowData.effort = 0;

        return rowData;
    }

    const getResettedRowForPresenceMeeting = (rowData) => {
        rowData.present = false;
        rowData.existentPresenceInDB = false;

        return rowData;
    }

    const emptyFunctionWithParam = (param) => {
    }

    const updateScore = () => {
        updateScoreOfGame(ls.get('token'), {
            event_id: selectedEvent.id,
            host_score: ourTeamScore,
            opposite_score: oppositeScore
        }).then(res => {
            if (res != null && res !== '') {
                selectedEvent.host_score = ourTeamScore;
                selectedEvent.opposite_score = oppositeScore;
                showSuccessWithMessage(notificationRef, "Scor modificat");
            }
        }).catch(err => {
            showError(notificationRef);
            console.log(err);
        })
    }

    const renderPlayerGameResultTable = () => {
        return (
            <div>
                <div className="center p-mb-4">
                    <div className="p-text-bold p-mb-2">Scor
                        final {selectedEvent.host_score === -1 && "(Neactualizat)"}</div>
                    <div className=" ">
                        <span className="p-text-bold p-lg-2 p-md-2 p-sm-12 ">{selectedEvent.team_name} </span>
                        <span className=" p-lg-3 p-md-3 p-sm-12 "><InputNumber className="" value={ourTeamScore}
                                                                               mode="decimal" min={0}
                                                                               max={100}
                                                                               onValueChange={e => setOurTeamScore(e.value)}/></span>
                        <span className="p-lg-3 p-md-3 p-sm-12 "><InputNumber className="" value={oppositeScore}
                                                                              mode="decimal" min={0}
                                                                              max={100}
                                                                              onValueChange={e => setOppositeScore(e.value)}/></span>
                        <span className="p-text-bold p-lg-2 p-md-2 p-sm-12 "> {selectedEvent.opposite_team}</span>
                        <span className="p-ml-2 p-lg-1 p-md-1 p-sm-12">
                             <Button icon="pi pi-pencil" type="button"
                                     className="p-button-rounded p-button-primary p-mt-2"
                                     tooltip="Modifica scor" tooltipOptions={{position: 'top'}}
                                     onClick={() => updateScore()}/>

                        </span>
                    </div>
                </div>
                <div className="datatable-responsive-demo">
                    <div className="card">
                        <DataTable className="homeTable p-datatable-responsive-demo stripe-datatable"
                                   value={playerGameResults} emptyMessage="Niciun membru convocat"
                                   editMode="row" dataKey="user_id" scrollable={true}
                                   onRowEditInit={(event) => rowEditInit(event, raeGameOriginalRows, setRaeGameOriginalRows, playerGameResults)}
                                   removableSort loading={loadingTable}
                                   onRowEditCancel={(event) => rowEditCancel(event, raeGameOriginalRows, setRaeGameOriginalRows, playerGameResults, setPlayerGameResults)}
                                   onRowEditSave={(props) => rowEditSave(props, execAddRAEGame, execUpdateRAEGame, fixRAEValues, playerGameResults, setPlayerGameResults)}>
                            <Column className="table-width font-size-14" field="present" header="Prezent?"
                                    body={(rowData) => checkboxBody(rowData, 'present', "Prezent?")}
                                    editor={(props) => checkboxEditor(setPlayerGameResults, props, 'present', "Prezent?")}
                                    sortable/>
                            <Column className="table-width font-size-14" header="Prenume" field="firstname"
                                    body={(rowData) => textBody(rowData, 'firstname', 'Prenume')}
                                    sortable/>
                            <Column className="table-width font-size-14" header="Nume" field="lastname"
                                    body={(rowData) => textBody(rowData, 'lastname', 'Nume')} sortable/>
                            <Column className="table-width font-size-14" header="Rol" field="role_desc"
                                    body={(rowData) => textBody(rowData, 'role_desc', 'Rol')} sortable/>
                            <Column className="table-width font-size-14 " header="Realizare" field="realization"
                                    body={(rowData) => colorBody(rowData, 'realization', 'Realizare')}
                                    editor={(props) => colorEditor(setPlayerGameResults, props, 'realization', 'Realizare')}
                                    sortable/>
                            <Column className="table-width font-size-14 " header="Atitudine" field="attitude"
                                    body={(rowData) => colorBody(rowData, 'attitude', 'Atitudine')}
                                    editor={(props) => colorEditor(setPlayerGameResults, props, 'attitude', 'Atitudine')}
                                    sortable/>
                            <Column className="table-width font-size-14 " header="Efort" field="effort"
                                    body={(rowData) => colorBody(rowData, 'effort', 'Efort')}
                                    editor={(props) => colorEditor(setPlayerGameResults, props, 'effort', 'Efort')}
                                    sortable/>
                            <Column className="table-width font-size-14 " header="C. Galben" field="yellow_card"
                                    body={(rowData) => checkboxYellowRedCardBody(rowData, 'yellow_card', 'C. Galben')}
                                    editor={(props) => checkboxYellowRedCardEditor(setPlayerGameResults, props, 'yellow_card', 'C. Galben')}
                                    sortable/>
                            <Column className="table-width font-size-14 " header="C. Rosu" field="red_card"
                                    body={(rowData) => checkboxYellowRedCardBody(rowData, 'red_card', 'C. Rosu')}
                                    editor={(props) => checkboxYellowRedCardEditor(setPlayerGameResults, props, 'red_card', 'C. Rosu')}
                                    sortable/>

                            <Column className="table-width font-size-14 " header="Minute jucate" field="played_time"
                                    body={(rowData) => inputNumberBody(rowData, 'played_time', "Minute jucate")}
                                    editor={(props) => inputNumberEditor(setPlayerGameResults, props, 'played_time', 120, "Minute jucate")}
                                    sortable/>
                            <Column className="table-width font-size-14 " header="Goluri" field="goal"
                                    body={(rowData) => inputNumberBody(rowData, 'goal', "Goluri")}
                                    editor={(props) => inputNumberEditor(setPlayerGameResults, props, 'goal', 100, "Goluri")}
                                    sortable/>
                            <Column className="table-width font-size-14 " header="Pase de gol" field="assist"
                                    body={(rowData) => inputNumberBody(rowData, 'assist', "Pase de gol")}
                                    editor={(props) => inputNumberEditor(setPlayerGameResults, props, 'assist', 100, "Pase de gol")}
                                    sortable/>
                            <Column className="table-width font-size-14" header="Editeaza" rowEditor
                                    headerStyle={{width: '7rem'}}
                                    bodyStyle={{textAlign: 'center'}}/>
                            <Column className="table-width font-size-14" header="Sterge"
                                    body={(rowData, colProps) => delAssessmentBody(rowData, colProps, deletePresentUser, deleteRaeGame, getResettedRowForRaeGame, playerGameResults, setPlayerGameResults, raeGameOriginalRows, setRaeGameOriginalRows, "Sterge")}/>
                        </DataTable>


                    </div>
                </div>
            </div>
        );
    }

    const renderPlayerTrainingResultTable = () => {
        return (
            <div className="datatable-responsive-demo">
                <div className="card">
                    <DataTable className="homeTable p-datatable-responsive-demo"
                               value={playerTrainingsResults} emptyMessage="Niciun membru convocat"
                               editMode="row" dataKey="user_id" scrollable={true}
                               onRowEditInit={(event) => rowEditInit(event, raeTrainingOriginalRows, setRaeTrainingOriginalRows, playerTrainingsResults)}
                               removableSort loading={loadingTable}
                               onRowEditCancel={(event) => rowEditCancel(event, raeTrainingOriginalRows, setRaeTrainingOriginalRows, playerTrainingsResults, setPlayerTrainingResults)}
                               onRowEditSave={(props) => rowEditSave(props, execAddRAETraining, execUpdateRAETraining, fixRAEValues, playerTrainingsResults, setPlayerTrainingResults)}>
                        <Column className="table-width" field="present" header="Prezent?"
                                body={(rowData) => checkboxBody(rowData, 'present', "Prezent?")}
                                editor={(props) => checkboxEditor(setPlayerTrainingResults, props, 'present', "Prezent?")}
                                sortable/>
                        <Column className="table-width" header="Prenume" field="firstname"
                                body={(rowData) => textBody(rowData, 'firstname', 'Prenume')} sortable/>
                        <Column className="table-width" header="Nume" field="lastname"
                                body={(rowData) => textBody(rowData, 'lastname', 'Nume')} sortable/>
                        <Column className="table-width" header="Rol" field="role_desc"
                                body={(rowData) => textBody(rowData, 'role_desc', 'Rol')} sortable/>
                        <Column className="table-width" header="Realizare" field="realization"
                                body={(rowData) => colorBody(rowData, 'realization', 'Realizare')}
                                editor={(props) => colorEditor(setPlayerTrainingResults, props, 'realization', 'Realizare')}
                                sortable/>
                        <Column className="table-width" header="Atitudine" field="attitude"
                                body={(rowData) => colorBody(rowData, 'attitude', 'Atitudine')}
                                editor={(props) => colorEditor(setPlayerTrainingResults, props, 'attitude', 'Atitudine')}
                                sortable/>
                        <Column className="table-width" header="Efort" field="effort"
                                body={(rowData) => colorBody(rowData, 'effort', 'Efort')}
                                editor={(props) => colorEditor(setPlayerTrainingResults, props, 'effort', 'Efort')}
                                sortable/>
                        <Column className="table-width" header="Editeaza" rowEditor headerStyle={{width: '7rem'}}
                                bodyStyle={{textAlign: 'center'}}/>
                        <Column className="table-width" header="Sterge"
                                body={(rowData, colProps) => delAssessmentBody(rowData, colProps, deletePresentUser, deleteRaeTraining, getResettedRowForRaeTraining, playerTrainingsResults, setPlayerTrainingResults, raeTrainingOriginalRows, setRaeTrainingOriginalRows, "Sterge")}/>
                    </DataTable>


                </div>
            </div>
        );
    }

    const renderPlayerMeetingPresenceCards = () => {
        return (
            <div className="datatable-responsive-demo">
                <div className="card">
                    <DataTable className="homeTable p-datatable-responsive-demo"
                               value={playerMeetingPresences} emptyMessage="Niciun membru convocat"
                               editMode="row" dataKey="user_id" scrollable={true}
                               onRowEditInit={(event) => rowEditInit(event, meetingOriginalRows, setMeetingOriginalRows, playerMeetingPresences)}
                               removableSort loading={loadingTable}
                               onRowEditCancel={(event) => rowEditCancel(event, meetingOriginalRows, setMeetingOriginalRows, playerMeetingPresences, setPlayerMeetingPresences)}
                               onRowEditSave={(props) => rowEditSave(props, emptyFunctionWithParam, emptyFunctionWithParam, emptyFunctionWithParam, playerMeetingPresences, setPlayerMeetingPresences)}>
                        <Column className="table-width" field="present" header="Prezent?"
                                body={(rowData) => checkboxBody(rowData, 'present', "Prezent?")}
                                editor={(props) => checkboxEditor(setPlayerMeetingPresences, props, 'present', "Prezent?")}
                                sortable/>
                        <Column className="table-width" header="Prenume" field="firstname"
                                body={(rowData) => textBody(rowData, 'firstname', 'Prenume')} sortable/>
                        <Column className="table-width" header="Nume" field="lastname"
                                body={(rowData) => textBody(rowData, 'lastname', 'Nume')} sortable/>
                        <Column className="table-width" header="Rol" field="role_desc"
                                body={(rowData) => textBody(rowData, 'role_desc', 'Rol')} sortable/>
                        <Column className="table-width" header="Editeaza" rowEditor headerStyle={{width: '7rem'}}
                                bodyStyle={{textAlign: 'center'}}/>
                        <Column className="table-width" header="Sterge"
                                body={(rowData, colProps) => delAssessmentBody(rowData, colProps, deletePresentUser, emptyFunctionWithParam, getResettedRowForPresenceMeeting, playerMeetingPresences, setPlayerMeetingPresences, meetingOriginalRows, setMeetingOriginalRows, "Sterge")}/>
                    </DataTable>


                </div>
            </div>
        );
    }

    const getEventsOfTeamId = team_id => {
        if (team_id === 0)
            return events;
        return events.filter(item => item.team_id === team_id);
    }

    const getAllTeamObject = () => {
        return {
            team_id: 0,
            team_name: "Toate echipele"
        };
    }

    const getNextNOrPreviousNDate = (startDate, nextOrPrevious, nextNOrPreviousN, currentViewDate) => {
        switch (currentViewDate) {
            case "timeGridWeek":
                let newWeekDate = new Date(startDate);
                newWeekDate.setDate(newWeekDate.getDate() + nextOrPrevious * 7 * nextNOrPreviousN);
                return newWeekDate;
            case "dayGridMonth":
                let newMonthDate = new Date(startDate);
                newMonthDate.setMonth(newMonthDate.getMonth() + nextOrPrevious * 1 * nextNOrPreviousN);
                return newMonthDate;
                break;
            case "timeGridDay":
                let newDayDate = new Date(startDate);
                newDayDate.setDate(newDayDate.getDate() + nextOrPrevious * 1 * nextNOrPreviousN);
                return newDayDate;
                break;
            case "listWeek":
                let newLWeekDate = new Date(startDate);
                newLWeekDate.setDate(newLWeekDate.getDate() + nextOrPrevious * 7 * nextNOrPreviousN);
                return newLWeekDate;
                break;

        }
    }

    const getEventsBetweenDates = (array, start, end, className) => {
        if (array != null && array != undefined && array.length !== 0) {
            return array.filter(item => ((new Date(item.start) >= start && new Date(item.start) <= end) || (new Date(item.end) >= start && new Date(item.end) <= end) || (start >= new Date(item.start) && start <= new Date(item.end))) && item.classNames.includes(className));
        }
        return [];
    }

    const getNumberOfEventBetweenDates = (array, start, end, className) => {
        if (array != null && array != undefined && array.length !== 0) {
            return array.filter(item => ((new Date(item.start) >= start && new Date(item.start) <= end) || (new Date(item.end) >= start && new Date(item.end) <= end) || (start >= new Date(item.start) && start <= new Date(item.end))) && item.classNames.includes(className)).length;
        }
        return 0;
    }

    const createDataObjForAllEventsBarChart = () => {
        if (calendarRef != null && calendarRef.calendar != null) {
            //setData + reinit
            return {
                labels: ['Nr. evenimente calendar'],
                datasets: [
                    {
                        label: 'Antrenament',
                        backgroundColor: trainingColor,
                        data: [getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), calendarRef.calendar.view.activeStart, calendarRef.calendar.view.activeEnd, "training")]
                    },
                    {
                        label: 'Meci',
                        backgroundColor: gameColor,
                        data: [getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), calendarRef.calendar.view.activeStart, calendarRef.calendar.view.activeEnd, "game")]
                    },
                    {
                        label: 'Sedinta',
                        backgroundColor: meetingColor,
                        data: [getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), calendarRef.calendar.view.activeStart, calendarRef.calendar.view.activeEnd, "meeting")]
                    }
                ]
            };
        } else return {};
    }

    const getRangeDateLabelFromDates = (start, end) => {
        const endDate = new Date(end);
        endDate.setDate(end.getDate() - 1);
        return `${start.getDate()} ${monthsRoShort[start.getMonth()]} - ${endDate.getDate()} ${monthsRoShort[endDate.getMonth()]}`;
    }

    const createDataObjForLineChart = () => {
        if (calendarRef != null && calendarRef.calendar != null) {
            const EVENTS_BEFORE_CURRENT = 5;
            const EVENTS_AFTER_CURRENT = 5;
            const calendarStart = calendarRef.calendar.view.activeStart;
            const calendarEnd = calendarRef.calendar.view.activeEnd;
            const calViewType = calendarRef.calendar.currentData.currentViewType;

            /** label: Perioada curenta*/
            const current = {
                start: calendarStart,
                end: calendarEnd,
                label: getRangeDateLabelFromDates(calendarStart, calendarEnd),
                meetingNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), calendarStart, calendarEnd, 'meeting'),
                gameNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), calendarStart, calendarEnd, 'game'),
                trainingNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), calendarStart, calendarEnd, 'training')
            };

            const beforeArr = [];
            for (let i = EVENTS_BEFORE_CURRENT; i >= 1; i--) {
                const prevStartDate = getNextNOrPreviousNDate(calendarStart, -1, i, calViewType);
                const prevEndDate = getNextNOrPreviousNDate(calendarEnd, -1, i, calViewType);
                beforeArr.push({
                    start: prevStartDate,
                    end: prevEndDate,
                    label: getRangeDateLabelFromDates(prevStartDate, prevEndDate),
                    meetingNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), prevStartDate, prevEndDate, 'meeting'),
                    gameNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), prevStartDate, prevEndDate, 'game'),
                    trainingNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), prevStartDate, prevEndDate, 'training')
                });
            }

            const afterArr = [];
            for (let i = 1; i <= EVENTS_AFTER_CURRENT; i++) {
                const nextStartDate = getNextNOrPreviousNDate(calendarStart, 1, i, calViewType);
                const nextEndDate = getNextNOrPreviousNDate(calendarEnd, 1, i, calViewType);
                afterArr.push({
                    start: nextStartDate,
                    end: nextEndDate,
                    label: getRangeDateLabelFromDates(nextStartDate, nextEndDate),
                    meetingNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), nextStartDate, nextEndDate, 'meeting'),
                    gameNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), nextStartDate, nextEndDate, 'game'),
                    trainingNo: getNumberOfEventBetweenDates(getEventsOfTeamId(loggedUserSelectedTeam), nextStartDate, nextEndDate, 'training')
                });
            }

            const datesArray = [...beforeArr, current, ...afterArr];
            return {
                labels: datesArray.map(item => item.label),
                datasets: [
                    {
                        label: 'Antrenament',
                        data: datesArray.map(item => item.trainingNo),
                        fill: false,
                        borderColor: trainingColor
                    },
                    {
                        label: 'Meci',
                        data: datesArray.map(item => item.gameNo),
                        fill: false,
                        borderColor: gameColor
                    },
                    {
                        label: 'Sedinta',
                        data: datesArray.map(item => item.meetingNo),
                        fill: false,
                        borderColor: meetingColor
                    }
                ]
            };
        }
    }

    const getDurationOfEventsInInterval = (array, start, end, className) => {
        if (array != null && array != undefined && array.length !== 0) {
            const arr = getEventsBetweenDates(array, start, end, className);
            let duration = 0;
            //console.log(arr);
            arr.forEach(item => {
                const hours = ((new Date(item.end).getTime() - new Date(item.start).getTime()) / (1000 * 60 * 60));
                duration += hours;
            })
            return Math.round((duration + Number.EPSILON) * 100) / 100;
        }
        return 0;
    }

    const createDataObjForBarChartDuration = () => {
        if (calendarRef != null && calendarRef.calendar != null) {
            return {
                labels: ['Durata evenimente calendar'],
                datasets: [
                    {
                        label: 'Antrenament',
                        backgroundColor: trainingColor,
                        data: [getDurationOfEventsInInterval(getEventsOfTeamId(loggedUserSelectedTeam), calendarRef.calendar.view.activeStart, calendarRef.calendar.view.activeEnd, "training")]
                    },
                    {
                        label: 'Meci',
                        backgroundColor: gameColor,
                        data: [getDurationOfEventsInInterval(getEventsOfTeamId(loggedUserSelectedTeam), calendarRef.calendar.view.activeStart, calendarRef.calendar.view.activeEnd, "game")]
                    },
                    {
                        label: 'Sedinta',
                        backgroundColor: meetingColor,
                        data: [getDurationOfEventsInInterval(getEventsOfTeamId(loggedUserSelectedTeam), calendarRef.calendar.view.activeStart, calendarRef.calendar.view.activeEnd, "meeting")]
                    }
                ]
            };
        }
    }

    const colorTemplate = (option) => {
        return (
            <div className="">
                <div className={option.className}>{option.value}</div>
            </div>
        );
    }
    return (
        <div className="Home">

            <div id="home" className="p-grid ">
                <Toast ref={notificationRef} position="top-right"/>
                <div className=" p-lg-6 p-md-12 p-sm-5 white-bck round-corners">
                    <FullCalendar className="width-100-p" ref={e => setCalendarRef(e)}
                                  events={getEventsOfTeamId(loggedUserSelectedTeam)}
                                  options={options}/>
                </div>
                <div className=" p-lg-6 p-md-12 p-sm-12 ">
                    <div className="p-grid space-evenly">
                        <Panel
                            className="event-panel p-lg-3 p-md-3 p-sm-3 center training  p-mb-3 ">
                            <div className="display-content">
                                <div className="p-mb-5">Urmatorul antrenament</div>
                                <div
                                    className="texts">{getLatestTrainingDate(getEventsOfTeamId(loggedUserSelectedTeam))}</div>
                            </div>
                        </Panel>
                        <Panel className="event-panel p-lg-3 p-md-3 p-sm-3 center game p-mb-3  ">
                            <div className="display-content">
                                <div className="p-mb-5"> Urmatorul meci</div>
                                <div
                                    className="texts">{getLatestGameDate(getEventsOfTeamId(loggedUserSelectedTeam))}</div>
                            </div>
                        </Panel>
                        <Panel
                            className="event-panel p-lg-3 p-md-3 p-sm-3 center meeting p-mb-3 ">
                            <div className="display-content">
                                <div className="p-mb-5"> Urmatoarea sedinta</div>
                                <div
                                    className="texts">{getLatestMeetingDate(getEventsOfTeamId(loggedUserSelectedTeam))}</div>
                            </div>
                        </Panel>
                    </div>
                    <div className="p-grid space-evenly full-height height-inherit">
                        <Panel className="p-lg-5 p-md-5 p-sm-12  card round-corners chart-panel">
                            <div className="text-bold center gray-bck round-corners">Nr. evenimente
                            </div>
                            <Chart ref={e => eventsBarChartRef = e} id="eventsNoBarChart" height="25vh" className=" "
                                   type="bar"
                                   data={createDataObjForAllEventsBarChart()} options={eventsNoOptions}/>
                        </Panel>
                        <Panel className="p-lg-5 p-md-5 p-sm-12  card round-corners chart-panel">
                            <div className="text-bold center gray-bck round-corners">Durata totala
                            </div>
                            <Chart ref={e => durationBarChartRef = e} id="eventsDurationBarChart" height="25vh"
                                   className=" " type="bar" data={createDataObjForBarChartDuration()}
                                   options={eventsDurationOptions}/>
                        </Panel>
                        <Panel className="p-lg-10 p-md-10 p-sm-12  card round-corners chart-panel">
                            <div className="text-bold center gray-bck round-corners">Nr. evenimente perioade
                                invecinate
                            </div>
                            <Chart ref={e => eventsLineChartRef = e} height="25vh" className=" " type="line"
                                   data={createDataObjForLineChart()}
                                   options={basicLineOptions}/>
                        </Panel>

                    </div>
                </div>
                <Button icon="pi pi-plus" tooltip="Adaugă eveniment" className="add-button"
                        onClick={() => setEventCategoryDlgVisible(true)} tooltipOptions={{position: 'left'}}/>
                <Dropdown value={loggedUserSelectedTeam || 0} options={loggedUserTeams} filter={true}
                          className=" rounded-dropdown fixed-field"
                          filterMatchMode="contains"
                          optionValue="team_id"
                          onChange={e => setLoggedUserSelectedTeam(e.value)}
                          optionLabel="team_name"
                          placeholder="Alege echipa"/>
                {/*                <Button icon="pi pi-cloud-upload" tooltip="Încarcă evenimente" className="upload-button"
                        onClick={() => setUploadExcelDlgVisible(true)} tooltipOptions={{position: 'left'}}/>*/}


                <Dialog header="Alege eveniment" visible={eventCategoryDlgVisible} modal closable={true}
                        draggable={true}
                        onHide={() => setEventCategoryDlgVisible(false)}>
                    <Button className="training c-mr-10" onClick={
                        () => {
                            setAddTrainingDlg(true);
                            setEventCategoryDlgVisible(false);
                            initTrainings();
                        }}> <img width={100} height={100} src="/trainingImage.png"/> Antrenament </Button>
                    <Button className="game c-mr-10" onClick={() => {
                        setAddGameDlg(true)
                        setEventCategoryDlgVisible(false)
                        initGames();
                    }}> <img width={100} height={100} src="/gameImage.png"/> Meci </Button>
                    <Button className="meeting" onClick={() => {
                        setAddMeetingDlg(true)
                        setEventCategoryDlgVisible(false)
                        initMeetings();
                    }}> <img width={100} height={100} src="/meetingImage.png"/> Sedinta </Button>

                </Dialog>

                <Dialog header="Adauga antrenament" className="overflow-dlg-content training" visible={addTrainingDlg}
                        modal
                        closable={true} draggable={true}
                        onHide={() => setAddTrainingDlg(false)}>
                    <form>
                        <div className="p-grid">
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <Calendar id="startTrainingDate" value={startTrainingDate || ''}
                                          maxDate={endTrainingDate}
                                          onChange={(e) => setStartTrainingDate(e.value)} showTime
                                          placeholder="Data de inceput" className="width-100-p"
                                          required showIcon monthNavigator/><br/><br/>
                                <Calendar id="endTrainingDate" value={endTrainingDate || ''} minDate={startTrainingDate}
                                          onChange={(e) => setEndTrainingDate(e.value)}
                                          showTime placeholder="Data de final" required showIcon className="width-100-p"
                                          monthNavigator/><br/><br/>
                                <Dropdown value={selectedTrainingTeam || 0} options={allTeams} filter={true}
                                          filterMatchMode="contains"
                                          optionValue="team_id"
                                          onChange={e => setSelectedTrainingTeam(e.value)}
                                          optionLabel="team_name" className="width-100-p"
                                          placeholder="Alege echipa"/><br/><br/>
                                <InputText id="principalObj" value={principalObjective || ''}
                                           onChange={(e) => setPrincipalObjective(e.target.value)}
                                           placeholder="Obiective principale" className="width-100-p"
                                           maxLength={200} required/><br/><br/>

                                <InputText id="principleSubprinciple" value={principleSubprinciple || ''}
                                           className="width-100-p"
                                           onChange={(e) => setPrincipleSubprinciple(e.target.value)}
                                           placeholder="Principii/Subprincipii" maxLength={200} required/><br/><br/>
                            </div>
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <InputText id="objectiveTask" value={objectiveTask || ''} className="width-100-p"
                                           onChange={(e) => setObjectiveTask(e.target.value)}
                                           placeholder="Obiective/Teme" maxLength={200} required/><br/><br/>
                                <InputText id="effortRegime" value={effortRegime || ''} className="width-100-p"
                                           onChange={(e) => setEffortRegime(e.target.value)}
                                           placeholder="Regim efort" maxLength={200} required/><br/><br/>
                                <InputText id="duration" value={duration || ''} className="width-100-p"
                                           onChange={(e) => setDuration(e.target.value)}
                                           placeholder="Durata antrenament" maxLength={200} required/><br/><br/>
                                <InputNumber id="volume" value={volume || 0} onValueChange={(e) => setVolume(e.value)}
                                             mode="decimal" className="width-100-p"
                                             min={0} required suffix="%" placeholder="Volum antrenament"/> <br/><br/>
                                <MultiSelect value={selectedTrainingUsers} options={allUsers} className="width-100-p"
                                             onChange={(e) => setSelectedTrainingUsers(e.value)} filter
                                             filterMatchMode="contains" filterBy="lastname" filterPlaceholder="Nume"
                                             optionLabel="lastname" className="width-100-p"
                                             itemTemplate={userMultiSelTemplate}
                                             selectedItemTemplate={selectedUserMultiSelTemplate}
                                             placeholder="Alege participanti"/><br/><br/>

                            </div>
                        </div>
                        <Button className="center" icon="pi pi-plus" label="Adauga" type="button" onClick={() => {
                            execCreateTraining();
                            setAddTrainingDlg(false);
                            // setShowConvenedUsersDlg(true);
                        }}/>
                    </form>
                </Dialog>

                <Dialog header="Adauga meci" className="overflow-dlg-content game" visible={addGameDlg} modal
                        closable={true}
                        draggable={true}
                        onHide={() => setAddGameDlg(false)}>
                    <form>
                        <div className="p-grid">
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <Calendar id="startGameDate" value={startGameDate || ''}
                                          onChange={(e) => setStartGameDate(e.value)}
                                          showTime maxDate={endGameDate} className="width-100-p"
                                          placeholder="Data de inceput" required showIcon monthNavigator/><br/><br/>
                                <Calendar id="endGameDate" value={endGameDate || ''}
                                          onChange={(e) => setEndGameDate(e.value)}
                                          showTime minDate={startGameDate} className="width-100-p"
                                          placeholder="Data de final" required showIcon monthNavigator/><br/><br/>
                                <Dropdown value={selectedGameTeam || 0} options={allTeams} filter={true}
                                          filterMatchMode="contains" className="width-100-p"
                                          optionLabel="team_name" optionValue="team_id"
                                          onChange={e => setSelectedGameTeam(e.value)}
                                          placeholder="Alege echipa"/><br/><br/>
                                <MultiSelect value={selectedGameUsers} options={allUsers} className="width-100-p"
                                             onChange={(e) => setSelectedGameUsers(e.value)} filter
                                             filterMatchMode="contains" filterBy="lastname" filterPlaceholder="Nume"
                                             itemTemplate={userMultiSelTemplate} className="width-100-p"
                                             selectedItemTemplate={selectedUserMultiSelTemplate} optionLabel="lastname"
                                             placeholder="Alege participanti"/><br/><br/>
                            </div>
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <Dropdown value={gameType || 0} options={allGameTypes} filter={true}
                                          filterMatchMode="contains"
                                          onChange={e => setGameType(e.value)} optionValue="game_id"
                                          optionLabel="game_desc" className="width-100-p"
                                          placeholder="Alege tipul jocului"/><br/><br/>
                                <Dropdown value={formation || 0} options={allFormations} filter={true}
                                          filterMatchMode="contains"
                                          onChange={e => setFormation(e.value)} optionValue="formation_id"
                                          optionLabel="formation_desc" className="width-100-p"
                                          placeholder="Alege formatia"/><br/><br/>
                                <InputText value={oppositeTeam || ''} onChange={(e) => setOppositeTeam(e.target.value)}
                                           placeholder="Echipa adversa" maxLength={100} required
                                           className="width-100-p"/> <br/><br/>
                            </div>
                        </div>
                        <Button className="center" icon="pi pi-plus" label="Adauga" type="button" onClick={() => {
                            execCreateGame();
                            setAddGameDlg(false);
                            //setShowConvenedUsersDlg(true);
                        }}/>
                    </form>
                </Dialog>

                <Dialog header="Adauga sedinta" className="overflow-dlg-content meeting" visible={addMeetingDlg} modal
                        closable={true} draggable={true}
                        onHide={() => setAddMeetingDlg(false)}>
                    <form>
                        {/*<InputTextarea rows={5} cols={30} placeholder="Subiecte de discutie" value={topic} onChange={(e) => setTopic(e.target.value)} />*/}
                        <Calendar id="startMeetingDate" value={startMeetingDate || ''} className="width-100-p"
                                  onChange={(e) => setStartMeetingDate(e.value)} maxDate={endMeetingDate}
                                  showTime placeholder="Data de inceput" required showIcon monthNavigator/><br/><br/>
                        <Calendar id="endMeetingDate" value={endMeetingDate || ''}
                                  onChange={(e) => setEndMeetingDate(e.value)}
                                  minDate={startMeetingDate} className="width-100-p"
                                  showTime placeholder="Data de final" required showIcon monthNavigator/><br/><br/>
                        <Dropdown value={selectedMeetingTeam || 0} options={allTeams} filter={true}
                                  filterMatchMode="contains"
                                  onChange={e => setSelectedMeetingTeam(e.value)} optionLabel="team_name"
                                  optionValue="team_id" className="width-100-p"
                                  placeholder="Alege echipa"/><br/><br/>
                        <MultiSelect value={selectedMeetingUsers} options={allUsers} className="width-100-p"
                                     onChange={(e) => setSelectedMeetingUsers(e.value)} filter
                                     filterMatchMode="contains" filterBy="lastname" filterPlaceholder="Nume"
                                     optionLabel="lastname" className="width-100-p"
                                     itemTemplate={userMultiSelTemplate}
                                     selectedItemTemplate={selectedUserMultiSelTemplate}
                                     placeholder="Alege participanti"/><br/><br/>
                        {/*                        <Editor style={{height: '200px'}} placeholder="Subiecte de discutie" value={topic || ''}
                                onTextChange={(e) => setTopic(e.htmlValue)}/>*/}
                        <InputTextarea rows={5} cols={30} value={topic || ''}
                                       placeholder="Subiecte de discutie" maxLength={3000} minLength={0}
                                       onChange={(e) => setTopic(e.target.value)}
                        />
                        <br/><br/>
                        <Button className="center" icon="pi pi-plus" label="Adauga" type="button" onClick={() => {
                            execCreateMeeting();
                            setAddMeetingDlg(false);
                            //setShowConvenedUsersDlg(true);
                        }}/>
                    </form>
                </Dialog>

                <Dialog header="Incarca evenimente" visible={uploadExcelDlgVisible} modal closable={true}
                        draggable={true}
                        onHide={() => setUploadExcelDlgVisible(false)}>

                </Dialog>

                <Dialog header="Actiuni eveniment" visible={updateOrDeleteDlgVisible} modal closable={true}
                        draggable={true}
                        onHide={() => setUpdateOrDeleteDlgVisible(false)}>
                    <Button className="high-button c-mr-10 p-button-warning" onClick={(e) => {
                        //getUpdateFunctionForEvent(selectedEvent)(true);
                        setUpdateFunctionForEvent(selectedEvent);
                    }}><img width={100} height={100} src="/view.png"/>
                        Vizualizeaza<br/>&<br/>Modifica
                    </Button>
                    <Button id="delEvent" className="p-button-danger high-button c-mr-10" onClick={(e) => {
                        setDelEventConfirmDlg(true);
                    }}><img width={100} height={100} src="/trashbin.png"/> Sterge </Button>
                    <ConfirmPopup target={document.getElementById('delEvent')} visible={delEventConfirmDlg}
                                  onHide={() => setDelEventConfirmDlg(false)}
                                  acceptLabel="Sterge" rejectLabel="Inapoi" className="confirm-popup-del-header"
                                  acceptClassName="p-button-danger"
                                  message={"Esti sigur ca vrei sa stergi acest eveniment? Odata sters, evenimentul si toate evaluarile asociate lui vor disparea complet!"}
                                  icon="pi pi-exclamation-triangle"
                                  accept={() => {
                                      deleteEvent(selectedEvent);
                                      setUpdateOrDeleteDlgVisible(false);
                                  }}
                                  reject={() => setDelEventConfirmDlg(false)}/>
                    <Button
                        className={"p-button-help high-button "}
                        onClick={(e) => {
                            getAllPresencesAndAssessmentsOfEvent();
                            setShowEventAssessment(true);
                            setUpdateOrDeleteDlgVisible(false);
                        }}><img width={100} height={100}
                                src="/assessment3.png"/> Prezenta {getVisibleEvaluationForEvent(selectedEvent) && <>
                        <br/>&<br/> Evaluare</>}
                    </Button>

                </Dialog>

                <Dialog header="Sedinta" className="overflow-dlg-content meeting" visible={updateMeetingDlg} modal
                        closable={true} draggable={true}
                        onHide={() => setUpdateMeetingDlg(false)}>
                    <form>
                        <div className="float-right p-mb-5 p-pb-2 txt-align-webkit-right bottom-line-separator">

                            <span className="vertical-align-super font-size-18">Vizualizeaza</span>
                            <InputSwitch className="p-mr-2 p-ml-2" checked={viewOrUpdateMeetingDlg}
                                         onChange={(e) => setViewOrUpdateMeetingDlg(e.value)}/>
                            <span className="vertical-align-super font-size-18">Modifica</span>
                        </div>

                        <Calendar id="startMeetingDate" value={startMeetingDate || ''}
                                  disabled={!viewOrUpdateMeetingDlg} className="width-100-p"
                                  onChange={(e) => setStartMeetingDate(e.value)} maxDate={endMeetingDate}
                                  showTime placeholder="Data de inceput" required showIcon monthNavigator/><br/><br/>
                        <Calendar id="endMeetingDate" value={endMeetingDate || ''} className="width-100-p"
                                  onChange={(e) => setEndMeetingDate(e.value)}
                                  minDate={startMeetingDate} disabled={!viewOrUpdateMeetingDlg}
                                  showTime placeholder="Data de final" required showIcon monthNavigator/><br/><br/>
                        <Dropdown value={selectedMeetingTeam || 0} options={allTeams} filter={true}
                                  filterMatchMode="contains" className="width-100-p"
                                  onChange={e => setSelectedMeetingTeam(e.value)} optionLabel="team_name"
                                  optionValue="team_id" disabled={!viewOrUpdateMeetingDlg}
                                  placeholder="Alege echipa"/><br/><br/>
                        <MultiSelect value={selectedMeetingUsers} options={allUsers} className="width-100-p"
                                     onChange={(e) => setSelectedMeetingUsers(e.value)} filter
                                     filterMatchMode="contains" filterBy="lastname" filterPlaceholder="Nume"
                                     itemTemplate={userMultiSelTemplate} disabled={!viewOrUpdateMeetingDlg}
                                     optionLabel="lastname" className="width-100-p"
                                     selectedItemTemplate={selectedUserMultiSelTemplate}
                                     placeholder="Alege participanti"/><br/><br/>
                        {/*                        <Editor style={{height: '200px'}} placeholder="Subiecte de discutie" className="width-100-p"
                                value={topic || ''}
                                onTextChange={(e) => setTopic(e.htmlValue)}/>*/}
                        <InputTextarea rows={5} cols={30} value={topic || ''} disabled={!viewOrUpdateMeetingDlg}
                                       placeholder="Subiecte de discutie" maxLength={3000} minLength={0}
                                       onChange={(e) => setTopic(e.target.value)}
                        /><br/><br/>
                        <Button className="center" icon="pi pi-user-edit" disabled={!viewOrUpdateMeetingDlg}
                                type="button"
                                label="Modifica"
                                onClick={() => {
                                    execUpdateMeeting();
                                    setUpdateMeetingDlg(false);
                                }}/>
                    </form>
                </Dialog>


                <Dialog header="Meci" className="overflow-dlg-content game" visible={updateGameDlg} modal
                        closable={true}
                        draggable={true}
                        onHide={() => setUpdateGameDlg(false)}>
                    <form>
                        <div className="float-right p-mb-5 p-pb-2 txt-align-webkit-right bottom-line-separator">

                            <span className="vertical-align-super font-size-18">Vizualizeaza</span>
                            <InputSwitch className="p-mr-2 p-ml-2" checked={viewOrUpdateGameDlg}
                                         onChange={(e) => setViewOrUpdateGameDlg(e.value)}/>
                            <span className="vertical-align-super font-size-18">Modifica</span>
                        </div>

                        <div className="p-grid">
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <Calendar id="startGameDate" value={startGameDate || ''} disabled={!viewOrUpdateGameDlg}
                                          onChange={(e) => setStartGameDate(e.value)}
                                          showTime maxDate={endGameDate} className="width-100-p"
                                          placeholder="Data de inceput" required showIcon monthNavigator/><br/><br/>
                                <Calendar id="endGameDate" value={endGameDate || ''} className="width-100-p"
                                          onChange={(e) => setEndGameDate(e.value)}
                                          showTime minDate={startGameDate} disabled={!viewOrUpdateGameDlg}
                                          placeholder="Data de final" required showIcon monthNavigator/><br/><br/>
                                <Dropdown value={selectedGameTeam || 0} options={allTeams} filter={true}
                                          filterMatchMode="contains" disabled={!viewOrUpdateGameDlg}
                                          optionLabel="team_name" optionValue="team_id" className="width-100-p"
                                          onChange={e => setSelectedGameTeam(e.value)}
                                          placeholder="Alege echipa"/><br/><br/>
                                <MultiSelect value={selectedGameUsers} options={allUsers} className="width-100-p"
                                             onChange={(e) => setSelectedGameUsers(e.value)} filter
                                             filterMatchMode="contains" filterBy="lastname" filterPlaceholder="Nume"
                                             optionLabel="lastname" className="width-100-p"
                                             itemTemplate={userMultiSelTemplate} disabled={!viewOrUpdateGameDlg}
                                             selectedItemTemplate={selectedUserMultiSelTemplate}
                                             placeholder="Alege participanti"/><br/><br/>
                            </div>
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <Dropdown value={gameType || 0} options={allGameTypes} filter={true}
                                          filterMatchMode="contains"
                                          onChange={e => setGameType(e.value)} optionValue="game_id"
                                          optionLabel="game_desc" className="width-100-p"
                                          disabled={!viewOrUpdateGameDlg}
                                          placeholder="Alege tipul jocului"/><br/><br/>
                                <Dropdown value={formation || 0} options={allFormations} filter={true}
                                          filterMatchMode="contains" disabled={!viewOrUpdateGameDlg}
                                          onChange={e => setFormation(e.value)} optionValue="formation_id"
                                          optionLabel="formation_desc" className="width-100-p"
                                          placeholder="Alege formatia"/><br/><br/>
                                <InputText value={oppositeTeam || ''} onChange={(e) => setOppositeTeam(e.target.value)}
                                           disabled={!viewOrUpdateGameDlg} className="width-100-p"
                                           placeholder="Echipa adversa" maxLength={100} required/><br/><br/>
                            </div>
                        </div>
                        <Button className="center" icon="pi pi-user-edit" label="Modifica" type="button"
                                disabled={!viewOrUpdateGameDlg}
                                onClick={() => {
                                    execUpdateGame();
                                    setUpdateGameDlg(false);
                                }}/>
                    </form>
                </Dialog>


                <Dialog header="Antrenament" className="overflow-dlg-content training" visible={updateTrainingDlg} modal
                        closable={true} draggable={true}
                        onHide={() => setUpdateTrainingDlg(false)}>
                    <form>
                        <div className="float-right p-mb-5 p-pb-2 txt-align-webkit-right bottom-line-separator">

                            <span className="vertical-align-super font-size-18">Vizualizeaza</span>
                            <InputSwitch className="p-mr-2 p-ml-2" checked={viewOrUpdateTrainingDlg}
                                         onChange={(e) => setViewOrUpdateTrainingDlg(e.value)}/>
                            <span className="vertical-align-super font-size-18">Modifica</span>
                        </div>
                        <div className="p-grid">
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <Calendar id="startTrainingDate" className="width-100-p" value={startTrainingDate || ''}
                                          maxDate={endTrainingDate}
                                          disabled={!viewOrUpdateTrainingDlg}
                                          onChange={(e) => setStartTrainingDate(e.value)} showTime
                                          placeholder="Data de inceput"
                                          required showIcon monthNavigator/><br/><br/>
                                <Calendar id="endTrainingDate" value={endTrainingDate || ''} className="width-100-p"
                                          minDate={startTrainingDate}
                                          disabled={!viewOrUpdateTrainingDlg}
                                          onChange={(e) => setEndTrainingDate(e.value)}
                                          showTime placeholder="Data de final" required showIcon
                                          monthNavigator/><br/><br/>
                                <Dropdown value={selectedTrainingTeam || 0} options={allTeams} className="width-100-p"
                                          filter={true}
                                          disabled={!viewOrUpdateTrainingDlg}
                                          filterMatchMode="contains"
                                          optionValue="team_id"
                                          onChange={e => setSelectedTrainingTeam(e.value)}
                                          optionLabel="team_name"
                                          placeholder="Alege echipa"/><br/><br/>
                                <InputText id="principalObj" value={principalObjective || ''} className="width-100-p"
                                           onChange={(e) => setPrincipalObjective(e.target.value)}
                                           disabled={!viewOrUpdateTrainingDlg}
                                           placeholder="Obiective principale"
                                           maxLength={200} required/><br/><br/>

                                <InputText id="principleSubprinciple" value={principleSubprinciple || ''}
                                           disabled={!viewOrUpdateTrainingDlg} className="width-100-p"
                                           onChange={(e) => setPrincipleSubprinciple(e.target.value)}
                                           placeholder="Principii/Subprincipii" maxLength={200} required/><br/><br/>
                            </div>
                            <div className="p-lg-6 p-md-12 p-sm-12">
                                <InputText id="objectiveTask" value={objectiveTask || ''}
                                           disabled={!viewOrUpdateTrainingDlg} className="width-100-p"
                                           onChange={(e) => setObjectiveTask(e.target.value)}
                                           placeholder="Obiective/Teme" maxLength={200} required/><br/><br/>
                                <InputText id="effortRegime" value={effortRegime || ''}
                                           disabled={!viewOrUpdateTrainingDlg} className="width-100-p"
                                           onChange={(e) => setEffortRegime(e.target.value)}
                                           placeholder="Regim efort" maxLength={200} required/><br/><br/>
                                <InputText id="duration" value={duration || ''} className="width-100-p"
                                           onChange={(e) => setDuration(e.target.value)}
                                           disabled={!viewOrUpdateTrainingDlg}
                                           placeholder="Durata antrenament" maxLength={200} required/><br/><br/>
                                <InputNumber id="volume" value={volume || 0} onValueChange={(e) => setVolume(e.value)}
                                             disabled={!viewOrUpdateTrainingDlg}
                                             mode="decimal" className="width-100-p"
                                             min={0} required suffix="%" placeholder="Volum antrenament"/> <br/><br/>
                                <MultiSelect value={selectedTrainingUsers} options={allUsers} className="width-100-p"
                                             onChange={(e) => setSelectedTrainingUsers(e.value)} filter
                                             filterMatchMode="contains" filterBy="lastname" filterPlaceholder="Nume"
                                             optionLabel="lastname" className="width-100-p"
                                             itemTemplate={userMultiSelTemplate} disabled={!viewOrUpdateTrainingDlg}
                                             selectedItemTemplate={selectedUserMultiSelTemplate}
                                             placeholder="Alege participanti"/><br/><br/>
                            </div>
                        </div>
                        <Button className="center" type="button" icon="pi pi-user-edit"
                                disabled={!viewOrUpdateTrainingDlg}
                                label="Modifica"
                                onClick={() => {
                                    execUpdateTraining();
                                    setUpdateTrainingDlg(false);
                                }}/>
                    </form>
                </Dialog>


                <Dialog header="Evalueaza" visible={showEventAssessment} modal closable={true}
                        draggable={true} className={"assessmentsDlg " + getClassnameBySelectedEvent(selectedEvent)}
                        onHide={() => setShowEventAssessment(false)}>
                    {
                        selectedEvent.id != undefined &&
                        ((selectedEvent.classNames.includes("game") && renderPlayerGameResultTable()) ||
                            (selectedEvent.classNames.includes("training") && renderPlayerTrainingResultTable()) ||
                            (selectedEvent.classNames.includes("meeting") && renderPlayerMeetingPresenceCards()))
                    }
                </Dialog>
            </div>
        </div>
    );
}

