const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');


const app = express();

// const allowedOrigins = [process.env.ORIGIN, "http://localhost:5173", "https://shardeum-academy.vercel.app"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

// app.use(cors(corsOptions));

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./db");
// require('./middlewares')

// routes
require("./routes/solarDataRoutes")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to backend of smart energy dashboard" });
});

app.get('/fetch-and-save', async (req, res) => {
  try {
    // Fetch CSV data from GitHub
    const response = await axios.get('https://raw.githubusercontent.com/username/repo/main/data.csv');
    const csvData = response.data;

    // Parse CSV data
    const jsonData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    }).data;

    // Save data to MongoDB
    const result = await SolarData.insertMany(jsonData);

    res.status(200).json({ message: 'Data saved to MongoDB', result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching/saving data' });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
