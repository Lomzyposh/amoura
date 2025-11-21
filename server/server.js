const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/swipes", require("./routes/swipeRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


app.get("/", (req, res) => {
  res.send("Dating App Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
