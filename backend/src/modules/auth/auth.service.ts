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

interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Hash refresh token before storing in DB
   */
  private hashRefreshToken(token: string): string {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  /**
   * Create JWT tokens
   */
  private createTokens(payload: JwtPayload) {
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

  /**
   * Save refresh token
   */
  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ) {
    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashRefreshToken(refreshToken),
        userAgent: userAgent ?? null,
        ipAddress: ipAddress ?? null,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
      },
    });
  }

  /**
   * Remove refresh token
   */
  private async revokeRefreshToken(
    refreshToken: string
  ) {
    await prisma.refreshToken.deleteMany({
      where: {
        tokenHash:
          this.hashRefreshToken(refreshToken),
      },
    });
  }

  /**
   * Remove password before returning user
   */
  private sanitizeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
 * Register User
 */
async register(
  data: RegisterDto,
  userAgent?: string,
  ipAddress?: string
) {
  const email = data.email.trim().toLowerCase();

  // Check email
  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new AppError(
      "Email is already registered.",
      409
    );
  }

  // Check phone (if supplied)
  if (data.phone) {
    const existingPhone =
      await prisma.user.findUnique({
        where: {
          phone: data.phone,
        },
      });

    if (existingPhone) {
      throw new AppError(
        "Phone number is already registered.",
        409
      );
    }
  }

  const hashedPassword =
    await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName.trim(),

      lastName: data.lastName.trim(),

      email,

      phone: data.phone ?? null,

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

  const tokens =
    this.createTokens(payload);

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

/**
 * Login User
 */
async login(
  data: LoginDto,
  userAgent?: string,
  ipAddress?: string
) {
  const email = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatches = await comparePassword(
    data.password,
    user.password
  );

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(
      "Your account is not active.",
      403
    );
  }

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
/**
 * Refresh Access Token
 */
async refresh(
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
) {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token is required.",
      401
    );
  }

  let payload: JwtPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(
      "Invalid or expired refresh token.",
      401
    );
  }

  const tokenHash =
    this.hashRefreshToken(refreshToken);

  const storedToken =
    await prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: true,
      },
    });

  if (!storedToken) {
    throw new AppError(
      "Refresh token not found.",
      401
    );
  }

  if (storedToken.revokedAt) {
    throw new AppError(
      "Refresh token has been revoked.",
      401
    );
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AppError(
      "Refresh token has expired.",
      401
    );
  }

  // Rotate refresh token
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

  const tokens =
    this.createTokens(newPayload);

  await this.saveRefreshToken(
    storedToken.user.id,
    tokens.refreshToken,
    userAgent,
    ipAddress
  );

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: this.sanitizeUser(
      storedToken.user
    ),
  };
}

/**
 * Logout
 */
async logout(refreshToken: string) {
  if (!refreshToken) return;

  await this.revokeRefreshToken(
    refreshToken
  );
}

/**
 * Current User
 */
async getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  return this.sanitizeUser(user);
}
}

export const authService = new AuthService();