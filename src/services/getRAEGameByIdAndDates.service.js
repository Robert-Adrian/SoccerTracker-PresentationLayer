import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getRAEGameByIdAndDates = async (token, id, startDate, endDate) => {
  
   // console.log(userName + " " + pass);
     return axiosInstance.get('/raegames/getDataByIdBetweenDates/'+ id + '/' + startDate + '/' + endDate, {
         headers: getDefaultHeader(token)
     })
     .then(response => {
        
        return response.data;
      }); 
      
};