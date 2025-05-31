import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signLogin = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
