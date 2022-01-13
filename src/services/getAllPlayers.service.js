import React from 'react';
import axios from 'axios';
import { Items } from '../hooks/user.hook.js';
import {getDefaultHeader} from '../constants/RESTApiData';
import axiosInstance from "../helpers/axios";

export const getAllPlayers = async (token) => {
   return axiosInstance.get('/player/getAll', {
      headers: getDefaultHeader(token)
   })
   .then(response => {
     return response.data;
   });
};