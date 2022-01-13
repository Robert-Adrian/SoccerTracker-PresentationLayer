import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const createDocument = async (token, doc) => {
    try {
        const resp = await axiosInstance.post('/document/create',
            {
                player_id: doc.player_id,
                document_type_id: doc.document_type_id,
                document_name: doc.document_name,
                document_path: doc.document_path,
                creation_date: doc.creation_date,
                team_id: doc.team_id
            },
            {
                headers: getDefaultHeader(token)
            }
        );

        if (resp.status === 200 && resp.data)
            return resp.data;
    } catch (error) {
        console.log(error);
    }
    return undefined;
}