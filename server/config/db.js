const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
        dbName: "amoura"
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;