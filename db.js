const mongoose = require("mongoose");

const dbURI = process.env.MONGODB_URI;

module.exports = {
  connectToDb: async () => {
    try {
      await mongoose.connect(dbURI, {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
      });
      console.log("Connected to the database!");
    } catch (err) {
      console.error("Error connecting to database:", err);
      throw new Error("Database connection failed");
    }
  },
};
