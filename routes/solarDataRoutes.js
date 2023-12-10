const controller = require("../controllers/solarDataController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/solar/fetchSolarData", controller.fetchSolarData);
  app.get("/api/solar/data", controller.readSolarData)
  app.post("/api/solar/filterData", controller.filterData)

};
