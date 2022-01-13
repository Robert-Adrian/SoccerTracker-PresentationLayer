import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getDocumentsByPlayerId = async (token, player_id) => { 
	try {
		const resp = await axiosInstance.get('/document/all/' + player_id, {
			headers: getDefaultHeader(token)
		});
		
		if (resp.status === 200 && resp.data && resp.data.length > 0)
			return resp.data;
	}
	catch(error) {
		console.log(error);
	}
	return [];
};