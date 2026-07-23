-- Recreate LeadStatus with the full CRM pipeline (table is empty, safe to swap cleanly)
ALTER TABLE "Lead" ALTER COLUMN status DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN status TYPE text;
DROP TYPE "LeadStatus";
CREATE TYPE "LeadStatus" AS ENUM ('NOUVEAU','CONTACTE','QUALIFIE','PROPOSITION_ENVOYEE','NEGOCIATION','GAGNE','PERDU');
ALTER TABLE "Lead" ALTER COLUMN status TYPE "LeadStatus" USING status::"LeadStatus";
ALTER TABLE "Lead" ALTER COLUMN status SET DEFAULT 'NOUVEAU';

ALTER TABLE "Lead" ADD COLUMN "convertedClientId" TEXT;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_convertedClientId_key" UNIQUE ("convertedClientId");
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_convertedClientId_fkey" FOREIGN KEY ("convertedClientId") REFERENCES "User"("id") ON DELETE SET NULL;

CREATE TYPE "LeadActivityType" AS ENUM ('NOTE', 'STATUS_CHANGE', 'ATTACHMENT');

CREATE TABLE "LeadActivity" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
  "type" "LeadActivityType" NOT NULL,
  "content" TEXT,
  "oldStatus" "LeadStatus",
  "newStatus" "LeadStatus",
  "authorId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "LeadActivity_leadId_createdAt_idx" ON "LeadActivity" ("leadId", "createdAt");

CREATE TABLE "LeadAttachment" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
  "fileName" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "contentType" TEXT NOT NULL,
  "uploadedById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "LeadAttachment_leadId_idx" ON "LeadAttachment" ("leadId");

ALTER TABLE "LeadActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadAttachment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_activity_team_all" ON "LeadActivity"
  FOR ALL USING (current_user_role() IN ('TEAM', 'ADMIN'));

CREATE POLICY "lead_attachment_team_all" ON "LeadAttachment"
  FOR ALL USING (current_user_role() IN ('TEAM', 'ADMIN'));
