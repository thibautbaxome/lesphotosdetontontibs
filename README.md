# Les photos de Tonton Tibs

(`lesphotosdetontontibs.com`, nom de code technique : tribu)

Albums photo et vidéo partagés en pleine qualité. Tu crées un album, tu envoies le lien, chacun ajoute ses photos et vidéos depuis son téléphone (iPhone, Android, ordinateur), sans compte ni appli.

## Ce que ça fait

- **Toi (admin, `/`)** : créer, renommer, supprimer un album ; lien de partage par album ; ouvrir ou fermer les ajouts (l'album passe en lecture seule) ; régénérer le lien si l'ancien a trop circulé ; supprimer n'importe quel fichier.
- **Tes invités (`/a/<lien>`)** : prénom demandé une fois ; ajout multiple de photos et vidéos ; galerie commune ; visionneuse plein écran (swipe) ; « Enregistrer » qui ouvre le menu de partage du téléphone pour ranger les originaux dans la galerie ; zip de l'album sur ordinateur ; chacun peut supprimer ses propres fichiers.

## Qualité et compatibilité

- **Le fichier est stocké tel qu'il sort du téléphone**, octet pour octet (HEIC, HEVC, ProRes, DNG, MP4, MOV…). Aucune recompression côté serveur.
- Les vignettes et l'aperçu (2048 px) sont générés sur le téléphone de l'invité au moment de l'envoi. Résultat : un iPhone HEIC s'affiche bien sur un PC Windows, alors que Chrome ne sait pas lire le HEIC.
- **Gros fichiers** : envoi en morceaux de 25 Mo, avec reprise automatique en cas de coupure réseau. Pas de limite pratique (garde-fou à 20 Go par fichier).
- **Pendant l'envoi**, l'écran reste allumé (Wake Lock), mais il faut garder la page ouverte : si l'invité change d'appli, iOS met l'envoi en pause.
- **Point de vigilance iPhone** : en passant par la photothèque, iOS peut réduire la qualité de certaines vidéos avant de les confier au navigateur (on voit alors « Compression… »). C'est un comportement du système, qu'aucun site web ne peut bloquer. Le site affiche un bandeau « Ton téléphone prépare tes photos… » pendant cette étape.

## Design

Direction « carton d'invitation » : papier cobalt plein cadre, encre jaune tournesol, titres en Sofia Sans Extra Condensed (polices hébergées sur le site). La liste des prénoms sous le titre (« avec Tatie Sophie, Mamie… ») filtre la galerie par personne. Règles complètes dans `DESIGN.md`, contexte produit dans `PRODUCT.md`.

## Mise en ligne (10 minutes, sur ordinateur)

Il faut un compte Cloudflare gratuit et Node.js installé.

```bash
cd tribu
npm run setup
```

Le script se connecte à ton compte, crée le stockage (R2) et la base (D1), te demande ton mot de passe admin et publie le site. Tu obtiens une adresse du type `https://tribu.<ton-compte>.workers.dev`.

## Déploiement automatique

Chaque `git push` sur `main` met le site en ligne (GitHub Actions, fichier `.github/workflows/deploy.yml`). Le workflow crée le stockage R2 et la base si besoin, puis déploie.

Réglage unique :

1. Cloudflare, My Profile, API Tokens, Create Token, modèle « Edit Cloudflare Workers ». Ajoute la permission **Account > D1 > Edit** (le modèle couvre déjà Workers et R2), puis crée le token.
2. GitHub, dépôt, Settings, Secrets and variables, Actions, New repository secret : nom `CLOUDFLARE_API_TOKEN`, valeur le token.
3. Le mot de passe admin reste un secret Cloudflare, à définir une seule fois : `npx wrangler secret put ADMIN_PASSWORD`.

Prérequis : R2 activé une fois dans le tableau de bord Cloudflare (menu R2 Object Storage).

## Nom de domaine

1. Achète le domaine chez un registrar (OVH, Gandi, ou Cloudflare Registrar si l'extension y est proposée).
2. Cloudflare, Add a domain : saisis-le, choisis la formule Free, puis remplace chez ton registrar les serveurs DNS par les deux que Cloudflare t'indique. L'activation prend de quelques minutes à quelques heures.
3. Dans `wrangler.toml`, décommente le bloc `routes` avec ton domaine et pousse. Le déploiement branche le domaine et le certificat HTTPS tout seul.

## Coûts

Stockage R2 : 10 Go gratuits, ensuite environ 0,015 $ par Go et par mois, et aucun frais de téléchargement. Pour 100 Go de souvenirs, compte environ 1,35 $ par mois. Workers et D1 restent dans le plan gratuit pour un usage familial.

## En local

```bash
echo 'ADMIN_PASSWORD=test' > .dev.vars
npm run dev   # http://localhost:8787
```

## Structure

- `src/worker.js` : API (auth admin, albums, envoi en plusieurs morceaux, lecture en streaming avec prise en charge du Range pour les vidéos)
- `public/index.html` : espace admin
- `public/album.html` : page invitée (envoi, galerie, visionneuse, téléchargement)
- `schema.sql` : base D1
