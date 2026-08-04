import { z } from "zod";
import {
  UserStatus,
  ListingStatus,
  ReportStatus,
} from "@prisma/client";


export const updateUserStatusSchema = z.object({

  body: z.object({

    status: z.nativeEnum(UserStatus),

  }),

});



export const updateListingStatusSchema = z.object({

  body: z.object({

    status: z.nativeEnum(ListingStatus),

  }),

});



export const updateReportStatusSchema = z.object({

  body: z.object({

    status: z.nativeEnum(ReportStatus),

  }),

});