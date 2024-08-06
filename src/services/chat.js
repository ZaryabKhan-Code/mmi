import axios from "axios";
const BASE_URL = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/chat";


export const AddMessage = (token, data) => {
    return axios.post(`${BASE_URL}/add_message`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },

    });
};