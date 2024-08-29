const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') cb(null, true);
    else cb(null, false);
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/images"),
    filename: (req, file, cb) => cb(null, file.originalname)
})

const uploadProdImg = multer({ storage: fileStorage, fileFilter: fileFilter })

module.exports = uploadProdImg;