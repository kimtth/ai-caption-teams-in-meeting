import { timeStamp } from '../util/Util'
import uuid from 'react-uuid'

export default function Conversation(userId, content, translateContent, channelId, metadata) {
    this.key = 0;
    this.userId = '';
    this.timestamp = '';
    this.content = '';
    this.translateContent = '';
    this.channelId = '';
    this.metadata = '';

    this.init = function() {
        this.key = uuid();
        this.userId = userId;
        this.timestamp = timeStamp();
        this.content = content;
        this.translateContent = translateContent;
        this.channelId = channelId;
        this.metadata = metadata;
    }

    this.init();
}