const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env;
const db = require("../models");
const User = db.user;

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    if (!token.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Invalid token format!" });
    }

    token = token.slice(7);

    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized!", errorMessage: err.message });
  }
};

const decodeUserFromToken = async (token) => {
  try {
    // Decode the user information from the JWT token
    const decoded = jwt.verify(token, config.SECRET); // Replace 'your_secret_key' with your actual secret key

    // The decoded variable now contains the user information
    const user = await User.findById(decoded.id).exec();

    return user;
  } catch (error) {
    // Handle token verification errors
    console.error('Error decoding token:', error);
    return null;
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await decodeUserFromToken(token);

    if (user.role === 'admin') {
      next();
    } else {
      res.status(403).send({ message: "Require Admin Role!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || "Internal Server Error" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  decodeUserFromToken
};

module.exports = authJwt;