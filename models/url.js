const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const url = new Schema(
  {
    id: { type: ObjectId },
    url: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.models.url || mongoose.model("url", url);
