import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllUsersByTeamId = async (token, team_id) => {
	try {
		const resp = await axiosInstance.get('/usermap/users/' + team_id, {
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