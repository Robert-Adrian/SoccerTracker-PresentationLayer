import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllFormations = async (token) => {
  
   // console.log(userName + " " + pass);
     return await axiosInstance.get('/formation/getAll', {
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};