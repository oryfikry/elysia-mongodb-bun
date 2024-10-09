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
const server = app.listen(3000, () => {
  console.log("API is running on http://localhost:3000");
});

// Gracefully handle SIGTERM (Koyeb sends this to stop the app)
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server and MongoDB connection");

  // Close server
  server.close(() => {
    console.log("HTTP server closed");
    
    // Disconnect from MongoDB
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

// Handle SIGINT (for manual stop, e.g., Ctrl+C in local dev)
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server and MongoDB connection");

  server.close(() => {
    console.log("HTTP server closed");

    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});
