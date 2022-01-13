import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllPlayPost = async (token) => {
  
   // console.log(userName + " " + pass);
     return axiosInstance.get('/playpost/getAll', {
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};