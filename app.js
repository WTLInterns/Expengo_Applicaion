const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const bodyParser = require('body-parser')

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files

app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.json()); // Parses JSON requests
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(" MongoDB Connected"))
    .catch(err => console.error(" MongoDB Connection Error:", err.message));

// ✅ Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static("uploads"));

// ✅ Import Routes
const loginRoutes = require("./routes/loginRoutes");
const driverRoutes = require("./routes/driverRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const cabRoutes = require("./routes/cabRoutes");

app.use("/api", loginRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/cabs", cabRoutes);
// const driverRoutes = require("./routes/driverRoutes");
// app.use("/api/driver", driverRoutes); // Add driver routes

// const cabRoutes = require("./routes/cabRoutes");
// app.use("/api/cabs", cabRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Start Server
// app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

// module.exports = app; 
const forpassRoutes = require("./routes/forPassRoutes");
app.use("/api/password", forpassRoutes);


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
