import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { comparePassword, hashPassword } from "../../utils/password";
import {
  UpdateProfileDto,
  ChangePasswordDto,
} from "./user.types";

class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        verificationStatus: true,
        profileImage: true,
        bio: true,
        gender: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return user;
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDto
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new AppError("User not found.", 404);
    }

    if (data.username) {
      const usernameExists = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: {
            id: userId,
          },
        },
      });

      if (usernameExists) {
        throw new AppError("Username already taken.", 409);
      }
    }

    if (data.phone) {
      const phoneExists = await prisma.user.findFirst({
        where: {
          phone: data.phone,
          NOT: {
            id: userId,
          },
        },
      });

      if (phoneExists) {
        throw new AppError("Phone number already in use.", 409);
      }
    }

    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        profileImage: true,
        bio: true,
        gender: true,
      },
    });
  }

  async changePassword(
    userId: string,
    data: ChangePasswordDto
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const validPassword = await comparePassword(
      data.currentPassword,
      user.password
    );

    if (!validPassword) {
      throw new AppError(
        "Current password is incorrect.",
        400
      );
    }

    const hashedPassword = await hashPassword(
      data.newPassword
    );

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: "Password changed successfully.",
    };
  }

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message: "Account deleted successfully.",
    };
  }
}

export const userService = new UserService();