# Mirleft Scraper

Système de collecte de données destiné à alimenter la plateforme Mirleft Travel avec des informations sur les hébergements, restaurants, activités et locations de vacances.

## Installation

```bash
cd scraper
npm install
```

## Lancement du Backend Laravel

Avant d'exécuter les scripts de collecte, démarrer l'API Laravel :

```bash
cd mirleft-backend
php artisan serve
```

Par défaut :

```text
http://127.0.0.1:8000
```

## Scripts Disponibles

| Catégorie             | Fichier                      |
| --------------------- | ---------------------------- |
| Hôtels                | `final-scraper.mjs`          |
| Restaurants           | `final-restaurants.mjs`      |
| Activités             | `final-activities.mjs`       |
| Locations de vacances | `final-vacation-rentals.mjs` |

## Exécution

### Hôtels

```bash
node final-scraper.mjs
```

### Restaurants

```bash
node final-restaurants.mjs
```

### Activités

```bash
node final-activities.mjs
```

### Locations de vacances

```bash
node final-vacation-rentals.mjs
```

## Fonctionnement

* Collecte des données depuis des plateformes de voyage publiques.
* Extraction des informations principales (nom, description, images, notes, localisation, etc.).
* Envoi des données vers l'API Laravel.
* Mise à jour automatique des enregistrements existants afin d'éviter les doublons.

## Structure

```text
scraper/
├── final-scraper.mjs
├── final-restaurants.mjs
├── final-activities.mjs
├── final-vacation-rentals.mjs
├── package.json
└── README.md
```

## Prérequis

* Node.js 18+
* Laravel Backend opérationnel
* Connexion Internet active

## Remarques

* Les scripts utilisent un navigateur automatisé pour la collecte des données.
* Les données récupérées sont intégrées directement à la plateforme Mirleft Travel.
* Vérifier que l'API Laravel est accessible avant l'exécution des scripts.
