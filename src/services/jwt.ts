import jwt from "jsonwebtoken";

export interface JwtToken {
  sub: string;
}

export default class JwtService {
  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, "secretjwtkey", {
      expiresIn: "1h"
    });
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, "secretjwtkey") as JwtToken;
  }
}
