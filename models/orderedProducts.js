const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let OrderedProducts = new Schema(
  {
    email: {
      type: String,
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
    id: {
      type: Number
    },
    qty: {
        type: Number
    },
    orderId: {
        type: String
    },
    order: {
        type: String
    }
  },
  {
    collection: "orderedProducts",
  }
);

module.exports = mongoose.model("OrderedProducts", OrderedProducts);
