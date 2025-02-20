const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: "dh8cvmhv0",
  api_key: "241816583456869",
  api_secret: "5IW1SM3oRXSw_9Qhgo_VCEUyQnc", // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
