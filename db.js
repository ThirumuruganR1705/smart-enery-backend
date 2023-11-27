require("dotenv").config();
const config = process.env;

const mongoose = require("mongoose");
const db = require("./models/index");
// const Role = db.role;

const MONGO_URI = config.MONGO_URI;

db.mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "solarData",
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // initial();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
