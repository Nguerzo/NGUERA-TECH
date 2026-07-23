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

-- Phase 4 — Lead / ContactAttempt (formulaire de contact public).
-- RLS activé, AUCUNE policy créée pour anon/authenticated : ces tables ne sont
-- accessibles ni en lecture ni en écriture via l'API PostgREST/anon key.
-- Toutes les opérations passent par app/actions/lead.ts, qui utilise Prisma
-- via DATABASE_URL (rôle postgres, exécuté uniquement côté serveur — jamais
-- exposé au navigateur). C'est la même défense en profondeur que pour les
-- tables ci-dessus : même en cas de bug applicatif ou de fuite de la clé anon,
-- personne ne peut lire ou écrire un prospect directement depuis le client.
alter table "Lead" enable row level security;
alter table "ContactAttempt" enable row level security;

-- L'équipe interne (TEAM/ADMIN) peut consulter les prospects depuis le futur
-- back-office admin, en réutilisant la même fonction current_user_role()
-- que pour Project/Invoice — pas de nouvelle surface d'accès à auditer.
create policy "lead_team_read" on "Lead"
  for select using (current_user_role() in ('TEAM', 'ADMIN'));

create policy "lead_team_update" on "Lead"
  for update using (current_user_role() in ('TEAM', 'ADMIN'));

-- ContactAttempt reste un journal interne : aucune policy de lecture, même
-- pour TEAM/ADMIN — consultez-le via Prisma Studio ou SQL direct si besoin.
