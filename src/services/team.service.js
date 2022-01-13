import axios from "axios"
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllTeams = (token) => {
    return axiosInstance.get('/team/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
};

export const createTeam = (token, teamObj) => {
    return axiosInstance.post('/team/create', teamObj, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const updateTeam = (token, teamObj) => {
    return axiosInstance.put('/team/update', teamObj, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const deleteTeam = (token, teamId) => {
    return axiosInstance.delete('/team/delete/'+teamId, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}