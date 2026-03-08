import { Request, Response } from "express";
import { getWeatherByCity } from "./weather.service";

export const getWeather = async (req: Request, res: Response) => {
  const { location } = req.params;

  if (!location || location.trim() === "") {
    return res.status(400).json({ message: "Location is required" });
  }

  try {
    const weather = await getWeatherByCity(location.trim());
    return res.status(200).json({ success: true, data: weather });
  } catch (error: any) {
    if (error.response?.status === 404) {
      return res
        .status(404)
        .json({ message: `Weather data not found for "${location}"` });
    }
    console.error("Weather fetch error:", error.message);
    return res.status(500).json({ message: "Failed to fetch weather data" });
  }
};
