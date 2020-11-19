import axios from 'axios';
import qs from 'qs';
import * as Config from '../api/Constants';

const restful = axios.create({
    withCredentials: true
}); //Kim: Must set for cors issue.

export const writeMessage = (conversationItem) =>
    restful.post(`${Config.API_URL}/api/message`, conversationItem);

export const listMessages = ({ channelId, userId }) => {
    const queryString = qs.stringify({
        channelId: channelId,
        userId: userId
    });
    return restful.get(`${Config.API_URL}/api/messages?${queryString}`);
};

export const updateMessage = ({ id, content, translateContent }) => 
    restful.put(`${Config.API_URL}/api/message/${id}`, {
        content: content,
        translateContent: translateContent
    });

export const removeMessage = (id) => restful.delete(`${Config.API_URL}/api/message/${id}`);

//login - logout
export const logInUser = (userId) => {
    let formData = new URLSearchParams();
    if(userId.includes(Config.TCS_DOMAIN)){
        formData.append('userId', Config.TCS_DOMAIN); //kim: if TCS user sign-in, proceed with the auth by domain only.
    }else{
        formData.append('userId', userId);
    }
    return restful.post(`${Config.API_URL}/api/login`, formData);
}
export const logOutUser = () => restful.get(`${Config.API_URL}/api/logout`);