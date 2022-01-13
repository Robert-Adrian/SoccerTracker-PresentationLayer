import React from 'react';
import axios from 'axios';
import {Items} from '../hooks/user.hook.js';
import {getDefaultHeader} from '../constants/RESTApiData.js';
import ls from "local-storage";
import axiosInstance from "../helpers/axios";

export const authUser = async (userName, pass) => {
    return axiosInstance.post('/authenticate', {
        username: userName,
        password: pass
    })
        .then(response => {
            return response.data;
        }).catch(err => {
            console.log(err);
        });
};
