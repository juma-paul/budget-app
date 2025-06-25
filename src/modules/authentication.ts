import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configs } from "../config/index.js";
import { createAccessToken, setAccessTokenCookie } from "../utils/tokens.js";

export const comparePasswords = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

export const protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  // Check if a token is provided
  if (!token) {
    res.status(401).json({ error: "You are not authorized." });
    return;
  }

  // Check if token is signed by the same secret
  try {
    const user = jwt.verify(token, configs.secrets.jwt_secret);
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
    const user = jwt.verify(token, configs.secrets.jwt_refresh_secret);
    const newAccessToken = createAccessToken(user);
    setAccessTokenCookie(res, newAccessToken);
    res.status(200).json({ success: "Access token refreshed." });
  } catch (err) {
    res.status(403).json({ error: "Invalid refresh token." });
  }
};
