import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const deletePlayer = async (token, p_person_id, p_user_id, p_team_id) => {
  
    
     return axiosInstance.delete('/player/delete',
     {
         headers: getDefaultHeader(token),
         data: {
            person_id: p_person_id,
            user_id: p_user_id,
            team_id: p_team_id
         }
     })
     .then(response => {
       
        return response.data;
      }); 
      
};