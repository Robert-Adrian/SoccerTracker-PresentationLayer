import React, { useState, useEffect, useRef } from 'react';
import '../styles/Profile.css';
import { withRouter } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Calendar } from 'primereact/calendar';
import 'primeflex/primeflex.css';
import { getAllPersons } from '../services/getAllPersons.service';
import { updatePersonData } from '../services/updatePersonData.service';
import ls from 'local-storage';
import { Toast } from 'primereact/toast';
 

function Profile() {
    const [id, setId] = useState(0);
    const [nume, setNume] = useState("");
    const [prenume, setPrenume] = useState(""); 
    const [email, setEmail] = useState("");
    const [telefon, setTelefon] = useState("");
    const [cnp, setCnp] = useState("");
    const [nationalitate, setNationalitate] = useState("");
    const [dataNasterii, setDataNasterii] = useState("");
    const [adresa, setAdresa] = useState("");
    const toastRef = useRef(null);

    useEffect(() => {
        getAllPersons(ls.get('token')).then(result => {
            if (result !== null && result !== undefined && result !== "") {
                result.forEach((item) => {
                    if (item['user_id'] === ls.get("user_id")) {
                        setNume(item['firstname']);
                        setPrenume(item['lastname']);
                        setEmail(item['email']);
                        setTelefon(item['phone']);
                        setCnp(item['pic_cnp']);
                        setNationalitate(item['nationality']);
                        setDataNasterii(item['birthdate']);
                        setAdresa(item['full_address']);
                        setId(item['person_id']);
                    }
                });
            }
        }).catch(function(error) {
            if(error.response.status === 401) {
                ls.set('token', '');
                ls.set('username', '');
                ls.set('authSucc', false);
                ls.set('dataLoad', false);
                window.location.reload();
            }
        });
    }, []);

    const updateData = (e) => {
      
        updatePersonData(ls.get('token'), id, ls.get('user_id'), nume, prenume, email, telefon, cnp, nationalitate, dataNasterii, adresa).then((result) => {
            if (toastRef !== null) {
                toastRef.current.clear();
                toastRef.current.show({life: 5000, severity: 'success', summary: 'Modifcare cu succes !', detail: 'Datele au fost modificate cu succes !'});
            }
        }).catch((error) => {
            if(error.response.status === 401) {
                ls.set('token', '');
                ls.set('username', '');
                ls.set('authSucc', false);
                ls.set('dataLoad', false);
                window.location.reload();
            }
        });
      
    }

        return (
            <div id="profile" className="Profile">
                <div className="form" >
                        <Avatar id="avatar" label="P" className="p-mr-2" size="xlarge" shape="circle" />
                        <div className="p-fluid">
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col">
                                    <label htmlFor="firstname2">Nume</label>
                                    <InputText value={nume === undefined || nume === null ? "" : nume} onChange={(e) => setNume(e.target.value)} id="firstname2" type="text"/>
                                </div>
                                <div className="p-field p-col">
                                    <label htmlFor="lastname2">Prenume</label>
                                    <InputText value={prenume === undefined || prenume === null ? "" : prenume} onChange={(e) => setPrenume(e.target.value)} id="lastname2" type="text"/>
                                </div>
                            </div>
                            <div className="p-field">
                                <label htmlFor="email">Email</label>
                                <InputText value={email === undefined || email === null ? "" : email} onChange={(e) => setEmail(e.target.value)} id="email" type="text"/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="telefon">Telefon</label>
                                <InputText value={telefon === undefined || telefon === null ? "" : telefon} onChange={(e) => setTelefon(e.target.value)} id="telefon" type="text"/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="cnp">CNP</label>
                                <InputText value={cnp === undefined || cnp === null ? "" : cnp} onChange={(e) => setCnp(e.target.value)} id="cnp" type="text"/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="adresa">Adresa</label>
                                <InputText value={adresa === undefined || adresa === null ? "" : adresa} onChange={(e) => setAdresa(e.target.value)} id="adresa" type="text"/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="nationalitate">Nationalitate</label>
                                <InputText value={nationalitate === undefined || nationalitate === null ? "" : nationalitate} onChange={(e) => setNationalitate(e.target.value)} id="nationalitate" type="text"/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="nastere">Data Nasterii</label>
                                <Calendar dateFormat="yy-mm-dd" value={new Date(dataNasterii)} yearRange="1900:2021" yearNavigator={true} onChange={(e) => { setDataNasterii(e.value)}} id="nastere" showIcon />
                            </div>
                        </div>
                        <Button id="btn-save" type="button" label="Salvare" onClick={(e) => updateData(e)}/>
                </div>
                <Toast ref={toastRef}/>
            </div>
        );
}

export default withRouter(Profile);