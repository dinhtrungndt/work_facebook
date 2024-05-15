const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const accounts = new Schema(
  {
    id: { type: ObjectId },
    birthday: { type: String },
    email: { type: String },
    favorite_athletes: [{
      id: { type: String },
      name: { type: String }
    }],
    first_name: { type: String },
    gender: { type: String },
    hometown: {
      id: { type: String },
      name: { type: String }
    },
    langueges: [{
      id: { type: String },
      name: { type: String }
    }],
    last_name: { type: String },
    link: { type: String },
    location: {
      id: { type: String },
      name: { type: String }
    },
    locale: { type: String },
    name: { type: String },
    quotes: { type: String },
    timezone: { type: Number },
    updated_time: { type: String },
    username: { type: String },
    verified: { type: Boolean },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.accounts || mongoose.model("accounts", accounts);
