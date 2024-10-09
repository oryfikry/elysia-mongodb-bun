// src/app.js
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { allRoutes } from "./routes/allRoutes.js";
import { MONGO_URI } from "./config.js";

// Create an Elysia instance
const app = new Elysia();

// Connect to MongoDB
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
  console.log("server is running on "+ process.env.APP_URL);
});

// Gracefully handle SIGTERM (Koyeb sends this to stop the app)
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: stopping server and closing MongoDB connection");

  // Stop Elysia server
  await app.stop();
  console.log("Elysia server stopped");

  // Disconnect from MongoDB
  await mongoose.connection.close(false);
});

// Handle SIGINT (for manual stop, e.g., Ctrl+C in local dev)
process.on("SIGINT", async () => {
  console.log("SIGINT signal received: stopping server and closing MongoDB connection");

  // Stop Elysia server
  await app.stop();
  console.log("Elysia server stopped");

  // Disconnect from MongoDB
  await mongoose.connection.close(false);
});
