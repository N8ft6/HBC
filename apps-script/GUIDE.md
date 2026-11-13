# Brancher les inscriptions : Google Sheet + e-mail de confirmation

Une fois ce guide terminé :

- chaque inscription envoyée sur le site arrive dans un **Google Sheet** ;
- la personne reçoit tout de suite un **e-mail de confirmation** (en français ou en anglais selon la langue du site) qui lui dit que son inscription va être examinée et qu'un second e-mail suivra ;
- les e-mails partent du compte Google qui fait l'installation, avec **« Hope Buds Club »** comme nom d'expéditeur.

Durée : environ 10 minutes. Gratuit.

---

## Étape 1 : créer le Google Sheet

1. Connectez-vous au compte Google qui enverra les e-mails.
2. Ouvrez <https://sheets.new> : un tableau vide s'ouvre.
3. Nommez-le, par exemple **HBC – Inscriptions 2026-2027** (en haut à gauche).

## Étape 2 : coller le script

1. Dans le tableau : menu **Extensions → Apps Script**. Un éditeur s'ouvre dans un nouvel onglet.
2. Supprimez tout le contenu du fichier `Code.gs` affiché.
3. Copiez **tout** le contenu du fichier [`apps-script/Code.gs`](Code.gs) du site et collez-le à la place.
4. En haut du script, vérifiez le bloc `CONFIG` (adresse de contact, lien Instagram). Vous pouvez le laisser tel quel.
5. Cliquez sur l'icône **💾 Enregistrer** (ou Ctrl+S).

## Étape 3 : autoriser et tester l'envoi d'e-mails

1. Dans la barre du haut, choisissez la fonction **`testEmail`** dans la liste déroulante, puis cliquez sur **▶ Exécuter**.
2. Google demande une autorisation : **Examiner les autorisations** → choisissez votre compte.
3. Un écran indique « Google n'a pas validé cette application ». C'est normal : c'est votre propre script.
   Cliquez sur **Paramètres avancés** → **Accéder à … (non sécurisé)** → **Autoriser**.
4. Vérifiez votre boîte mail : vous devez recevoir **deux e-mails d'exemple** (un en français, un en anglais).

> Rien reçu ? Regardez dans les spams et l'onglet « Promotions ». Le journal d'exécution, en bas de l'éditeur, affiche aussi les erreurs éventuelles.

## Étape 4 : publier le script comme application web

1. En haut à droite : **Déployer → Nouveau déploiement**.
2. Cliquez sur la roue ⚙️ à côté de « Sélectionner le type » → **Application Web**.
3. Remplissez :
   - **Description** : `Inscriptions HBC`
   - **Exécuter en tant que** : **Moi**
   - **Qui peut accéder** : **Tout le monde** (indispensable pour que le site puisse envoyer le formulaire)
4. Cliquez sur **Déployer**, puis copiez l'**URL de l'application Web**. Elle ressemble à :
   `https://script.google.com/macros/s/AKfy…/exec`
5. Vérification rapide : collez cette URL dans un navigateur. Vous devez voir
   « Hope Buds Club : le service d'inscription fonctionne ✅ ».

## Étape 5 : coller l'URL dans le site

Dans `app.js`, cherchez la ligne :

```js
const FORM_ENDPOINT = "";
```

et collez l'URL entre les guillemets :

```js
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfy…/exec";
```

Enregistrez, puis publiez le site (commit + push). Vous pouvez aussi me demander de le faire.

## Étape 6 : test complet

1. Ouvrez le site et remplissez le formulaire avec **votre propre adresse e-mail**.
2. Vous devez :
   - voir l'écran « Merci, … » avec le message « Un e-mail de confirmation vient d'être envoyé à … » ;
   - recevoir l'e-mail en moins d'une minute ;
   - voir une nouvelle ligne dans le Google Sheet (onglet **Inscriptions 2026-2027**), avec la colonne **E-mail de confirmation** = `Envoyé`.
