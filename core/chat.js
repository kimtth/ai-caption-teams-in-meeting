const socketIo = require("socket.io");

let Channels = {}

const socketJS = function (server, port) {
    const io = socketIo(server, {
        pingInterval: 25000, // 25 seconds,
        pingTimeout: 3600000 // default 1 minute / set 1 hour
    });
    //io.set("transports", ["websocket"]);

    io.on('connection', function (socket) {
        socket.on("join", (userid, channelid) => {
            try {
                console.log("join", userid, channelid, socket.id)
                socket.join(channelid);
            } catch (error) {
                console.log('join-socket', error)
            }
        });

        socket.on("message", (messageObject, channelid) => {
            try {
                //To paticipants
                socket.broadcast.to(channelid).emit('message-client', messageObject);
            } catch (error) {
                console.log('message-socket', error)
            }
        });

        socket.on("remove-event", () => {
            //Kim: for preventing mutiple connections
            //https://stackoverflow.com/questions/52138337/socket-io-makes-multiple-connections-when-the-page-is-refreshed-node-js
            socket.removeAllListeners();
        })

        socket.on('disconnect', () => {
            console.log('disconnect', socket.id)
        });

        socket.on('disconnecting', (reason) => {
            try {
                //Kim: Update UserList when unexpected events such as browser refresh and browser close are triggered.
                console.log('disconnecting:', reason)
            } catch (error) {
                console.log('disconnecting-socket', error)
            }
        });
    });
}

module.exports = {
    socketJS
}