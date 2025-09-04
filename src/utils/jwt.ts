import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET as string) || "jwt_secret";
const JWT_EXPIRES_IN = "1h";

type JwtPayload = {
  id: string | number;
  role: string;
};

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
