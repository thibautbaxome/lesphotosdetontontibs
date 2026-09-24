---
name: Les photos de Tonton Tibs
description: Un carton d'invitation de fête imprimé en deux encres, jaune et blanc, sur papier cobalt.
colors:
  paper: "#1d3fd1"
  paper-deep: "#1733b0"
  paper-press: "#142c98"
  paper-night: "#122a8f"
  paper-night-deep: "#0f2379"
  paper-night-press: "#0b1b63"
  ink: "#ffc928"
  ink-press: "#f0b400"
  white: "#ffffff"
  soft: "#c9d3ff"
  soft-night: "#b7c3f5"
  rule: "rgba(255, 255, 255, 0.28)"
typography:
  display:
    fontFamily: "Sofia Display, Arial Narrow, sans-serif"
    fontSize: "min(clamp(3.1rem, 13vw, 6rem), 21vh)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Sofia Display, Arial Narrow, sans-serif"
    fontSize: "clamp(30px, 5vw, 42px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "normal"
  title:
    fontFamily: "Sofia Display, Arial Narrow, sans-serif"
    fontSize: "26px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Sofia Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
  guest:
    fontFamily: "Sofia Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
  button:
    fontFamily: "Sofia Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1
  label:
    fontFamily: "Sofia Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.45
rounded:
  none: "0px"
  dot: "50%"
spacing:
  hairline: "3px"
  xs: "6px"
  sm: "8px"
  md: "16px"
  lg: "22px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-ink-hover:
    backgroundColor: "{colors.ink-press}"
    textColor: "{colors.paper}"
  button-bare:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    height: "44px"
  cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    width: "100%"
    height: "62px"
  input:
    backgroundColor: "{colors.paper-press}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "50px"
  guest-name:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.guest}"
    padding: "4px 2px"
  guest-name-active:
    textColor: "{colors.ink}"
  tile:
    backgroundColor: "{colors.paper-press}"
    rounded: "{rounded.none}"
  pill:
    backgroundColor: "{colors.paper-press}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  panel:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
  toast:
    backgroundColor: "{colors.white}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 18px"
---

# Design System: Les photos de Tonton Tibs

## Overview

**Creative North Star: "Le carton d'invitation deux encres"**

