import axios from "axios";
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllFullDataUsers = (token) => {
    return axiosInstance.get('/users/getAllFullDataUsers', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
};