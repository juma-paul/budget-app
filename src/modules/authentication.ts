import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAccessToken, setAccessTokenCookie } from "../utils/tokens.js";

export const comparePasswords = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

export const protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  // check if a token is provided
  if (!token) {
    res.status(401).json({ error: "You are not authorized." });
    return;
  }

  // check if token is signed by the same secret
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Not a valid token!" });
  }
};

// Generate new access token
export const freshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;

  // Check if client has a refresh token
  if (!token) {
    return res.status(401).json({ error: "No refresh token." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = createAccessToken(user);
    setAccessTokenCookie(res, newAccessToken);
    res.status(200).json({ success: "Access token refreshed." });
  } catch (err) {
    res.status(403).json({ error: "Invalid refresh token." });
  }
};
