const express = require("express");
const app = express();
const productRoute = express.Router();
const productController = require("../controllers/product.controller");
const uploadProdImg = require("../middlewares/uploadProductPhotos");
const uploadProdExcel = require("../middlewares/uploadProductExcel")

app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
    );
    next();
});

productRoute.route("/fetchAllProducts").post(productController.fetchAllProducts);
productRoute.route("/filterProducts").post(productController.filterProducts);
productRoute.route("/getCategories").get(productController.getCategories);
productRoute.route("/exp").get(productController.exp);
productRoute.route("/getMaxProductPrice").get(productController.getMaxProductPrice);
productRoute.route("/addNewProduct").post(uploadProdImg.any("img"), productController.addNewProduct);
productRoute.route("/editProduct").post(uploadProdImg.any("img"), productController.editProduct);
productRoute.route("/downloadPDF").get(productController.downloadPDF);
productRoute.route("/downloadProductExcel").post(productController.downloadProductExcel);
productRoute.route("/uploadProductExcel").post(uploadProdExcel.single("productexcel"), productController.uploadProductExcel);

productRoute.route("/removeProductImg").post(productController.removeProductImg);
productRoute.route("/removeProduct/:id").delete(productController.removeProduct);
productRoute.route("/fetchProduct/:id").get(productController.fetchProduct);

module.exports = { productRoute }