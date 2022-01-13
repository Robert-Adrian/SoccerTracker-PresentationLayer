import axios from 'axios';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const updatePersonData = async (token, person_id_val, user_id_val, firstname_val, lastname_val, email_val, phone_val, cnp_val, nationalitate_val, birthdate_val, address_val) => {
  
    
     return axiosInstance.put('/person/update', {
        
            person_id : person_id_val,
            user_id : user_id_val,
            firstname: firstname_val,
            lastname: lastname_val,
            email: email_val,
            phone: phone_val,
            pic_cnp: cnp_val,
            nationality: nationalitate_val,
            birthdate: birthdate_val,
            full_address: address_val
        
     },{
         headers: getDefaultHeader(token)
     })
     .then(response => {
        return response.data;
      }); 
      
};