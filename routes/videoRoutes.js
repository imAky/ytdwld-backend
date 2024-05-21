import express from "express";
import { downloadVideo, getvideoDetails } from "../controllers/videos.js";

const router = express.Router();

router.get("/details", getvideoDetails);
router.get("/download", downloadVideo);

export default router;
