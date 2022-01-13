import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const createAssessment = async (token, list) => {
   
     return await axiosInstance.post('/assessment/create', list,{
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};