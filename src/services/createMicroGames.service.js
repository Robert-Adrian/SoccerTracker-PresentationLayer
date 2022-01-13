import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const createMicroGames = async (token, microgamesList) => {
  
   
     return axiosInstance.post('/microgames/create', microgamesList, {
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};