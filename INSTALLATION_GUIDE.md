# Mirleft Travel Platform

## Installation et Configuration

### Prérequis

* PHP 8.3 ou supérieur
* Composer
* Node.js 16 ou supérieur
* MySQL ou SQLite

---

## Installation du Backend

Se placer dans le dossier backend :

```bash
cd mirleft-backend
```

Installer les dépendances :

```bash
composer install
```

Copier le fichier d’environnement et générer la clé :

```bash
cp .env.example .env
php artisan key:generate
```

Configurer la base de données dans le fichier `.env`.

Exécuter les migrations :

```bash
php artisan migrate
```

Démarrer le serveur :

```bash
php artisan serve
```

Le backend sera accessible sur :

```text
http://127.0.0.1:8000
```

---

## Installation du Frontend

Se placer dans le dossier frontend :

```bash
cd mirleft-frontend
```

Installer les dépendances :

```bash
npm install
```

Configurer le fichier `.env` :

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Lancer l’application :

```bash
npm run dev
```

Le frontend sera accessible sur :

```text
http://127.0.0.1:5173
```

---

## Structure du Projet

```text
Projet de soute/
├── mirleft-backend/
├── mirleft-frontend/
├── scraper/
├── documentations/
└── design/
```

---

## Fonctionnalités

### Hébergements

* Consultation des hébergements
* Recherche et filtrage
* Affichage détaillé
* Galerie d’images
* Gestion des favoris
* Réservations

### Restaurants

* Liste des restaurants
* Consultation des détails
* Recherche

### Activités

* Liste des activités
* Consultation des détails
* Recherche

### Utilisateurs

* Inscription
* Connexion
* Gestion du profil
* Gestion des favoris
* Consultation des réservations

### Administration

* Gestion des hébergements
* Gestion des restaurants
* Gestion des activités
* Gestion des utilisateurs
* Gestion des contenus

---

## Endpoints API

### Hébergements

```text
GET /api/properties
GET /api/properties/{id}
```

### Restaurants

```text
GET /api/restaurants
GET /api/restaurants/{id}
```

### Activités

```text
GET /api/activities
GET /api/activities/{id}
```

### Authentification

```text
POST /api/register
POST /api/login
POST /api/logout
```

### Favoris

```text
GET /api/favorites
POST /api/favorites/toggle
```

### Réservations

```text
GET /api/bookings
POST /api/bookings
```

---

## Scraper

Le dossier `scraper` contient les scripts permettant de récupérer et de mettre à jour les données utilisées par la plateforme.

Exemple d’exécution :

```bash
node scrape-mirleft-final.mjs
```

---

## Vérifications

Backend :

```bash
php artisan serve
```

Frontend :

```bash
npm run dev
```

Build frontend :

```bash
npm run build
```

---

## Notes

Avant tout déploiement, vérifier :

* La configuration du fichier `.env`
* La connexion à la base de données
* Les permissions de stockage Laravel
* Le bon fonctionnement des routes API
* Le bon chargement des données dans l’interface

Le projet est structuré autour d’une architecture Laravel API et React afin de permettre une maintenance simple et une évolution progressive des fonctionnalités.
