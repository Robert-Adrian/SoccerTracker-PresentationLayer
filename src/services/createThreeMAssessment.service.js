import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const createThreeMAssessment = async (token, list) => {
   
     return axiosInstance.post('/threemonthassessment/create', list ,{
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};