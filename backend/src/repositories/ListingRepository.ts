import { Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

export class ListingRepository extends BaseRepository {
  findById(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.listing.findUnique({
      where: { slug },
    });
  }

  findByIdWithImages(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
  }

  update(id: string, data: Prisma.ListingUpdateInput) {
    return this.prisma.listing.update({
      where: { id },
      data,
    });
  }

  incrementViews(id: string) {
    return this.prisma.listing.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  softDelete(id: string) {
    return this.prisma.listing.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const listingRepository = new ListingRepository();