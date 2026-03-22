# Blog API Backend

Une API REST backend simple pour la gestion d'un blog, développée avec Node.js, Express et SQLite. Ce projet inclut des points de terminaison (endpoints) entièrement documentés à l'aide de Swagger.

## Technologies Utilisées
- **Node.js** : Environnement d'exécution côté serveur.
- **Express** : Framework web pour la création de l'API.
- **SQLite** : Base de données SQL légère.
- **Joi** : Validation des données entrantes.
- **Swagger UI** : Interface interactive pour la documentation de l'API.

## Prérequis
- Node.js (version 18+ recommandée)
- npm (fourni avec Node.js)

## Installation

1. Cloner ce dépôt (le cas échéant) ou télécharger les fichiers.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer un fichier `.env` à la racine (un fichier par défaut est inclus avec ce projet) :
   ```env
   PORT=3000
   DB_FILE=./database.sqlite
   ```

## Lancer l'application

Pour démarrer le serveur en mode développement (avec redémarrage automatique / watch) :
```bash
npm run dev
```

Pour démarrer le serveur en mode production :
```bash
npm start
```

Le serveur démarrera sur `http://localhost:3000`.

## Documentation (Swagger)

Une fois le serveur démarré, accédez à l'URL suivante dans votre navigateur pour consulter la documentation interactive de l'API et tester les endpoints :
**http://localhost:3000/api-docs**

## Interface Web (Frontend)

Ce projet inclut également un frontend complet intitulé **"The @rtist Blog"** conçu spécifiquement pour consommer cette API. Il permet de visualiser, créer, modifier, supprimer et rechercher des articles via une interface minimaliste et élégante avec un design "Glassmorphism".
Une fois le backend démarré, l'interface utilisateur est accessible directement sur :
**http://localhost:3000**

## Résumé des Endpoints

- `GET /api/articles` : Récupérer tous les articles. Supporte les filtres via l'URL (`?category=Tech&author=John&date=2026-03-18`).
- `POST /api/articles` : Créer un nouvel article. Champs obligatoires : `title`, `content`, `author`.
- `GET /api/articles/search` : Rechercher des articles contenant un texte spécifique dans leur titre ou contenu (`?query=texte`).
- `GET /api/articles/:id` : Récupérer un article spécifique grâce à son ID.
- `PUT /api/articles/:id` : Mettre à jour un article existant grâce à son ID.
- `DELETE /api/articles/:id` : Supprimer un article grâce à son ID.

## Exemples

### Créer un nouvel article
**Requête :** `POST /api/articles`
```json
{
  "title": "Mon Premier Article de Blog",
  "content": "Voici le contenu de mon article. Apprendre Node.js est super !",
  "author": "Jean Dupont",
  "category": "Technologie",
  "tags": "Node, Express, SQLite"
}
```

### Récupérer les articles filtrés
**Requête :** `GET /api/articles?category=Technologie`

### Rechercher dans les articles
**Requête :** `GET /api/articles/search?query=Node`

## Notes et Bonnes Pratiques Intégrées
- **Validation** : Validation stricte à l'aide de `Joi` pour garantir que les champs obligatoires ne sont pas vides et respectent les types attendus.
- **Codes de statut HTTP** : Utilisation correcte des codes `200` (OK), `201` (Créé avec succès), `400` (Mauvaise requête / Bad Request), `404` (Non trouvé / Not Found), et `500` (Erreur Serveur).
- **Séparation des responsabilités** : Code source structuré et clairement divisé entre `routes`, `controllers`, `models`, et `middlewares`.
