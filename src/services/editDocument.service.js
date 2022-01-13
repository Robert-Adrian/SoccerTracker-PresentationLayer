import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const editDocument = async (token, doc, changes) => {
	try {
		const resp = await axiosInstance.post('/document/update',
			{
				document_id: doc.document_id,
				player_id: doc.player_id,
				document_type_id: doc.document_type_id,
				document_name: changes.document_name,
				document_path: changes.document_path,
				creation_date: doc.creation_date.replace(' ','T').concat('.000'),
				team_id: doc.team_id
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
	return false;
}