# Gamou de Garack 2027 — site événementiel

Site statique (HTML + CSS + un peu de JS), sans build. Animations 100 % CSS.

## Vidéos
Dans `js/main.js`, section CONFIGURATION : les deux vidéos sont déjà renseignées
(`ceremonie` = LiOYMSNlSPU, `accueil` = sieSeoyPvvg). Pour en changer, remplacer l'identifiant
(la partie après `youtu.be/`).

## Publier : GitHub → Vercel
1. Créer un dépôt GitHub et y envoyer le contenu de ce dossier (index.html, css/, js/, assets/, vercel.json).
2. vercel.com → *Add New… → Project* → importer le dépôt. Framework Preset : **Other**,
   Build Command et Output Directory vides → **Deploy**.
3. Chaque modification sur GitHub redéploie automatiquement.
