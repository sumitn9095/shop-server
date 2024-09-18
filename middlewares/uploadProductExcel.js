const multer = require("multer")
const path = require("path")

const fileStorageTaskExcel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/xlsx');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const limits = {
  fileSize: 1024 * 1024 * 2
}

const uploadProductExcel = multer({
  storage: fileStorageTaskExcel,
  limits: limits,
  fileFilter: (req, file, cb) => {
    let fileType = /xlsx/;
    //let fileMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // let mimeType = fileType.test(file.mimetype);
    let extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase())
    console.log("uploadProductExcel", file, extname)
    if (extname) {
      return cb(null, true)
    } else {
      req.fileValidationError = "File upload only supports, xlsx only";
      return cb(null, false, req.fileValidationError);
    }
  }
})

module.exports = uploadProductExcel;