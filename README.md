# NGUERA SENEGALENSIS TECH — Espace client (Phase 3)

Authentification + espace client en lecture seule (projets, factures, documents).
Voir `architecture.md` (livré séparément) pour la vision d'ensemble et les phases suivantes.

## Ce que contient cette livraison

- Connexion sécurisée via Supabase Auth (email + mot de passe)
- Middleware qui protège `/dashboard`, `/projets`, `/factures`
- Contrôle des rôles (CLIENT / TEAM / ADMIN) avec Row Level Security en base — pas seulement côté application
- Trois pages client : vue d'ensemble, projets, factures — **lecture seule**, aucune écriture n'est encore possible depuis l'interface

## Ce que cette livraison ne contient pas encore

- Inscription libre (volontaire : les comptes clients sont créés par votre équipe après signature d'un devis — voir "Provisioning" ci-dessous)
- Paiement en ligne (phase 4)
- Back-office admin pour créer/modifier projets et factures (phase 5) — en attendant, la création se fait via Prisma Studio ou SQL directement
- Module IA (phase 6)

## Installation

```bash
npm install
cp .env.example .env
```

Remplissez `.env` avec les informations de votre projet Supabase (Project Settings → API et → Database).

## Mise en place de la base de données

```bash
npm run prisma:migrate    # crée les tables à partir de prisma/schema.prisma
```

Puis, dans l'éditeur SQL de Supabase, exécutez le contenu de `prisma/rls-policies.sql`.
C'est cette étape qui garantit qu'un client ne peut jamais lire les données d'un autre,
même en cas de bug côté application.

## Provisioning du premier compte (vous, en tant qu'admin)

Supabase Auth gère l'authentification (mot de passe, session) dans sa propre table
`auth.users`, séparée de votre table `User` métier. Les deux doivent partager le même `id`.

1. Dans le dashboard Supabase → Authentication → Users → **Add user**, créez votre compte (email + mot de passe).
2. Copiez l'UUID généré.
3. Dans Prisma Studio (`npm run prisma:studio`) ou en SQL, créez la ligne correspondante dans `User` :

```sql
insert into "User" (id, email, "fullName", role)
values ('UUID-COPIÉ-ICI', 'vous@ngueratech.com', 'Votre nom', 'ADMIN');
```

Répétez cette opération (avec `role = 'CLIENT'`) pour chaque client, une fois son devis signé.
Ce processus manuel sera remplacé par un formulaire admin en phase 5.

## Lancer en local

```bash
npm run dev
```

L'espace client est disponible sur `/login`, puis `/dashboard` après connexion.

## Phase 4 — Formulaire de contact → prospects réels

Le formulaire public (`/contact`) enregistre désormais chaque demande dans la table `Lead`
via une Server Action (`app/actions/lead.ts`), envoie un email de confirmation au prospect
et une notification interne à l'équipe via [Resend](https://resend.com).

### Ce qui est en place

- Validation complète côté serveur (Zod) — `lib/validation/lead.ts`
- Anti-spam par honeypot (champ invisible, jamais rempli par un humain)
- Rate limiting (5 tentatives / 10 minutes par IP, hachée avant stockage) — `lib/leads/guard.ts`
- Détection de doublon (même email soumis dans les 10 dernières minutes)
- Journalisation de toutes les tentatives (réussies, spam, erreurs) dans `ContactAttempt`
- Emails de confirmation en anglais britannique / français selon la langue du visiteur
- Notification interne en français (même langue que le reste du back-office)
- Aucun secret (clé Resend, clé service_role) n'est jamais envoyé au navigateur —
  tout passe par la Server Action, exécutée côté serveur uniquement

### Configuration Supabase (table `Lead`)

La table est créée par Prisma comme le reste du schéma :

```bash
npm run prisma:migrate
```

Puis, dans l'éditeur SQL de Supabase, exécutez le contenu mis à jour de
`prisma/rls-policies.sql` (section "Phase 4"). RLS est activé sur `Lead` et
`ContactAttempt` ; aucune policy n'autorise la clé `anon` à lire ou écrire —
seule la Server Action (via `DATABASE_URL`, jamais exposée au client) peut le
faire. L'équipe (rôle `TEAM`/`ADMIN`) pourra consulter les prospects depuis un
futur back-office admin grâce aux policies `lead_team_read` / `lead_team_update`.

### Configuration Resend

1. Créez un compte sur [resend.com](https://resend.com) et générez une clé API
   (Resend → API Keys).
2. Vérifiez un domaine d'envoi (Resend → Domains) — tant qu'aucun domaine n'est
   vérifié, utilisez l'adresse sandbox `onboarding@resend.dev` pour tester.
3. Renseignez dans `.env` :
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` — l'adresse d'envoi (doit appartenir au domaine vérifié)
   - `ADMIN_NOTIFICATION_EMAIL` — l'adresse qui reçoit chaque nouveau prospect

**Sans ces variables, le formulaire continue de fonctionner normalement** : le
prospect est bien enregistré en base, seul l'envoi des emails est
silencieusement désactivé (et journalisé comme tel dans `ContactAttempt`,
`outcome = "email_error"`). C'est un choix délibéré — l'enregistrement du
prospect ne doit jamais dépendre de la disponibilité du service d'emailing.

### Statuts d'un prospect

`NOUVEAU` → `A_CONTACTER` → `QUALIFIE` → `PROPOSITION_ENVOYEE` → `GAGNE` / `PERDU`.
Ces statuts se changent aujourd'hui via Prisma Studio (`npm run prisma:studio`)
ou SQL direct ; une interface admin dédiée est prévue en phase 5.

### Tests

```bash
npm test
```

Couvre la validation Zod et les fonctions pures anti-abus (honeypot, rate
limit, doublon) — voir `lib/validation/lead.test.ts` et `lib/leads/guard.test.ts`.
Ces tests n'appellent ni Supabase ni Resend : ils vérifient la logique de
décision en isolation.

## Prochaine étape recommandée

Phase 5 : back-office admin pour consulter/qualifier les prospects (`Lead`) et gérer
projets/factures, puis Stripe pour le premier moyen de paiement.
