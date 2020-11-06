import * as Config from '../api/Constants'
//import { getBackTrackConversation } from '../api/ConversationHistory.js';

export const timeStamp = function(){
    const timestampNow = Date().now;
    const timestamp = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric', 
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(timestampNow);
    return timestamp
  }

// export const saveTextArea = (channelId, firstTabSrcValues, secondTabSrcValues) =>{
//     let save_data = Config.TITLE_SAVE_ONE;
//     //Kim: Add userId in text
//     firstTabSrcValues.map((item) => {
//         save_data += `${item.timestamp} ${item.conversationText} <${item.userId}>`;
//         save_data += '\r\n';
//         save_data += `${item.timestamp} ${item.translateText} <${item.userId}>`;
//         save_data += '\r\n';
//         return save_data;
//     })
    
//     save_data += '\r\n';
//     save_data += Config.TITLE_SAVE_TWO;
//     secondTabSrcValues.map((item) => {
//         save_data += `${item.timestamp} ${item.conversationText} <${item.userId}>`;
//         save_data += '\r\n';
//         save_data += `${item.timestamp} ${item.translateText} <${item.userId}>`;
//         save_data += '\r\n';
//         return save_data;
//     })

//     save_data += '\r\n';
//     save_data += Config.TITLE_BACKTRACK;
//     getBackTrackConversation(channelId).map((item) => {
//         save_data += `${item.timestamp} ${item.conversationText} <${item.userId}>`;
//         save_data += '\r\n';
//         return save_data;
//     })

//     SaveRecordToFile(save_data, Config.SAVE_FILE_NAME);
// }

export const SaveRecordToFile = (save_data, save_file_name) => {
    const timestampNow = Date().now;
    const timestamp = new Intl.DateTimeFormat('ja-JP', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestampNow)

    if(save_data){
        const element = document.createElement("a");
        const file = new Blob([save_data], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = save_file_name + timestamp + Config.SAVE_FILE_EXTENSION;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
}