import axios from "axios";
const BASE_URL = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/expert_user_dashboard";
const BASE_URL_2 = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/user";
const BASE_URL_3 = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/notification/user";

export const UserNotifications = (token, Id) => {
    return axios.get(`${BASE_URL_3}/active_session`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: { userId: Id }
    });
};

export const ForgetPassword = (data, token) => {

    return axios.post(`${BASE_URL}/change_password`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};
export const ExpertProfile = (token, filter) => {

    return axios.get(`${BASE_URL}/get_all_experts`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: { tags: filter }
    });
};


export const ExpertFavProfile = (token) => {
    return axios.get(`${BASE_URL}/get_all_fav_experts`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
};

export const ExpertSingleProfile = (token, id) => {
    return axios.get(`${BASE_URL}/get_expert`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: { userId: id }
    });
};

export const UpdateUserProfile = (token, data) => {
    return axios.put(`${BASE_URL_2}/update_profile`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },

    });
};


export const ExpertLike = (token, data) => {
    return axios.post(
        `https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/like?userId=${data.userId}&expertUserId=${data.expertId}`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

