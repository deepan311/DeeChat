const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: String,
    reciverId: String,
    text: String,
  },
  { timestamps: true }
);

const schema = mongoose.Schema(
  {
    member: { type: Array, required: true },
    message: [messageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("conversation", schema);

module.exports = Chat;
