const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

router.post("/signup", async (req, res) => {
  try {
    // 1. If the user already exist
    const user = await User.findOne({ email: req.body.email });

    // 2. If user exists, send and error response
    if (user) {
      return res.send({
        message: "User already exists",
        success: false,
      });
    }

    // 3. Encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // 4. Create new user, save in db
    const newUser = await new User(req.body);
    await newUser.save();

    res.status(201).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1. Check if user exists
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) {
      return res.send({
        message: "Invalid password or email",
        success: false,
      });
    }

    // 2. Check if the password is correct
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.send({
        message: "Invalid password or email",
        success: false,
      });
    }

    // 3. Id the user exists & password is correct, assign a JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.send({
      message: "Logged in successfully",
      success: true,
      token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
