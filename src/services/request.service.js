import React from 'react';
import axios from 'axios';
import {originAPI} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getRequest = async () => {
     return axiosInstance.get('http://localhost:8080/sample/getAll').then(response => {
        
       
        return response.data;
      })
      .catch(function(error){
  
      }); 
      
};