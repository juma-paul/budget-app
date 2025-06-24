import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const comparePasswords = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

export const createJwtToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );

  return token;
};

export const protect = (req, res, next) => {
  const token = req.cookies.token;

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
