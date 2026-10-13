require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../app");
let connectionPromise;
module.exports = async (req, res) => {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB_URI is not configured");
    if (mongoose.connection.readyState !== 1) {
      if (!connectionPromise)
        connectionPromise = mongoose
          .connect(process.env.MONGODB_URI)
          .catch((err) => {
            connectionPromise = null;
            throw err;
          });
      await connectionPromise;
    }
    return app(req, res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message:
          "API initialization failed. Check the deployment environment variables.",
      });
  }
};
