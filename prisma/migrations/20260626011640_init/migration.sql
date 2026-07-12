-- CreateEnum
CREATE TYPE "Category" AS ENUM ('RESTAURANT', 'CAFE', 'GROCERY_MARKET', 'RETAIL_SHOP', 'SERVICES', 'COMPANY_B2B', 'ACCOMMODATION', 'OTHER');

-- CreateEnum
CREATE TYPE "Governorate" AS ENUM ('TUNIS', 'ARIANA', 'BEN_AROUS', 'MANOUBA', 'NABEUL', 'ZAGHOUAN', 'BIZERTE', 'BEJA', 'JENDOUBA', 'KEF', 'SILIANA', 'SOUSSE', 'MONASTIR', 'MAHDIA', 'SFAX', 'KAIROUAN', 'KASSERINE', 'SIDI_BOUZID', 'GABES', 'MEDENINE', 'TATAOUINE', 'GAFSA', 'TOZEUR', 'KEBILI');

-- CreateEnum
CREATE TYPE "Practice" AS ENUM ('PLANT_BASED_OPTIONS', 'LOCALLY_SOURCED', 'ZERO_WASTE_COMPOSTING', 'NO_SINGLE_USE_PLASTIC', 'REUSABLE_PACKAGING', 'BULK_PACKAGE_FREE', 'RENEWABLE_ENERGY', 'WATER_CONSERVATION', 'RECYCLING_PROGRAM', 'ANTI_FOOD_WASTE', 'FAIR_ETHICAL_LABOR', 'BIKE_EV_FRIENDLY');

-- CreateEnum
CREATE TYPE "CertificationType" AS ENUM ('ORGANIC_BIO_TUNISIE', 'EU_ORGANIC', 'USDA_ORGANIC', 'FAIR_TRADE', 'ISO_14001', 'B_CORP', 'EU_ECOLABEL', 'GREEN_KEY', 'LEED', 'MSC');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Verification" AS ENUM ('SELF_DECLARED', 'EVIDENCE_PROVIDED', 'ADMIN_VERIFIED');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "governorate" "Governorate" NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "priceRange" INTEGER,
    "images" TEXT[],
    "tags" TEXT[],
    "practices" "Practice"[],
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "verification" "Verification" NOT NULL DEFAULT 'SELF_DECLARED',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessCertification" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "CertificationType" NOT NULL,
    "issuer" TEXT,
    "year" INTEGER,
    "evidenceUrl" TEXT,

    CONSTRAINT "BusinessCertification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_status_idx" ON "Business"("status");

-- CreateIndex
CREATE INDEX "Business_category_idx" ON "Business"("category");

-- CreateIndex
CREATE INDEX "Business_governorate_idx" ON "Business"("governorate");

-- CreateIndex
CREATE INDEX "BusinessCertification_businessId_idx" ON "BusinessCertification"("businessId");

-- AddForeignKey
ALTER TABLE "BusinessCertification" ADD CONSTRAINT "BusinessCertification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
