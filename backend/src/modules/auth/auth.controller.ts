import { Request, Response, NextFunction } from "express";

import { authService } from "./auth.service";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  REFRESH_COOKIE_NAME,
} from "../../utils/cookies";

class AuthController {
  register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("REGISTER BODY:", req.body);

  try {
    const result = await authService.register(
      req.body,
      req.headers["user-agent"],
      req.ip
    );

    // ...

      setRefreshTokenCookie(res, result.refreshToken);

      return res.status(201).json({
        success: true,
        message: "Registration successful.",
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await authService.login(
        req.body,
        req.headers["user-agent"],
        req.ip
      );

      setRefreshTokenCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await authService.forgotPassword(
        req.body.email
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await authService.resetPassword(
        req.body.token,
        req.body.password
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

      const result = await authService.refresh(
        refreshToken,
        req.headers["user-agent"],
        req.ip
      );

      setRefreshTokenCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

      await authService.logout(refreshToken);

      clearRefreshTokenCookie(res);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const user = await authService.getCurrentUser(
        req.user.userId
      );

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();