import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || "secret");
};

export const refreshToken = (userId: string): string => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    { expiresIn: "30d" }
  );
};
