const socketIo = require("socket.io");

let Channels = {}

const socketJS = function (server, port) {
    const io = socketIo(server, {
        pingInterval: 25000, // 25 seconds,
        pingTimeout: 3600000 // default 1 minute / set 1 hour
    });
    //io.set("transports", ["websocket"]);

    io.on('connection', function (socket) {
        socket.on("join", (userid, username, channelid) => {
            try {
                console.log("join", userid, username, channelid, socket.id)
                socket.join(channelid);

                const user = {
                    userid: userid,
                    username: username,
                    socketid: socket.id
                }

                //Kim: { channelid: [ { userid: 'test@test', username: '' } ] }
                if (typeof Channels[channelid] === 'undefined')
                    Channels[channelid] = []

                //Kim: The existence check
                if (Channels[channelid].some(item => item.userid === userid) === false) {
                    Channels[channelid].push(user)
                }

                //To user
                socket.emit("update-activity", `You have connected.`);
                //console.log("Channels[channelid]", Channels[channelid])
                socket.emit("user-list", Channels[channelid]);
                //To paticipants
                socket.broadcast.to(channelid).emit("user-list", Channels[channelid]);
                socket.broadcast.to(channelid).emit("update-activity", `${userid} is online. `);
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

        socket.on("leave-channel", (userid, channelid) => {
            try {
                console.log("leave-channel", userid, channelid)
                //To paticipants
                socket.broadcast.to(channelid).emit("update-activity", `${userid} has disconnected. `);

                if (Array.isArray(Channels[channelid])) {
                    Channels[channelid] = Channels[channelid].filter(item => item.userid !== userid);
                    socket.broadcast.to(channelid).emit("user-list", Channels[channelid]);
                    socket.emit("user-list", Channels[channelid]);
                    socket.leave(channelid);
                }
            } catch (error) {
                console.log('leave-socket', error)
            }
        });

        socket.on("remove-event", () => {
            //Kim: for preventing mutiple connections
            //https://stackoverflow.com/questions/52138337/socket-io-makes-multiple-connections-when-the-page-is-refreshed-node-js
            socket.removeAllListeners();
        })

        socket.on('error', err => handleErrors('error', err));
        socket.on('connect_error', err => handleErrors('connect_error', err));
        socket.on('reconnect_error', err => handleErrors('reconnect_error', err));
        socket.on('disconnect', () => {
            console.log('disconnect', socket.id)
        });

        socket.on('disconnecting', (reason) => {
            try {
                //Kim: Update UserList when unexpected events such as browser refresh and browser close are triggered.
                console.log('disconnecting:', reason)
                const socketId = socket.id;
                let channelids = Object.keys(Channels);
                channelids.forEach(channelid => {
                    if (Array.isArray(Channels[channelid])) {
                        const Users = Channels[channelid]
                        Channels[channelid] = Users.filter(user => (user.socketid !== socketId))
                        socket.broadcast.to(channelid).emit("update-activity", `Active users have updated. `);
                        socket.broadcast.to(channelid).emit("user-list", Channels[channelid]);
                    }
                })
            } catch (error) {
                console.log('disconnecting-socket', error)
            }
        });
    });
}

const handleErrors = (errtype, err) => {
    console.log(errtype, ': ', err)
    //socket.emit("error-handle", `${errtype} : ${err}`);
}

module.exports = {
    socketJS
}