import axios from "axios";
const BASE_URL = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/cart";

export const CreateCart = (token, data) => {
    return axios.post(`${BASE_URL}/create_or_update_cart`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const UpdateCart = (token, data) => {
    return axios.put(`${BASE_URL}/update_cart`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    });
};


export const GetTotalCartItem = (token, data) => {
    return axios.get(`${BASE_URL}/get_cart_items/${data}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const GetCart = (token, data) => {
    return axios.get(`${BASE_URL}/get_cart/${data}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


export const DeleteSignleItemCart = (token, data) => {
    return axios.delete(`${BASE_URL}/delete_experts`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: data
    });
};


export const DeleteAllItemCart = (token, data) => {
    return axios.delete(`${BASE_URL}/delete_cart/${data}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};