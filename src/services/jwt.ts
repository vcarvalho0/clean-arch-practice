import { env } from "@/env";
import jwt from "jsonwebtoken";

export interface JwtToken {
  sub: string;
}

export default class JwtService {
  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, env.SECRET_JWT_KEY, {
      expiresIn: "1h"
    });
  }

  public static verifyToken(token: string): JwtToken {
    return jwt.verify(token, env.SECRET_JWT_KEY) as JwtToken;
  }
}
