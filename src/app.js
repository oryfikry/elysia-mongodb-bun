// src/app.js
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { allRoutes } from "./routes/allRoutes.js";
import { MONGO_URI } from "./config.js";

const app = new Elysia();

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Register routes and middleware
app.use(allRoutes);

// Start the server
app.listen(3000, () => {
  console.log("API is running on http://localhost:3000");
});
