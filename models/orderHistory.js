const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let OrderHistory = new Schema(
  {
    orderId: {
        type: String
    },
     id: {
        type: Number
    },
    name: {
        type: String,
    },
    category: {
        type: String,
    },
    price: {
        type: Number,
    },
    md: {
        type: Date
    },
    ed: {
        type: Date
    },
    qty: {
        type: Number
    }
  },
  {
    collection: "OrderHistory",
  }
);

module.exports = mongoose.model("orderHistory", OrderHistory);
