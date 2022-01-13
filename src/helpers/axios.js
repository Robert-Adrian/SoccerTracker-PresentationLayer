import axios from 'axios';
import ls from 'local-storage';

let headers = {};

if(ls.get('token')) {
    headers.Authorization = `Bearer ${ls.get('token')}`;
}

const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV == null || process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL: window._env_.REACT_APP_API_URL,
    headers,
});

export default axiosInstance;