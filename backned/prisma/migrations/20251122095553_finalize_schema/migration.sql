/*
  Warnings:

  - The `status` column on the `Adjustment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Receipt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `StockMove` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Transfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('draft', 'waiting', 'ready', 'done', 'cancelled');

-- AlterTable
ALTER TABLE "Adjustment" DROP COLUMN "status",
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "status",
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "status",
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "StockMove" ADD COLUMN     "documentId" INTEGER,
ADD COLUMN     "documentType" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'done';

-- AlterTable
ALTER TABLE "Transfer" DROP COLUMN "status",
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'draft';
