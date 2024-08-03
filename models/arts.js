const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Art = new Schema(
  {
    id: {
        type: Number
    },
    name: {
        type: String,
    },
    category: {
        type: String,
    },
    inStock: {
        type: Boolean,
    },
    price: {
        type: Number,
    },
    md: {
        type: Date
    },
    ed: {
        type: Date
    }
  },
  {
    collection: "arts",
  }
);

module.exports = mongoose.model("Art", Art);
