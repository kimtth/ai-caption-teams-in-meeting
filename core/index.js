const Router = require('koa-router');
const passport = require('koa-passport');
const msgCtrl = require('./handler/message-handler');

const handler = new Router();

const auth = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  } else {
    ctx.status = 401;
  }
};

handler.get('/messages', auth, msgCtrl.list);
handler.post('/message', auth, msgCtrl.create);
handler.get('/message/:id', auth, msgCtrl.show);
handler.put('/message/:id', auth, msgCtrl.update);
handler.delete('/message/:id', auth, msgCtrl.destroy);

handler.post('/login', (ctx) => {
  //console.log(ctx.request.body.userId)
  return passport.authenticate('local', (err, user, info, status) => {
    console.log(err, user, info, status)
    if (user === false) {
      ctx.body = {
        success: false
      };
    } else {
      ctx.body = {
        success: true
      };
      return ctx.login(user)
    }
  })(ctx)
})

handler.get('/logout', (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
  } else {
    ctx.body = {
      success: false
    };
    ctx.throw(401);
  }
})

module.exports = handler;