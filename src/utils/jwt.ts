import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { SignOptions } from "jsonwebtoken";

export const signToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_SECRET, { 
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
});
  //return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};
