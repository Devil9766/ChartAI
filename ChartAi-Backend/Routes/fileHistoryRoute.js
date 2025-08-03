import express from "express";
import VerifyToken from "../Middleware/VerifyToken.js";
import { getFileHistory } from "../Controllers/FileController.js";
import authorizeRoles from "../Middleware/AuthorizeRoles.js";
const router = express.Router();

router.get("/file-history" ,VerifyToken,authorizeRoles("user"),  getFileHistory);

export default router;


