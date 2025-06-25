import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { signUp, logIn, logOut } from "./handlers/user.js";
import { protect, freshAccessToken } from "./modules/authentication.js";
import { getCsrfToken, doubleCsrfProtection } from "./utils/csrf.js";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route to homepage
app.get("/", (req, res) => {
  res.json({ message: "Hello, Express!" });
});

// Public routes
app.get("/csrf-token", getCsrfToken);

// Apply CSRF protection to all routes below
app.use(doubleCsrfProtection);

// Protected routes
app.post("/signup", signUp);
app.post("/login", logIn);
app.post("/refresh-token", freshAccessToken);
app.post("/logout", logOut);
app.use("/api", protect);

// Global error handling
app.use((err, req, res, next) => {
  if (err.type === "input") {
    return res
      .status(400)
      .json({ error: "Invalid input. Please check your details." });
  } else if (err.type === "auth") {
    return res.status(401).json({ error: "Authentication failed." });
  } else {
    return res
      .status(500)
      .json({ error: "Something went wrong, try again later." });
  }
});

export default app;