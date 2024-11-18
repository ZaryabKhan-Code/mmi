import axios from "axios";
const BASE_URL = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/chat";
const BASE_URL_2 = "https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/assistant_chat";

export const SendMessage = (token, data) => {
    return axios.post(`${BASE_URL_2}/add_message`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const GetSingleAssistant = (token, assistantId) => {
    return axios.get(`${BASE_URL_2}/single_assistant/${assistantId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


export const GetChatRoomId = (token, userId, assistantId) => {
    return axios.get(`${BASE_URL_2}/get_chatroom_id?userId=${userId}&assistantId=${assistantId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};



export const GetConverstation = (token, chatRoomId) => {
    return axios.get(`${BASE_URL_2}/get_messages?chatRoomId=${chatRoomId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const GetAllAssistant = (token) => {
    return axios.get(`${BASE_URL_2}/all_assistant`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


export const AddMessage = (token, data) => {
    return axios.post(`${BASE_URL}/add_message`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    });
};