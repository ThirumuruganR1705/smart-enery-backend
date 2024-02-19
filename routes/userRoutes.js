const controller = require("../controllers/userController");
const { authJwt } = require("../middlewares");
let express = require("express")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/user/register", [authJwt.verifyToken, authJwt.isAdmin], controller.register);
  app.post("/api/user/login", controller.login);
  app.delete("/api/user/delete/:userId", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
  app.get("/api/user/getAllUsers", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers)
};
