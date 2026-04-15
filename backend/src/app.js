const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const stationRoutes = require("./routes/stationRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SolarPlug API running" });
});

module.exports = app;