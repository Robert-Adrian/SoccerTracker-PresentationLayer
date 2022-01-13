import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllPrefferedFoot = async (token) => {
  
   // console.log(userName + " " + pass);
     return axiosInstance.get('/prefferedfoot/getAll', {
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};