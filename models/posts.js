const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const posts = new Schema(
  {
    id: { type: ObjectId },
    name: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.models.posts || mongoose.model("posts", posts);
