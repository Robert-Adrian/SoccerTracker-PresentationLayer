import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const updateFormation = async (token, formation_id_val, formation_desc_val) => {
  
    
     return axiosInstance.put('/formation/update', {
        
            formation_id : formation_id_val,
            formation_desc : formation_desc_val
        
     },{
         headers: getDefaultHeader(token)
     })
     .then(response => {
        return response.data;
      }); 
      
};