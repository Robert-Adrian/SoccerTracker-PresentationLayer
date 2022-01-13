import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const deleteFormation = async (token, formation_desc_val) => {
  
    
     return await axiosInstance.delete('/formation/delete/' + formation_desc_val,{
         headers: getDefaultHeader(token)
     })
     .then(response => {
       
        return response.data;
      }); 
      
};