import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const updatePlayer = async (token, p_person_id, p_firstname, p_lastname, p_email, p_phone, p_cnp, p_nationalit, p_birthdate, p_full_address, p_team_history, p_coach_history, p_licenc, p_play_post_id, p_preffered_foot_id, p_shirt_number, p_weight, p_height, p_injured) => {
      
     return axiosInstance.put('/player/update',{

      person_id: p_person_id,
      firstname: p_firstname,
      lastname: p_lastname,
      email: p_email,
      phone: p_phone,
      pic_cnp: p_cnp,
      nationality: p_nationalit,
      birthdate: p_birthdate,
      full_address: p_full_address,
      team_history: p_team_history,
      coach_history: p_coach_history,
      licence: p_licenc,
      play_post_id: p_play_post_id,
      preffered_foot_id: p_preffered_foot_id,
      shirt_number: p_shirt_number,
      weight: p_weight,
      height: p_height,
      injured: p_injured

     },
     {
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};