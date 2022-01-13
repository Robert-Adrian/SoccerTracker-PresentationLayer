import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getDataByIdBetweenDates = async (token, id, team_id, startDate, endDate) => {
  
   // console.log(userName + " " + pass);
     return axiosInstance.get('/assessment/getDataByIdBetweenDates/'+ id + '/' + team_id + '/' + startDate + '/' + endDate, {
         headers: getDefaultHeader(token)
     })
     .then(response => {
        
        return response.data;
      }); 
      
};