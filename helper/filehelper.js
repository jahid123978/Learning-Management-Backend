// "use strict";
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   return cb(null, "./public/files");
  },
  filename: (req, file, cb) => {
    console.log("file name: ", file)
   return cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const filefilter = (req, file, cb) => {
  console.log("file name2: ", file)
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

module.exports = { upload };
