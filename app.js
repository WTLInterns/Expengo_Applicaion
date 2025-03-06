
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;


app.use(express.json()); 
app.use(cors()); 

// MongoDB Connection
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err.message));

const cabRoutes = require("./routes/cabRoutes");
app.use("/api/cabs", cabRoutes); // ✅ Route Prefix

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
