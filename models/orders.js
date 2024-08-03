const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Order = new Schema(
  {
    products: {
      type: Array,
    },
  },
  {
    collection: "order",
  }
);

module.exports = mongoose.model("Order", Order);
