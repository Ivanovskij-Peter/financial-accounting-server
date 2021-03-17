const mongoose = require('mongoose');
const { Schema, Types: {ObjectId} } = mongoose;

const SessionSchema = new Schema({
    AccessToken: {
        type: String,
        required: true
    },
    RefreshToken: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    sid: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 1000 * 60 * 60 * 24
    }
})

module.exports = mongoose.model('Session', SessionSchema);