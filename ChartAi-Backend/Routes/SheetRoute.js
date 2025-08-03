import express from "express";
import VerifyToken from "../Middleware/VerifyToken.js";
import { getSheetList } from "../Controllers/SheetController.js";
import authorizeRoles from "../Middleware/AuthorizeRoles.js";
const router = express.Router();

router.get("/sheets" ,VerifyToken,authorizeRoles("user"),  getSheetList);

export default router;


