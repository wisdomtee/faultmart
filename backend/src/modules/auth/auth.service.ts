import crypto from "crypto";
import { Prisma, Role, UserStatus } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import {
  hashPassword,
  comparePassword,
} from "../../utils/password";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JwtPayload,
} from "../../utils/jwt";

interface RegisterInput {
    firstName: string;
    lastName: string;
    identifier: string;
    password: string;
}

interface LoginDto {
  identifier: string;
  password: string;
}

class AuthService {
  /**
   * Hash refresh token before storing it in DB.
   * Never store the raw refresh token.
   */
  private hashRefreshToken(token: string): string {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  /**
   * Create JWT access + refresh tokens.
   */
  private createTokens(payload: JwtPayload) {
    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Save refresh token to database.
   */
  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ) {
    const tokenHash = this.hashRefreshToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        userAgent,
        ipAddress,
        expiresAt: new Date(
          Date.now() +
            30 * 24 * 60 * 60 * 1000
        ),
      },
    });
  }

  /**
   * Remove a refresh token from the database.
   */
  private async revokeRefreshToken(refreshToken: string) {
    const tokenHash = this.hashRefreshToken(refreshToken);

    await prisma.refreshToken.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  /**
   * Remove sensitive fields before returning a user.
   */
  private sanitizeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // Registration
  async register(
  data: RegisterDto,
  userAgent?: string,
  ipAddress?: string
) {
  const identifier = data.identifier?.trim();

if (!identifier) {
    throw new AppError("Email or phone is required.", 400);
}

const isEmail = identifier.includes("@");

const email = isEmail ? identifier : null;
const phone = !isEmail ? identifier : null;
  // Check email
  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new AppError("Email is already registered.", 409);
  }

  // Check phone
  if (data.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: {
        phone: data.phone,
      },
    });

    if (existingPhone) {
      throw new AppError("Phone number is already registered.", 409);
    }
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.$transaction(async (tx) => {
    return tx.user.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email,
        phone: data.phone,
        password: hashedPassword,

        role: Role.BUYER,

        status: UserStatus.ACTIVE,
      },
    });
  });

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = this.createTokens(payload);

  await this.saveRefreshToken(
    user.id,
    tokens.refreshToken,
    userAgent,
    ipAddress
  );

  return {
    user: this.sanitizeUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

  // Login
 async register(
  data: RegisterInput,
  userAgent?: string,
  ipAddress?: string
) {
  const identifier = data.identifier?.trim().toLowerCase();

  if (!identifier) {
    throw new AppError("Email or phone is required.", 400);
  }

  const isEmail = identifier.includes("@");

  const email = isEmail ? identifier : null;
  const phone = !isEmail ? identifier : null;


  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : undefined,
        phone ? { phone } : undefined,
      ].filter(Boolean) as Prisma.UserWhereInput[],
    },
  });


  if (existingUser) {
    throw new AppError(
      "Email or phone is already registered.",
      409
    );
  }


  const hashedPassword = await hashPassword(
    data.password
  );


  const user = await prisma.user.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),

      email,
      phone,

      password: hashedPassword,

      role: Role.BUYER,

      status: UserStatus.ACTIVE,
    },
  });


  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };


  const tokens = this.createTokens(payload);


  await this.saveRefreshToken(
    user.id,
    tokens.refreshToken,
    userAgent,
    ipAddress
  );


  return {
    user: this.sanitizeUser(user),

    accessToken: tokens.accessToken,

    refreshToken: tokens.refreshToken,
  };
}

  // Refresh Token
  async refresh(
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
) {
  if (!refreshToken) {
    throw new AppError("Refresh token is required.", 401);
  }

  // Verify JWT
  let payload: JwtPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token.", 401);
  }

  const tokenHash = this.hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!storedToken) {
    throw new AppError("Refresh token not found.", 401);
  }

  if (storedToken.revokedAt) {
    throw new AppError("Refresh token has been revoked.", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AppError("Refresh token has expired.", 401);
  }

  // Rotate token
  await prisma.refreshToken.delete({
    where: {
      id: storedToken.id,
    },
  });

  const newPayload: JwtPayload = {
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
  };

  const tokens = this.createTokens(newPayload);

  await this.saveRefreshToken(
    storedToken.user.id,
    tokens.refreshToken,
    userAgent,
    ipAddress
  );

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: this.sanitizeUser(storedToken.user),
  };
}

  // Logout
  async logout(refreshToken: string) {
  if (!refreshToken) {
    return;
  }

  await this.revokeRefreshToken(refreshToken);
}

  // Current User
  async getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return this.sanitizeUser(user);
}
}

export const authService = new AuthService();
