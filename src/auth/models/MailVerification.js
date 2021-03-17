const mongoose = require('mongoose');
const { Schema, Types: {ObjectId} } = mongoose;

const VerificationTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    uid: {
        type: ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 1000 * 60 * 60 * 24
    }
})

module.exports = mongoose.model('VerificationToken', VerificationTokenSchema);