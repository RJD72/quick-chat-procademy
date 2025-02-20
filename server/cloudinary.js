const cloudinary = require("cloudinary").v2;

const api_key = import.meta.env.VITE_CLOUDINARY_API_KEY;
const api_secret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Configuration
cloudinary.config({
  cloud_name: "dh8cvmhv0",
  api_key: api_key,
  api_secret: api_secret, // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
