import axios from 'axios';
import qs from 'qs';
import * as Config from '../api/Constants';

const restful = axios.create({ withCredentials: true }); //Kim: Must set for cors issue.

export const writeMessage = (conversationItem) =>
    restful.post(`${Config.API_URL}/api/message`, conversationItem);

export const listMessages = ({ channelId, userId }) => {
    const queryString = qs.stringify({
        channelId: channelId,
        userId: userId
    });
    return restful.get(`${Config.API_URL}/api/messages?${queryString}`);
};

export const updateMessage = ({ id, content }) =>
    restful.put(`${Config.API_URL}/api/message/${id}`, {
        content,
    });

export const updateTranslateMessage = ({ id, translateContent }) =>
    restful.put(`${Config.API_URL}/api/message/${id}`, {
        translateContent,
    });

export const removeMessage = (id) => restful.delete(`${Config.API_URL}/api/message/${id}`);

//login - logout
export const logInUser = ({ userId }) => {
    return restful.post(`${Config.API_URL}/api/login`, { userId });
}
export const logOutUser = () => restful.get(`${Config.API_URL}/api/logout`);