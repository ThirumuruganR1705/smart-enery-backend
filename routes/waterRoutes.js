const controller = require("../controllers/waterController");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/water/turnOnMotor", [authJwt.verifyToken] ,controller.turnOnMotor);

};
