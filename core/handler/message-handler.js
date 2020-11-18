const Message = require('./message-model');

//get queryString
exports.list = async ctx => {
    const channelId = ctx.request.query.channelId;
    const userId = ctx.request.query.userId;
  
    if (!channelId) {
      ctx.status = 400;
      return;
    }
  
    const query = {
      ...(channelId ? { channelId: channelId } : {}),
      ...(userId ? { userId: userId } : {}),
    };
  
    try {
      const posts = await Message.find(query)
      ctx.body = posts
    } catch (e) {
      ctx.throw(500, e);
    }
};

//post
exports.create = async ctx => {
    try {
        const msg = await new Message(ctx.request.body).save();
        ctx.body = msg;
    } catch (err) {
        ctx.throw(422, err);
    }
};

//get:id
exports.show = async ctx => {
    try {
        const msg = await Message.findOne({ id: ctx.params.id });
        if (!msg) {
            ctx.throw(404);
        }
        ctx.body = msg;
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError') {
            ctx.throw(404);
        }
        ctx.throw(500);
    }
};

//put:id
exports.update = async ctx => {
    try {
        const msg = await Message.findOneAndUpdate(
            { id: ctx.params.id },
            ctx.request.body,
            {
                new: true, //body: updated data
            }
        );
        if (!msg) {
            ctx.throw(404);
        }
        ctx.body = msg;
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError') {
            ctx.throw(404);
        }
        ctx.throw(500);
    }
};

//delete:id
exports.destroy = async ctx => {
    try {
        const msg = await Message.findOneAndRemove({id: ctx.params.id});
        if (!msg) {
            ctx.throw(204); // No Content
        }
        ctx.body = msg;
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError') {
            ctx.throw(404);
        }
        ctx.throw(500);
    }
};

