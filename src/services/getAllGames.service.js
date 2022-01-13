import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllGames = async (token) => {
	try {
		const resp = await axiosInstance.get('/game/getAll', {
			headers: getDefaultHeader(token)
		});
		
		if (resp.status === 200 && resp.data)
			return resp.data;
	}
	catch(error) {
		console.log(error);
	}
	console.log('aici');
	return [];
};