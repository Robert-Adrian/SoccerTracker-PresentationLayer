import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const deleteDocument = async (token, doc_id) => {
    try {
        const resp = await axiosInstance.delete('/document/delete/' + doc_id,
            {
                headers: getDefaultHeader(token)
            }
        );
        
        if (resp.status === 200 || resp.status === 404)
            return true;
    }
    catch(error) {
        console.log(error);
    }
    return false;
}