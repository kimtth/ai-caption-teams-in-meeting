const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    userId: { type: String, unique: true }, //email
    username: String,
    publishedDate: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.methods.checkUserId = function (userId) {
    if (this.userId === userId) {
        return true
    } else {
        return false
    }
}

module.exports = mongoose.model('User', UserSchema);