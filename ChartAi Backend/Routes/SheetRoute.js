import express from "express";
import VerifyToken from "../Middleware/VerifyToken.js";
import { getSheetList } from "../Controllers/SheetController.js";

const router = express.Router();

router.get("/sheets" ,VerifyToken,  getSheetList);

export default router;


