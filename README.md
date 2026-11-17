# Gamou de Garack 2027 — site événementiel

Site statique (HTML + CSS + un peu de JS), sans build. Animations 100 % CSS.

## Mettre à jour les vidéos
Ouvrir `js/main.js`, section CONFIGURATION (les deux vidéos sont déjà renseignées) :
- `accueil` : déjà renseignée (`sieSeoyPvvg`)
- `ceremonie` : `LiOYMSNlSPU` (https://youtu.be/LiOYMSNlSPU)
  (pour `https://youtu.be/ABC123xyz`, l'identifiant est `ABC123xyz`).

## Publier : GitHub → Vercel
1. **GitHub** : créer un dépôt vide (ex. `gamou-garack-2027`), puis
   ```bash
   git init && git add . && git commit -m "Site Gamou Garack 2027"
   git branch -M main
   git remote add origin https://github.com/<votre-compte>/gamou-garack-2027.git
   git push -u origin main
   ```
   (ou « Add file → Upload files » sur github.com, en glissant le contenu du dossier).
2. **Vercel** : vercel.com → *Add New… → Project* → importer le dépôt.
   Framework Preset : **Other** — Build Command : vide — Output Directory : vide → **Deploy**.
3. Chaque `git push` redéploie automatiquement. Domaine perso : *Settings → Domains*.
