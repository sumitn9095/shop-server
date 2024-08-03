const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Product = new Schema(
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
    collection: "products",
  }
);

Product.index({name: 'text', 'name': 'text'});

module.exports = mongoose.model("Product", Product);