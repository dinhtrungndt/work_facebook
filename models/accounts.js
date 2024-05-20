const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const accounts = new Schema(
  {
    id: { type: ObjectId },
    name: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.accounts || mongoose.model("accounts", accounts);
