const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comments = new Schema(
  {
    _id: { type: Number },
    created_time: { type: Date, default: Date.now },
    from: {
      id: { type: Number },
      name: { type: String },
    },
    message: { type: String },
    can_remove: { type: Boolean },
    like_count: { type: Number },
    user_likes: { type: Boolean },
  },
  {
    versionKey: false,
    _id: false,
  }
);

module.exports =
  mongoose.models.comments || mongoose.model("comments", comments);
