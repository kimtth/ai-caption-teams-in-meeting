const passport = require('koa-passport')
const User = require('./user-model');
const LocalStrategy = require('passport-local').Strategy;

async function fetchUser(userid) {
    try {
        const user = await User.findOne({ userId: userid });
        if (!user) {
            return false
        }

        return user
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError') {
            return false
        }
        return false
    }
}

passport.serializeUser(function (user, done) {
    done(null, user.userId);
})

passport.deserializeUser(async function (userId, done) {
    fetchUser(userId)
        .then(user => {
            done(null, user)
        })
        .catch(err => done(err))
})

passport.use('local', new LocalStrategy({
    usernameField: 'userId', //Kim: Mapping with the request field.
}, function (username, done) {
    fetchUser(username)
        .then(user => {
            if (user.checkUserId(username)) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
        .catch(err => done(err))
}))
