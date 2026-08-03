import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};