import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllPersons = async (token) => {
  
   // console.log(userName + " " + pass);
     return await axiosInstance.get('/person/getAll', {
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};