3. Renvoyez le formulaire avec la même adresse : le site affiche le même écran « Merci », aucune nouvelle ligne n'est ajoutée, et vous recevez un e-mail « vous êtes déjà inscrit(e) ».
4. Supprimez ensuite vos lignes de test dans le tableau.

---

## Bon à savoir

- **Quota** : un compte Gmail gratuit peut envoyer environ **100 e-mails par jour** depuis un script. Si le quota est atteint, l'inscription est quand même enregistrée, et la colonne indique `Échec`.
- **Colonne « Statut »** : elle vaut `À examiner` pour chaque nouvelle inscription. Le bureau peut la changer (Acceptée, Refusée, etc.) : elle servira pour le second e-mail.
- **Alerte pour le bureau** : pour recevoir un e-mail à chaque nouvelle inscription, mettez une adresse dans `NOTIFY_EMAIL` du bloc `CONFIG`. Attention, cela compte double dans le quota.
- **Modifier le script plus tard** :
  1. collez le nouveau code et enregistrez ;
  2. lancez **`testEmail`** (▶ Exécuter) : il vérifie l'installation, redemande les autorisations si besoin et vous envoie deux e-mails d'exemple. S'il affiche une erreur, **ne déployez pas** ;
  3. faites **Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version → Déployer**. Ne choisissez jamais « Nouveau déploiement » : l'URL changerait et le site ne pourrait plus envoyer les inscriptions.
- **Doublons** : une même adresse e-mail ne peut s'inscrire qu'une fois. Le site affiche la même réponse que pour une nouvelle inscription (personne ne peut ainsi tester qui est inscrit), et la personne reçoit un e-mail « vous êtes déjà inscrit(e) », au plus une fois toutes les 6 heures. Pour corriger une inscription, modifiez directement la ligne dans le tableau.
- **Protections anti-abus** (réglables dans `CONFIG`) :
  - **jeton signé** : à l'ouverture du formulaire, le site demande un jeton au script, signé avec une clé secrète gardée dans les propriétés du script (`TOKEN_SECRET`, à ne jamais partager). Une inscription n'est acceptée qu'avec un jeton valable, utilisé une seule fois, au moins 15 secondes après l'ouverture (`MIN_FILL_SECONDS`) et au plus 6 heures après (`TOKEN_MAX_HOURS`). Le site gère tout cela sans que le visiteur ne voie rien ;
  - **limites horaires** : 150 inscriptions (`ROWS_PER_HOUR`) et 40 e-mails (`MAILS_PER_HOUR`) par heure. Au-delà de la limite d'e-mails, l'inscription est quand même enregistrée, avec `Échec` dans la colonne de l'e-mail ;
  - **réserve** : 5 e-mails gardés sur le quota du jour (`MAIL_RESERVE`) ;
  - **contrôles** : nom en lettres seulement (pas de chiffres, de points ni de liens, pour qu'on ne puisse pas glisser un message piégé dans l'e-mail du club), adresse e-mail stricte, consentement coché, cellules existantes, longueurs maximales, envoi de plus de 50 Ko refusé. La saison et la date sont fixées par le script, jamais par le navigateur ;
  - **tableau protégé** : les réponses commençant par `=`, `+`, `-` ou `@` ne sont jamais exécutées comme des formules ;
  - **liens neutralisés** : dans les réponses libres, `https://site.com` devient `hxxps[:]//site[.]com`. Le texte reste lisible, mais le bureau ne peut pas cliquer par erreur sur un lien piégé ;
  - **chaque champ vérifié par le script** : téléphone au bon format, longueurs maximales, nombre de cases cochées limité. Le navigateur ne suffit pas, il se contourne facilement ;
  - **erreurs muettes** : en cas de problème, le visiteur reçoit seulement « erreur », jamais un message interne. Le détail est dans le **journal d'exécution**.
