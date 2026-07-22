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

## Prochaine étape recommandée

Phase 4 : activer l'écriture (création de projets/factures côté admin) et brancher Stripe
pour le premier moyen de paiement. Le schéma de données n'a pas besoin de changer pour ça —
seules des routes serveur protégées par `service_role` seront ajoutées.
