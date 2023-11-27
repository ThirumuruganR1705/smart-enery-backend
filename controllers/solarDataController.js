require("dotenv").config();
const config = process.env;
const db = require("../models");
const SolarData = db.solarData;
const solarDataSchema = db.solarDataSchema;
const axios = require("axios");
const Papa = require("papaparse");

exports.fetchSolarData = async (req, res) => {
  try {
    let token = "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";
    // Fetch CSV data from GitHub
    const response = await axios.get(
      "https://raw.githubusercontent.com/ash1435/data/main/DAILY.csv",
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    const csvData = response.data;

    // Parse CSV data
    let jsonData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    }).data;

    const updatedData = [];

    for (let i = 0; i < jsonData.length; i++) {
      updatedData[i] = {};
      for (const key in jsonData[i]) {
        if (Object.prototype.hasOwnProperty.call(jsonData[i], key)) {
          const bracketPos = key.indexOf("(");
          const updatedKey =
            bracketPos !== -1 ? key.slice(0, bracketPos).trim() : key.trim();
          updatedData[i][updatedKey] = jsonData[i][key];
        }
      }
    }
    jsonData = updatedData;

    // Save data to MongoDB
    const result = await SolarData.insertMany(jsonData);
    console.log("inserted data successfully");
    res.status(200).json({ message: "Data saved to MongoDB", result });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error fetching/saving data" });
  }
};

exports.readSolarData = async (req, res) => {
  try {
    let query = {};
    if (req.query.time) {
      query = { Time: req.query.time }; // Assuming 'Time' is the field name in the database
    }

    const data = await SolarData.find(query);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
