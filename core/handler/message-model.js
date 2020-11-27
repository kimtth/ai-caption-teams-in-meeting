const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  id: { type:String, unique: true },
  channelId: String,
  userId: String,
  content: String,
  translateContent: String,
  timestamp: String,
  metadata: String, //{from:en, to:jp}
  publishedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);