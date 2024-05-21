const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const cloudinary = new Schema(
  {
    id: { type: ObjectId },
    url: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.cloudinary || mongoose.model("cloudinary", cloudinary);
