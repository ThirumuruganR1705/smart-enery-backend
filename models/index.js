const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { solarDataSchema, SolarData } = require("./SolarData");
const { User } = require('./User');

const db = {};

db.mongoose = mongoose;

// db.user = require("./User");
db.solarDataSchema = solarDataSchema;
db.solarData = SolarData;
db.user = User;

// db.userToken = require("./UserToken")
// db.role = require("./Role");
// db.course = require("./Course");

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;