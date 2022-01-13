import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getCoachByUserId = async (token, user_id) => {
	try {
		const resp = await axiosInstance.get('/coach/getById/' + user_id,
			{
				headers: getDefaultHeader(token)
			}
		);

		if (resp.status === 200 && resp.data) {
			return true;
		}
	}
	catch(error) {
		console.log(error);
	}

	return false;
}