import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  DATABASE_URL: process.env.DATABASE_URL!,

  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY!,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  ACCESS_TOKEN_EXPIRES:
    process.env.ACCESS_TOKEN_EXPIRES || "15m",

  REFRESH_TOKEN_EXPIRES:
    process.env.REFRESH_TOKEN_EXPIRES || "30d",
};
