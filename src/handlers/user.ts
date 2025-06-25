import prisma from "../database.js";
import { comparePasswords, hashPassword } from "../modules/authentication.js";
import {
  createAccessToken,
  setAccessTokenCookie,
  clearAccessTokenCookie,
  createRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/tokens.js";

// Create a new user
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, acceptedTerms, acceptedPrivacy } =
      req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return res
        .status(400)
        .json({ error: "You must accept terms and privacy policy." });
    }
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await hashPassword(password),
        acceptedTerms,
        acceptedPrivacy,
      },
    });

    // Create tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Set tokens as cookies
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: `Welcome, ${username}! We're happy to have you on board`,
    });
  } catch (err) {
    err.type = "input";
    next(err);
  }
};

// Login a user
export const logIn = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    // Check if we found a user
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // Check if the password provided is valid
    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Create tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Set tokens as cookies
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({ success: "Successfully logged in." });
  } catch (err) {
    err.type = "input";
    next(err);
  }
};

// Logout a user
export const logOut = (req, res) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);

  return res.status(200).json({ success: "Logged out successfully." });
};
