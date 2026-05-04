# Gestion de Stock

Application web simple de gestion de stock réalisée avec HTML, CSS et JavaScript. Elle permet de gérer les clients, les fournisseurs, les produits, les commandes et les factures depuis une interface de tableau de bord.

## Fonctionnalités

- Connexion avec un formulaire d'authentification.
- Tableau de bord avec statistiques globales.
- Graphiques pour suivre les statuts des commandes et des factures.
- Gestion des clients : ajouter, modifier, supprimer et rechercher.
- Gestion des fournisseurs : ajouter, modifier, supprimer et rechercher.
- Gestion des produits : ajouter, modifier, supprimer et rechercher.
- Gestion des commandes et des factures.
- Sauvegarde des données dans le `localStorage` du navigateur.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript
- Chart.js pour les graphiques du tableau de bord
- `localStorage` pour stocker les données localement

## Structure du projet

```text
Web_Dev/
+-- index.html
+-- Dashboard.html
+-- css/
|   +-- login.css
|   +-- Dashboard.css
|   +-- Clients.css
|   +-- Fournisseur.css
|   +-- Produit.css
|   +-- Commande.css
+-- js/
|   +-- login.js
|   +-- Dashboard.js
|   +-- Clients.js
|   +-- Fournisseur.js
|   +-- Produit.js
|   +-- Commande.js
+-- tableaux/
    +-- Clients.html
    +-- Fournisseur.html
    +-- Produit.html
    +-- Commande.html
```

## Lancement du projet

1. Télécharger ou cloner le projet.
2. Ouvrir le fichier `index.html` dans un navigateur web.
3. Se connecter avec les identifiants suivants :

```text
Nom d'utilisateur : admin
Mot de passe      : admin
```

Après la connexion, l'utilisateur est redirigé vers le tableau de bord.

## Pages principales

| Page | Description |
| --- | --- |
| `index.html` | Page de connexion |
| `Dashboard.html` | Tableau de bord avec statistiques et graphiques |
| `tableaux/Clients.html` | Gestion des clients |
| `tableaux/Fournisseur.html` | Gestion des fournisseurs |
| `tableaux/Produit.html` | Gestion des produits |
| `tableaux/Commande.html` | Gestion des commandes et des factures |

## Stockage des données

Les données sont enregistrées directement dans le navigateur avec `localStorage`. Cela signifie que :

- les données restent disponibles après le rafraîchissement de la page ;
- les données sont propres au navigateur utilisé ;
- la suppression du cache ou des données du site peut effacer les informations enregistrées.

## Remarque

Le projet ne nécessite pas de base de données ni de serveur back-end. Une connexion internet peut être nécessaire pour afficher les graphiques, car Chart.js est chargé depuis un CDN.
