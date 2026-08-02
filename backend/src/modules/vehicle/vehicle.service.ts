import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import {
  CreateVehicleDto,
  UpdateVehicleDto,
} from "./vehicle.types";

class VehicleService {
  /**
   * Ensure listing exists
   */
  private async getListing(listingId: string) {
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing || listing.deletedAt) {
      throw new AppError("Listing not found.", 404);
    }

    return listing;
  }

  /**
   * Ensure vehicle exists
   */
  private async getVehicleByListing(listingId: string) {
    const vehicle = await prisma.vehicleDetail.findUnique({
      where: {
        listingId,
      },
    });

    if (!vehicle) {
      throw new AppError("Vehicle details not found.", 404);
    }

    return vehicle;
  }

  /**
   * Create vehicle details
   */
  async createVehicle(
    sellerId: string,
    listingId: string,
    data: CreateVehicleDto
  ) {
    const listing = await this.getListing(listingId);

    if (listing.sellerId !== sellerId) {
      throw new AppError(
        "You do not own this listing.",
        403
      );
    }

    const existing = await prisma.vehicleDetail.findUnique({
      where: {
        listingId,
      },
    });

    if (existing) {
      throw new AppError(
        "Vehicle details already exist for this listing.",
        409
      );
    }

    return prisma.vehicleDetail.create({
      data: {
        listingId,
        ...data,
      },

      include: {
        listing: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });
  }

  /**
   * Get vehicle details
   */
  async getVehicle(listingId: string) {
    await this.getListing(listingId);

    return this.getVehicleByListing(listingId);
  }

  /**
   * Update vehicle details
   */
  async updateVehicle(
    sellerId: string,
    listingId: string,
    data: UpdateVehicleDto
  ) {
    const listing = await this.getListing(listingId);

    if (listing.sellerId !== sellerId) {
      throw new AppError(
        "You do not own this listing.",
        403
      );
    }

    await this.getVehicleByListing(listingId);

    return prisma.vehicleDetail.update({
      where: {
        listingId,
      },

      data,

      include: {
        listing: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });
  }

  /**
   * Delete vehicle details
   */
  async deleteVehicle(
    sellerId: string,
    listingId: string
  ) {
    const listing = await this.getListing(listingId);

    if (listing.sellerId !== sellerId) {
      throw new AppError(
        "You do not own this listing.",
        403
      );
    }

    await this.getVehicleByListing(listingId);

    await prisma.vehicleDetail.delete({
      where: {
        listingId,
      },
    });

    return {
      success: true,
      message: "Vehicle details deleted successfully.",
    };
  }
}

export const vehicleService = new VehicleService();