import { Request, Response, NextFunction } from "express";
import JwtService from "@/services/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  try {
    const formatToken = token?.split(" ")[1];
    const claims = JwtService.verifyToken(formatToken as string);
    req.headers.user = claims.sub;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send({ code: 401, error: error.message });
    } else {
      res.status(401).send({ code: 401, error: "Unknown Error" });
    }
  }
}
