const mongoose = require('mongoose');
const { Schema, Types: {ObjectId} } = mongoose;

const RefreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);