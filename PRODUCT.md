# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Invités** : la famille de Thibaut (« Tonton Tibs »), tous à l'aise avec un smartphone (niveau WhatsApp). Ils reçoivent un lien dans un groupe WhatsApp ou Messenger pendant ou après un repas de famille, l'ouvrent dans le navigateur intégré de l'appli ou dans Safari/Chrome, et veulent déposer leurs photos et vidéos en quelques secondes, puis voir et récupérer celles des autres.
- **Admin** : Thibaut seul. Crée un album par événement, récupère le lien, le partage, ouvre ou ferme les ajouts, fait le ménage.

## Product Purpose

Remplacer le partage de photos compressées dans les groupes WhatsApp/Messenger et les albums iCloud/Google qui ne marchent pas entre iOS et Android. Succès : tout le monde envoie ses photos en pleine qualité via un seul lien, sans compte ni appli, et chacun récupère les originaux.

## Positioning

Un lien, zéro compte, pleine qualité, iPhone et Android à égalité. Site familial personnel, pas un produit commercial.

## Operating Context

- Ouverture principalement sur mobile, souvent depuis le navigateur intégré de WhatsApp/Messenger ; ordinateur pour l'admin et les téléchargements en zip.
- Envois volumineux (vidéos 4K) : la page doit rester ouverte pendant l'envoi.
- Un album par événement (Noël, anniversaires, repas de famille).

## Capabilities and Constraints

- Admin : connexion par mot de passe, créer / renommer / supprimer un album, lien de partage, ouvrir/fermer les ajouts, régénérer le lien, supprimer un fichier.
- Invité : prénom demandé une fois, ajout multiple photos et vidéos (originaux conservés octet pour octet), galerie commune, visionneuse, enregistrement dans la galerie du téléphone via le menu de partage, zip sur ordinateur, suppression de ses propres fichiers.
- Stack existante : Cloudflare Worker + R2 + D1, pages HTML/CSS/JS statiques sans framework.
- iOS peut compresser certaines vidéos choisies depuis la photothèque avant l'envoi (limite système).

## Brand Commitments

- Nom : **Les photos de Tonton Tibs**, domaine `lesphotosdetontontibs.com`. Ton familial, complice, en français, tutoiement.

## Evidence on Hand

- Aucune photo réelle dans le dépôt : les visuels de démonstration sont synthétiques. Pas de témoignages ni de chiffres à inventer.

## Product Principles

1. Le bouton pour ajouter est toujours évident et accessible.
2. Les photos de la famille sont le contenu : l'interface s'efface derrière elles.
3. Rien à comprendre, rien à installer, aucun compte.
4. La pleine qualité n'est jamais sacrifiée.
