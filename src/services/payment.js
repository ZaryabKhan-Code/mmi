import axios from "axios";
const BASE_URL = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/user";
export const AddCard = (token, data) => {
    return axios.post(`${BASE_URL}/add-card`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};


export const GetAllCard = (token, data) => {
    return axios.get(`${BASE_URL}/payment-methods/${data}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const DeleteCard = (token, data) => {
    return axios.delete(`${BASE_URL}/payment-methods/${data}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};