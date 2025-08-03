import express from "express";
import { generateInsight } from "../Controllers/insightService.js"
import authorizeRoles from "../Middleware/AuthorizeRoles.js";
import VerifyToken from "../Middleware/VerifyToken.js";

const router = express.Router();

router.post("/generate-insight", VerifyToken,authorizeRoles("user"), async (req, res) => {
  try {
    const { sheetData } = req.body;
    const insight = await generateInsight(sheetData);
    res.json({ insight });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Insight generation failed" });
  }
});

export default router;
