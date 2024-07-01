import "dotenv/config";
import express from "express";
import query from "./api.js";

const port = process.env.PORT || 8080;

const app = express();

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;

  if (!visitor_name) {
    res.status(400).json({
      error: "Missing required parameter 'visitor_name' in query",
      success: false,
    });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const geoData = await query("ip.json", ip[0] || ip);
  const currentWeatherData = await query("current.json", geoData?.city);

  console.log(ip);
  console.log(geoData);
  console.log(currentWeatherData);

  res.status(200).json({
    success: true,
    greeting: `Hello, ${visitor_name}!, the temperature is ${currentWeatherData?.temp_c} degrees Celsius in ${geoData?.city}.`,
    location: geoData?.city,
    client_ip: ip[0] || ip,
  });
});
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    success: false,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
