CREATE TYPE "QuoteStatus" AS ENUM ('BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'EXPIRE');

CREATE TABLE "Quote" (
  "id" TEXT PRIMARY KEY,
  "number" TEXT NOT NULL UNIQUE,
  "clientId" TEXT NOT NULL REFERENCES "User"("id"),
  "projectId" TEXT REFERENCES "Project"("id"),
  "status" "QuoteStatus" NOT NULL DEFAULT 'BROUILLON',
  "currency" TEXT NOT NULL DEFAULT 'GBP',
  "validUntil" TIMESTAMP(3),
  "notes" TEXT,
  "createdById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "Quote_clientId_idx" ON "Quote" ("clientId");

CREATE TABLE "QuoteItem" (
  "id" TEXT PRIMARY KEY,
  "quoteId" TEXT NOT NULL REFERENCES "Quote"("id") ON DELETE CASCADE,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(65,30) NOT NULL DEFAULT 1,
  "unitPrice" DECIMAL(65,30) NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX "QuoteItem_quoteId_idx" ON "QuoteItem" ("quoteId");

ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuoteItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quote_team_all" ON "Quote"
  FOR ALL USING (current_user_role() IN ('TEAM', 'ADMIN'));
CREATE POLICY "quote_client_read_own" ON "Quote"
  FOR SELECT USING ("clientId" = auth.uid()::text);

CREATE POLICY "quote_item_team_all" ON "QuoteItem"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "Quote" q WHERE q.id = "QuoteItem"."quoteId" AND current_user_role() IN ('TEAM', 'ADMIN'))
  );
CREATE POLICY "quote_item_client_read_own" ON "QuoteItem"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Quote" q WHERE q.id = "QuoteItem"."quoteId" AND q."clientId" = auth.uid()::text)
  );
