const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => value.includes("@"),
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarURL: String,
  token: String,
  verificationToken: String,
  balance: {
    type: Number,
  },
  operations: {
    incomes: [
      {
        id: String,
        date: String,
        category: String,
        description: String,
        amount: Number,
      },
    ],
    costs: [
      {
        id: String,
        date: String,
        category: String,
        description: String,
        amount: Number,
      },
    ],
  },
});

module.exports = mongoose.model("User", UserSchema);
