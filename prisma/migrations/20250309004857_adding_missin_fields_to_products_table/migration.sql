/*
  Warnings:

  - Added the required column `shortDescription` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `sku` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "color" TEXT,
ADD COLUMN     "isBestChoice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "size" TEXT,
ALTER COLUMN "sku" SET NOT NULL;
