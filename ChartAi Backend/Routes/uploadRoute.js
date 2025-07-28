import express from "express";
import multer from "multer";
import path from "path";
import { handleExcelUpload } from "../Controllers/uploadController.js";
import VerifyToken from "../Middleware/VerifyToken.js";

const router = express.Router();


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = ext === ".xls" || ext === ".xlsx";

  if (allowedMimeTypes.includes(file.mimetype) && isValidExt) {
    cb(null, true);
  } else {
    cb(new Error("Only .xls and .xlsx files are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

router.post("/upload", VerifyToken, upload.single("DataFile"), handleExcelUpload);

export default router;
