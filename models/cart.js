const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Cart = new Schema(
  {
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
    products: {
      type: Array,
      unique: [true, "Already product is added"],
    },
  },
  {
    collection: "cart",
  }
);

module.exports = mongoose.model("Cart", Cart);
