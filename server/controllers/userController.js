const router = require("express").Router();
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require("./../cloudinary");

// Get details of current logged user
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    res.send({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

// Get all users except currently logged in user
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.body.userId } });
    res.send({
      message: "All users fetched successfully",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

//
router.post("/upload-profile-pic", authMiddleware, async (req, res) => {
  try {
    const image = req.body.image;

    // Upload the image to cloudinary
    const uploadImage = await cloudinary.uploader.upload(image, {
      folder: "quick-chat",
    });

    // Update the user model & set the profilePic property
    const user = await User.findByIdAndUpdate(
      { _id: req.body.userId },
      { profilePic: uploadImage.secure_url },
      { new: true }
    );

    res.send({
      message: "Profile picture uploaded successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
