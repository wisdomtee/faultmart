import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma";

export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }
}