- **Autorisations figées** : le fichier `appsscript.json` (dans ce dossier) fixe la liste exacte des droits du script : son seul tableau, l'envoi d'e-mails, votre adresse, l'appel à Cloudflare pour l'anti-robot et la mise à jour automatique de l'onglet « Sécurité ». Pour l'installer : ⚙️ **Paramètres du projet** → cochez **« Afficher le fichier manifeste "appsscript.json" dans l'éditeur »**, puis remplacez son contenu dans l'éditeur.

## Anti-robot Cloudflare Turnstile

Au moment de l'envoi, le site demande à Cloudflare une preuve que le visiteur est humain (le plus souvent sans rien lui montrer ; une case à cocher n'apparaît qu'en cas de doute). Le script fait vérifier cette preuve par Cloudflare avant d'enregistrer quoi que ce soit.

1. Sur <https://dash.cloudflare.com> (compte gratuit) : **Turnstile → Add widget**. Nom : `HBC inscriptions`, hostname : `n8ft6.github.io`, mode : **Managed**. Cloudflare donne deux clés :
   - la **Site Key**, publique : elle va dans `app.js` (`TURNSTILE_SITEKEY`) ;
   - la **Secret Key**, **secrète** : ne l'écrivez jamais dans le code ni dans un message.
2. Dans l'éditeur Apps Script : ⚙️ **Paramètres du projet → Propriétés du script → Ajouter une propriété du script**. Propriété : `TURNSTILE_SECRET`, valeur : la Secret Key. Enregistrez.
3. Lancez **`testEmail`** : il doit afficher « 🛡️ Anti-robot Turnstile : ACTIF, clé secrète valide ».

La vérification est active dès que la propriété existe, sans nouveau déploiement. Pour la couper (par exemple si Cloudflare a une panne), supprimez la propriété `TURNSTILE_SECRET`. En cas de fuite de la Secret Key : dans Cloudflare, **Rotate secret key**, puis remplacez la valeur de la propriété.

## En cas d'attaque ou de doute

Ces fonctions se lancent depuis l'éditeur (liste en haut → ▶ Exécuter) et agissent **immédiatement, sans nouveau déploiement** :

| Fonction | Quand l'utiliser |
|---|---|
| `installerOngletSecurite` | **Une seule fois.** Crée l'onglet **« Sécurité »** du tableau, mis à jour automatiquement chaque heure : une ligne par heure, la plus récente en haut, avec un **Bilan** en clair (✅ Calme, ✅ inscriptions, ⚠️ activité suspecte, 🚨 attaque probable, ❗ erreur interne). Pratique à suivre depuis l'application Google Sheets du téléphone. 30 jours sont gardés. |
| `rapportSecurite` | Voir ce que le script a reçu ces 6 dernières heures (inscriptions, robots bloqués, tentatives refusées). Le résultat s'affiche dans le journal d'exécution. |
| `fermerInscriptions` | Attaque en cours, ou fin de la saison : plus aucune inscription n'est acceptée, le site affiche « les inscriptions sont fermées ». |
| `ouvrirInscriptions` | Rouvrir les inscriptions. |
| `changerCleJetons` | Si la clé secrète a pu fuiter (par exemple si quelqu'un a eu accès au projet) : tous les anciens jetons deviennent invalides. Les visiteurs n'ont rien à faire. |
| `testEmail` | Après chaque mise à jour : vérifie que tout est en place. |
- **Droits du script** : grâce à la mention `@OnlyCurrentDoc` en haut du code, le script n'a accès qu'au tableau auquel il est rattaché, pas au reste de votre Drive. Il doit donc toujours être ouvert depuis le tableau (**Extensions → Apps Script**).
- **Partage du tableau** : un « Éditeur » du tableau peut aussi modifier le script, qui s'exécute avec votre compte. Ne donnez ce rôle qu'à des personnes de totale confiance ; pour les autres, choisissez « Lecteur » ou « Commentateur ».
- **Sécurité** : l'URL du script est visible dans le code du site, ce n'est pas un secret. Elle permet seulement de demander un jeton et d'ajouter une inscription, jamais de lire le tableau. Un champ piège invisible bloque aussi les robots les plus simples.
