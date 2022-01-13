import axios from "axios"
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllGameTypes = (token) => {
    return axiosInstance.get('/gametype/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e)
    })
}