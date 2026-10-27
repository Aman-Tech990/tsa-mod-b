/*
  Warnings:

  - The `discountType` column on the `Coupon` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('Fixed', 'Percent');

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "discountType",
ADD COLUMN     "discountType" "DiscountType" NOT NULL DEFAULT 'Fixed';

-- DropEnum
DROP TYPE "CouponType";
