const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
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
    default: 0,
  },

  operations: {
    incomes: {
      date: String,
      category: String,
      description: String,
      amount: String,
    },
    costs: {
      date: String,
      category: String,
      description: String,
      amount: String,
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
