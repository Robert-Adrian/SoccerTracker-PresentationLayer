import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getPersonsByUserId = async (token, users_ids) => {
	try {
		const resp = await axiosInstance.post('/person/users_ids',
			{
				vector: users_ids
			},
			{
				headers: getDefaultHeader(token)
			}
		);
		
		if (resp.status === 200 && resp.data)
			return resp.data;
	}
	catch(error) {
		console.log(error);
	}
	return [];
}