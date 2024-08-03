const express = require("express");
const productRoute = express.Router();
const productController = require("../controllers/product.controller");

productRoute.route("/fetchAllProducts").post(productController.fetchAllProducts);
productRoute.route("/filterProducts").post(productController.filterProducts);
productRoute.route("/getCategories").get(productController.getCategories);
productRoute.route("/exp").get(productController.exp);
productRoute.route("/getMaxProductPrice").get(productController.getMaxProductPrice);

module.exports = {productRoute}