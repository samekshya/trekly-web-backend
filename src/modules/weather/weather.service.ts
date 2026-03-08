import axios from "axios";

const OWM_BASE = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY!;

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: string; // main condition e.g. "Clear", "Rain"
}

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(`${OWM_BASE}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });

  const d = response.data;

  return {
    location: d.name,
    country: d.sys.country,
    temperature: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    humidity: d.main.humidity,
    windSpeed: Math.round(d.wind.speed * 3.6), // m/s → km/h
    visibility: Math.round((d.visibility || 0) / 1000), // m → km
    condition: d.weather[0].main,
  };
};