Chaque album est un carton de fête imprimé : un papier cobalt saturé qui remplit tout l'écran, et seulement deux encres posées dessus, un jaune tournesol et un blanc. Le lien de partage est l'invitation ; la page le dit littéralement (« Tonton Tibs t'invite à partager tes photos de… ») puis imprime le nom de la fête en capitales condensées jaunes, pleine largeur. Tout ce qui n'est pas une photo appartient au carton : filets imprimés, aplats plus denses, coins droits, aucune carte qui flotte.

La densité est celle d'un imprimé, pas d'une application : un en-tête typographique généreux, puis une grille de photos serrée qui prend le relais, les photos de la famille devenant le seul élément polychrome de la page. L'interface reste dans ses deux encres pour que les photos, elles, aient toutes les couleurs. Le système refuse explicitement la grille blanche façon Google Photos et le « cinéma noir » des visionneuses sombres.

Le mouvement imite l'impression et le développement : un nouveau prénom « prend l'encre » en jaune avant de redevenir blanc, une nouvelle photo se développe du flou désaturé à la netteté. Tout le mouvement s'éteint sous `prefers-reduced-motion`.

**Key Characteristics:**
- Papier cobalt plein cadre, jamais de fond blanc ni noir.
- Deux encres seulement : jaune pour l'action et l'accent, blanc pour le texte et les traits.
- Capitales ultra-condensées très grasses pour les titres, sans empattement lisible pour le texte.
- Coins droits partout ; seuls les points imprimés sont ronds.
- Profondeur par aplats de bleu plus dense, jamais par ombre.
- Icônes au trait 2px, arrondies aux extrémités, héritant de la couleur du texte.

## Colors

Un papier cobalt en trois densités, une encre jaune, une encre blanche et un blanc teinté du papier pour le texte secondaire.

### Primary
- **Papier cobalt** (`paper`) : le fond de tout, plein cadre, `html` compris. Aussi la couleur du texte posé sur l'encre jaune (boutons, CTA) et sur le toast blanc. Il fixe le `theme-color` du navigateur.
- **Papier de nuit** (`paper-night`, `paper-night-deep`, `paper-night-press`) : le même papier, imprimé plus sombre, substitué sous `prefers-color-scheme: dark`. Ce n'est pas un thème sombre générique : c'est le même carton sous une lumière plus basse, les encres ne changent pas.

### Secondary
- **Encre tournesol** (`ink`) : l'action et l'accent. Le titre de l'album, le CTA « J'apporte mes photos », les boutons primaires, le prénom filtré, la barre de progression, les points séparateurs, l'anneau de focus, la sélection de texte et le curseur de saisie.
- **Encre tournesol foulée** (`ink-press`) : l'état survolé des boutons à encre jaune.

### Neutral
- **Encre blanche** (`white`) : le texte courant, les prénoms, les contours des boutons secondaires, le fond du toast.
- **Blanc teinté** (`soft` / `soft-night`) : texte secondaire (ligne « avec », compteurs, statistiques, méta de la visionneuse, placeholders). Mélangé au bleu, il se lit comme une encre plus maigre plutôt qu'un gris.
- **Aplat dense** (`paper-deep`) : panneaux de la barre d'envoi, barre de sélection collante.
- **Zone foulée** (`paper-press`) : champs de saisie, cases vides des vignettes, pastilles, fond de la visionneuse, piste de la barre de progression.
- **Filet** (`rule`) : blanc à 28 %, pour les filets imprimés de 2px et le soulignement au repos des prénoms.

### Named Rules
**La règle des deux encres.** Rien d'autre que le jaune et le blanc ne s'imprime sur le cobalt. Pas de rouge pour le danger, pas de vert pour le succès : une action destructive est un texte blanc souligné, un état « ouvert » est un point jaune, un état « fermé » un cercle au trait.

**La règle du papier plein cadre.** Le cobalt va jusqu'aux bords, `html` compris, et la visionneuse elle-même reste sur le papier (zone foulée), jamais sur du noir.

**La règle de l'encre rare.** Le jaune marque ce qu'on peut toucher ou ce qui est choisi. Un texte jaune est soit le titre, soit un élément actif ; il ne sert jamais à décorer un paragraphe.

## Typography

**Display Font:** Sofia Sans Extra Condensed 900, auto-hébergée sous le nom `Sofia Display` (repli : Arial Narrow)
**Body Font:** Sofia Sans variable, auto-hébergée sous le nom `Sofia Text` (repli : pile système)

**Character:** Une affiche de fête et sa petite ligne : l'ultra-condensé noir crie le nom de l'événement en capitales serrées, la Sofia Sans de la même famille parle en tutoiement, chaleureuse et nette.

### Hierarchy
- **Display** (900, `min(clamp(3.1rem, 13vw, 6rem), 21vh)`, 0.88, capitales) : le titre de l'album, le titre admin « Mes albums », « Réservé à Tonton ». Le plafond en `vh` garde le titre dans le premier écran en paysage. En état vide, la même face descend à `clamp(2.2rem, 9vw, 3.6rem)` et passe en blanc.
- **Headline** (900, `clamp(30px, 5vw, 42px)`, 0.9, capitales, jaune) : le nom de chaque album dans la liste admin.
- **Title** (900, 26px, 1, capitales) : le texte du CTA fixe ; la même face à 24px porte le prénom du contributeur dans la visionneuse.
- **Body** (400, 17px, 1.45) : texte courant ; les paragraphes d'état vide sont limités à 34ch.
- **Guest** (700, 18px, 23px dès 900px) : les prénoms de la liste des invités, soulignés d'un filet de 2px décalé de 5px.
- **Button** (700, 16px, 1) : libellés de boutons.
- **Label** (600, 15px) : la ligne de faits (date, compteurs, poids), statistiques admin, marque, notes de filtre. Les compteurs utilisent des chiffres tabulaires.

### Named Rules
**La règle du titre imprimé.** Toute face `Sofia Display` est en capitales, en 900, interlignage sous 1. Jamais en casse mixte, jamais en graisse plus légère.

**La règle de la phrase d'invitation.** L'en-tête se lit comme une phrase : une ligne d'invitation en Sofia Text 600 au-dessus du titre, puis « avec » suivi des prénoms séparés par des virgules. Pas d'étiquette en petites capitales espacées au-dessus du titre.

## Layout

Une colonne unique centrée, `max-width` 1180px, gouttières latérales de 16px (ou la zone sûre si plus grande), marge basse de 140px pour laisser place à la barre d'envoi fixe.

L'en-tête du carton (`invite`) se ferme par un filet de 2px. La grille de photos est à 3 colonnes carrées avec 3px d'espace et déborde des gouttières sur mobile (bord à bord) ; à partir de 600px elle passe en `auto-fill` de cellules de 180px minimum, espace 6px, dans les gouttières.

La barre d'envoi (`dock`) est fixée en bas, contenue à 560px, et se détache du contenu par un fondu vers le papier (`linear-gradient` du papier à 55 % vers transparent), seule transition non aplat du système, purement fonctionnelle. En paysage bas (`max-height: 500px`), le CTA rétrécit à 50px, l'en-tête se resserre, le titre plafonne à 18vh et la barre se range à droite sans fondu.

L'admin empile les albums en lignes séparées par des filets de 2px : couverture carrée de 132px à gauche, nom, statistiques et actions à droite ; sous 560px la couverture tombe à 72px et les actions passent pleine largeur.

Rythme d'espacement observé : 3 / 6 / 8 / 12 / 16 / 22px. Cibles tactiles de 44px minimum (38px pour les actions secondaires admin).

## Elevation & Depth

Le système est plat. Aucune `box-shadow` n'existe. La profondeur est tonale : trois densités du même cobalt (papier, aplat dense, zone foulée) disent « au-dessus » ou « creusé », comme deux passages d'impression. Le toast est le seul élément inversé (fond blanc, texte cobalt) pour se détacher sans ombre.

### Named Rules
**La règle de l'aplat.** Un élément qui doit se distinguer change de densité de bleu ou s'inverse en encre ; il ne flotte jamais. Pas d'ombre portée, pas de carte surélevée, pas de flou d'arrière-plan.

## Shapes

Coins droits (0px) partout : boutons, champs, vignettes, panneaux, pastilles, toast, couvertures, boutons de navigation de la visionneuse. Les seules formes rondes sont des marques d'impression : le point séparateur jaune de 5px, le point d'état de 8px, la case de sélection circulaire de 28px sur les vignettes. Les traits sont épais et francs : filets, contours de bouton et soulignements tous à 2px ; anneau de focus à 3px.

Les icônes sont un sprite SVG (`icons.svg`) de 13 symboles au trait 2px, extrémités et jonctions arrondies, dimensionnées à 1.2em et colorées par `currentColor`. Seul le triangle « lecture » du badge vidéo est plein.

## Components

### Buttons
Francs et imprimés : un rectangle à coins droits, une encre.
- **Shape :** coins droits (0px), hauteur minimale 44px, icône et libellé séparés de 8px.
- **Contour (par défaut) :** filet blanc de 2px, fond transparent, texte blanc ; survol en voile blanc à 10 %.
- **Encre (primaire) :** aplat jaune, texte cobalt ; survol en jaune foulé.
- **Nu :** contour transparent, padding réduit à 10px, pour les actions de barre d'outils (« Sélectionner », « Tout », « Se déconnecter »).
- **Danger :** texte blanc souligné par un filet de 2px, jamais une couleur d'alerte.
- **Pression / Focus :** à l'appui, le bouton descend de 1px et se contracte à 0.985 ; focus en anneau jaune de 3px décalé de 3px. Désactivé à 45 % d'opacité.

### CTA « J'apporte mes photos »
Le geste principal, toujours visible. Pleine largeur de la barre d'envoi (560px max), 62px de haut, aplat jaune, libellé en capitales condensées 26px et icône appareil photo de 26px au trait 2.4. Il est la seule surface jaune de cette taille sur la page.

### Liste des invités (composant signature)
Les prénoms des contributeurs imprimés sous le titre, précédés de « avec » et séparés par des virgules, chacun suivi de son compteur en petit. Chaque prénom est un bouton filtre sans fond : blanc avec un soulignement-filet à 28 % ; au survol le filet passe au jaune ; filtré (`aria-pressed`), le prénom entier passe au jaune. Un prénom nouveau arrive en « prenant l'encre » (1.2s, montée de 4px depuis le jaune).

### Vignettes
Carrés à coins droits sur zone foulée, photo en `object-fit: cover`. Badge vidéo en bas à gauche : aplat cobalt, triangle plein et durée en 12px gras. En mode sélection, une case ronde à contour blanc apparaît en haut à droite ; sélectionnée, elle se remplit de jaune et la photo s'assombrit légèrement. Une nouvelle vignette se développe du flou désaturé à la netteté en 1.4s.

### Inputs / Fields
- **Style :** zone foulée, contour transparent de 2px, coins droits, 50px de haut, texte blanc 600 17px, placeholder en blanc teinté.
- **Focus :** le contour passe au jaune, sans halo.

### Panneaux de la barre d'envoi
Aplats denses à coins droits (14px 16px) au-dessus du CTA : la demande de prénom (« Comment tu t'appelles ? ») et la file d'envoi, avec une barre de progression de 8px (piste foulée, remplissage jaune animé par `scaleX`).

### Pastilles d'état (admin)
Zone foulée, texte blanc 13px gras, coins droits ; « ouvert » précédé d'un point jaune plein, « fermé » d'un cercle au trait blanc teinté.

### Toast
Inversion d'encre : aplat blanc, texte cobalt 700 15px, coins droits, centré au-dessus du CTA, entrée en 0.4s.

### Visionneuse
Plein écran sur zone foulée (le papier, pas du noir). Boutons icônes de 44px sur voile blanc à 10 %, flèches de 52px sur voile à 12 % masquées sur écrans tactiles. Le prénom du contributeur en capitales condensées jaunes 24px, la date et le poids en blanc teinté 13px.

## Do's and Don'ts

### Do:
- **Do** poser toute nouvelle surface sur le papier cobalt (`paper`, `paper-night` en mode sombre), bord à bord.
- **Do** réserver l'encre jaune (`ink`) à l'action principale, à l'état choisi et au titre.
- **Do** composer les titres en `Sofia Display` 900, capitales, interlignage 0.88 à 1.
- **Do** tracer séparateurs, contours et soulignements à 2px, en blanc (`white`) ou en filet (`rule`).
- **Do** exprimer la profondeur par les trois densités du cobalt (`paper`, `paper-deep`, `paper-press`).
- **Do** garder les icônes au trait 2px en `currentColor`, depuis le sprite `icons.svg`.
- **Do** écrire en français, en tutoiement, avec des phrases d'invitation plutôt que des étiquettes.

### Don't:
- **Don't** introduire une troisième encre (rouge d'erreur, vert de succès, gris neutre) : la règle des deux encres tient même pour le danger.
- **Don't** mettre un fond blanc ou noir, ni une visionneuse « cinéma » noire.
- **Don't** arrondir les coins des boutons, champs, vignettes ou panneaux ; seuls les points d'impression sont ronds.
- **Don't** ajouter d'ombre portée, de carte flottante ni de flou d'arrière-plan.
- **Don't** composer la face condensée en casse mixte ou en graisse inférieure à 900.
- **Don't** placer de petite étiquette espacée en capitales au-dessus d'un titre.
