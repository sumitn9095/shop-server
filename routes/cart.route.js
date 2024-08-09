const express = require("express");
const cartRoute = express.Router();
const orderController = require("../controllers/order.controller");
const cartController = require("../controllers/cart.controller")
//--------- Cart Collection ---------------
cartRoute
  .route("/fetch_cartUserOrders")
  .post(cartController.fetch_cartUserOrders);
cartRoute.route("/addProductToOrder").post(cartController.addProductToOrder);
cartRoute.route("/cartItems").post(cartController.cartItems)
cartRoute.route("/updateQuantity").post(cartController.updateQuantity)
cartRoute.route("/countProductsMoreThanOnce").post(cartController.countProductsMoreThanOnce)


module.exports = {cartRoute}