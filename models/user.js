const mongoose = require("mongoose"); //a module for monogdb
const Schema = mongoose.Schema;

//creating a schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    name: { type: String },
  },
  { collection: "user" }
);

const User = mongoose.model("User", userSchema); //A Mongoose model is a wrapper of the Mongoose schema.
module.exports = User;
