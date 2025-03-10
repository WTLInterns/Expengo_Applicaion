
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// require("dotenv").config();


// const app = express();
// const PORT = process.env.PORT || 5000;
// const DB_URI = process.env.DB_URI;


// app.use(express.json()); 
// app.use(cors()); 

// // MongoDB Connection
// mongoose.connect(DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log(" MongoDB Connected"))
// .catch(err => console.error(" MongoDB Connection Error:", err.message));

// const driverRoutes = require("./routes/driverRoutes");
// app.use("/api/driver", driverRoutes); // Add driver routes

// const cabRoutes = require("./routes/cabRoutes");
// app.use("/api/cabs", cabRoutes); 

// const adminRoutes= require("./routes/adminRoutes");
// app.use("/api/admin",adminRoutes);

// const forpassRoutes = require("./routes/forPassRoutes");
// app.use("/api/password", forpassRoutes);


// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cabRoutes = require("./routes/cabRoutes"); // Import your routes
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// API Routes
app.use("/api/cabs", cabRoutes); // ✅ Ensure this matches the Postman URL

// Connect to MongoDB using DB_URI from .env
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
