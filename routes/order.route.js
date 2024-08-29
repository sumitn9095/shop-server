const express = require("express");
const orderRoute = express.Router();
const orderController = require("../controllers/order.controller");

//---------- Order Collection -------------
orderRoute.route("/fetchAll").post(orderController.fetchAll);
orderRoute.route("/fetchOrders").get(orderController.fetchOrders);
orderRoute.route("/fetchArtOrders").get(orderController.fetchArtOrders);
orderRoute.route("/fetchUsers").get(orderController.fetchUsers);


//--------- OrderedProducts Collection ----
orderRoute
  .route("/fetch_orderedProducts")
  .post(orderController.fetch_orderedProducts);
orderRoute
  .route("/addProductToOrderedProducts")
  .post(orderController.addProductToOrderedProducts);
orderRoute.route("/fetch_orderId").post(orderController.fetch_orderId);
orderRoute.route("/orderInit").post(orderController.orderInit);
orderRoute.route("/cartCheckout").post(orderController.cartCheckout);
orderRoute.route("/cartHistory").post(orderController.cartHistory);

module.exports = { orderRoute };