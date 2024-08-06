import axios from "axios";
const BASE_URL = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/user";


export const ForgetPasswordGetToken = (data) => {
    return axios.post(`${BASE_URL}/forget_password?email=${data}`, {
    });
};

export const VerifyForgetPasswordToken = (token) => {
    return axios.get(`${BASE_URL}/getverify`, {
        params: {
            token: token
        }
    });
};
export const ForgetPassword = (data) => {
    return axios.post(`${BASE_URL}/forget_change_password`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
export const RegisterUserPost = (data) => {
    return axios.post(`${BASE_URL}/signup`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const LoginUserPost = (data) => {
    return axios.post(`${BASE_URL}/login`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
