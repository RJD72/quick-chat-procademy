const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const db = require("./config/dbConfig");
const server = require("./app");

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
