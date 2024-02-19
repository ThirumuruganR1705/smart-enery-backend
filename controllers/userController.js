require("dotenv").config();
const config = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models");
const { decodeUserFromToken } = require("../middlewares/authJwt");
const User = db.user;

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    role = req.body?.role;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role === "admin" ? role : "member",
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const jwtToken = jwt.sign({ id: user.id }, config.SECRET, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    // At this point, the user is authenticated
    res
      .status(200)
      .json({ message: "login success", user, accessToken: jwtToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.userId;

    // Validate user ID format
    if (!userIdToDelete.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    // Find the user by ID and remove them from the database
    const deletedUser = await User.findByIdAndRemove(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
exports.getAllUsers = async (req, res) => {
  try {
    // Check if the current user is an admin
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Permission denied" });
    // }

    // const token = req.headers.authorization.split(" ")[1];
    // const user = await decodeUserFromToken(token);

    // Fetch all users from the database (excluding passwords)
    const users = await User.find({}, "-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
