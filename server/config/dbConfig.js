const mongoose = require("mongoose");

// Connection logic
mongoose.connect(process.env.MONGODB_URI);

// Connection state
const db = mongoose.connection;

// Check DB connection
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("err", () => {
  console.log("DB connection failed");
});

module.exports = db;
