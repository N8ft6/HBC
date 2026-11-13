# Hope Buds Club 🌱

Site officiel du **Hope Buds Club**, club scientifique de la Faculté des
Sciences de l'Université d'Alger 1 : écologie, biodiversité, économie
circulaire et sensibilisation.

👉 **Site officiel : https://n8ft6.github.io/HBC/**

Suivez le club : [Instagram](https://www.instagram.com/hopebudsclub/) ·
[TikTok](https://www.tiktok.com/@hopebudsclub) ·
[Facebook](https://www.facebook.com/HopeBudsClub)

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | La page (HTML et CSS, sans framework), bilingue français / anglais. Un sommaire en haut du fichier explique son organisation. |
| `app.js` | Tout le JavaScript du site, un bloc commenté par fonctionnalité (textes français, quiz, formulaire d'inscription…). |
| `theme.js` | Petit script lancé avant l'affichage : thème clair/sombre, langue, et refus d'être affiché dans le cadre d'un autre site. |
| `fonts/` | Les polices du site (Cormorant, Hanken Grotesk, JetBrains Mono, licence SIL OFL), hébergées ici : la page ne contacte aucun service tiers. |
| `apps-script/` | Le Google Apps Script qui reçoit les inscriptions, les enregistre dans le Google Sheet du club et envoie l'e-mail de confirmation, avec son guide d'installation (`GUIDE.md`). |
| `.nojekyll` | Indique à GitHub Pages de publier les fichiers tels quels. |

## Modifier le site

1. Modifiez `index.html` ou `app.js`, puis vérifiez avec un petit serveur
   local (par exemple `python -m http.server`, puis http://localhost:8000).
2. Ne mettez **jamais** de `<script>…</script>` ni d'attribut `onclick="…"`
   dans `index.html` : la politique de sécurité de la page les bloque.
   Tout le code va dans `app.js`. Cette politique (ligne `Content-Security-Policy`
   en haut de `index.html`) n'autorise que les fichiers de ce site et le script
   d'inscription du club : si l'adresse du site ou du script change, ou si vous
   ajoutez un service externe, mettez-la à jour. Ouvrir `index.html` par un
   double-clic ne marche pas : utilisez le petit serveur local ci-dessus.
3. Après avoir modifié `app.js` ou `theme.js`, changez le numéro `?v=…` de
   sa balise `<script>` dans `index.html`, pour que les visiteurs reçoivent
   la nouvelle version.
4. Attention : en local aussi, le formulaire est branché sur le vrai script ;
   une inscription de test crée une vraie ligne et envoie un vrai e-mail.
5. Faites un commit et un push sur `main` : GitHub Pages met le site à jour
   en une à deux minutes.

Vous voulez proposer une amélioration ? Ouvrez une pull request : elle sera
relue par le bureau avant toute mise en ligne.

## Droits et sécurité

- © 2026 Hope Buds Club, **tous droits réservés** : voir [LICENSE](LICENSE).
  La reproduction ou la republication du site est interdite sans autorisation.
- Pour signaler un problème de sécurité, voir [SECURITY.md](SECURITY.md).
