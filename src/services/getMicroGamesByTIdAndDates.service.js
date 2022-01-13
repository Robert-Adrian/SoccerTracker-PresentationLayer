import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getMicroGamesByTIdAndDates = async (token, id, startDate, endDate) => {
  
   // console.log(userName + " " + pass);
     return axiosInstance.get('/microgames/getDataByTeamIdBetweenDates/'+ id + '/' + startDate + '/' + endDate, {
         headers: getDefaultHeader(token)
     })
     .then(response => {
        
        return response.data;
      }); 
      
};