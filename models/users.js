const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name not provided"]
    },
    email: {
      type: String,
      unique: [true, "Email already exists in db"],
      lowercase: true,
      trim: true,
      required: [true, "Email not provided"],
      validate: {
        validator: (v) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'This is not a valid email!'
      },
    },
    password: {
      type: String,
      required: [true, "Password not provided"]
    },
    details: {
      type: Object,
      required: [true, "User details not provided"]
    },
    admin: {
      type: Boolean
    },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("User", User);
