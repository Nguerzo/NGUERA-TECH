-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NOUVEAU', 'A_CONTACTER', 'QUALIFIE', 'PROPOSITION_ENVOYEE', 'GAGNE', 'PERDU');

-- CreateEnum
CREATE TYPE "LeadLocale" AS ENUM ('en', 'fr');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "service" TEXT,
    "projectDescription" TEXT,
    "budget" TEXT,
    "currency" TEXT,
    "timeline" TEXT,
    "contactPreference" TEXT,
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "locale" "LeadLocale" NOT NULL DEFAULT 'en',
    "source" TEXT NOT NULL DEFAULT 'website_contact_form',
    "status" "LeadStatus" NOT NULL DEFAULT 'NOUVEAU',
    "confirmationEmailSentAt" TIMESTAMP(3),
    "adminNotifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactAttempt" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "email" TEXT,
    "outcome" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "ContactAttempt_ipHash_createdAt_idx" ON "ContactAttempt"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "ContactAttempt_email_createdAt_idx" ON "ContactAttempt"("email", "createdAt");
