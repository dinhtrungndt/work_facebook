const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ReplyComment = new Schema(
  {
    id: { type: ObjectId },
    idReply: { type: String },
    message: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.ReplyComment || mongoose.model("ReplyComment", ReplyComment);
