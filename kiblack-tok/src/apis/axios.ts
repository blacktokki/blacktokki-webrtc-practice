import axios, { AxiosRequestConfig } from 'axios';


export const defaultOption:AxiosRequestConfig = {
    baseURL: 'http://localhost:9000/messenger/',
    withCredentials: true
};

const _axios = axios.create(defaultOption);

_axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

_axios.interceptors.response.use(
    response => {
        // if((response.request.responseURL as string).indexOf('/task/login')>=0 && response.data.length != 0){
        //     // redirect login
        // }
        return response;
    },
    error => {
        if (error.response.status === 401) {
            // redirect login
        }
        return Promise.reject(error)
    }
)

export default _axios
