# Yam Master ♥

### https://socket-io-lac.vercel.app/

Jeu mobile multijoueur temps reel base sur React Native + Expo, backend Socket.IO/Express, persistence PostgreSQL via Prisma, authentification Better Auth.

## Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Organisation du code](#organisation-du-code)
- [Sections du jeu](#sections-du-jeu)
- [Points forts](#points-forts)
- [Installation locale](#installation-locale)
- [Tests backend](#tests-backend)
- [Environnements d'execution](#environnements-dexecution)
- [Production et infrastructure](#production-et-infrastructure)

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
| **Etat backend** | ✓ Deployé et operationel sur serveur physique privé |
| **Etat frontend** | ✓ Vercel (Web operationel), Mobile en attente (frais trop importants pour plateformes mobiles) |
| Domaine backend | https://yatzy.puglabz.com |

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
| Mode Vs Bot | Variante solo de la boucle de jeu (3 niveaux de difficultés)|
| Classement | Endpoint backend de leaderboard, aggregation des resultats |
| Authentification | Session utilisateur, profils, securisation du flux auth |
| Regles | Ecran dedie expliquant combinaisons et mecaniques |

## Points forts

- Realtime robuste avec protocole evenementiel Socket.IO clair (join queue, start game, updates, end game).
- Domaine explicite: game service centralise regles, combinaisons, score et conditions de victoire.
- Persistence maintenable: GameRepository isole l'ecriture des resultats.
- Front modulaire: separation components/modules/screens pour reduire le couplage.
- Multi-environnements natifs: local et production
- Data ownership: backend auto-heberge sur Home Server personnel

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

Variables a renseigner dans .env:

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

- Adminer (outil de visualisation BDD dockerisé): http://localhost:8080

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

## Environnements d'execution

### Frontend local et dev

Le frontend lit l'endpoint backend via EXPO_PUBLIC_SOCKET_URL:

~~~bash
# Local dev (Expo native)
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000 npx expo start

# Local dev (Expo Web)
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000 npx expo start --web
~~~

Notes reseau mobile:

- Simulateur iOS: localhost fonctionne.
- Appareil physique: utiliser l'IP LAN de la machine backend.

### Frontend en production

| Environnement | Plateforme | URL | Etat |
|---|---|---|---|
| Vercel | Web (React Native Web) | https://socket-io-lac.vercel.app | ✓ Operationel |
| Mobile | iOS/Android (Expo EAS) | https://yatzy.puglabz.com | X Non disponible (frais plateformes) |

Notes deploiement Vercel:

- Les appels auth (`/api/auth/*`) sont proxifies via `vercel.json` vers le backend pour eviter les problemes de cookies cross-domain.
- Socket.IO se connecte directement a `https://yatzy.puglabz.com`.

## Production et infrastructure

| Composant | Choix |
|---|---|
| Hébergement backend | Home Server privé (✓ Déployé) |
| Hébergement frontend Web | Vercel (✓ Déployé) |
| Mobile frontend | En attente (limitations iOS/Android d'ordre financière) |
| Reverse proxy | Traefik |
| TLS | Cloudflare |
| Persistance BDD | Volume Docker PostgreSQL |
| Domaine backend | yatzy.puglabz.com |
| Logs | Dozzle + logs Traefik |

Le projet étant hébergé sur un serveur privé, un accès à Dozzle est disponible pour consulter les logs des conteneurs Docker en temps réel. Cela permet de monitorer le comportement du backend, détecter des erreurs et renforcer la sécurité en auditant l'activité des services. Les logs Traefik complètent ce dispositif en traçant l'ensemble du trafic HTTP entrant au niveau du reverse proxy.

