const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  googleId: { type: String, required: true },

  name: { type: String, required: true },

  email: { type: String, required: true },

  username: { type: String, required: true, unique: true },

  friendList: { type: Array ,default:[] },

  profilePic: { type: String },
});

const User = mongoose.model("Users", Schema);

module.exports = User;
