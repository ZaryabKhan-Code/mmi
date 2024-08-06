import axios from "axios";
const BASE_URL = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/session";

export const GetAllBookedSesssion = (token, id) => {
    return axios.get(`${BASE_URL}/booked_session/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
};

export const GetAllSesssion = (token, id) => {
    return axios.get(`${BASE_URL}/all-session/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
};


export const GetCreditStatus = (token, userId, creditId) => {
    return axios.get(`${BASE_URL}/credit_status?userId=${userId}&creditId=${creditId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
};


export const GetSessionWithType = (token, id, type) => {
    return axios.get(`${BASE_URL}/session_type/?userId=${id}&type=${type}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
};