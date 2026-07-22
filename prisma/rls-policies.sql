-- Row Level Security — à exécuter dans l'éditeur SQL de Supabase après la première migration Prisma.
-- Principe : même si une route applicative a un bug, la base elle-même refuse
-- à un client de lire les données d'un autre client.

alter table "User" enable row level security;
alter table "Project" enable row level security;
alter table "Invoice" enable row level security;
alter table "Document" enable row level security;

-- Un utilisateur peut lire sa propre fiche
create policy "user_read_self" on "User"
  for select using (auth.uid()::text = id);

-- Un client ne voit que ses propres projets ; l'équipe/admin voit tout
-- (le rôle est vérifié via une fonction qui lit la table User, pas via un claim JWT
-- modifiable côté client)
create or replace function current_user_role()
returns text
language sql stable
set search_path = public
as $$
  select role::text from "User" where id = auth.uid()::text;
$$;

create policy "project_client_read_own" on "Project"
  for select using (
    "clientId" = auth.uid()::text
    or current_user_role() in ('TEAM', 'ADMIN')
  );

create policy "invoice_client_read_own" on "Invoice"
  for select using (
    "clientId" = auth.uid()::text
    or current_user_role() in ('TEAM', 'ADMIN')
  );

create policy "document_client_read_own" on "Document"
  for select using (
    exists (
      select 1 from "Project" p
      where p.id = "Document"."projectId"
      and (p."clientId" = auth.uid()::text or current_user_role() in ('TEAM', 'ADMIN'))
    )
  );

-- Aucune policy INSERT/UPDATE/DELETE n'est créée pour le rôle client à ce stade :
-- la phase 3 est volontairement en lecture seule. Les écritures (phase 4+)
-- passeront par des routes serveur qui utilisent la clé service_role,
-- jamais directement depuis le navigateur du client.
