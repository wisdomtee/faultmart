/*
  Warnings:

  - The values [SYSTEM,MESSAGE,OFFER,ORDER,PAYMENT,REVIEW,REPORT] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `data` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vin]` on the table `VehicleDetail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VehicleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DriveType" AS ENUM ('FWD', 'RWD', 'AWD', 'FOUR_WD');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."NotificationType_new" AS ENUM ('OFFER_RECEIVED', 'OFFER_ACCEPTED', 'OFFER_REJECTED', 'NEW_MESSAGE', 'PAYMENT_SUCCESSFUL', 'ORDER_CONFIRMED', 'DELIVERY_UPDATED', 'NEW_REVIEW', 'ADMIN_ACTION');
ALTER TABLE "public"."Notification" ALTER COLUMN "type" TYPE "public"."NotificationType_new" USING ("type"::text::"public"."NotificationType_new");
ALTER TYPE "public"."NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "public"."NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- DropIndex
DROP INDEX "public"."Notification_createdAt_idx";

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "data",
ADD COLUMN     "referenceId" TEXT,
ADD COLUMN     "referenceType" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."VehicleDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "doors" INTEGER,
ADD COLUMN     "driveType" "public"."DriveType",
ADD COLUMN     "owners" INTEGER,
ADD COLUMN     "plateNumber" TEXT,
ADD COLUMN     "registered" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDetail_vin_key" ON "public"."VehicleDetail"("vin");

-- CreateIndex
CREATE INDEX "VehicleDetail_make_idx" ON "public"."VehicleDetail"("make");

-- CreateIndex
CREATE INDEX "VehicleDetail_model_idx" ON "public"."VehicleDetail"("model");

-- CreateIndex
CREATE INDEX "VehicleDetail_year_idx" ON "public"."VehicleDetail"("year");

-- CreateIndex
CREATE INDEX "VehicleDetail_fuelType_idx" ON "public"."VehicleDetail"("fuelType");

-- CreateIndex
CREATE INDEX "VehicleDetail_transmission_idx" ON "public"."VehicleDetail"("transmission");
