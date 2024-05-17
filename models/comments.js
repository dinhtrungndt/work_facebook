const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const comments = new Schema(
  {
    id: { type: ObjectId },
    idComment: { type: String },
    message: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.comments || mongoose.model("comments", comments);
