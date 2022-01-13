import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { ScrollPanel } from 'primereact/scrollpanel';
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { FullCalendar } from 'primereact/fullcalendar';
import '../styles/TableAnalitics.css';
import 'primeflex/primeflex.css';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { getDataByIdBetweenDates } from '../services/getDataByIdBetweenDates.service';
import { getDataByTeamIdBetweenDates } from '../services/getDataByTeamIdBetweenDates.service';
import { createAssessment } from '../services/createAssessment.service';
import { getRAETrainByIdAndDates } from '../services/getRAETrainByIdAndDates.service';
import { getRAEGameByIdAndDates } from '../services/getRAEGameByIdAndDates.service';
import { getThreeMonthAssessment } from '../services/getThreeMonthAssessment.service';
import { createThreeMAssessment } from '../services/createThreeMAssessment.service';
import { getEventsByTeamIdAndDates } from '../services/event.service';
import { getMicroGamesByTIdAndDates } from '../services/getMicroGamesByTIdAndDates.service';
import { createMicroGames } from '../services/createMicroGames.service';
import ls from 'local-storage';
import { InputTextarea } from 'primereact/inputtextarea';
import moment from 'moment';
import { getGTByTeamIdAndDates } from '../services/event.service';
 

export function TableAnalitics(props) {
    const [playerList, setPlayerList] = useState([]);
    const [dialogShow, setDialogShow] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [playerLabelsSelected, setPlayerLabelsSelected] = useState([]);
    const [teamLabelsSelected, setTeamLabelsSelected] = useState([]);
    const [playerParameterValues, setPlayerParameterValues] = useState([]); 
    
    const [teamParameterValues, setTeamParameterValues] = useState([]);
    const [playerObservation, setPlayerObservation] = useState("");
    const [playerConclusion, setPlayerConclusion] = useState("");
    
    const [teamObservation, setTeamObservation] = useState("");
    const [teamConclusion, setTeamConclusion] = useState("");

    const [labelThreeMAsm, setLabelThreeMAsm] = useState([]);
    const [dataThreeMAsm, setDataThreeMAsm] = useState([[], [], [], [], [], [], [], [], [], []]);
    const [player3MonthObservation, setPlayer3MonthObservation] = useState("");
    const [player3MonthConclusion, setPlayer3MonthConclusion] = useState("");

    const [startDateFilter1, setStartDateFilter1] = useState("");
    const [endDateFilter1, setEndDateFilter1] = useState("");
    const [startDateFilter2, setStartDateFilter2] = useState("");
    const [endDateFilter2, setEndDateFilter2] = useState("");
    const [startDateFilter3, setStartDateFilter3] = useState("");
    const [endDateFilter3, setEndDateFilter3] = useState("");
    const [startDateFilter4, setStartDateFilter4] = useState("");
    const [endDateFilter4, setEndDateFilter4] = useState("");
    const [startDateFilter5, setStartDateFilter5] = useState("");
    const [endDateFilter5, setEndDateFilter5] = useState("");
    const [startDateFilter6, setStartDateFilter6] = useState("");
    const [endDateFilter6, setEndDateFilter6] = useState("");

    const [labelTrain, setLabelTrain] = useState([]);
    const [valuesBarTrain, setValuesBarTrain] = useState([]);
    const [colorTrain1, setColorTrain1] = useState([]);
    const [colorTrain2, setColorTrain2] = useState([]);
    const [colorTrain3, setColorTrain3] = useState([]);
    const [labelDatasetTrain1, setLabelDatasetTrain1] = useState("");
    const [labelDatasetTrain2, setLabelDatasetTrain2] = useState("");
    const [labelDatasetTrain3, setLabelDatasetTrain3] = useState("");
    const [dataGreenRTrain, setDataGreenRTrain] = useState(0);
    const [dataRedRTrain, setDataRedRTrain] = useState(0);
    const [dataOrangeRTrain, setDataOrangeRTrain] = useState(0);
    const [dataGreenATrain, setDataGreenATrain] = useState(0);
    const [dataRedATrain, setDataRedATrain] = useState(0);
    const [dataOrangeATrain, setDataOrangeATrain] = useState(0);
    const [dataGreenETrain, setDataGreenETrain] = useState(0);
    const [dataRedETrain, setDataRedETrain] = useState(0);
    const [dataOrangeETrain, setDataOrangeETrain] = useState(0);

    const [labelGame, setLabelGame] = useState([]);
    const [valuesBarGame, setValuesBarGame] = useState([]);
    const [colorGame1, setColorGame1] = useState([]);
    const [colorGame2, setColorGame2] = useState([]);
    const [colorGame3, setColorGame3] = useState([]);
    const [labelDatasetGame1, setLabelDatasetGame1] = useState("");
    const [labelDatasetGame2, setLabelDatasetGame2] = useState("");
    const [labelDatasetGame3, setLabelDatasetGame3] = useState("");
    const [dataGreenRGame, setDataGreenRGame] = useState(0);
    const [dataRedRGame, setDataRedRGame] = useState(0);
    const [dataOrangeRGame, setDataOrangeRGame] = useState(0);
    const [dataGreenAGame, setDataGreenAGame] = useState(0);
    const [dataRedAGame, setDataRedAGame] = useState(0);
    const [dataOrangeAGame, setDataOrangeAGame] = useState(0);
    const [dataGreenEGame, setDataGreenEGame] = useState(0);
    const [dataRedEGame, setDataRedEGame] = useState(0);
    const [dataOrangeEGame, setDataOrangeEGame] = useState(0);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState({});
    const [showEventDialog, setShowEventDialog] = useState(false);
    const [dataMicroGames, setDataMicroGames] = useState([[], [], [], [], []]);
    const [labelMicroGames, setLabelMicroGames] = useState([]);


    const fileType = 'application/vnd.ms-excel';
    const fileExtension = '.xls';

    const [playerValues, setPlayerValues] = useState([{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
                        {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
                    {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
                {label: 'Viteza de executie', database_label: 'VEX', value: 0}]);
    
    const [teamValues, setTeamValues] = useState([{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
                                            {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
                                            {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
                                            {label: 'Viteza de executie', database_label: 'VEX', value: 0}]);
    const playerLabelsOptions = [{label: 'Tehnica', value: 'Tehnica'}, {label: 'Tactic defensiv', value: 'Tactic defensiv'}, {label: 'Tactic ofensiv', value: 'Tactic ofensiv'}, {label: 'Emotional', value: 'Emotional'}, {label: 'Fizic', value: 'Fizic'}, {label: 'Pasa scurta+ft', value: 'Pasa scurta+ft'}, {label: 'Pasa lunga si medie', value: 'Pasa lunga si medie'}, {label: 'Finalizare', value: 'Finalizare'}, {label: 'Toate formele', value: 'Toate formele'}, {label: 'Control balon', value: 'Control balon'}, {label: 'Marcaj', value: 'Marcaj'}, {label: 'Repliere', value: 'Repliere'},
                    {label: 'Dublaj/Acoperire', value: 'Dublaj/Acoperire'}, {label: 'Anticipatie', value: 'Anticipatie'}, {label: 'TDCapacitate decizionala', value: 'TDCapacitate decizionala'}, {label: 'TACapacitate decizionala', value: 'TACapacitate decizionala'}, {label: 'Demarcare', value: 'Demarcare'}, {label: 'Sprijin', value: 'Sprijin'}, {label: 'Preluare sarcini', value: 'Preluare sarcini'},
                    {label: 'Motivatie intrinseca', value: 'Motivatie intrinseca'}, {label: 'Optimism', value: 'Optimism'}, {label: 'Fragilitate mentala', value: 'Fragilitate mentala'}, {label: 'Competenta sociala', value: 'Competenta sociala'}, {label: 'Prezenta fizica+talie', value: 'Prezenta fizica+talie'}, {label: 'Viteza', value: 'Viteza'}, {label: 'Forta', value: 'Forta'}, 
                    {label: 'Rezistenta', value: 'Rezistenta'}, {label: 'Viteza de executie', value: 'Viteza de executie'}];
    
    const teamLabelsOptions = [{label: 'Tehnica', value: 'Tehnica'}, {label: 'Tactic defensiv', value: 'Tactic defensiv'}, {label: 'Tactic ofensiv', value: 'Tactic ofensiv'}, {label: 'Emotional', value: 'Emotional'}, {label: 'Fizic', value: 'Fizic'}, {label: 'Pasa scurta+ft', value: 'Pasa scurta+ft'}, {label: 'Pasa lunga si medie', value: 'Pasa lunga si medie'}, {label: 'Finalizare', value: 'Finalizare'}, {label: 'Toate formele', value: 'Toate formele'}, {label: 'Control balon', value: 'Control balon'}, {label: 'Marcaj', value: 'Marcaj'}, {label: 'Repliere', value: 'Repliere'},
    {label: 'Dublaj/Acoperire', value: 'Dublaj/Acoperire'}, {label: 'Anticipatie', value: 'Anticipatie'}, {label: 'TDCapacitate decizionala', value: 'TDCapacitate decizionala'}, {label: 'TACapacitate decizionala', value: 'TACapacitate decizionala'}, {label: 'Demarcare', value: 'Demarcare'}, {label: 'Sprijin', value: 'Sprijin'}, {label: 'Preluare sarcini', value: 'Preluare sarcini'},
    {label: 'Motivatie intrinseca', value: 'Motivatie intrinseca'}, {label: 'Optimism', value: 'Optimism'}, {label: 'Fragilitate mentala', value: 'Fragilitate mentala'}, {label: 'Competenta sociala', value: 'Competenta sociala'}, {label: 'Prezenta fizica+talie', value: 'Prezenta fizica+talie'}, {label: 'Viteza', value: 'Viteza'}, {label: 'Forta', value: 'Forta'}, 
    {label: 'Rezistenta', value: 'Rezistenta'}, {label: 'Viteza de executie', value: 'Viteza de executie'}];

    const toast = useRef(null);

    useEffect(() => {
       
        setPlayerList(props.filter);

    }, [props.filter]);

    const playerChartData = {
        labels: playerLabelsSelected,
        datasets: [
            
            {
                label: 'Radar',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,1)',
                data: playerParameterValues
            }
        ]
    };

    const teamChartData = {
        labels: teamLabelsSelected,
        datasets: [
            
            {
                label: 'Radar',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,1)',
                data: teamParameterValues
            }
        ]
    };

    const lightOptions = {
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scale: {
            pointLabels: {
                fontColor: '#495057'
            },
            gridLines: {
                color: '#ebedef'
            }
        }
    };

    const options = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next,today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectMirror: true,
        eventClick: (e) => {
            setShowEventDialog(true);
            setSelectedEvent(e.event._def);
        }
    };

    const handleDataChart = (type, value) => {
        let list = [];
        if (value != null) {
            if (type === 'jucator') {
                value.forEach(item => {
                    list.push(playerValues.filter(jsonObj => jsonObj['label'].toLowerCase() === item.toLowerCase())[0]['value']);
                });
                setPlayerParameterValues(list);
            } else if (type === 'echipa') {
                value.forEach(item => {
                    list.push(teamValues.filter(jsonObj => jsonObj['label'].toLowerCase() === item.toLowerCase())[0]['value']);
                });
                setTeamParameterValues(list);
            } else if (type === '3 luni') {
              
            }
        }
        
    }

    const evaluareIT = [
        ["JUCATORUL", "TEHNICA", "", "", "", "", "TACTIC DEFENSIV", "", "", "", "", "TACTIC OFENSIV", "", "", "", "EMOTIONAL", "", "", "", "FIZIC", "", "", "", "", "TOTAL PCT IND", "Data", "Observatii", "Concluzii"],
        ["", "PASA SCURTA+FT (PS_FT)", "PASA LUNGA SI MEDIE (PL)", "FINALIZARE (FIN)", "TOATE FORMELE (2V1)", "CONTROL BALON (COB)", "MARCAJ (MAR)", "REPLIERE (REP)", "DUBLAJ/ACOPERIRE (DUB)", "ANTICIPATIE (ANT)", "TDCAPACITATE DECIZIONALA (CD)", "DEMARCARE (DEM)", "SPRIJIN (SPR)", "PRELUARE SARCINI (PRS)", "TACAPACITATE DECIZIONALA (TCD)", "MOTIVATIE INTRINSECA (MI)", "OPTIMISM (OPT)", "FRAGILITATE MENTALA (FM)", "COMPETENTA SOCIALA (CS)", "PREZENTA FIZICA+TALIE (PFT)", "VITEZA (VIT)", "FORTA (FOR)", "REZISTENTA (REZ)", "VITEZA DE EXECUTIE (VEX)", "", "", "", ""],
        ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "=SUM(B3:X3)", "1997-05-05", "", ""]
    ];

    const microjocuri = [
        {'Saptamana / Momentele jocului': "S1", 'INITIEREA JOCULUI': "x", 'PROGRESIE / FINALIZARE': "x", 'TRANZITIA NEGATIVA': "x", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""},
        {'Saptamana / Momentele jocului': "S1", 'INITIEREA JOCULUI': "x", 'PROGRESIE / FINALIZARE': "x", 'TRANZITIA NEGATIVA': "x", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""},
        {'Saptamana / Momentele jocului': "S2", 'INITIEREA JOCULUI': "x", 'PROGRESIE / FINALIZARE': "x", 'TRANZITIA NEGATIVA': "x", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""},
        {'Saptamana / Momentele jocului': "S3", 'INITIEREA JOCULUI': "", 'PROGRESIE / FINALIZARE': "", 'TRANZITIA NEGATIVA': "", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""},
        {'Saptamana / Momentele jocului': "S4", 'INITIEREA JOCULUI': "", 'PROGRESIE / FINALIZARE': "", 'TRANZITIA NEGATIVA': "", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""},
        {'Saptamana / Momentele jocului': "S5", 'INITIEREA JOCULUI': "", 'PROGRESIE / FINALIZARE': "", 'TRANZITIA NEGATIVA': "", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""},
        {'Saptamana / Momentele jocului': "S6", 'INITIEREA JOCULUI': "", 'PROGRESIE / FINALIZARE': "", 'TRANZITIA NEGATIVA': "", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""},
        {'Saptamana / Momentele jocului': "S7", 'INITIEREA JOCULUI': "", 'PROGRESIE / FINALIZARE': "", 'TRANZITIA NEGATIVA': "", 'ORGANIZAREA DEFENSIVA': "", 'TRANZITIA POZITIVA': "", 'Data': ""}
    ]

    const evaluare3M = [
        ['nume', 'principii de atac', 'sub+subsub principii de atac', 'principii de aparare', 'sub+subsub principii de aparare', 'tranzitia pozitiva', 'tranzitia negativa', 'fitness/ABCs', 'fitness/forta & anduranta specifica', 'informarea/perceptie/decizie', 'atitudine/mediu de dezvoltare', 'data', 'observations', 'conclusions'],
        ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "1997-05-05", "", ""]
    ];


    

    const evaluareITTemplate = (csvData, fileName) => {
        const ws = XLSX.utils.aoa_to_sheet(csvData);
        // ws['pageSetup'] = {
        //     horizontalCentered: true,
        //     verticalCentered: true
        // };
        ws['!merges'] = [
            {s:{r:0,c:0},e:{r:1,c:0}},
            {s:{r:0,c:1},e:{r:0,c:5}},
            {s:{r:0,c:6},e:{r:0,c:10}},
            {s:{r:0,c:11},e:{r:0,c:14}},
            {s:{r:0,c:15},e:{r:0,c:18}},
            {s:{r:0,c:19},e:{r:0,c:23}},
            {s:{r:0,c:24},e:{r:1,c:24}},
            {s:{r:0,c:25},e:{r:1,c:25}},
            {s:{r:0,c:26},e:{r:1,c:26}},
            {s:{r:0,c:27},e:{r:1,c:27}}
        ];
        const wb = { Sheets: { 'EVALUARE I+T': ws }, SheetNames: ['EVALUARE I+T'] };
        wb.Sheets['EVALUARE I+T']['Z3'].z = "@";
        wb.Sheets['EVALUARE I+T']['Y3'].f = "SUM(B3:X3)";
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const evaluareI3MTemplate = (csvData, fileName) => {
        const ws = XLSX.utils.aoa_to_sheet(csvData);
       
       
        const wb = { Sheets: { 'EVALUARE la 3 luni': ws }, SheetNames: ['EVALUARE la 3 luni'] };
        wb.Sheets['EVALUARE la 3 luni']['L2'].z = "@";
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const microjocuriTemplate = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
       
        ws['!merges'] = [
            {s:{r:0,c:0},e:{r:1,c:0}},
            {s:{r:0,c:1},e:{r:1,c:1}},
            {s:{r:0,c:2},e:{r:1,c:2}},
            {s:{r:0,c:3},e:{r:1,c:3}},
            {s:{r:0,c:4},e:{r:1,c:4}},
            {s:{r:0,c:5},e:{r:1,c:5}},
            {s:{r:0,c:6},e:{r:1,c:6}}
        ];
       
        const wb = { Sheets: { 'Microjocuri': ws }, SheetNames: ['Microjocuri'] };
        wb.Sheets['Microjocuri']['G3'].z = "@";
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const myUpload = (e, rowData) => {
        e.files.map((item, index) => {
            if (item.type === 'application/vnd.ms-excel') {
                if (item.name.toLowerCase().includes('evaluare i+t')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const wb = XLSX.read(e.target.result, {type: 'binary'});
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws, {header:1});
                       
                                data[1][0] = "JUCATORUL";
                                data[1][24] = "TOTAL PCT IND";
                                data[1][25] = "Data";
                                data[1][26] = "Observatii";
                                data[1][27] = "Concluzii";
                                // {
                                //     "assessment_id": 1,
                                //     "player_id": 11,
                                //     "team_id": 1,
                                //     "creation_date": "2021-04-09T21:00:00.000+00:00",
                                //     "observations": null,
                                //     "conclusions": "Pescaru Mihai, se remarca prin talie deosebita dar are carente mari :\nprocedee si elemente tehnice neinsusite;\ncapacitate de antrenare si invatare slaba;\nprobleme la pozitionare, dueluri, iesiri la mingi inalte\ncapacitati psihice si mentale care nu sunt la nivelul corespunzator, slaba concentrare, implicare atat la antrenamente cat si la jocuri",
                                //     "pft": 5,
                                //     "dem": 1,
                                //     "rep": 1,
                                //     "pl": 2,
                                //     "ant": 3,
                                //     "fram": 4,
                                //     "cob": 5,
                                //     "cs": 3,
                                //     "dub": 4,
                                //     "ps_FT": 3,
                                //     "forc": 3,
                                //     "vit": 4,
                                //     "opt": 1,
                                //     "moti": 2,
                                //     "mar": 2,
                                //     "cd": 5,
                                //     "spr": 2,
                                //     "rez": 2,
                                //     "fin": 1,
                                //     "twoVOne": 4,
                                //     "prs": 3,
                                //     "tcd": 4,
                                //     "vex": 1
                                // }
                                let jsonList = [];
                                let jsonLabel = ["", "", "ps_FT", "pl", "fin", "twoVOne", "cob", "mar", "rep", "dub", "ant", "cd", "dem", "spr", "prs", "tcd", "mi", "opt", "fm", "cs", "pft", "vit", "for", "rez", "vex", "", "", "", ""];
                                
                                 for (var i = 2; i < data.length; i++) {
                                     if (data[i].length === 26) {
                                         data[i][26] = "";
                                         data[i][27] = "";
                                     }
                                     if (data[i].length > 0 && data[i][0].toLowerCase() !== "total puncte echipa") {
                                        let player = playerList.filter((element) => element['nume'] === data[i][0]);
                                        if (player.length > 0) {
                                            let jsonObj = {};
                                            jsonObj['player_id'] = player[0]['id'];
    
                                            for (var j = 2; j < data[i].length - 4; j++) {
                                                jsonObj[jsonLabel[j]] = data[i][j];
                                            }
    
                                            jsonObj['creation_date'] = (new Date(data[i][data[i].length - 3])).toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-");
                                            jsonObj['observations'] = data[i][data[i].length - 2];
                                            jsonObj['conclusions'] = data[i][data[i].length - 1];
                                            jsonList.push(jsonObj);
                                            
                                        }
    
                                     }
                                }
                            
                               createAssessment(ls.get('token'), jsonList).then((result) => {
                                    if (toast !== null) {
                                        toast.current.clear();
                                        toast.current.show({severity:'success', summary: 'Incarcare reusita', detail:'Fisierul a fost incarcat cu succes !', life: 3000});
                                    }
                                    setDialogShow(false);
                               }).catch((error) => {
                                if(error.response) {
                                    if (error.response.status === 401) {
                                        ls.set('token', '');
                                        ls.set('username', '');
                                        ls.set('authSucc', false);
                                        ls.set('dataLoad', false);
                                        window.location.reload();
                                    }
                                }
                               });
                            //console.log(listPlayersValues.filter(obj => obj['database_label'].toLowerCase() === 'ps_ft'));
                                    setPlayerConclusion("");
                                    setTeamConclusion("");
                                    
                                    setPlayerObservation("");
                                    setTeamObservation("");

                                    setPlayerValues([{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
                                    {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
                                {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
                            {label: 'Viteza de executie', database_label: 'VEX', value: 0}]);
                                   // handleDataChart('jucator', playerLabelsSelected);
                                
                               
                                   
                                    setTeamValues([{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
                                    {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
                                {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
                            {label: 'Viteza de executie', database_label: 'VEX', value: 0}]);
                                   // handleDataChart('echipa', teamLabelsSelected);
                                
                        
                    };
                    
                    reader.readAsBinaryString(item);

                } else if (item.name.toLowerCase().includes('microjocuri')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const wb = XLSX.read(e.target.result, {type: 'binary'});
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws);
                        
                        if (data !== null && data !== undefined && data !== "") {
                            let microGamesList = [];
                            data.forEach((element) => {
                                if (element.hasOwnProperty("Saptamana / Momentele jocului")) {    
                                    let newJson = {};

                                    if (element.hasOwnProperty("INITIEREA JOCULUI")) {
                                        if (element['INITIEREA JOCULUI'].toLowerCase() === 'x') {
                                            newJson['init_game'] = 1;
                                        } else {
                                            newJson['init_game'] = 0;
                                        }
                                    } else if (!element.hasOwnProperty("INITIEREA JOCULUI")){
                                            newJson['init_game'] = 0;
                                    }

                                    if (element.hasOwnProperty("ORGANIZAREA DEFENSIVA")) {
                                        if (element['ORGANIZAREA DEFENSIVA'].toLowerCase() === 'x') {
                                            newJson['org_def'] = 1;
                                        } else {
                                            newJson['org_def'] = 0;
                                        }
                                    } else if (!element.hasOwnProperty("ORGANIZAREA DEFENSIVA")) {
                                            newJson['org_def'] = 0;
                                    }

                                    if (element.hasOwnProperty("PROGRESIE / FINALIZARE")) {
                                        if (element['PROGRESIE / FINALIZARE'].toLowerCase() === 'x') {
                                            newJson['prog_fin'] = 1;
                                        } else {
                                            newJson['prog_fin'] = 0;
                                        }
                                    } else if (!element.hasOwnProperty("PROGRESIE / FINALIZARE")) {
                                        newJson['prog_fin'] = 0;
                                    }

                                    if (element.hasOwnProperty("TRANZITIA NEGATIVA")) {
                                        if (element['TRANZITIA NEGATIVA'].toLowerCase() === 'x') {
                                            newJson['tn'] = 1;
                                        } else {
                                            newJson['tn'] = 0;
                                        }
                                    } else if (!element.hasOwnProperty("TRANZITIA NEGATIVA")) {
                                        newJson['tn'] = 0;
                                    }

                                    if (element.hasOwnProperty("TRANZITIA POZITIVA")) {
                                        if (element['TRANZITIA POZITIVA'].toLowerCase() === 'x') {
                                            newJson['tp'] = 1;
                                        } else {
                                            newJson['tp'] = 0;
                                        }
                                    } else if (!element.hasOwnProperty("TRANZITIA POZITIVA")) {
                                        newJson['tp'] = 0;
                                    }

                                    if (element.hasOwnProperty("Data")) {
                                        newJson['creation_date'] = element['Data'];
                                    } else if (!element.hasOwnProperty("Data")) {
                                        newJson = {};
                                    }

                                   if (newJson.hasOwnProperty("creation_date")) {
                                        newJson['team_id'] = rowData.team_id;
                                        microGamesList.push(newJson);
                                   }
                                }
                            });

                            createMicroGames(ls.get('token'), microGamesList).then((result) => {
                                if (toast !== null) {
                                    toast.current.clear();
                                    toast.current.show({severity:'success', summary: 'Incarcare reusita', detail:'Fisierul a fost incarcat cu succes !', life: 3000});
                                }
                                setDialogShow(false);
                            }).catch((error) => {
                                if(error.response) {
                                    if (error.response.status === 401) {
                                        ls.set('token', '');
                                        ls.set('username', '');
                                        ls.set('authSucc', false);
                                        ls.set('dataLoad', false);
                                        window.location.reload();
                                    }
                                }
                            });

                            setDataMicroGames([[], [], [], [], []]);
                            setLabelMicroGames([]);
                            setEvents([]);

                        }
                        
                    };
                    
                    reader.readAsBinaryString(item);
                   

                } else if (item.name.toLowerCase().includes('evaluare la 3 luni')) {

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const wb = XLSX.read(e.target.result, {type: 'binary'});
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws);
                        
                        let jsonList = [];
                        data.forEach((item) => {
                            let json = {};
                            let player = playerList.filter((element) => { if (element['nume'].toLowerCase() === item['nume'].toLowerCase()) { return element; };});
                            if (player.length > 0) {
                                json['player_id'] = player[0]['id'];
                                json['conclusions'] = item.hasOwnProperty('conclusions') ? item['conclusions'] : "";
                                json['observations'] = item.hasOwnProperty('observations') ? item['observations'] : "";
                                json['creation_date'] = moment(item['data']).format("YYYY-MM-DD");//(new Date(item['data'])).toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-");
                                json['pap'] = item['principii de aparare'];
                                json['s_SS_Pap'] = item['sub+subsub principii de aparare'];
                                json['patt'] = item['principii de atac'];
                                json['f_F_AS'] = item['fitness/forta & anduranta specifica'];
                                json['tp'] = item['tranzitia pozitiva'];
                                json['tn'] = item['tranzitia negativa'];
                                json['i_P_D'] = item['informarea/perceptie/decizie'];
                                json['f_ABCs'] = item['fitness/ABCs'];
                                json['s_SS_Patt'] = item['sub+subsub principii de atac'];
                                json['a_MD'] = item['atitudine/mediu de dezvoltare'];
                                jsonList.push(json);
    
                            }
                        });
                       
                        createThreeMAssessment(ls.get('token'), JSON.stringify(jsonList)).then((result) => {
                            if (toast !== null) {
                                toast.current.clear();
                                toast.current.show({severity:'success', summary: 'Incarcare reusita', detail:'Fisierul a fost incarcat cu succes !', life: 3000});
                            }
                            setDialogShow(false);
                        }).catch((error) => {
                            if(error.response) {
                                if (error.response.status === 401) {
                                    ls.set('token', '');
                                    ls.set('username', '');
                                    ls.set('authSucc', false);
                                    ls.set('dataLoad', false);
                                    window.location.reload();
                                }
                            }
                        });

                        setPlayer3MonthObservation("");
                        setPlayer3MonthConclusion("");
                        setDataThreeMAsm([[], [], [], [], [], [], [], [], [], []]);  
                        setLabelThreeMAsm([]);   
                        
                       
                    };
                    
                    reader.readAsBinaryString(item);
                } else {
                    if (toast !== null) {
                        toast.current.clear();
                        toast.current.show({severity:'error', summary: 'Nume fisier incorect', detail:'Numai fisierele cu denumirile [evaluare la 3 luni, microjocuri, evaluare i+t] sunt permise!', life: 3000});
                    }
                } 
               
                
             } else {
                 toast.current.clear();
                 toast.current.show({severity:'error', summary: 'Format Incorect', detail:'Numai fisierele de tip excel sunt permise', life: 3000});  
             }
            
        });
    };

    const basicDataRAEAntr = {
        labels: labelTrain,
        datasets: [
            {
                label: labelDatasetTrain1,
                backgroundColor: colorTrain1,
                data: valuesBarTrain
            },
            {
                label: labelDatasetTrain2,
                backgroundColor: colorTrain2,
                data: valuesBarTrain
            },
            {
                label: labelDatasetTrain3,
                backgroundColor: colorTrain3,
                data: valuesBarTrain
            }
        ]
    };

    const basicDataRAEGame = {
        labels: labelGame,
        datasets: [
            {
                label: labelDatasetGame1,
                backgroundColor: colorGame1,
                data: valuesBarGame
            },
            {
                label: labelDatasetGame2,
                backgroundColor: colorGame2,
                data: valuesBarGame
            },
            {
                label: labelDatasetGame3,
                backgroundColor: colorGame3,
                data: valuesBarGame
            }
        ]
    };


    let stackedDataThreeMonth = {
        labels: labelThreeMAsm,
        datasets: [{
            type: 'bar',
            label: 'Principii de atac',
            backgroundColor: '#42A5F5',
            data: dataThreeMAsm[0]
        }, {
            type: 'bar',
            label: 'Sub+subsub principii de atac',
            backgroundColor: '#66BB6A',
            data: dataThreeMAsm[1]
        }, {
            type: 'bar',
            label: 'Principii de aparare',
            backgroundColor: '#FFA726',
            data: dataThreeMAsm[2]
        }, 
        {
            type: 'bar',
            label: 'Sub+subsub principii de aparare',
            backgroundColor: '#EAF326',
            data: dataThreeMAsm[3]
        }, {
            type: 'bar',
            label: 'Tranzitia pozitiva',
            backgroundColor: '#3A6073',
            data: dataThreeMAsm[4]
        }, {
            type: 'bar',
            label: 'Tranzitia negativa',
            backgroundColor: '#26D0CE',
            data: dataThreeMAsm[5]
        }, {
            type: 'bar',
            label: 'Fitness / ABCs',
            backgroundColor: '#AA076B',
            data: dataThreeMAsm[6]
        }, {
            type: 'bar',
            label: 'Fitness / Forta & Anduranta Specifica',
            backgroundColor: '#EDDE5D',
            data: dataThreeMAsm[7]
        }, {
            type: 'bar',
            label: 'Informarea / Perceptie / Decizie',
            backgroundColor: '#603813',
            data: dataThreeMAsm[8]
        }, {
            type: 'bar',
            label: 'Atitudine / Mediu de dezvoltare',
            backgroundColor: '#fd1d1d',
            data: dataThreeMAsm[9]
        }]
    };

    let stackedOptionsThreeMonth = {
        tooltips: {
            mode: 'index',
            intersect: false
        },
        responsive: true,
        scales: {
            xAxes: [{
                stacked: true,
                ticks: {
                    fontColor: '#495057'
                },
                gridLines: {
                    color: '#ebedef'
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontColor: '#495057'
                },
                gridLines: {
                    color: '#ebedef'
                }
            }]
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };



    const basicData = {
        labels: [""],
        datasets: [
            {
                label: 'Satisfacator',
                backgroundColor: '',
                data: []
            },
            {
                label: 'Mediu',
                backgroundColor: '',
                data: []
            },
            {
                label: 'Nesatisfacator',
                backgroundColor: '',
                data: []
            }
        ]
    };

    let basicOptions = {
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
                    fontColor: '#495057'
                }
            }]
        }
    }

    const chartDataDoughnutRAntr = {
        labels: ['Satis', 'Nesatis', 'Mediu'],
        datasets: [
            {
                data: [dataGreenRTrain, dataRedRTrain, dataOrangeRTrain],
                backgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ]
            }]
    };

    const chartDataDoughnutAAntr = {
        labels: ['Satis', 'Nesatis', 'Mediu'],
        datasets: [
            {
                data: [dataGreenATrain, dataRedATrain, dataOrangeATrain],
                backgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ]
            }]
    };

    const chartDataDoughnutEAntr = {
        labels: ['Satis', 'Nesatis', 'Mediu'],
        datasets: [
            {
                data: [dataGreenETrain, dataRedETrain, dataOrangeETrain],
                backgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ]
            }]
    };

    const chartDataDoughnutRGame = {
        labels: ['Satis', 'Nesatis', 'Mediu'],
        datasets: [
            {
                data: [dataGreenRGame, dataRedRGame, dataOrangeRGame],
                backgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ]
            }]
    };

    const chartDataDoughnutAGame = {
        labels: ['Satis', 'Nesatis', 'Mediu'],
        datasets: [
            {
                data: [dataGreenAGame, dataRedAGame, dataOrangeAGame],
                backgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ]
            }]
    };

    const chartDataDoughnutEGame = {
        labels: ['Satis', 'Nesatis', 'Mediu'],
        datasets: [
            {
                data: [dataGreenEGame, dataRedEGame, dataOrangeEGame],
                backgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#45a247",
                    "#FF6384",
                    "#FFA726"
                ]
            }]
    };
    
    const lightOptionsDoughnutRAntr = {
        title: {
            display: true,
            text: 'R'
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    const lightOptionsDoughnutAAntr = {
        title: {
            display: true,
            text: 'A'
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    const lightOptionsDoughnutEAntr = {
        title: {
            display: true,
            text: 'E'
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    const lightOptionsDoughnutRGame = {
        title: {
            display: true,
            text: 'R'
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    const lightOptionsDoughnutAGame = {
        title: {
            display: true,
            text: 'A'
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    const lightOptionsDoughnutEGame = {
        title: {
            display: true,
            text: 'E'
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    const microGamesData = {
        labels: labelMicroGames,
        datasets: [{
            type: 'bar',
            label: 'Initierea jocului',
            backgroundColor: '#42A5F5',
            data: dataMicroGames[0]
        }, {
            type: 'bar',
            label: 'Progresie / Finalizare',
            backgroundColor: '#66BB6A',
            data: dataMicroGames[1]
        }, {
            type: 'bar',
            label: 'Tranzitia negativa',
            backgroundColor: '#FFA726',
            data: dataMicroGames[2]
        }, {
            type: 'bar',
            label: 'Organizarea defensiva',
            backgroundColor: '#fd1d1d',
            data: dataMicroGames[3]
        }, {
            type: 'bar',
            label: 'Tranzitia pozitiva',
            backgroundColor: '#7b4397',
            data: dataMicroGames[4]
        }]
    };

    const microGamesOptions = {
        tooltips: {
            mode: 'index',
            intersect: false
        },
        responsive: true,
        scales: {
            xAxes: [{
                stacked: true,
                ticks: {
                    fontColor: '#495057'
                },
                gridLines: {
                    color: '#ebedef'
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontColor: '#495057'
                },
                gridLines: {
                    color: '#ebedef'
                }
            }]
        },
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };



    const filter = (type, id) => {
       
        if (type === 1) {
            if (startDateFilter1 !== '' && endDateFilter1 !== '') {
                getDataByIdBetweenDates(ls.get('token'), id['id'], id['team_id'], startDateFilter1, endDateFilter1).then((result) => {
                    let sumaTehnica = 0;
                    let sumaTDef = 0;
                    let sumaTOfe = 0;
                    let sumaEmo = 0;
                    let sumaFizic = 0;
                    let list = [{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
                    {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
                {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
            {label: 'Viteza de executie', database_label: 'VEX', value: 0}];
                    let observations = "";
                    let conclusions = "";

                    if (result !== "" && result !== null && result !== undefined) {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                        result.map((item) => {
                            for (var key in item) {
                                list.forEach((item2) => {
                                    if (item2['database_label'].toLowerCase() === key.toLowerCase()) {
                                        let value = parseInt(item2['value']);
                                        value += parseInt(item[key]);
                                        item2['value'] = value;
                                    }
                                    
                                });
                                if (key.toLowerCase() === 'observations') {
                                    observations += "\nCreation Date: " + (new Date(item['creation_date'])).toLocaleDateString() + " " + (new Date(item['creation_date'])).toLocaleTimeString() + "\n" + (item[key] === null ? "" : item[key]) + "\n";
                                } else if (key.toLowerCase() === 'conclusions') {
                                    conclusions += "\nCreation Date: " + (new Date(item['creation_date'])).toLocaleDateString() + " " + (new Date(item['creation_date'])).toLocaleTimeString() + "\n" + (item[key] === null ? "" : item[key]) + "\n";
                                }
                            }
                        });
                    } else {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista date introduse !'});
                    }

                    list.forEach((item2) => {
                        if (item2['database_label'].toLowerCase() === 'ps_ft' || item2['database_label'].toLowerCase() === 'pl' ||
                            item2['database_label'].toLowerCase() === 'fin' || item2['database_label'].toLowerCase() === 'twovone' ||
                            item2['database_label'].toLowerCase() === 'cob') {
                            sumaTehnica += parseInt(item2['value']);
                        } else if (item2['database_label'].toLowerCase() === 'mar' || item2['database_label'].toLowerCase() === 'rep' ||
                                    item2['database_label'].toLowerCase() === 'dub' || item2['database_label'].toLowerCase() === 'ant' ||
                                    item2['database_label'].toLowerCase() === 'cd') {
                            sumaTDef += parseInt(item2['value']);
                        } else if (item2['database_label'].toLowerCase() === 'dem' || item2['database_label'].toLowerCase() === 'spr' ||
                                    item2['database_label'].toLowerCase() === 'prs' || item2['database_label'].toLowerCase() === 'tcd') {
                                sumaTOfe += parseInt(item2['value']);
                        } else if (item2['database_label'].toLowerCase() === 'moti' || item2['database_label'].toLowerCase() === 'opt' ||
                                    item2['database_label'].toLowerCase() === 'fram' || item2['database_label'].toLowerCase() === 'cs') {
                                sumaEmo += parseInt(item2['value']);
                        }  else if (item2['database_label'].toLowerCase() === 'pft' || item2['database_label'].toLowerCase() === 'vit' ||
                                    item2['database_label'].toLowerCase() === 'forc' || item2['database_label'].toLowerCase() === 'rez' ||
                                    item2['database_label'].toLowerCase() === 'vex') {
                            sumaFizic += parseInt(item2['value']);
                        }
                    });

                    list.forEach((item2) => {
                        if (item2['label'].toLowerCase() === 'tehnica') {
                            item2['value'] = sumaTehnica;
                        } else if (item2['label'].toLowerCase() === 'tactic defensiv') {
                            item2['value'] = sumaTDef;
                        } else if (item2['label'].toLowerCase() === 'tactic ofensiv') {
                            item2['value'] = sumaTOfe;
                        } else if (item2['label'].toLowerCase() === 'emotional') {
                            item2['value'] = sumaEmo;
                        } else if (item2['label'].toLowerCase() === 'fizic') {
                            item2['value'] = sumaFizic;
                        }
                    });
                    setPlayerObservation(observations);
                    setPlayerConclusion(conclusions);
                    setPlayerValues(list);
                    handleDataChart('jucator', playerLabelsSelected);
                }).catch(error => {
                    if(error.response) {
                        if (error.response.status === 401) {
                            ls.set('token', '');
                            ls.set('username', '');
                            ls.set('authSucc', false);
                            ls.set('dataLoad', false);
                            window.location.reload();
                        }
                    }
                });
                setStartDateFilter1('');
                setEndDateFilter1('');
            }
        } else if (type === 2) {
            if (startDateFilter2 !== '' && endDateFilter2 !== '') {
                let eventList = [];

                getGTByTeamIdAndDates(ls.get('token'), id, startDateFilter2, endDateFilter2).then((result) => {
                    if (result !== "" && result !== null && result !== undefined) {
                        result.forEach((item) => {
                             item['data'].forEach((element) => {
                                 let newJson = {};
                                 if (element['event_type_id'] === 1) {
                                     newJson['title'] = element['event_type_desc'];
                                     newJson['start'] = element['start_date'];
                                     newJson['end'] = element['end_date'];
                                     newJson['duration'] = element['duration'];
                                     newJson['regime'] = element['effort_regime'];
                                     newJson['obj_task'] = element['objective_task'];
                                     newJson['first_obj'] = element['principal_objective'];
                                     newJson['second_obj'] = element['principle_subprinciple'];
                                     newJson['volume'] = element['volume'];
                                     newJson['type'] = element['event_type_id'];
                                     
                                 } else if (element['event_type_id'] === 2) {
                                     newJson['title'] = element['event_type_desc'];
                                     newJson['start'] = element['start_date'];
                                     newJson['end'] = element['end_date'];
                                     newJson['formation'] = element['formation_desc'];
                                     newJson['game_type'] = element['game_type_desc'];
                                     newJson['opposite_team'] = element['opposite_team'];
                                     newJson['type'] = element['event_type_id'];
                     
                                 } 
                                 eventList.push(newJson);
                             });
                        });
                        setEvents(eventList);
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                    } else {
                     toast.current.clear();
                     toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista evenimente introduse !'});
                    }
                }).catch((error) => {
                    if(error.response) {
                        if (error.response.status === 401) {
                            ls.set('token', '');
                            ls.set('username', '');
                            ls.set('authSucc', false);
                            ls.set('dataLoad', false);
                            window.location.reload();
                        }
                    }
                }); 

                // getGamesByTeamIdAndDates(ls.get('token'), id, startDateFilter2, endDateFilter2).then((result) => {
                //     if (result !== "" && result !== null && result !== undefined) {
                //         result.forEach((element) => {
                //                  let newJson = {};
                                
                //                      newJson['title'] = element['event_type_desc'];
                //                      newJson['start'] = element['start_date'];
                //                      newJson['end'] = element['end_date'];
                //                      newJson['formation'] = element['formation_desc'];
                //                      newJson['game_type'] = element['game_type_desc'];
                //                      newJson['opposite_team'] = element['opposite_team'];
                //                      newJson['type'] = element['event_type_id'];
                     
                //                      eventList.push(newJson);
                             
                //         });
                //         setEvents(eventList);
                //         toast.current.clear();
                //         toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                //     } else {
                //      toast.current.clear();
                //      toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista evenimente introduse !'});
                //     }
                // }).catch((error) => {
                //     if(error.response) {
                //         if (error.response.status === 401) {
                //             ls.set('token', '');
                //             ls.set('username', '');
                //             ls.set('authSucc', false);
                //             ls.set('dataLoad', false);
                //             window.location.reload();
                //         }
                //     }
                // }); 
                
                getMicroGamesByTIdAndDates(ls.get('token'), id, startDateFilter2, endDateFilter2).then((result) => {
                    if (result !== null && result !== undefined && result !== "") {
                        let label = [];
                        let data = [[], [], [], [], []];

                        result.map((item, index) => {
                            label.push("S" + parseInt(index + 1));
                            if (item['init_game'] === 1) {
                                data[0].push(50);
                            } else {
                                data[0].push(0);
                            }
                            if (item['prog_fin'] === 1) {
                                data[1].push(50);
                            } else {
                                data[1].push(0);
                            }
                            if (item['tn'] === 1) {
                                data[2].push(50);
                            } else {
                                data[2].push(0);
                            }
                            if (item['org_def'] === 1) {
                                data[3].push(50);
                            } else {
                                data[3].push(0);
                            }
                            if (item['tp'] === 1) {
                                data[4].push(50);
                            } else {
                                data[4].push(0);
                            }
                        });
                        setDataMicroGames(data);
                        setLabelMicroGames(label);

                       toast.current.clear();
                       toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                    } else {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista microjocuri introduse !'});
                    }
                }).catch((error) => {
                    if(error.response) {
                        if (error.response.status === 401) {
                            ls.set('token', '');
                            ls.set('username', '');
                            ls.set('authSucc', false);
                            ls.set('dataLoad', false);
                            window.location.reload();
                        }
                    }
                });

            } 
            setStartDateFilter2("");
            setEndDateFilter2("");
        } else if (type === 3) {
            if (startDateFilter3 !== '' && endDateFilter3 !== '') {
              
                let trainsList = [];
              
                getRAETrainByIdAndDates(ls.get('token'), id, startDateFilter3, endDateFilter3).then((result) => {
                    let i = 1;
                    
                    if (result !== null && result !== undefined && result !== "") {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                        trainsList.push({lab: '', color: ['#FF6384', '#45a247', '#FFA726']});
                        result.forEach((item) => {
                            let colors = [];
                            
                            if (item['realization'] === 1) {
                                colors.push('#45a247');
                            } else if (item['realization'] === 2) {
                                colors.push('#FFA726');
                            } else if (item['realization'] === 3) {
                                colors.push('#FF6384');
                            }

                            if (item['attitude'] === 1) {
                                colors.push('#45a247');
                            } else if (item['attitude'] === 2) {
                                colors.push('#FFA726');
                            } else if (item['attitude'] === 3) {
                                colors.push('#FF6384');
                            }

                            if (item['effort'] === 1) {
                                colors.push('#45a247');
                            } else if (item['effort'] === 2) {
                                colors.push('#FFA726');
                            } else if (item['effort'] === 3) {
                                colors.push('#FF6384');
                            }

                            let newRecord = {lab: 'J'+ i + ' (R, A, E)', color: colors};
                            
                            trainsList.push(newRecord);
                            i++;
                            
                        });
                    } else {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista date introduse !'});
                    }

                    let labelList = labelTrain;
                    let colorList1 = colorTrain1;
                    let colorList2 = colorTrain2;
                    let colorList3 = colorTrain3;
                    let lengthBar = valuesBarTrain;
    
                    let datGR = dataGreenRTrain;
                    let datOR = dataOrangeRTrain;
                    let datRR = dataRedRTrain;
                    let datGA = dataGreenATrain;
                    let datOA = dataOrangeATrain;
                    let datRA = dataRedATrain;
                    let datGE = dataGreenETrain;
                    let datOE = dataOrangeETrain;
                    let datRE = dataRedETrain;

                    trainsList.forEach((item) => {
                       
                        labelList.push(item['lab']);
                        colorList1.push(item['color'][0]);
                        colorList2.push(item['color'][1]);
                        colorList3.push(item['color'][2]);
                        if (item['lab'] === "") {
                            lengthBar.push(0);
                        } else {
                            lengthBar.push(50);
                            if(item['color'][0] === '#45a247') {
                                datGR++;
                            } else if(item['color'][0] === '#FFA726') {
                                datOR++;
        
                            } else if(item['color'][0] === '#FF6384') {
                                datRR++;
                            }
        
                            if(item['color'][1] === '#45a247') {
                                datGA++;
                            } else if(item['color'][1] === '#FFA726') {
                                datOA++;
        
                            } else if(item['color'][1] === '#FF6384') {
                                datRA++;
                            }
        
                            if(item['color'][2] === '#45a247') {
                                datGE++;
                            } else if(item['color'][2] === '#FFA726') {
                                datOE++;
        
                            } else if(item['color'][2] === '#FF6384') {
                                datRE++;
                            }
                        }
                    });
        
                    setDataGreenRTrain(datGR);
    
                    setDataOrangeRTrain(datOR);
                    setDataRedRTrain(datRR);
      
                    setDataGreenATrain(datGA);
    
                    setDataOrangeATrain(datOA);
                    setDataRedATrain(datRA);
      
                    setDataGreenETrain(datGE);
    
                    setDataOrangeETrain(datOE);
                    setDataRedETrain(datRE);
      
    
                    //'#45a247', '#FFA726', '#FF6384'
                    let label1 = labelDatasetTrain1, label2 = labelDatasetTrain2, label3 = labelDatasetTrain3;
                    colorList1.forEach((item) => {
                       
                        if (item === '#45a247' && label1 === '' && label2 !== 'Satisfacut' && label3 !== 'Satisfacut') {
                            
                            label1 = 'Satisfacut';
                        } else if (item === '#FFA726' && label1 === '' && label2 !== 'Mediu' && label3 !== 'Mediu') {
                           
                            label1 = 'Mediu';
                        } else if (item === '#FF6384' && label1 === '' && label2 !== 'Nesatisfacut' && label3 !== 'Nesatisfacut') {
                           
                           label1 = 'Nesatisfacut';
                        }
                    });
        
                    colorList2.forEach((item) => {
                       
                        if (item === '#45a247' && label2 === '' && label1 !== 'Satisfacut' && label3 !== 'Satisfacut') {
                            
                           label2 = 'Satisfacut';
                        } else if (item === '#FFA726' && label2 === '' && label1 !== 'Mediu' && label3 !== 'Mediu') {
                            
                            label2 = 'Mediu';
                        } else if (item === '#FF6384' && label2 === '' && label1 !== 'Nesatisfacut' && label3 !== 'Nesatisfacut') {
                           
                           label2 = 'Nesatisfacut';
                        }
                    });
        
                    colorList3.forEach((item) => {
                        
                        if (item === '#45a247' && label3 === '' && label1 !== 'Satisfacut' && label2 !== 'Satisfacut') {
                            
                            label3 = 'Satisfacut';
                        } else if (item === '#FFA726' && label3 === '' && label1 !== 'Mediu' && label2 !== 'Mediu') {
                            
                            label3 = 'Mediu';
                        } else if (item === '#FF6384' && label3 === '' && label1 !== 'Nesatisfacut' && label2 !== 'Nesatisfacut') {
                            
                            label3 = 'Nesatisfacut';
                        }
                    });
    
    
    
                    setLabelDatasetTrain1(label1);
                    setLabelDatasetTrain2(label2);
                    setLabelDatasetTrain3(label3);
                    setLabelTrain(labelList);
                    setColorTrain1(colorList1);
                    setColorTrain2(colorList2);
                    setColorTrain3(colorList3);
                    setValuesBarTrain(lengthBar);
                    setStartDateFilter3('');
                    setEndDateFilter3('');

                }).catch((error) => {
                    if(error.response) {
                        if (error.response.status === 401) {
                            ls.set('token', '');
                            ls.set('username', '');
                            ls.set('authSucc', false);
                            ls.set('dataLoad', false);
                            window.location.reload();
                        }
                    }
                });
                
               
            }
           
        } else if (type === 4) {
            if (startDateFilter4 !== '' && endDateFilter4 !== '') {
              
                let trainsList = [];
              
                getRAEGameByIdAndDates(ls.get('token'), id, startDateFilter4, endDateFilter4).then((result) => {
                    
                    let i = 1;
                    if (result !== null && result !== undefined && result !== "") {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                        trainsList.push({lab: '', color: ['#FFA726', '#FF6384', '#45a247']});
                        result.forEach((item) => {
                            let colors = [];
                            
                            if (item['realization'] === 1) {
                                colors.push('#45a247');
                            } else if (item['realization'] === 2) {
                                colors.push('#FFA726');
                            } else if (item['realization'] === 3) {
                                colors.push('#FF6384');
                            }

                            if (item['attitude'] === 1) {
                                colors.push('#45a247');
                            } else if (item['attitude'] === 2) {
                                colors.push('#FFA726');
                            } else if (item['attitude'] === 3) {
                                colors.push('#FF6384');
                            }

                            if (item['effort'] === 1) {
                                colors.push('#45a247');
                            } else if (item['effort'] === 2) {
                                colors.push('#FFA726');
                            } else if (item['effort'] === 3) {
                                colors.push('#FF6384');
                            }

                           
                            let newRecord = {lab: 'J'+ i + ' (R, A, E)', color: colors};
                            
                            trainsList.push(newRecord);
                            i++;
                            
                        });
                    } else {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista date introduse !'});
                    }
                    
                    let labelList = labelGame;
                    let colorList1 = colorGame1;
                    let colorList2 = colorGame2;
                    let colorList3 = colorGame3;
                    let lengthBar = valuesBarGame;
    
                    let datGR = dataGreenRGame;
                    let datOR = dataOrangeRGame;
                    let datRR = dataRedRGame;
                    let datGA = dataGreenAGame;
                    let datOA = dataOrangeAGame;
                    let datRA = dataRedAGame;
                    let datGE = dataGreenEGame;
                    let datOE = dataOrangeEGame;
                    let datRE = dataRedEGame;

                    trainsList.forEach((item) => {
                       
                        labelList.push(item['lab']);
                        colorList1.push(item['color'][0]);
                        colorList2.push(item['color'][1]);
                        colorList3.push(item['color'][2]);
                        if (item['lab'] === "") {
                            lengthBar.push(0);
                        } else {
                            lengthBar.push(50);
                            if(item['color'][0] === '#45a247') {
                                datGR++;
                            } else if(item['color'][0] === '#FFA726') {
                                datOR++;
        
                            } else if(item['color'][0] === '#FF6384') {
                                datRR++;
                            }
        
                            if(item['color'][1] === '#45a247') {
                                datGA++;
                            } else if(item['color'][1] === '#FFA726') {
                                datOA++;
        
                            } else if(item['color'][1] === '#FF6384') {
                                datRA++;
                            }
        
                            if(item['color'][2] === '#45a247') {
                                datGE++;
                            } else if(item['color'][2] === '#FFA726') {
                                datOE++;
        
                            } else if(item['color'][2] === '#FF6384') {
                                datRE++;
                            }
                        }
                        
                       
                    });
        
                    setDataGreenRGame(datGR);
    
                    setDataOrangeRGame(datOR);
                    setDataRedRGame(datRR);
      
                    setDataGreenAGame(datGA);
    
                    setDataOrangeAGame(datOA);
                    setDataRedAGame(datRA);
      
                    setDataGreenEGame(datGE);
    
                    setDataOrangeEGame(datOE);
                    setDataRedEGame(datRE);
      
    
                    //'#45a247', '#FFA726', '#FF6384'
                    let label1 = labelDatasetGame1, label2 = labelDatasetGame2, label3 = labelDatasetGame3;
                    colorList1.forEach((item) => {
                       
                        if (item === '#45a247' && label1 === '' && label2 !== 'Satisfacut' && label3 !== 'Satisfacut') {
                            
                            label1 = 'Satisfacut';
                        } else if (item === '#FFA726' && label1 === '' && label2 !== 'Mediu' && label3 !== 'Mediu') {
                           
                            label1 = 'Mediu';
                        } else if (item === '#FF6384' && label1 === '' && label2 !== 'Nesatisfacut' && label3 !== 'Nesatisfacut') {
                           
                           label1 = 'Nesatisfacut';
                        }
                    });
        
                    colorList2.forEach((item) => {
                       
                        if (item === '#45a247' && label2 === '' && label1 !== 'Satisfacut' && label3 !== 'Satisfacut') {
                            
                           label2 = 'Satisfacut';
                        } else if (item === '#FFA726' && label2 === '' && label1 !== 'Mediu' && label3 !== 'Mediu') {
                            
                            label2 = 'Mediu';
                        } else if (item === '#FF6384' && label2 === '' && label1 !== 'Nesatisfacut' && label3 !== 'Nesatisfacut') {
                           
                           label2 = 'Nesatisfacut';
                        }
                    });
        
                    colorList3.forEach((item) => {
                        
                        if (item === '#45a247' && label3 === '' && label1 !== 'Satisfacut' && label2 !== 'Satisfacut') {
                            
                            label3 = 'Satisfacut';
                        } else if (item === '#FFA726' && label3 === '' && label1 !== 'Mediu' && label2 !== 'Mediu') {
                            
                            label3 = 'Mediu';
                        } else if (item === '#FF6384' && label3 === '' && label1 !== 'Nesatisfacut' && label2 !== 'Nesatisfacut') {
                            
                            label3 = 'Nesatisfacut';
                        }
                    });
    
    
    
                    setLabelDatasetGame1(label1);
                    setLabelDatasetGame2(label2);
                    setLabelDatasetGame3(label3);
                    setLabelGame(labelList);
                    setColorGame1(colorList1);
                    setColorGame2(colorList2);
                    setColorGame3(colorList3);
                    setValuesBarGame(lengthBar);
                    setStartDateFilter4('');
                    setEndDateFilter4('');

                }).catch((error) => {
                    if(error.response) {
                        if (error.response.status === 401) {
                            ls.set('token', '');
                            ls.set('username', '');
                            ls.set('authSucc', false);
                            ls.set('dataLoad', false);
                            window.location.reload();
                        }
                    }
                });
                
               
            }
        } else if (type === 5) {
            if (startDateFilter5 !== '' && endDateFilter5 !== '') {
                getDataByTeamIdBetweenDates(ls.get('token'), id, startDateFilter5, endDateFilter5).then((result) => {
                    let sumaTehnica = 0;
                    let sumaTDef = 0;
                    let sumaTOfe = 0;
                    let sumaEmo = 0;
                    let sumaFizic = 0;
                    let list = [{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
                    {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
                {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
            {label: 'Viteza de executie', database_label: 'VEX', value: 0}];;
                    let observations = "";
                    let conclusions = "";
                    if (result !== null && result !== undefined && result !== "") {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                        result.map((item) => {
                            for (var key in item) {
                                list.forEach((item2) => {
                                    if (item2['database_label'].toLowerCase() === key.toLowerCase()) {
                                        let value = parseInt(item2['value']);
                                        value += parseInt(item[key]);
                                        item2['value'] = value;
                                    }
                                    
                                });
                                if (key.toLowerCase() === 'observations') {
                                    observations += "\r\n" + (item[key] === null ? "" : item[key]) + "";
                                } else if (key.toLowerCase() === 'conclusions') {
                                    conclusions += "\r\n" + (item[key] === null ? "" : item[key]) + "";
                                }
                            }
                        });
                    } else {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista date introduse !'});
                    }

                    list.forEach((item2) => {
                        if (item2['database_label'].toLowerCase() === 'ps_ft' || item2['database_label'].toLowerCase() === 'pl' ||
                            item2['database_label'].toLowerCase() === 'fin' || item2['database_label'].toLowerCase() === 'twovone' ||
                            item2['database_label'].toLowerCase() === 'cob') {
                            sumaTehnica += parseInt(item2['value']);
                        } else if (item2['database_label'].toLowerCase() === 'mar' || item2['database_label'].toLowerCase() === 'rep' ||
                                    item2['database_label'].toLowerCase() === 'dub' || item2['database_label'].toLowerCase() === 'ant' ||
                                    item2['database_label'].toLowerCase() === 'cd') {
                            sumaTDef += parseInt(item2['value']);
                        } else if (item2['database_label'].toLowerCase() === 'dem' || item2['database_label'].toLowerCase() === 'spr' ||
                                    item2['database_label'].toLowerCase() === 'prs' || item2['database_label'].toLowerCase() === 'tcd') {
                                sumaTOfe += parseInt(item2['value']);
                        } else if (item2['database_label'].toLowerCase() === 'moti' || item2['database_label'].toLowerCase() === 'opt' ||
                                    item2['database_label'].toLowerCase() === 'fram' || item2['database_label'].toLowerCase() === 'cs') {
                                sumaEmo += parseInt(item2['value']);
                        }  else if (item2['database_label'].toLowerCase() === 'pft' || item2['database_label'].toLowerCase() === 'vit' ||
                                    item2['database_label'].toLowerCase() === 'forc' || item2['database_label'].toLowerCase() === 'rez' ||
                                    item2['database_label'].toLowerCase() === 'vex') {
                            sumaFizic += parseInt(item2['value']);
                        }
                    });

                    list.forEach((item2) => {
                        if (item2['label'].toLowerCase() === 'tehnica') {
                            item2['value'] = sumaTehnica;
                        } else if (item2['label'].toLowerCase() === 'tactic defensiv') {
                            item2['value'] = sumaTDef;
                        } else if (item2['label'].toLowerCase() === 'tactic ofensiv') {
                            item2['value'] = sumaTOfe;
                        } else if (item2['label'].toLowerCase() === 'emotional') {
                            item2['value'] = sumaEmo;
                        } else if (item2['label'].toLowerCase() === 'fizic') {
                            item2['value'] = sumaFizic;
                        }
                    });
                    setTeamObservation(observations);
                    setTeamConclusion(conclusions);
                    setTeamValues(list);
                    handleDataChart('echipa', playerLabelsSelected);
                }).catch(error => {
                    if(error.response) {
                        if (error.response.status === 401) {
                            ls.set('token', '');
                            ls.set('username', '');
                            ls.set('authSucc', false);
                            ls.set('dataLoad', false);
                            window.location.reload();
                        }
                    }
                });

                setStartDateFilter5('');
                setEndDateFilter5('');
            }
        } else if (type === 6) {
            if (startDateFilter6 !== '' && endDateFilter6 !== '') {
                getThreeMonthAssessment(ls.get('token'), id, startDateFilter6, endDateFilter6).then((result) => {
                    
                    let data = [[], [], [], [], [], [], [], [], [], []];
                    let labels = [];
                    let observations = "";
                    let conclusions = "";
                    if (result !== null && result !== undefined && result !== "") {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'success', summary: 'Succes !', detail: 'Operatiune de filtrare efectuata cu success !'});
                        result.forEach((item) => {
                            for (var key in item) {
                                if (key.toLowerCase() === 'observations') {
                                    observations += "\nCreation Date: " + (new Date(item['creation_date'])).toLocaleDateString() + " " + (new Date(item['creation_date'])).toLocaleTimeString() + "\n" + (item[key] === null ? "" : item[key]) + "\n";
                                } else if (key.toLowerCase() === 'conclusions') {
                                    conclusions += "\nCreation Date: " + (new Date(item['creation_date'])).toLocaleDateString() + " " + (new Date(item['creation_date'])).toLocaleTimeString() + "\n" + (item[key] === null ? "" : item[key]) + "\n";
                                }
                            }
                            labels.push((new Date(item['creation_date'])).toLocaleString('ro', { month: 'long' }));
                            data[0].push(item['patt']);
                            data[1].push(item['s_SS_Patt']);
                            data[2].push(item['pap']);
                            data[3].push(item['s_SS_Pap']);
                            data[4].push(item['tp']);
                            data[5].push(item['tn']);
                            data[6].push(item['f_ABCs']);
                            data[7].push(item['f_F_AS']);
                            data[8].push(item['i_P_D']);
                            data[9].push(item['a_MD']);
                        });
                    } else {
                        toast.current.clear();
                        toast.current.show({life: 5000, severity: 'warn', summary: 'Atentie !', detail: 'Nu exista date introduse !'});
                    }

                    setPlayer3MonthObservation(observations);
                    setPlayer3MonthConclusion(conclusions);
                    setDataThreeMAsm(data);  
                    setLabelThreeMAsm(labels);                  
                }).catch(error => {
                    if(error.response) {
                        if (error.response.status === 401) {
                            ls.set('token', '');
                            ls.set('username', '');
                            ls.set('authSucc', false);
                            ls.set('dataLoad', false);
                            window.location.reload();
                        }
                    }
                });
                setStartDateFilter6('');
                setEndDateFilter6('');
            }
        }
    }

    const validateDate = (startOrEnd, date, value, setDateFilter) => {
       
            if (startOrEnd === 1) {
                if (value !== '') {
                    if (date <= value) {
                        
                        setDateFilter(date);
                    } else {
                        toast.current.clear();
                        toast.current.show({severity:'error', summary: 'Data invalida', detail:'Prima data este mai mare decat a doua, trebuie sa fie mai mica sau egala ca a doua !', life: 5000});
                        setDateFilter(date);
                    }
                } else {
                    setDateFilter(date);
                }
            } 
            if (startOrEnd === 2) {
                if (value !== '') {
                    if (date >= value) {
                        
                        setDateFilter(date);
                    } else {
                        toast.current.clear();
                        toast.current.show({severity:'error', summary: 'Data invalida', detail:'Cea dea doua data este mai mica decat prima, trebuie sa fie mai mare sau egala ca prima !', life: 5000});
                        setDateFilter(date);
                    }
                } else {
                    setDateFilter(date);
                }
            }
    }

    const renderDialog = () => {
        let bodyEventDialog = "";
        if (selectedEvent.hasOwnProperty('title')) {

            if(selectedEvent.extendedProps.type === 1) {
                bodyEventDialog = (
                    <div>
                        <span className="p-float-label">
                            <InputText id="titl" value={selectedEvent['title']} disabled/>
                            <label htmlFor="titl">Titlu</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputText id="prin" value={selectedEvent.extendedProps['first_obj']} disabled/>
                            <label htmlFor="prin">Principiu</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputText id="subprin" value={selectedEvent.extendedProps['second_obj']} disabled/>
                            <label htmlFor="subprin">Sub principiu</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputText id="vol" value={selectedEvent.extendedProps['volume']} disabled/>
                            <label htmlFor="vol">Volum</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputText id="reg" value={selectedEvent.extendedProps['regime']} disabled/>
                            <label htmlFor="reg">Regim de efort</label>
                        </span>
                    </div>
                );
            } else if (selectedEvent.extendedProps.type === 2) {
                bodyEventDialog = (
                    <div>
                        <span className="p-float-label">
                            <InputText id="titl" value={selectedEvent['title']} disabled/>
                            <label htmlFor="titl">Titlu</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputText id="f" value={selectedEvent.extendedProps['formation']} disabled/>
                            <label htmlFor="f">Formatie</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputText id="gt" value={selectedEvent.extendedProps['game_type']} disabled/>
                            <label htmlFor="gt">Tipul meciului</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputText id="oppt" value={selectedEvent.extendedProps['opposite_team']} disabled/>
                            <label htmlFor="oppt">Echipa adversa</label>
                        </span>
                    </div>
                );
            } else if (selectedEvent.extendedProps.type === 3) {
                bodyEventDialog = (
                    <div>
                        <span className="p-float-label">
                            <InputText id="titl" value={selectedEvent['title']} disabled/>
                            <label htmlFor="titl">Titlu</label>
                        </span>
                        <br />
                        <span className="p-float-label">
                            <InputTextarea id="topic" rows={5} cols={30} value={selectedEvent.extendedProps['topic']} disabled autoResize />
                            <label htmlFor="topic">Topic</label>
                        </span>
                    </div>
                );
            }
            
        } 
        
        return (
            bodyEventDialog
        );
    }

    const bodyTemplate = (rowData) => {

        return (
            <div className="p-grid">
                {/* First section */}
                {/* ---------------------------------------------------------------------- */}
                <div className="p-sm-12 p-md-12 p-lg-12">
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <h2 className="section-title"><u>Analiza la nivel de jucator</u></h2>
                    </div>
                    <div className="p-grid">
                            <div className="p-sm-12 p-md-12 p-lg-1">
                                <Button label="Filtrare" onClick={() => filter(1, {'id': rowData.id, 'team_id': rowData.team_id})}/>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" placeholder="Din data" dateFormat="yy-mm-dd" value={startDateFilter1} onChange={(e) => {validateDate(1, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), endDateFilter1, setStartDateFilter1)}} showIcon />
                                </div>
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_5" className="filter" placeholder="Pana in data" dateFormat="yy-mm-dd" value={endDateFilter1} onChange={(e) => {validateDate(2, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), startDateFilter1, setEndDateFilter1)}} showIcon />
                                </div>
                            </div>
                    </div>
                    {/*Display on the chart different parameters about player selected from drop down*/}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <MultiSelect id="selectLabels" filter showClear optionLabel="label" optionValue="value" value={playerLabelsSelected} options={playerLabelsOptions} onChange={(e) => { handleDataChart('jucator', e.value != null ? e.value.sort() : e.value); setPlayerLabelsSelected(e.value != null ? e.value.sort() : e.value);  }} placeholder="Selecteaza un element"/>
                    </div>
                    <div className="p-grid">
                        <div className="p-sm-12 p-md-12 p-lg-6">
                            <Chart type="radar" data={playerChartData} options={lightOptions} />
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the display on the chart the parameters about player*/}
                        
                        {/*Observations and Conclusions sections about player*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-sm-12 p-md-12 p-lg-6">
                            <div className="p-grid">
                                <div className="p-sm-12 p-md-12 p-lg-12">
                                    <h4 className="section-data-title"><u>Observatii medici</u></h4>
                                    <ScrollPanel className="objective-conclusion">
                                        {playerObservation}
                                    </ScrollPanel>
                                </div>
                                <div className="p-sm-12 p-md-12 p-lg-12">
                                    <h4 className="section-data-title"><u>Concluzii</u></h4>
                                    <ScrollPanel className="objective-conclusion">
                                        {playerConclusion}
                                    </ScrollPanel>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the observations and conclusions sections*/}
                    </div>
                    {/* Load/Download Excel Actions */}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <Button className="load-section-btn" label="Adaugare&nbsp;" onClick={() => setDialogShow(true)}><i className="pi pi-plus"></i></Button>
                        <Button className="load-section-btn" label="Descarcare format&nbsp;" onClick={(e) => evaluareITTemplate(evaluareIT,"EVALUARE I+T")}><i className="pi pi-file-excel"></i></Button>
                        <Dialog header="Adauga un excel" visible={dialogShow} resizable modal dismissableMask onHide={() => setDialogShow(false)}>
                            <FileUpload accept="application/vnd.ms-excel" customUpload uploadHandler={(e) => myUpload(e, rowData)} chooseLabel="Adaugare"/>
                        </Dialog>
                        <Toast ref={toast} />
                    </div>
                    {/*-------------------------------------------------------------------*/}
                    {/* End of the Load/Download Excel Actions section */}
                </div>
                {/* ---------------------------------------------------------------------- */}
                {/* End of the First section */}


                 {/* Second section */}
                {/* ---------------------------------------------------------------------- */}
                <div className="p-sm-12 p-md-12 p-lg-12">
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <h2 className="section-title"><u>Planificarea jucatorului</u></h2>
                    </div>
                    <div className="p-grid">
                            <div className="p-sm-12 p-md-12 p-lg-1">
                                <Button label="Filtrare" onClick={() => filter(2, rowData.team_id)}/>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4"className="filter" dateFormat="yy-mm-dd" placeholder="Din data" onChange={(e) => {validateDate(1, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), endDateFilter2, setStartDateFilter2)}} showIcon />
                                </div>
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" dateFormat="yy-mm-dd" placeholder="Pana in data" onChange={(e) => {validateDate(2, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), startDateFilter2, setEndDateFilter2)}} showIcon />
                                </div>
                            </div>
                    </div>
                    {/*Calendar section for set plan for the player*/}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-grid">
                        <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                            <FullCalendar className="calendar" events={events} options={options} />
                            <Dialog visible={showEventDialog} onHide={() => setShowEventDialog(false)} dismissableMask>
                                {renderDialog()}
                            </Dialog>
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the calendar section*/}
                        
                        {/*Display on the chart different key points to improve on a player*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6" style={{paddingRight: '50px'}}>
                            <Chart type="bar" data={microGamesData} options={microGamesOptions} />
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the display on the chart the parameters about player*/}
                    </div>
                    {/* Load/Download Excel Actions */}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <Button className="load-section-btn" label="Adaugare&nbsp;" onClick={() => setDialogShow(true)}><i className="pi pi-plus"></i></Button>
                        <Button className="load-section-btn" label="Descarcare format&nbsp;" onClick={(e) => microjocuriTemplate(microjocuri, "Microjocuri")}><i className="pi pi-file-excel"></i></Button>
                    </div>
                    {/*-------------------------------------------------------------------*/}
                    {/* End of the Load/Download Excel Actions section */}
                </div>
                {/* ---------------------------------------------------------------------- */}
                {/* End of the Second section */}

                 {/* Third section */}
                {/* ---------------------------------------------------------------------- */}
                <div className="p-sm-12 p-md-12 p-lg-12">
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <h2 className="section-title"><u>Analiza antrenamentelor</u></h2>
                    </div>
                    <div className="p-grid">
                            <div className="p-sm-12 p-md-12 p-lg-1">
                                <Button label="Filtrare" onClick={() => filter(3, rowData.id)}/>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" dateFormat="yy-mm-dd" placeholder="Din data" onChange={(e) => {validateDate(1, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), endDateFilter3, setStartDateFilter3)}} showIcon />
                                </div>
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" dateFormat="yy-mm-dd" placeholder="Pana in data" onChange={(e) => {validateDate(2, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), startDateFilter3, setEndDateFilter3)}} showIcon />
                                </div>
                            </div>
                    </div>
                    {/*Chart total RAE indicators section for trainings*/}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-grid">
                        <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                            <div className="p-grid">
                                <div className="p-sm-12 p-md-12 p-lg-6">
                                    <Chart type="doughnut" data={chartDataDoughnutRAntr} options={lightOptionsDoughnutRAntr}/>
                                </div>
                                <div className="p-sm-12 p-md-12 p-lg-6">
                                    <Chart type="doughnut" data={chartDataDoughnutAAntr} options={lightOptionsDoughnutAAntr}/>
                                </div>
                                <div className="p-sm-12 p-md-12 p-lg-6">
                                    <Chart type="doughnut" data={chartDataDoughnutEAntr} options={lightOptionsDoughnutEAntr}/>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the chart RAE indicators section*/}
                        
                        {/*Display on the chart different RAE indicators per trainings*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6" style={{paddingRight: '50px'}}>
                            <Chart type="bar" data={basicDataRAEAntr} options={basicOptions}/>
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the display on the chart different RAE indicators per trainings*/}
                    </div>
                    {/* Load/Download Excel Actions */}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <Button className="load-section-btn" label="Adaugare&nbsp;" onClick={() => setDialogShow(true)}><i className="pi pi-plus"></i></Button>
                        <Button className="load-section-btn" label="Descarcare format&nbsp;"><i className="pi pi-file-excel"></i></Button>
                    </div>
                    {/*-------------------------------------------------------------------*/}
                    {/* End of the Load/Download Excel Actions section */}
                </div>
                {/* ---------------------------------------------------------------------- */}
                {/* End of the Third section */}

                {/* Fourth section */}
                {/* ---------------------------------------------------------------------- */}
                <div className="p-sm-12 p-md-12 p-lg-12">
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <h2 className="section-title"><u>Analiza meciurilor</u></h2>
                    </div>
                    <div className="p-grid">
                            <div className="p-sm-12 p-md-12 p-lg-1">
                                <Button label="Filtrare" onClick={() => filter(4, rowData.id)}/>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" dateFormat="yy-mm-dd" placeholder="Din data" onChange={(e) => {validateDate(1, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), endDateFilter4, setStartDateFilter4)}} showIcon />
                                </div>
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" dateFormat="yy-mm-dd" placeholder="Pana in data" onChange={(e) => {validateDate(2, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), startDateFilter4, setEndDateFilter4)}} showIcon />
                                </div>
                            </div>
                    </div>
                    {/*Chart total RAE indicators section for games*/}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-grid">
                        {/*Display on the chart different RAE indicators per games*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                            <Chart type="bar" data={basicDataRAEGame} options={basicOptions} />
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the display on the chart different RAE indicators per games*/}

                        <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                            <div className="p-grid">
                                <div className="p-sm-12 p-md-12 p-lg-6">
                                    <Chart type="doughnut" data={chartDataDoughnutRGame} options={lightOptionsDoughnutRGame}/>
                                </div>
                                <div className="p-sm-12 p-md-12 p-lg-6">
                                    <Chart type="doughnut" data={chartDataDoughnutAGame} options={lightOptionsDoughnutAGame}/>
                                </div>
                                <div className="p-sm-12 p-md-12 p-lg-6">
                                    <Chart type="doughnut" data={chartDataDoughnutEGame} options={lightOptionsDoughnutEGame}/>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the chart RAE indicators section*/}
                        
                    </div>
                    {/* Load/Download Excel Actions */}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <Button className="load-section-btn" label="Adaugare&nbsp;" onClick={() => setDialogShow(true)}><i className="pi pi-plus"></i></Button>
                        <Button className="load-section-btn" label="Descarcare format&nbsp;"><i className="pi pi-file-excel"></i></Button>
                    </div>
                    {/*-------------------------------------------------------------------*/}
                    {/* End of the Load/Download Excel Actions section */}
                </div>
                {/* ---------------------------------------------------------------------- */}
                {/* End of the Fourth section */}

                {/* Fifth section */}
                {/* ---------------------------------------------------------------------- */}
                <div className="p-sm-12 p-md-12 p-lg-12">
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <h2 className="section-title"><u>Analiza la nivel de echipa</u></h2>
                    </div>
                    <div className="p-grid">
                            <div className="p-sm-12 p-md-12 p-lg-1">
                                <Button label="Filtrare" onClick={() => filter(5, rowData.team_id)}/>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" placeholder="Din data" dateFormat="yy-mm-dd" onChange={(e) => {validateDate(1, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), endDateFilter5, setStartDateFilter5)}} showIcon />
                                </div>
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" placeholder="Pana in data" dateFormat="yy-mm-dd" onChange={(e) => {validateDate(2, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), startDateFilter5, setEndDateFilter5)}} showIcon />
                                </div>
                            </div>
                    </div>
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <MultiSelect id="selectLabels" filter showClear optionLabel="label" optionValue="value" value={teamLabelsSelected} options={teamLabelsOptions} onChange={(e) => {handleDataChart('echipa', e.value != null ? e.value.sort() : e.value); setTeamLabelsSelected(e.value != null ? e.value.sort() : e.value);}} placeholder="Selecteaza un element"/>
                    </div>
                    <div className="p-grid">
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the display on the chart the parameters about player*/}
                        
                        {/*Observations and Conclusions sections about player*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-sm-12 p-md-12 p-lg-6">
                            <div className="p-grid">
                                <div className="p-sm-12 p-md-12 p-lg-12">
                                    <h4 className="section-data-title"><u>Observatii medici</u></h4>
                                    <ScrollPanel className="objective-conclusion">
                                        {teamObservation}
                                    </ScrollPanel>
                                </div>
                                <div className="p-sm-12 p-md-12 p-lg-12">
                                    <h4 className="section-data-title"><u>Concluzii</u></h4>
                                    <ScrollPanel className="objective-conclusion">
                                        {teamConclusion}
                                    </ScrollPanel>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the observations and conclusions sections*/}

                        {/*Display on the chart different parameters about player selected from drop down*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-sm-12 p-md-12 p-lg-6">
                            <Chart type="radar" data={teamChartData} options={lightOptions} />
                        </div>
                         {/*-------------------------------------------------------------------*/}
                        {/*End of the display on the chart the parameters about player*/}
                    </div>
                    {/* Load/Download Excel Actions */}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <Button className="load-section-btn" label="Adaugare&nbsp;" onClick={() => setDialogShow(true)}><i className="pi pi-plus"></i></Button>
                        <Button className="load-section-btn" label="Descarcare format&nbsp;" onClick={(e) => evaluareITTemplate(evaluareIT, "EVALUARE I+T")}><i className="pi pi-file-excel"></i></Button>
                    </div>
                    {/*-------------------------------------------------------------------*/}
                    {/* End of the Load/Download Excel Actions section */}
                </div>
                {/* ---------------------------------------------------------------------- */}
                {/* End of the Fifth section */}

                {/* Sixth section */}
                {/* ---------------------------------------------------------------------- */}
                <div className="p-sm-12 p-md-12 p-lg-12">
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <h2 className="section-title"><u>Evaluarea jucatorului</u></h2>
                    </div>
                    <div className="p-grid">
                            <div className="p-sm-12 p-md-12 p-lg-1">
                                <Button label="Filtrare" onClick={() => filter(6, rowData.id)}/>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" dateFormat="yy-mm-dd" placeholder="Din data" onChange={(e) => {validateDate(1, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), endDateFilter6, setStartDateFilter6)}} showIcon />
                                </div>
                                <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                                    <Calendar id="pr_id_4" className="filter" dateFormat="yy-mm-dd" placeholder="Pana in data" onChange={(e) => {validateDate(2, e.value.toLocaleDateString("en-GB").replaceAll("/","-").split("-").reverse().join("-"), startDateFilter6, setEndDateFilter6)}} showIcon />
                                </div>
                            </div>
                    </div>
                    <div className="p-grid">
                        {/*Display on the chart different fizical indicators of the player*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-col-align-center p-sm-12 p-md-12 p-lg-6">
                            <Chart type="bar" data={stackedDataThreeMonth} options={stackedOptionsThreeMonth} />
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the display on the chart different fizical indicators of the player*/}
                        
                        {/*Observations and Conclusions sections about player*/}
                        {/*-------------------------------------------------------------------*/}
                        <div className="p-sm-12 p-md-12 p-lg-6">
                            <div className="p-grid">
                                <div className="p-sm-12 p-md-12 p-lg-12">
                                    <h4 className="section-data-title"><u>Observatii medici</u></h4>
                                    <ScrollPanel className="objective-conclusion">
                                        {player3MonthObservation}
                                    </ScrollPanel>
                                </div>
                                <div className="p-sm-12 p-md-12 p-lg-12">
                                    <h4 className="section-data-title"><u>Concluzii</u></h4>
                                    <ScrollPanel className="objective-conclusion">
                                        {player3MonthConclusion}
                                    </ScrollPanel>
                                </div>
                            </div>
                        </div>
                        {/*-------------------------------------------------------------------*/}
                        {/*End of the observations and conclusions sections*/}
                    </div>
                    {/* Load/Download Excel Actions */}
                    {/*-------------------------------------------------------------------*/}
                    <div className="p-sm-12 p-md-12 p-lg-12">
                        <Button className="load-section-btn" label="Adaugare&nbsp;" onClick={() => setDialogShow(true)}><i className="pi pi-plus"></i></Button>
                        <Button className="load-section-btn" label="Descarcare format&nbsp;" onClick={(e) => evaluareI3MTemplate(evaluare3M, "EVALUARE la 3 luni")}><i className="pi pi-file-excel"></i></Button>
                    </div>
                    {/*-------------------------------------------------------------------*/}
                    {/* End of the Load/Download Excel Actions section */}
                </div>
                {/* ---------------------------------------------------------------------- */}
                {/* End of the Sixth section */}

            </div>
        );
      };

      const ExpandedBody = () => {

//         setPlayerConclusion("");
//         setTeamConclusion("");

//         setPlayerObservation("");
//         setTeamObservation("");

//         setPlayerValues([{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
//         {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
//     {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
// {label: 'Viteza de executie', database_label: 'VEX', value: 0}]);
//        // handleDataChart('jucator', playerLabelsSelected);


//         setTeamValues([{label: 'Tehnica', database_label: 'Tehnica', value: 0}, {label: 'Tactic defensiv', database_label: 'Tactic defensiv', value: 0}, {label: 'Tactic ofensiv', database_label: 'Tactic ofensiv', value: 0}, {label: 'Emotional', database_label: 'Emotional', value: 0}, {label: 'Fizic', database_label: 'Fizic', value: 0}, {label: 'Pasa scurta+ft', database_label: 'PS_FT', value: 0}, {label: 'Pasa lunga si medie', database_label: 'PL', value: 0}, {label: 'Finalizare', database_label: 'FIN', value: 0}, {label: 'Toate formele', database_label: 'TwoVOne', value: 0}, {label: 'Control balon', database_label: 'COB', value: 0}, {label: 'Marcaj', database_label: 'MAR', value: 0}, {label: 'Repliere', database_label: 'REP', value: 0},
//         {label: 'Dublaj/Acoperire', database_label: 'DUB', value: 0}, {label: 'Anticipatie', database_label: 'ANT', value: 0}, {label: 'TDCapacitate decizionala', database_label: 'TCD', value: 0}, {label: 'Demarcare', database_label: 'DEM', value: 0}, {label: 'Sprijin', database_label: 'SPR', value: 0}, {label: 'Preluare sarcini', database_label: 'PRS', value: 0}, {label: 'TACapacitate decizionala', database_label: 'CD', value: 0},
//     {label: 'Motivatie intrinseca', database_label: 'MOTI', value: 0}, {label: 'Optimism', database_label: 'OPT', value: 0}, {label: 'Fragilitate mentala', database_label: 'FRAM', value: 0}, {label: 'Competenta sociala', database_label: 'CS', value: 0}, {label: 'Prezenta fizica+talie', database_label: 'PFT', value: 0}, {label: 'Viteza', database_label: 'VIT', value: 0}, {label: 'Forta', database_label: 'FORC', value: 0}, {label: 'Rezistenta', database_label: 'REZ', value: 0},
// {label: 'Viteza de executie', database_label: 'VEX', value: 0}]);

//         setPlayerLabelsSelected([]);
//         setTeamLabelsSelected([]);

//         setDataMicroGames([[], [], [], [], []]);
//         setLabelMicroGames([]);
//         setEvents([]);

//         setDataGreenRTrain(0);

//         setDataOrangeRTrain(0);
//         setDataRedRTrain(0);

//         setDataGreenATrain(0);

//         setDataOrangeATrain(0);
//         setDataRedATrain(0);

//         setDataGreenETrain(0);

//         setDataOrangeETrain(0);
//         setDataRedETrain(0);

//         setLabelDatasetTrain1("");
//         setLabelDatasetTrain2("");
//         setLabelDatasetTrain3("");
//         setLabelTrain("");
//         setColorTrain1([]);
//         setColorTrain2([]);
//         setColorTrain3([]);
//         setValuesBarTrain([]);



//         setDataGreenRGame(0);

//         setDataOrangeRGame(0);
//         setDataRedRGame(0);

//         setDataGreenAGame(0);

//         setDataOrangeAGame(0);
//         setDataRedAGame(0);

//         setDataGreenEGame(0);

//         setDataOrangeEGame(0);
//         setDataRedEGame(0);

//         setLabelDatasetGame1("");
//         setLabelDatasetGame2("");
//         setLabelDatasetGame3("");
//         setLabelGame("");
//         setColorGame1([]);
//         setColorGame2([]);
//         setColorGame3([]);
//         setValuesBarGame([]);


//         setPlayer3MonthObservation("");
//         setPlayer3MonthConclusion("");
//         setDataThreeMAsm([[], [], [], [], [], [], [], [], [], []]);  
//         setLabelThreeMAsm([]);   

      }

    return (
        <div className="table_analitics">
            <DataTable className="table-view" value={playerList} expandedRows={expandedRow} onSelectionChange={() => {ExpandedBody()}} rowExpansionTemplate={bodyTemplate} onRowToggle={(e) => {setExpandedRow(e.data)}}>
                <Column field="nr" header="Nr." sortable/>
                <Column field="nationalitate" header="Nationalitate" sortable/>
                <Column field="varsta" header="Varsta" sortable/>
                <Column field="nume" header="Nume Jucator" sortable/>
                <Column field="pozitie" header="Pozitie" sortable/>
                <Column field="data_nasterii" header="Data nasterii" sortable/>
                <Column field="accidentat" header="Accidentat" sortable/>
                <Column expander />
            </DataTable>
        </div>  
    );

};