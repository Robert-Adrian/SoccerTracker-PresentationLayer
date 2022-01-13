import React, {useEffect, useRef, useState} from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Button } from 'primereact/button';
import ls from 'local-storage';
import { InputNumber } from 'primereact/inputnumber';
import { ColorPicker } from 'primereact/colorpicker';
import { FileUpload } from 'primereact/fileupload';
import '../styles/Schematics.css';
import { withRouter } from 'react-router';
import field from '../img/field.jpg';
import { Toast } from 'primereact/toast';

function Schematics() {
    const [refCanvas, setRefCanvas] = useState(null);
    const [loadData, setLoadData] = useState("");
    const [widthPen, setWidthPen] = useState(2);
    const [colorPen, setColorPen] = useState("00000");
    const [fileDownloadUrl, setFileDownloadUrl] = useState("");
    const toastRef = useRef(null);
    let downloadAnchor = useRef(null);


    useEffect(() => {
        if (fileDownloadUrl !== "")
            downloadAnchor.click();
        setFileDownloadUrl("");
    }, [fileDownloadUrl])

    const download = (e) => {
        e.preventDefault();
        let output = loadData.toString();
        const blob = new Blob([output]);
        const fileURL = URL.createObjectURL(blob);
        setFileDownloadUrl(fileURL);
        if (toastRef !== null) {
            toastRef.current.clear();
            toastRef.current.show({life: 5000, severity: 'success', summary: 'Descarcare cu succes', detail: 'Descarcarea a avut loc cu succes !'});
        }
        //URL.revokeObjectURL(fileURL);
    };  

    const parserFiles = (e) => {
        let file = e.files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
            setLoadData("");
            refCanvas.loadSaveData(e.target.result, true);
        }
        reader.readAsText(file);
        
    };

    const loading = (value) => {
        if (value !== "" && value !== undefined && value !== null) {
            refCanvas.loadSaveData(value, true);
            if (toastRef !== null) {
                toastRef.current.clear();
                toastRef.current.show({life: 5000, severity: 'success', summary: 'Incarcare cu succes', detail: 'Incarcarea a avut loc cu succes !'});
            }
        }
    };

    const clearData = () => {
        refCanvas.clear();
        setLoadData("");
        if (toastRef !== null) {
            toastRef.current.clear();
            toastRef.current.show({life: 5000, severity: 'success', summary: 'Stergere cu succes', detail: 'Stergerea a avut loc cu succes !'});
        }
    };

    const saveData = () => {
        ls.set('savedDrawing', loadData);
        if (toastRef !== null) {
            toastRef.current.clear();
            toastRef.current.show({life: 5000, severity: 'success', summary: 'Salvare cu succes', detail: 'Salvarea a avut loc cu succes !'});
        }
    }
    return (
        <div className="Schematics">
            <div className="p-grid" style={{width: '100%', height: '100%'}}>
                <div className="p-col-6 p-md-6 p-lg-12">
                    <Button className="draw-command" label="Incarcare" style={{margin: '10px'}} onClick={() => loading(ls.get('savedDrawing'))}/>
                    <Button className="draw-command" label="Salvare" style={{margin: '10px'}} onClick={() => { saveData() }}/>
                    <Button className="draw-command" label="Stergere" style={{margin: '10px'}} onClick={() => clearData()}/>
                    <Button className="draw-command" label="Inapoi" style={{margin: '10px'}} onClick={() => {refCanvas.undo()}}/>
                    <label htmlFor="minmax-buttons" style={{color: 'black', margin: '10px'}}>Grosime pensula: </label>
                    <InputNumber id="minmax-buttons" value={widthPen} style={{margin: '10px'}} onValueChange={(e) => setWidthPen(e.value)} showButtons min={2} max={20} />
                    <br />
                    <label htmlFor="color-brush" style={{color: 'black', margin: '10px'}}>Culoare pensula: </label>
                    <ColorPicker id="color-brush" style={{margin: '10px'}} value={colorPen} onChange={(e) => setColorPen(e.value)}></ColorPicker>
                    <Button className="draw-command" style={{margin: '10px'}} onClick={download}>Export</Button>
                    <a download={"schema_soccertracker.txt"} href={fileDownloadUrl} ref={(e) => downloadAnchor = e}></a>
                    <FileUpload mode="basic" accept="text/*" label="Import" chooseLabel="Import" onSelect={(e) => parserFiles(e)} className="p-mr-2 p-d-inline-block"/>
                    <Toast ref={toastRef} />
                </div>
                <div className="p-col-12" style={{height: '90%'}}>
                    <CanvasDraw ref={canvas => setRefCanvas(canvas)} imgSrc={field} onChange={(e) => setLoadData(refCanvas.getSaveData())} style={{margin: '20px', boxShadow: '0 0 20px grey', position: 'relative'}} loadTimeOffset={0} brushColor={"#" + colorPen} brushRadius={widthPen} lazyRadius={0} canvasHeight="92%" canvasWidth="70%" />
                </div>
            </div>
        </div>  
    );
}

export default withRouter(Schematics);