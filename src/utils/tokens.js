import jwt from "jsonwebtoken";
import { configs } from "../config/index.js";

// Access token helper functions
export const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, username: user.username },
    configs.secrets.jwt_secret,
    { exp: "15m" }
  );
};

export const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: configs.env === "production",
    sameSite: configs.env === "production" ? "None" : "Lax",
    path: "/",
  });
};

export const clearAccessTokenCookie = (res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: configs.env === "production",
    sameSite: configs.env === "production" ? "None" : "Lax",
    path: "/",
  });
};

// Refresh token helper functions
export const createRefreshToken = (user) => {
  return jwt.sign({ sub: user.id }, configs.secrets.jwt_refresh_secret, {
    exp: "7d",
  });
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: configs.env === "production",
    sameSite: configs.env === "production" ? "None" : "Lax",
    path: "/refresh-token",
  });
};
export const clearRefreshTokenCookie = (res) => {
  res.cookie("refreshToken", {
    httpOnly: true,
    secure: configs.env === "production",
    sameSite: configs.env === "production" ? "None" : "Lax",
    path: "/refresh-token",
  });
};
