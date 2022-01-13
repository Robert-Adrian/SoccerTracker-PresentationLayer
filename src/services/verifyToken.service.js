import axios from 'axios';
import axiosInstance from "../helpers/axios";

export const verifyToken = async (token_user) => {
  
   // console.log(userName + " " + pass);
     return axiosInstance.post('/verifyToken', {
        token: token_user
     })
     .then(response => {
       
        return response.data;
      }); 
      
};