import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllPlayerResultsByGameId = async (token, game_id) => {
    try {
        const resp = await axiosInstance.get('/playergameresult/all/' + game_id, {
            headers: getDefaultHeader(token)
        });
        if (resp.status === 200 && resp.data)
            return resp.data;
    }
    catch(error) {
        console.log(error);
    }
    return [];
};