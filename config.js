require("dotenv").config();

const DEMO_MODE = process.env.DEMO_MODE !== "false";

const ZONES = [
  { id: "Koramangala", lat: 12.9352, lon: 77.6245 },
  { id: "Indiranagar",  lat: 12.9719, lon: 77.6412 },
];

const OPENWEATHER_API = process.env.OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_KEY";
const TOMTOM_API      = process.env.TOMTOM_API_KEY      || "YOUR_TOMTOM_KEY";
const WAQI_API        = process.env.WAQI_API_KEY        || "YOUR_WAQI_KEY";
const GEMINI_API      = process.env.GEMINI_API_KEY      || "YOUR_GEMINI_KEY";

const BACKEND_URL      = process.env.BACKEND_URL       || "http://localhost:3000/payout/trigger";
const ML_SERVICE_URL   = process.env.ML_SERVICE_URL    || "http://localhost:5001";
const FRAUD_SERVICE_URL = process.env.FRAUD_SERVICE_URL || "http://localhost:5002";

module.exports = {
  DEMO_MODE,
  ZONES,
  OPENWEATHER_API,
  TOMTOM_API,
  WAQI_API,
  GEMINI_API,
  BACKEND_URL,
  ML_SERVICE_URL,
  FRAUD_SERVICE_URL,
};
