import { Router } from "express";
import { getWeather } from "./weather.controller";

const router = Router();

// GET /api/weather/:location
// Public route — no auth needed for displaying trek weather
router.get("/:location", getWeather);

export default router;
