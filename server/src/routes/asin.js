import express from "express";
import {
  getAllProducts,
  fetchAndSaveASINData,
  optimizeDetailsUsingGeminiAI,
  getOptimizationHistoryForASIN,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/fetch", fetchAndSaveASINData);
router.post("/optimize", optimizeDetailsUsingGeminiAI);
router.get("/:asin/history", getOptimizationHistoryForASIN);

export default router;
