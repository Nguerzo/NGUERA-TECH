CREATE TYPE "ContractStatus" AS ENUM ('BROUILLON', 'ENVOYE', 'SIGNE');

CREATE TABLE "Contract" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "clientId" TEXT NOT NULL REFERENCES "User"("id"),
  "projectId" TEXT REFERENCES "Project"("id"),
  "status" "ContractStatus" NOT NULL DEFAULT 'BROUILLON',
  "fileName" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "contentType" TEXT NOT NULL,
  "signedAt" TIMESTAMP(3),
  "uploadedById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "Contract_clientId_idx" ON "Contract" ("clientId");

ALTER TABLE "Contract" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contract_team_all" ON "Contract"
  FOR ALL USING (current_user_role() IN ('TEAM', 'ADMIN'));
CREATE POLICY "contract_client_read_own" ON "Contract"
  FOR SELECT USING ("clientId" = auth.uid()::text);

insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

create policy "contracts_team_read" on storage.objects
  for select using (bucket_id = 'contracts' and current_user_role() in ('TEAM', 'ADMIN'));
create policy "contracts_team_write" on storage.objects
  for insert with check (bucket_id = 'contracts' and current_user_role() in ('TEAM', 'ADMIN'));
create policy "contracts_team_delete" on storage.objects
  for delete using (bucket_id = 'contracts' and current_user_role() in ('TEAM', 'ADMIN'));
