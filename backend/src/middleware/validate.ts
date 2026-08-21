import { NextFunction, Request, Response } from "express";
import { ZodTypeAny, ZodError } from "zod";

export const validate =
  (schema: ZodTypeAny) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as {
        body?: any;
        params?: any;
        query?: any;
      };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      if (parsed.params !== undefined) {
        Object.assign(req.params, parsed.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: error.issues,
        });
      }

      next(error);
    }
  };
