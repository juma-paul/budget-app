import prisma from "../database.js";
import {
  comparePasswords,
  hashPassword,
  createJwtToken,
} from "../modules/authentication.js";

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

    const token = createJwtToken(user);
    return res.json({ token: token });
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

    // check if we found a user
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // check if the password provided is valid
    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    const token = createJwtToken(user);
    return res.json({ token: token });
  } catch (err) {
    err.type = "input";
    next(err);
  }
};
