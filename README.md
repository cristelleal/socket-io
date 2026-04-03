# Yam Master ♥

Jeu mobile multijoueur temps reel base sur React Native + Expo, backend Socket.IO/Express, persistence PostgreSQL via Prisma, authentification Better Auth.

## Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Organisation du code](#organisation-du-code)
- [Sections du jeu](#sections-du-jeu)
- [Points forts](#points-forts)
- [Installation locale](#installation-locale)
- [Tests backend](#tests-backend)
- [Local vs production sur Expo](#local-vs-production-sur-expo)
- [Production et infrastructure](#production-et-infrastructure)
- [Best practices](#best-practices)
- [Roadmap technique courte](#roadmap-technique-courte)

## Vue d'ensemble

| Item | Valeur |
|---|---|
| Plateforme | iOS, Android, Web (Expo) |
| Backend runtime | Node.js + Express + Socket.IO |
| Base de donnees | PostgreSQL 16 |
| ORM | Prisma |
| Auth | Better Auth (adapter Prisma) |
| Dev infra locale | Docker Compose + Adminer |
| Infra prod | Home Server + Traefik + Docker Compose |

## Architecture

### Principes

- Decoupage par features: auth, game, matchmaking, rank, bot.
- Separation transport/metier/persistence avec Repository pattern.
- Contrats de donnees explicites sur les evenements Socket et les reponses HTTP, via payloads TypeScript types.
- Injection de dependances au niveau des modules (client Prisma partage, auth adapter, contextes React).

### Stack logicielle

| Couche | Technologies | Responsabilites |
|---|---|---|
| Frontend mobile | Expo 54, React Native 0.81, TypeScript, React Navigation, socket.io-client | UI, navigation, etat de session, orchestration realtime |
| Backend | Node.js, Express, Socket.IO, TypeScript | Matchmaking, game loop, regles metier, API classement |
| Auth | Better Auth + Prisma Adapter | Inscription, connexion, sessions, trusted origins |
| Data | PostgreSQL 16, Prisma ORM | GameResult, users, sessions, leaderboard |
| Infra | Docker Compose, Adminer (local), Traefik (prod), EAS (mobile build) | Execution locale, visualisation BDD, exposition TLS, distribution |

## Organisation du code

| Cible | Structure | Role |
|---|---|---|
| Frontend | src/components | Composants UI reutilisables (board, grid, timer, score, etc.) |
| Frontend | src/modules | Logique de feature et orchestration d'ecran |
| Frontend | src/screens | Points d'entree applicatifs (Home, Online, Vs Bot, Rank, Rules, Auth) |
| Backend | src/bootstrap | Initialisation technique (socket server bootstrap) |
| Backend | src/generated | Client Prisma genere et artefacts associes |
| Backend | src/modules | Logique par feature (auth, game, matchmaking, rank, bot) |
| Backend | src/shared | Briques transverses (etat serveur, client Prisma, types) |

## Sections du jeu

| Section | Description fonctionnelle |
|---|---|
| Menu principal | Point d'entree vers parties online, bot, classement, regles |
| Game Loop online | Matchmaking, attribution player:1/player:2, tours, timer, scoring, fin de partie |
| Mode Vs Bot | Variante solo de la boucle de jeu |
| Classement | Endpoint backend de leaderboard, aggregation des resultats |
| Authentification | Session utilisateur, profils, securisation du flux auth |
| Regles | Ecran dedie expliquant combinaisons et mecaniques |

## Points forts

- Realtime robuste avec protocole evenementiel Socket.IO clair (join queue, start game, updates, end game).
- Domaine explicite: game service centralise regles, combinaisons, score et conditions de victoire.
- Persistence maintenable: GameRepository isole l'ecriture des resultats.
- Front modulaire: separation components/modules/screens pour reduire le couplage.
- Multi-environnements natifs: local, preview, production via profils EAS et compose overrides.
- Data ownership: backend auto-heberge sur Home Server.

## Installation locale

### Prerequis

- Node.js 20+
- npm 10+
- Docker + Docker Compose 

### 1. Cloner et preparer les variables

~~~bash
git clone <repo-url>
cd socket-io
cp .env.example .env
~~~

Variables minimales a renseigner dans .env:

- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- DATABASE_URL
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- TRUSTED_ORIGINS

### 2. Demarrer PostgreSQL + Adminer

~~~bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d db adminer
~~~

Visualisation de la base:

- Adminer: http://localhost:8080

### 3. Lancer le backend

~~~bash
cd backend
npm install
npx prisma migrate deploy
npm run test
npm run dev
~~~

Backend local: http://localhost:3000

### 4. Lancer le frontend Expo

~~~bash
cd frontend
npm install
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000 npx expo start
~~~

## Tests backend

Depuis le dossier backend:

~~~bash
cd backend
npm run test
~~~

Mode watch:

~~~bash
cd backend
npm run test:watch
~~~

Couverture actuelle (tests unitaires):

- Game helpers
- Game service
- Bot service
- Matchmaking service
- Game repository
- Rank repository
- Rank handler

## Local vs production sur Expo

Le frontend lit l'endpoint backend via EXPO_PUBLIC_SOCKET_URL. Le code applicatif reste identique; seule la variable d'environnement change selon l'environnement cible.

| Environnement | Build ou run | URL backend injectee | Resultat |
|---|---|---|---|
| Local dev | npx expo start | http://localhost:3000 | L'app consomme le backend local |
| Preview EAS | eas build --profile preview | https://yatzy.puglabz.com | Build interne connectee a la prod |
| Production EAS | eas build --profile production | https://yatzy.puglabz.com | Build store-ready connectee a la prod |

Commandes de reference:

~~~bash
# Local
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000 npx expo start

# Preview
EXPO_PUBLIC_SOCKET_URL=https://yatzy.puglabz.com eas build --profile preview --platform ios

# Production
EXPO_PUBLIC_SOCKET_URL=https://yatzy.puglabz.com eas build --profile production --platform ios
~~~

Notes reseau mobile:

- Simulateur iOS: localhost fonctionne.
- Appareil physique: utiliser l'IP LAN de la machine backend.

Limitation actuelle de deploiement frontend:

- Le host/deploiement frontend n'a pas pu etre finalise completement cote iOS, faute de compte Apple Developer.
- Sans compte Apple Developer, il n'est pas possible de produire une preview iOS coherente via EAS Build (signature/provisioning).

## Production et infrastructure

| Composant | Choix |
|---|---|
| Hebergement backend | Home Server prive |
| Reverse proxy | Traefik |
| TLS | Certificats geres via Traefik |
| Persistance BDD | Volume Docker PostgreSQL |
| Domaine | yatzy.puglabz.com |

Commande de deploiement:

~~~bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
~~~

