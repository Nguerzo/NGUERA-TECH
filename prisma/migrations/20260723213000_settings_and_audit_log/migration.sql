CREATE TABLE "CompanySettings" (
  "id" TEXT PRIMARY KEY DEFAULT 'default',
  "companyName" TEXT NOT NULL DEFAULT 'NGUERA SENEGALENSIS TECH',
  "companyEmail" TEXT,
  "companyPhone" TEXT,
  "defaultCurrency" TEXT NOT NULL DEFAULT 'GBP',
  "supportedCurrencies" TEXT[] NOT NULL DEFAULT ARRAY['GBP','FCFA','EUR','USD'],
  "supportedLocales" TEXT[] NOT NULL DEFAULT ARRAY['en','fr'],
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorId" TEXT NOT NULL REFERENCES "User"("id"),
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "detail" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog" ("createdAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog" ("actorId", "createdAt");

ALTER TABLE "CompanySettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_settings_admin_all" ON "CompanySettings"
  FOR ALL USING (current_user_role() = 'ADMIN');
CREATE POLICY "audit_log_admin_read" ON "AuditLog"
  FOR SELECT USING (current_user_role() = 'ADMIN');

insert into "CompanySettings" (id) values ('default') on conflict (id) do nothing;
