const express = require("express");
const orderRoute = express.Router();
const orderController = require("../controllers/order.controller");

//---------- Order Collection -------------
orderRoute.route("/fetchAll").post(orderController.fetchAll);
orderRoute.route("/fetchOrders").get(orderController.fetchOrders);
orderRoute.route("/fetchArtOrders").get(orderController.fetchArtOrders);
orderRoute.route("/fetchUsers").get(orderController.fetchUsers);

//--------- Cart Collection ---------------
orderRoute.route("/fetch_cartUserOrders").post(orderController.fetch_cartUserOrders);
orderRoute.route("/addProductToOrder").post(orderController.addProductToOrder);

//--------- OrderedProducts Collection ----
orderRoute.route("/fetch_orderedProducts").post(orderController.fetch_orderedProducts);
orderRoute.route("/addProductToOrderedProducts").post(orderController.addProductToOrderedProducts);


module.exports = {orderRoute};