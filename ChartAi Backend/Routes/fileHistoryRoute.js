import express from "express";
import VerifyToken from "../Middleware/VerifyToken.js";
import { getFileHistory } from "../Controllers/FileController.js";

const router = express.Router();

router.get("/file-history" ,VerifyToken,  getFileHistory);

export default router;


