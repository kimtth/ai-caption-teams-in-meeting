import { delay,isServiceBusError,ServiceBusClient } from '@azure/service-bus'
import {parse, stringify} from 'flatted';
import * as Config from './Constants'

const sbClient = new ServiceBusClient(Config.SERVICE_BUS_CONNECTION_STRING);
const sender = sbClient.createSender(Config.QUEUE_NAME);
const receiver = sbClient.createReceiver(Config.QUEUE_NAME)


export async function serviceBusPublisher(conversationItem) {
    const message = {
        body: `"${JSON.stringify(conversationItem)}"`
    };

    try {
        await sender.sendMessages(message);
        console.log('send message end');
    } catch (e) {
        console.log("Error occurred: ", e);
    }
}

export async function serviceBusSubscribeOneMessage(userId, meetingId, callback) {
    const messages = await receiver.receiveMessages(1);
    console.log("Received messages:");
    messages.map(message => console.log(message.body));
}

//Kim: ?? not working
export async function serviceBusSubscribe(userId, meetingId, callback) {
    // function to handle messages
    const messageHandler = async (message) => {
        //console.log(stringify(message))
        console.log(`Received message: ${message.body}`, typeof message.body);
        try {
            const msg = JSON.parse(message.body.toString());
            if (msg.channelId === meetingId && msg.userId !== userId) {
                callback(msg);
            }
        } catch (e) {
            console.log(`Error ${e} occurred: `)
        }
    };

    // function to handle any errors
    const errorHandler = async (e) => {
        console.log(`Error from source ${e.errorSource} occurred: `, e.error);

        if (isServiceBusError(e.error)) {
            switch (e.error.code) {
                case "MessagingEntityDisabled":
                case "MessagingEntityNotFound":
                case "UnauthorizedAccess":
                    console.log(`An unrecoverable error occurred. Stopping processing.`)
                    break;
                case "MessageLockLost":
                    console.log(`Message lock lost for message`, args.error);
                    break;
                case "ServiceBusy":
                    await delay(1000);
                    break;
            }
        }
    };

    // subscribe and specify the message and error handlers
    receiver.subscribe({
        processMessage: messageHandler,
        processError: errorHandler
    });
}

export async function serviceBusClearProcessBeforeLoad() {
    await delay(2000);

    await receiver.close();
    await sender.close();
    await sbClient.close();
}