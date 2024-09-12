import { Elysia } from "elysia";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationToEmail
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { ResJson } from "../utils/ResJson.js";
import { getAllUsers } from "../controllers/userController.js";

const app = new Elysia();

// Register a new user
app.post("/register", async (req) => {
  const response = await register(req);
  return response;
});

// Login user and get JWT token
app.post("/login", async (req) => {
  const response = await login(req);
  return response;
});
app.get('/verify-email/:token', verifyEmail); 
// Generate password reset token
app.post("/forgot-password", async (req) => {
  const response = await forgotPassword(req);
  return response;
});

// Reset password with reset token
app.post("/reset-password", async (req) => {
  const response = await resetPassword(req);
  return response;
});

// Route with role-based access (e.g., only 'admin' can access)
app.get("/admin", verifyToken(["SUPER_ADMIN","ADMIN"]), (req) => {
  return ResJson("admin here ! ", null, 200);
});

app.get("/admin-only", verifyToken(["ADMIN"]), (req) => {
  return ResJson("admin here ! ", null, 200);
});

app.get("/", () => {
  return { status: 200, message: "Server is up 🐦‍🔥" };
});

app.get("/users", getAllUsers);

app.post("/sendVerificationToEmail", async(req)=>{
  const res = await sendVerificationToEmail(req)
  return res
});

export const authRoutes = app;
