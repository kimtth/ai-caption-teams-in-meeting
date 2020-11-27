const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require("koa-bodyparser");
const serve = require('koa-static');
const mount = require("koa-mount");
const session = require('koa-session');
const mongoose = require('mongoose');
const cors = require('@koa/cors');
const api = require('./core/index');
const passport = require('koa-passport')
const fs = require('fs');

//Kim: Switch between multiple .env files.
require('dotenv').config()
const env = process.env.NODE_ENV;
if (env !== "production") {
    require('dotenv').config({
        path: "./.env.dev"
    })
}

const {
    socketJS
} = require('./core/chat');

const corsOptionsDev = {
    origin: process.env.NGROK_ENDPOINT,
    credentials: true
};
const app = new Koa();
if (process.env.NODE_ENV !== 'production') {
    app.use(cors(corsOptionsDev));
} else {
    app.use(cors());
}

//Kim: authentication
app.keys = [process.env.CRYPT_KEY];
app.use(session({
    sameSite: "None"
}, app)) //Kim: allow cors

app.use(BodyParser()); //Kim: Bodyparser should be set before router.

//Kim: authentication
require('./core/handler/user-auth')
app.use(passport.initialize())
app.use(passport.session())

const static_pages = new Koa();
static_pages.use(serve(__dirname + "/build")); //serve the build directory
app.use(mount("/", static_pages));
app.use(mount("/privacy", static_pages));
app.use(mount("/termsofuse", static_pages));
app.use(mount("/tab", static_pages));
app.use(mount("/setting", static_pages));
app.use(mount("/config", static_pages));

const router = new Router();
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

//Kim: for handling 404 error
app.use(async (ctx, next) => {
    if (ctx.status === 404) {
        ctx.status = 404
        let bodyContents = `<html><body style="background-color:#c3c4ff; padding:100px">`
        bodyContents += `<h2 style="color:black;text-align:center">You are currently in fallback (404).`
        bodyContents += `<br/> Please go back to main page.</h2></body></html>`
        ctx.body = bodyContents;
    }
})

// console.log('>>>>', process.env.NODE_ENV)
let mongoUri = process.env.MONGO_ENDPOINT
let port = 443
if (process.env.NODE_ENV !== 'production') { //development
    port = 8080;
}

//Kim: SSL/TLS
//https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/
const options = {
    email: "ultra.taco.0808@gmail.com", // Emailed when certificates expire.
    agreeTos: true, // Required for letsencrypt.
    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
    domains: ["ai-caption-teams.azurewebsites.net", ["azurewebsites.net"]], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
    dir: "./core/cert", // Directory for storing certificates. Defaults to "~/letsencrypt/etc" if not present.
    ports: {
      http: 80, // Optionally override the default http port.
      https: 443 // // Optionally override the default https port.
    }
};

// //Kim: socket server
// var createServer = require("auto-sni");
// const server = createServer(options, app.callback());
const server = require('http').createServer(app.callback())
socketJS(server);

let dbName = process.env.DB_NAME;
server.listen(port, () => {
    console.log(`Listening on (Web/Socket) ${port}`)
    //Kim: useCreateIndex: true: Prevent DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
    //Kim: DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated.
    //Azure Cosmos DB does not support retryWrites.
    mongoose.connect(mongoUri, {
            useCreateIndex: true,
            dbName: dbName,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: false
        })
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch(e => {
            console.log(e);
        })
})