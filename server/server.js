const express = require("express");
const cors = require("cors");
const serviceRoutes = require("./routes/serviceRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const timesRoutes = require("./routes/timesRoutes");
const tokenRoutes = require('./routes/tokenRoutes');
const connectDB = require("./dbConnection");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));

// Use routes
app.use("/services", serviceRoutes);
app.use("/reservations", reservationRoutes);
app.use("/times", timesRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/notifications", notificationRoutes);
app.use('/api',tokenRoutes);

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app
