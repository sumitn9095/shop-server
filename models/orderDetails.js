const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let OrderDetails = new Schema(
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
    createdAt: {
        type: Date
    },
    checkoutAt: {
        type: Date
    },
    orderId: {
        type: String
    },
    order: {
        type: String
    }
  },
  {
    collection: "orderDetails",
  }
);

module.exports = mongoose.model("OrderDetails", OrderDetails);
