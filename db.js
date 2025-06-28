const mongoose = require("mongoose");

let dbURI =
  "mongodb+srv://test:test@cluster0.aktgqej.mongodb.net/adoption?retryWrites=true&w=majority&appName=Cluster0";

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
