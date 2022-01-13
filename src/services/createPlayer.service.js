import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const createPlayer = async (token, p_username, p_password, p_active_id, p_role_id, p_firstname, p_lastname, p_email, p_phone, p_pic_cnp, p_nationality, p_birthdate, p_full_address, p_team_history, p_coach_history, p_licence, p_play_post_id, p_preffered_foot_id, p_shirt_number, p_weight, p_height, p_injured, p_team_id, p_join_date, p_expiry_date) => {
  
   
     return axiosInstance.post('/player/create', {
        username: p_username, 
        password: p_password, 
        active_id: p_active_id,
        role_id: p_role_id,
        firstname: p_firstname, 
        lastname: p_lastname, 
        email: p_email, 
        phone: p_phone, 
        pic_cnp: p_pic_cnp, 
        nationality: p_nationality, 
        birthdate: p_birthdate, 
        full_address: p_full_address, 
        team_history: p_team_history, 
        coach_history: p_coach_history, 
        licence: p_licence, 
        play_post_id: p_play_post_id, 
        preffered_foot_id: p_preffered_foot_id, 
        shirt_number: p_shirt_number, 
        weight: p_weight, 
        height: p_height, 
        injured: p_injured, 
        team_id: p_team_id, 
        join_date: p_join_date, 
        expiry_date: p_expiry_date
     },{
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};