/**
 * Hope Buds Club — inscriptions 2026–2027
 *
 * Ce script reçoit le formulaire d'inscription du site, enregistre chaque
 * inscription dans ce Google Sheet et envoie un e-mail de confirmation
 * à la personne inscrite (en français ou en anglais selon la langue du site).
 *
 * Installation : voir apps-script/GUIDE.md dans le dépôt du site.
 *
 * Sécurité : le script n'a accès qu'au tableau auquel il est rattaché
 * (aucun autre fichier de votre Drive), grâce à la mention ci-dessous.
 * @OnlyCurrentDoc
 */

/* ===================== À PERSONNALISER ===================== */
const CONFIG = {
  // Nom affiché comme expéditeur des e-mails
  CLUB_NAME: 'Hope Buds Club',
  // Saison affichée dans l'e-mail (fixée ici, jamais par le site)
  SEASON: '2026-2027',
  // Adresse qui reçoit les réponses quand quelqu'un clique sur « Répondre ».
  // '' = le compte Google qui a déployé ce script (celui qui envoie les e-mails).
  REPLY_TO: '',
  // Adresse de contact affichée dans l'e-mail
  CONTACT_EMAIL: 'hopebuds.club@univ-alger.dz',
  INSTAGRAM_URL: 'https://www.instagram.com/hopebudsclub/',
  // Facultatif : une adresse du bureau prévenue à chaque nouvelle inscription ('' = désactivé).
  // Attention : chaque alerte compte dans le quota de ~100 e-mails par jour.
  NOTIFY_EMAIL: '',
  // Nom de l'onglet du Google Sheet où sont rangées les inscriptions
  SHEET_NAME: 'Inscriptions 2026-2027',

  // --- Protections anti-abus ---
  // Inscriptions acceptées par heure (au-delà : « réessayez dans quelques minutes »)
  ROWS_PER_HOUR: 150,
  // E-mails envoyés par heure (au-delà : l'inscription est enregistrée, l'e-mail est marqué « Échec »)
  MAILS_PER_HOUR: 40,
  // Temps minimum entre l'ouverture du formulaire et l'envoi, en secondes (vérifié par le script, pas par le navigateur)
  MIN_FILL_SECONDS: 15,
  // Durée de validité du jeton de formulaire, en heures (6 au maximum)
  TOKEN_MAX_HOURS: 6,
  // Nombre d'e-mails gardés en réserve sur le quota quotidien (~100), pour les tests et l'alerte bureau
  MAIL_RESERVE: 5,
  // Anti-robot Cloudflare Turnstile : actif dès que la propriété du script TURNSTILE_SECRET existe (voir GUIDE.md).
  // Seules les vérifications faites sur ces adresses sont acceptées.
  TURNSTILE_HOSTNAMES: ['n8ft6.github.io']
};
/* =========================================================== */

const CELLS = {
  project:    { fr: 'Développement de projets',  en: 'Project Development',        ic: '🌱' },
  activities: { fr: 'Activités & Organisation',  en: 'Activities & Organisations', ic: '⚙️' },
  media:      { fr: 'Médias & Créativité',       en: 'Media & Creativity',         ic: '📸' },
  relations:  { fr: 'Relations & Partenariats',  en: 'Relations & Partnerships',   ic: '🤝' },
  any:        { fr: 'Ouvert à toutes les cellules', en: 'Open to any cell',        ic: '🍃' }
};

// Colonnes du tableau : [clé envoyée par le site, titre de la colonne]
const COLUMNS = [
  ['createdAt', 'Date'], ['status', 'Statut'], ['mailStatus', 'E-mail de confirmation'], ['lang', 'Langue'],
  ['name', 'Nom complet'], ['email', 'E-mail'], ['phone', 'Téléphone'], ['telegram', 'Telegram'],
  ['faculty', 'Faculté'], ['department', 'Département'], ['specialty', 'Spécialité'], ['level', 'Niveau'], ['studentId', 'Matricule'],
  ['choice1', '1er choix'], ['why1', 'Pourquoi ce 1er choix'], ['exp1', 'Expérience (1er choix)'], ['expText1', 'Détail expérience (1er choix)'],
  ['choice2', '2e choix'], ['why2', 'Pourquoi ce 2e choix'], ['exp2', 'Expérience (2e choix)'], ['expText2', 'Détail expérience (2e choix)'],
  ['why', 'Pourquoi rejoindre HBC'], ['interests', "Centres d'intérêt"], ['skills', 'Compétences'],
  ['availability', 'Disponibilité'], ['when', 'Quand'], ['outside', 'Activités hors université'], ['commitment', 'Engagement'],
  ['gain', 'Ce que la personne espère'], ['activity', 'Activité proposée'], ['ideas', 'Idées & suggestions']
];

// Règles de validation (les mêmes que sur le site)
// Nom : lettres (latines, accentuées ou arabes), séparées par une espace, une apostrophe ou un tiret. Pas de chiffres, de points ni de liens.
const NAME_RE = /^[A-Za-z\u00C0-\u024F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF][A-Za-z\u00C0-\u024F\u0300-\u036F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]*(?:[ '\u2019-][A-Za-z\u00C0-\u024F\u0300-\u036F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;
const PHONE_RE = /^[+0-9 ()-]{8,20}$/;

// Les autres champs du formulaire : longueur maximale (comme sur le site) et, pour les cases à cocher,
// nombre maximal de réponses. Tout champ absent de COLUMNS est ignoré ; tout dépassement est coupé.
const FIELDS = {
  phone: { max: 20 }, telegram: { max: 60 }, studentId: { max: 30 },
  faculty: { max: 200 }, department: { max: 200 }, specialty: { max: 200 }, level: { max: 40 },
  why1: { max: 800 }, expText1: { max: 800 }, why2: { max: 800 }, expText2: { max: 800 },
  why: { max: 1200 }, activity: { max: 1200 }, ideas: { max: 1200 },
  exp1: { max: 200 }, exp2: { max: 200 }, availability: { max: 200 }, outside: { max: 200 }, commitment: { max: 200 }, gain: { max: 200 },
  interests: { list: 15, max: 200 }, skills: { list: 15, max: 200 }, when: { list: 15, max: 200 }
};

/* ---------- Le site demande un jeton en ouvrant le formulaire, puis envoie l'inscription ----------
   En cas d'erreur imprévue, le visiteur reçoit seulement « server » : jamais de message interne
   (numéro de ligne, nom de fonction…) qui renseignerait un attaquant. Le détail va dans le journal d'exécution. */
// Ouvrir l'URL du déploiement dans un navigateur affiche un message : pratique pour vérifier qu'il fonctionne
function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action === 'token') return json_({ ok: true, token: newToken_() });
    return ContentService.createTextOutput('Hope Buds Club : le service d’inscription fonctionne ✅');
  } catch (err) {
    console.error('doGet : ' + err);
    return json_({ ok: false, error: 'server' });
  }
}

function doPost(e) {
  try {
    return handlePost_(e);
  } catch (err) {
    console.error('doPost : ' + (err && err.stack || err));
    return answer_('server', { ok: false, error: 'server' });
  }
}

// Répond au site et compte la réponse pour le rapport de sécurité (fonction rapportSecurite)
function answer_(kind, o) { stat_(kind); return json_(o); }

function handlePost_(e) {
  // 0. Inscriptions fermées (fonction fermerInscriptions) : rien n'est enregistré
  if (PropertiesService.getScriptProperties().getProperty('INSCRIPTIONS') === 'fermees') return answer_('closed', { ok: false, error: 'closed' });

  // 1. Taille et format : une vraie inscription fait quelques Ko
  const raw = e && e.postData && e.postData.contents;
  if (!raw || raw.length > 50000) return answer_('bad_request', { ok: false, error: 'bad_request' });
  let d;
  try { d = JSON.parse(raw); } catch (err) { return answer_('bad_request', { ok: false, error: 'bad_request' }); }
  if (!d || typeof d !== 'object' || Array.isArray(d)) return answer_('bad_request', { ok: false, error: 'bad_request' });

  // 2. Champ piège invisible rempli = robot : réponse « ok » pour ne pas le renseigner, rien n'est enregistré
  if (d.website) return answer_('honeypot', { ok: true, mail: 'sent' });

  // 3. Jeton signé par ce script : prouve que le formulaire a été ouvert sur le site il y a au moins 15 secondes
  const tk = checkToken_(d.token);
  if (tk.s === 'bad') return answer_('token', { ok: false, error: 'token' });
  if (tk.s === 'young') return answer_('wait', { ok: false, error: 'wait', wait: tk.wait });
  if (tk.s === 'expired') return answer_('expired', { ok: false, error: 'expired' });

  // 4. Contrôle des champs essentiels
  // Seulement du texte : un objet piégé (avec un faux « toString ») est refusé au lieu de faire planter le script
  const email = typeof d.email === 'string' ? d.email.trim().toLowerCase() : '';
  const name = typeof d.name === 'string' ? d.name.replace(/\s+/g, ' ').trim() : '';
  if (name.length < 2 || name.length > 80 || !NAME_RE.test(name)) return answer_('invalid', { ok: false, error: 'invalid' });
  if (email.length > 120 || !EMAIL_RE.test(email)) return answer_('invalid', { ok: false, error: 'invalid' });
  if (d.consent !== true) return answer_('invalid', { ok: false, error: 'invalid' });
  if (!isCell_(d.choice1)) return answer_('invalid', { ok: false, error: 'invalid' });
  if (d.choice1 === 'any') d.choice2 = '';
  if (d.choice2 && (!isCell_(d.choice2) || d.choice2 === 'any' || d.choice2 === d.choice1)) return answer_('invalid', { ok: false, error: 'invalid' });
  Object.keys(FIELDS).forEach(k => { d[k] = cleanField_(k, d[k]); });
  if (!PHONE_RE.test(d.phone)) return answer_('invalid', { ok: false, error: 'invalid' });
  d.email = email;
  d.name = name;
  d.lang = d.lang === 'fr' ? 'fr' : 'en';
  d.season = CONFIG.SEASON; // jamais la valeur envoyée par le navigateur

  // 4b. Anti-robot Cloudflare Turnstile : Cloudflare confirme qu'un humain, sur notre site, a fait la vérification
  if (turnstileCheck_(d.ts) !== 'ok') return answer_('captcha', { ok: false, error: 'captcha' });

  // 5. Limite de débit : protège le tableau contre une vague d'envois
  if (!underHourlyLimit_('rows', CONFIG.ROWS_PER_HOUR)) return answer_('busy', { ok: false, error: 'busy' });

  const sheet = getSheet_();
  let row = 0, duplicate = false;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return answer_('busy', { ok: false, error: 'busy' });
  try {
    // Un jeton ne sert qu'une fois
    const cache = CacheService.getScriptCache();
    if (cache.get('used-' + tk.nonce)) return answer_('expired', { ok: false, error: 'expired' });
    cache.put('used-' + tk.nonce, '1', 21600);
    duplicate = alreadyRegistered_(sheet, email);
    if (!duplicate) {
      sheet.appendRow(COLUMNS.map(([k]) => cellValue_(k, d)));
      row = sheet.getLastRow();
    }
  } finally {
    lock.releaseLock();
  }

  // 6. E-mail. Adresse déjà inscrite : la réponse est identique à une nouvelle inscription (personne ne peut
  //    ainsi tester qui est inscrit), et la personne reçoit au plus un e-mail « déjà inscrit » toutes les 6 heures.
  if (duplicate) {
    const cache = CacheService.getScriptCache(), key = 'dup-' + Utilities.base64EncodeWebSafe(email).slice(0, 200);
    if (cache.get(key)) return answer_('duplicate', { ok: true, mail: 'sent' });
    cache.put(key, '1', 21600);
    return answer_('duplicate', { ok: true, mail: trySend_(d, 'dup') });
  }
  const mail = trySend_(d, 'new');
  sheet.getRange(row, colIndex_('mailStatus')).setValue(mail === 'sent' ? 'Envoyé' : 'Échec');

  if (CONFIG.NOTIFY_EMAIL) {
    try { notifyCommittee_(d, sheet); } catch (err) { console.error('Alerte bureau non envoyée : ' + err); }
  }
  return answer_('registered', { ok: true, mail: mail });
}

/* ---------- Anti-robot Cloudflare Turnstile ----------
   Le site obtient une preuve (jeton Turnstile) auprès de Cloudflare au moment de l'envoi ; le script la fait
   vérifier par Cloudflare avec la clé secrète, gardée dans les propriétés du script (jamais dans le code).
   Sans clé installée, la vérification est simplement sautée (réponse 'ok'). */
function turnstileCheck_(token) {
  const secret = (PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET') || '').trim();
  if (!secret) return 'ok';
  if (typeof token !== 'string' || !token || token.length > 2048) return 'missing';
  const j = turnstileVerify_(secret, token);
  if (!j || j.success !== true) return 'refused';
  const testing = j.metadata && j.metadata.result_with_testing_key; // clés de test officielles de Cloudflare (développement)
  if (!testing && CONFIG.TURNSTILE_HOSTNAMES.indexOf(j.hostname) < 0) return 'hostname';
  if (!testing && j.action !== 'register') return 'action'; // le site demande toujours la preuve pour l'action « register »
  return 'ok';
}
function turnstileVerify_(secret, token) {
  try {
    const res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post', payload: { secret: secret, response: token }, muteHttpExceptions: true
    });
    // Cloudflare répond 200 ou 400 (clé ou preuve invalide) : dans les deux cas, la réponse JSON fait foi
    let j = null;
    try { j = JSON.parse(res.getContentText()); } catch (e) { /* pas du JSON */ }
    if (j && typeof j.success === 'boolean') return j;
    console.error('Turnstile : réponse inattendue de Cloudflare (HTTP ' + res.getResponseCode() + ')');
    return null;
  } catch (err) {
    // Cloudflare injoignable, ou droit « service externe » absent (voir appsscript.json) : l'inscription est refusée (prudence)
    console.error('Turnstile injoignable : ' + err);
    return null;
  }
}

// Remet un champ dans la forme attendue : texte coupé à la longueur maximale, ou liste de textes
function cleanField_(k, v) {
  const f = FIELDS[k];
  const text = x => (typeof x === 'string' || typeof x === 'number') ? String(x).trim().slice(0, f.max) : '';
  if (f.list) return (Array.isArray(v) ? v : (v == null || v === '' ? [] : [v])).slice(0, f.list).map(text).filter(Boolean);
  return text(v);
}

// Envoie l'e-mail si la limite horaire et le quota du jour le permettent ; un échec n'annule jamais l'inscription
function trySend_(d, kind) {
  try {
    if (!underHourlyLimit_('mails', CONFIG.MAILS_PER_HOUR)) throw new Error('Limite horaire d’e-mails atteinte');
    if (MailApp.getRemainingDailyQuota() <= CONFIG.MAIL_RESERVE) throw new Error('Quota quotidien d’e-mails presque atteint');
    sendConfirmation_(d, kind);
    return 'sent';
  } catch (err) {
    console.error('E-mail non envoyé (' + kind + ') : ' + err);
    return 'failed';
  }
}

/* ---------- Jeton de formulaire ----------
   Format : horodatage.identifiant.signature. La signature (HMAC-SHA256) utilise une clé secrète
   gardée dans les propriétés du script : impossible de fabriquer un jeton sans passer par ce script. */
let secretCache_ = null;
function secret_() {
  if (secretCache_) return secretCache_;
  const props = PropertiesService.getScriptProperties();
  let s = props.getProperty('TOKEN_SECRET');
  if (!s) {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      s = props.getProperty('TOKEN_SECRET');
      if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); props.setProperty('TOKEN_SECRET', s); }
    } finally { lock.releaseLock(); }
  }
  return (secretCache_ = s);
}
function sign_(msg) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(msg, secret_())).replace(/=+$/, '');
}
function newToken_() {
  const msg = Date.now() + '.' + Utilities.getUuid().replace(/-/g, '');
  return msg + '.' + sign_(msg);
}
function checkToken_(tok) {
  if (typeof tok !== 'string' || tok.length > 200) return { s: 'bad' };
  const m = /^(\d{13})\.([0-9a-f]{32})\.([A-Za-z0-9_-]{43})$/.exec(tok);
  if (!m || !sameText_(sign_(m[1] + '.' + m[2]), m[3])) return { s: 'bad' };
  const age = Date.now() - Number(m[1]), min = CONFIG.MIN_FILL_SECONDS * 1000;
  if (age < -60000) return { s: 'bad' };
  if (age < min) return { s: 'young', wait: Math.ceil((min - age) / 1000) };
  if (age > Math.min(CONFIG.TOKEN_MAX_HOURS, 6) * 3600000) return { s: 'expired' };
  return { s: 'ok', nonce: m[2] };
}
// Comparaison en temps constant (ne révèle pas, par sa durée, combien de caractères sont justes)
function sameText_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---------- E-mails ---------- */
const TXT = {
  fr: {
    subject: 'Hope Buds Club : nous avons bien reçu votre inscription 🌱',
    hello: 'Bonjour {name},',
    thanks: 'Merci pour votre inscription au Hope Buds Club pour la saison {season} ! Nous l’avons bien reçue.',
    choices: 'Vos choix de cellule',
    first: '1er choix', second: '2e choix',
    nextT: 'Et maintenant ?',
    next: 'Votre inscription va être examinée par le bureau du club. Nous vous enverrons un second e-mail avec la suite : notre réponse, votre cellule et la date de la première réunion.',
    nothing: 'Vous n’avez rien d’autre à faire d’ici là. Une question ? Répondez simplement à cet e-mail ou écrivez-nous à {contact}.',
    dupSubject: 'Hope Buds Club : vous êtes déjà inscrit(e) 🌱',
    dupHello: 'Bonjour,',
    dupThanks: 'Nous avons reçu une nouvelle demande d’inscription avec cette adresse, mais elle est déjà inscrite pour la saison {season}. Votre première inscription est conservée et sera examinée par le bureau.',
    dupNext: 'Vous souhaitez modifier vos réponses ? Répondez simplement à cet e-mail ou écrivez-nous à {contact}.',
    bye: 'À très bientôt,', team: 'L’équipe du Hope Buds Club',
    insta: 'Suivez-nous sur Instagram',
    foot: 'Vous recevez cet e-mail parce que cette adresse a été utilisée pour s’inscrire au Hope Buds Club (Faculté des Sciences, Université d’Alger 1). Si ce n’est pas vous, ignorez simplement ce message.'
  },
  en: {
    subject: 'Hope Buds Club: we have received your registration 🌱',
    hello: 'Hello {name},',
    thanks: 'Thank you for registering with Hope Buds Club for the {season} season! We have received your registration.',
    choices: 'Your cell choices',
    first: '1st choice', second: '2nd choice',
    nextT: 'What happens next?',
    next: 'The club committee will now review your registration. We will send you a second email with the next steps: our answer, your cell and the date of the first meeting.',
    nothing: 'There is nothing else you need to do for now. Any questions? Just reply to this email or write to us at {contact}.',
    dupSubject: 'Hope Buds Club: you are already registered 🌱',
    dupHello: 'Hello,',
    dupThanks: 'We received a new registration request with this address, but it is already registered for the {season} season. Your first registration is kept and will be reviewed by the committee.',
    dupNext: 'Want to change your answers? Just reply to this email or write to us at {contact}.',
    bye: 'See you soon,', team: 'The Hope Buds Club team',
    insta: 'Follow us on Instagram',
    foot: 'You are receiving this email because this address was used to register with Hope Buds Club (Faculty of Sciences, University of Algiers 1). If this wasn’t you, simply ignore this message.'
  }
};

// kind = 'new' (confirmation) ou 'dup' (adresse déjà inscrite : pas de nom ni de choix repris de la nouvelle demande)
function buildEmail_(d, kind) {
  const L = d.lang === 'fr' ? 'fr' : 'en', t = TXT[L], dup = kind === 'dup';
  const first = String(d.name || '').trim().split(/\s+/)[0];
  const season = CONFIG.SEASON.replace('-', '–');
  const cell = id => isCell_(id) ? CELLS[id].ic + ' ' + CELLS[id][L] : '';
  const choices = dup ? [] : [[t.first, cell(d.choice1)]];
  if (!dup && d.choice2 && d.choice1 !== 'any') choices.push([t.second, cell(d.choice2)]);
  const fill = s => s.replace('{name}', first).replace('{season}', season).replace('{contact}', CONFIG.CONTACT_EMAIL);
  const subject = dup ? t.dupSubject : t.subject;
  const hello = dup ? t.dupHello : fill(t.hello);
  const intro = fill(dup ? t.dupThanks : t.thanks);
  const outro = fill(dup ? t.dupNext : t.nothing);

  // Version texte brut (pour les messageries qui n'affichent pas le HTML)
  const text = [hello, '', intro, ''].concat(
    choices.length ? [t.choices + ' :'].concat(choices.map(([k, v]) => '  • ' + k + ' : ' + v), ['']) : [],
    dup ? [] : [t.nextT, t.next, ''],
    [outro, '', t.bye, t.team, CONFIG.INSTAGRAM_URL, '', '—', t.foot]
  ).join('\n');

  // Version HTML : tableaux et styles en ligne pour bien s'afficher dans Gmail, Outlook et sur mobile
  const h = esc_;
  const rows = choices.map(([k, v]) =>
    '<tr><td style="padding:10px 14px;border-bottom:1px solid #e3ebd8;font:500 12px/1.4 Consolas,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#4c625a;white-space:nowrap">' + h(k) +
    '</td><td style="padding:10px 14px;border-bottom:1px solid #e3ebd8;font:600 16px/1.4 Arial,Helvetica,sans-serif;color:#10282a">' + h(v) + '</td></tr>').join('');
  const html =
'<!doctype html><html lang="' + L + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + h(subject) + '</title></head>' +
'<body style="margin:0;padding:0;background:#f5f8ee">' +
'<div style="display:none;max-height:0;overflow:hidden;opacity:0">' + h(intro) + '</div>' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8ee"><tr><td align="center" style="padding:28px 12px">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fcfdf8;border-radius:18px;overflow:hidden;border:1px solid #e3ebd8">' +
  '<tr><td style="height:6px;background:#4eb017;background-image:linear-gradient(90deg,#4eb017,#0b5ba8);font-size:0;line-height:0">&nbsp;</td></tr>' +
  '<tr><td style="padding:28px 28px 8px;font:700 24px/1.2 Georgia,\'Times New Roman\',serif;color:#10282a">🌱 Hope Buds Club' +
    '<div style="margin-top:6px;font:500 11px/1.4 Consolas,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#4c625a">' + h(L === 'fr' ? 'Inscriptions ' : 'Registrations ') + h(season) + '</div></td></tr>' +
  '<tr><td style="padding:16px 28px 0;font:16px/1.6 Arial,Helvetica,sans-serif;color:#10282a">' +
    '<p style="margin:0 0 14px">' + h(hello) + '</p>' +
    '<p style="margin:0 0 22px">' + h(intro) + '</p>' +
    (rows ? '<p style="margin:0 0 8px;font:600 15px/1.4 Arial,Helvetica,sans-serif;color:#2e7a0b">' + h(t.choices) + '</p>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ecf3e1;border-radius:12px;margin-bottom:24px">' + rows + '</table>' : '') +
    (dup ? '' : '<p style="margin:0 0 8px;font:700 20px/1.3 Georgia,\'Times New Roman\',serif;color:#0b5ba8">' + h(t.nextT) + '</p>' +
      '<p style="margin:0 0 14px">' + h(t.next) + '</p>') +
    '<p style="margin:0 0 24px;color:#4c625a">' + h(outro).replace(h(CONFIG.CONTACT_EMAIL), '<a href="mailto:' + h(CONFIG.CONTACT_EMAIL) + '" style="color:#0b5ba8">' + h(CONFIG.CONTACT_EMAIL) + '</a>') + '</p>' +
    '<p style="margin:0">' + h(t.bye) + '<br><b>' + h(t.team) + '</b></p>' +
  '</td></tr>' +
  '<tr><td style="padding:24px 28px 28px">' +
    '<a href="' + h(CONFIG.INSTAGRAM_URL) + '" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#0b5ba8;color:#ffffff;text-decoration:none;font:600 14px/1 Arial,Helvetica,sans-serif">' + h(t.insta) + ' →</a>' +
  '</td></tr>' +
  '<tr><td style="padding:18px 28px 24px;border-top:1px solid #e3ebd8;font:12px/1.5 Arial,Helvetica,sans-serif;color:#6b7f77">' + h(t.foot) + '</td></tr>' +
'</table></td></tr></table></body></html>';

  return { subject: subject, text: text, html: html };
}

function sendConfirmation_(d, kind) {
  const m = buildEmail_(d, kind || 'new');
  const opts = { to: d.email, subject: m.subject, body: m.text, htmlBody: m.html, name: CONFIG.CLUB_NAME };
  if (CONFIG.REPLY_TO) opts.replyTo = CONFIG.REPLY_TO;
  MailApp.sendEmail(opts);
}

function notifyCommittee_(d, sheet) {
  const c = id => isCell_(id) ? CELLS[id].fr : '—';
  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: 'Nouvelle inscription HBC : ' + d.name,
    body: 'Nouvelle inscription reçue.\n\nNom : ' + d.name + '\nE-mail : ' + d.email + '\n1er choix : ' + c(d.choice1) +
      (d.choice2 ? '\n2e choix : ' + c(d.choice2) : '') + '\n\nToutes les réponses : ' + sheet.getParent().getUrl(),
    name: CONFIG.CLUB_NAME
  });
}

/* ---------- Tableau ---------- */
// Le tableau utilisé est celui auquel le script est rattaché (ouvert depuis le Sheet : Extensions → Apps Script)
function getSpreadsheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Ce script doit être rattaché au Google Sheet des inscriptions (ouvrez-le depuis le Sheet : Extensions → Apps Script).');
  return ss;
}

function getSheet_() {
  const ss = getSpreadsheet_();
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) sh = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS.map(c => c[1]));
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#dcefc9');
    sh.setFrozenRows(1);
  }
  return sh;
}

function alreadyRegistered_(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  return sheet.getRange(2, colIndex_('email'), last - 1, 1).getValues().some(r => String(r[0]).trim().toLowerCase() === email);
}

function colIndex_(key) { return COLUMNS.findIndex(c => c[0] === key) + 1; }

// Une vraie cellule du club (et pas « constructor », « toString »… hérités de tout objet JavaScript)
function isCell_(id) { return typeof id === 'string' && Object.prototype.hasOwnProperty.call(CELLS, id); }

// Compte les envois de l'heure en cours (mémoire temporaire de Google, remise à zéro chaque heure)
function underHourlyLimit_(name, max) {
  const cache = CacheService.getScriptCache();
  const key = name + '-' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
  const n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 3600);
  return n <= max;
}

function cellValue_(k, d) {
  if (k === 'status') return 'À examiner';
  if (k === 'mailStatus') return 'En cours';
  if (k === 'createdAt') return new Date(); // heure du serveur, jamais celle envoyée par le navigateur
  if (k === 'lang') return d.lang === 'fr' ? 'FR' : 'EN';
  let v = d[k];
  if ((k === 'choice1' || k === 'choice2') && isCell_(v)) v = CELLS[v].fr;
  if (Array.isArray(v)) v = v.slice(0, 30).join(', ');
  if (v == null || v === false) return '';
  if (v === true) return 'Oui';
  if (typeof v === 'object') return '';
  // Texte seulement, 2000 caractères maximum, sans caractères de contrôle invisibles
  v = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, '').slice(0, 2000);
  // Liens neutralisés dans les réponses libres : le bureau ne peut pas cliquer par erreur sur un lien piégé
  if (k !== 'name' && k !== 'email') v = defang_(v);
  // Empêche qu'une réponse commençant par = + - @ (ou espace puis l'un d'eux) soit interprétée comme une formule
  return /^\s*[=+\-@]/.test(v) ? "'" + v : v;
}

// « https://site-piege.com » devient « hxxps[:]//site-piege[.]com » : toujours lisible, plus cliquable.
// Même chose pour www., les adresses du type « exemple.com » et les liens javascript:, data:, file:…
const TLDS_ = /^(com|net|org|info|biz|io|co|me|ly|gl|gg|app|dev|xyz|top|site|online|link|club|shop|live|page|ai|tk|ml|ga|cf|ru|cn|dz|fr|uk|de|us|tv|cc|to|in|su|ws|pw|cloud|store|tech|space|website|click|icu|zip|mov|sh|im|be|ch|ma|tn|eg|sa|ae|qa)$/i;
function defang_(s) {
  return s
    .replace(/\b(h)tt(ps?)(?=:\/\/)/gi, '$1xx$2')
    .replace(/:\/\//g, '[:]//')
    .replace(/\b(javascript|vbscript|data|file|blob):/gi, '$1[:]')
    .replace(/\b((?:[a-z0-9-]+\.)+)([a-z]{2,24})\b/gi, (m, host, tld) => TLDS_.test(tld) ? host.replace(/\./g, '[.]') + tld : m);
}

/* ---------- Rapport de sécurité ----------
   Chaque réponse du script est comptée par heure (6 dernières heures, mémoire temporaire de Google). */
const STAT_KINDS_ = ['registered', 'duplicate', 'wait', 'token', 'expired', 'invalid', 'captcha', 'honeypot', 'bad_request', 'busy', 'closed', 'server'];
function hourKey_(d) { return Utilities.formatDate(d || new Date(), 'UTC', 'yyyyMMddHH'); }
function stat_(kind) {
  try {
    const cache = CacheService.getScriptCache(), key = 'stat-' + hourKey_() + '-' + kind;
    cache.put(key, String(Number(cache.get(key) || 0) + 1), 21600);
  } catch (err) { /* le comptage ne doit jamais bloquer une inscription */ }
}

/* ---------- Utilitaires ---------- */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc_(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

/* =====================================================================
   Fonctions à lancer depuis l'éditeur : choisissez-les dans la liste en haut, puis ▶ Exécuter.
   Elles agissent tout de suite, sans nouveau déploiement.
   ===================================================================== */

// Après chaque mise à jour : vérifie l'installation (tableau, clé des jetons, mémoire, autorisations)
// puis envoie deux exemples d'e-mail (FR et EN) à votre propre adresse, sans ajouter d'inscription.
function testEmail() {
  const sheet = getSheet_();           // s'arrête avec un message clair si le script n'est pas rattaché au tableau
  secret_();                           // crée la clé secrète des jetons si elle n'existe pas encore
  const tok = newToken_();
  if (checkToken_(tok).s !== 'young') throw new Error('Jeton de formulaire : vérification échouée.');
  const cache = CacheService.getScriptCache(); cache.put('selftest', 'ok', 60);
  if (cache.get('selftest') !== 'ok') throw new Error('Mémoire temporaire (CacheService) indisponible.');
  const me = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  ['fr', 'en'].forEach(lang => sendConfirmation_({ name: 'Yasmine Test', email: me, lang: lang, choice1: 'media', choice2: 'relations' }, 'new'));
  console.log('✅ Installation correcte. E-mails de test envoyés à ' + me + '. Quota restant aujourd’hui : ' + MailApp.getRemainingDailyQuota());
  console.log('Les inscriptions arrivent dans : ' + sheet.getParent().getUrl() + ' (onglet « ' + CONFIG.SHEET_NAME + ' »)');
  console.log(PropertiesService.getScriptProperties().getProperty('INSCRIPTIONS') === 'fermees' ? '🔒 Les inscriptions sont FERMÉES (ouvrirInscriptions pour rouvrir).' : '🟢 Les inscriptions sont ouvertes.');
  // Anti-robot : on envoie à Cloudflare une fausse preuve ; une clé secrète valide répond « preuve invalide »
  const tsSecret = (PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET') || '').trim();
  if (!tsSecret) console.log('⚪ Anti-robot Turnstile : pas encore activé (propriété TURNSTILE_SECRET absente).');
  else {
    const j = turnstileVerify_(tsSecret, 'test-invalide');
    const codes = (j && j['error-codes']) || [];
    if (!j) throw new Error('Anti-robot Turnstile : impossible de joindre Cloudflare. Vérifiez que appsscript.json contient le droit « script.external_request » (puis relancez testEmail et acceptez l’autorisation), ou réessayez dans un moment.');
    if (codes.indexOf('invalid-input-secret') >= 0 || codes.indexOf('missing-input-secret') >= 0) throw new Error('Anti-robot Turnstile : la clé secrète TURNSTILE_SECRET est fausse. Recopiez la « Secret Key » depuis Cloudflare, sans espace avant ni après.');
    if (codes.indexOf('invalid-input-response') < 0) throw new Error('Anti-robot Turnstile : réponse inattendue de Cloudflare (' + (codes.join(', ') || 'aucun code') + ').');
    console.log('🛡️ Anti-robot Turnstile : ACTIF, clé secrète valide.');
  }
  // Onglet « Sécurité » : la mise à jour automatique est-elle en place ?
  try {
    const on = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'majOngletSecurite');
    console.log(on ? '📊 Onglet « Sécurité » : mis à jour automatiquement chaque heure.' : '⚪ Onglet « Sécurité » : pas encore installé (lancez installerOngletSecurite).');
  } catch (err) {
    console.log('⚪ Onglet « Sécurité » : droit « script.scriptapp » absent de appsscript.json.');
  }
}

// Ce que le script a reçu ces 6 dernières heures : inscriptions, robots bloqués, tentatives refusées…
// Beaucoup de « token », « invalid » ou « honeypot » = quelqu'un essaie d'attaquer le formulaire.
function rapportSecurite() {
  const cache = CacheService.getScriptCache(), lines = [];
  for (let h = 0; h < 6; h++) {
    const d = new Date(Date.now() - h * 3600000), hk = hourKey_(d);
    const counts = cache.getAll(STAT_KINDS_.map(k => 'stat-' + hk + '-' + k));
    const parts = STAT_KINDS_.map(k => [k, Number(counts['stat-' + hk + '-' + k] || 0)]).filter(([, n]) => n > 0);
    lines.push(Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM HH') + 'h : ' + (parts.length ? parts.map(([k, n]) => k + ' ' + n).join(' · ') : 'rien'));
  }
  console.log('Rapport de sécurité (heure par heure, la plus récente en premier)\n' + lines.join('\n') +
    '\n\nregistered = inscription enregistrée · duplicate = adresse déjà inscrite · wait = envoyé trop vite (réessai automatique)' +
    '\ntoken / expired = jeton absent, falsifié, périmé ou réutilisé · invalid = champs refusés · honeypot = robot piégé' +
    '\ncaptcha = vérification anti-robot Cloudflare échouée' +
    '\nbad_request = envoi mal formé · busy = limite horaire · closed = inscriptions fermées · server = erreur interne');
}

/* ---------- Onglet « Sécurité » du tableau (à suivre depuis l'application Google Sheets) ----------
   Chaque heure, une ligne est ajoutée EN HAUT de l'onglet : le bilan de l'heure écoulée (inscriptions,
   robots bloqués, tentatives refusées) et un verdict en clair dans la colonne « Bilan ». 30 jours sont gardés.
   À installer une seule fois avec installerOngletSecurite. */
const SECURITY_SHEET = 'Sécurité';
const SECURITY_HEAD = ['Heure', 'Bilan', 'Inscriptions', 'Déjà inscrits', 'Trop rapides', 'Jeton refusé', 'Jeton périmé',
  'Champs refusés', 'Anti-robot refusé', 'Robots piégés', 'Envois mal formés', 'Limite horaire', 'Fermé', 'Erreurs internes'];
const SECURITY_KEEP_ROWS = 24 * 30;

// Lancée automatiquement chaque heure : écrit les heures terminées qui ne sont pas encore dans l'onglet
function majOngletSecurite() {
  const props = PropertiesService.getScriptProperties(), cache = CacheService.getScriptCache();
  const nowH = Math.floor(Date.now() / 3600000);                    // numéro de l'heure en cours
  let last = Number(props.getProperty('SECURITE_DERNIERE_HEURE'));
  if (!(last >= nowH - 6)) last = nowH - 2;                           // la mémoire temporaire garde 6 heures au plus
  const rows = [], colors = [];
  for (let h = last + 1; h <= nowH - 1; h++) {                        // seulement les heures terminées
    const d = new Date(h * 3600000), hk = hourKey_(d);
    const counts = cache.getAll(STAT_KINDS_.map(k => 'stat-' + hk + '-' + k));
    const n = {}; STAT_KINDS_.forEach(k => { n[k] = Number(counts['stat-' + hk + '-' + k] || 0); });
    const verdict = securityVerdict_(n);
    rows.push([d, verdict[0]].concat(STAT_KINDS_.map(k => n[k])));
    colors.push([null, verdict[1]].concat(STAT_KINDS_.map(() => null)));
  }
  if (!rows.length) return;
  const sh = securitySheet_();
  sh.insertRowsAfter(1, rows.length);
  sh.getRange(2, 1, rows.length, SECURITY_HEAD.length).setValues(rows.reverse()).setBackgrounds(colors.reverse());
  sh.getRange(2, 1, rows.length, 1).setNumberFormat('dd/mm/yyyy hh"h"');
  if (sh.getLastRow() > SECURITY_KEEP_ROWS + 1) sh.deleteRows(SECURITY_KEEP_ROWS + 2, sh.getLastRow() - SECURITY_KEEP_ROWS - 1);
  props.setProperty('SECURITE_DERNIERE_HEURE', String(nowH - 1));
}

// Le verdict de l'heure, en clair, et sa couleur
function securityVerdict_(n) {
  const refused = n.token + n.expired + n.invalid + n.captcha + n.honeypot + n.bad_request;
  if (n.server > 0) return ['❗ Erreur interne : voir Exécutions dans Apps Script', '#f4c7c3'];
  if (refused >= 30) return ['🚨 Attaque probable (' + refused + ' refus) : si ça continue, lancez fermerInscriptions', '#f4c7c3'];
  if (refused >= 10) return ['⚠️ Activité suspecte (' + refused + ' refus)', '#fce8b2'];
  if (n.closed > 0) return ['🔒 Inscriptions fermées', '#e8eaed'];
  if (n.busy > 0) return ['⏳ Limite horaire atteinte', '#fce8b2'];
  if (n.registered + n.duplicate > 0) return ['✅ ' + n.registered + ' inscription(s)' + (refused ? ', ' + refused + ' refus' : ''), '#d9ead3'];
  return [refused ? '✅ Calme (' + refused + ' refus)' : '✅ Calme', null];
}

function securitySheet_() {
  const ss = getSpreadsheet_();
  let sh = ss.getSheetByName(SECURITY_SHEET);
  if (!sh) {
    sh = ss.insertSheet(SECURITY_SHEET);
    sh.getRange(1, 1, 1, SECURITY_HEAD.length).setValues([SECURITY_HEAD]).setFontWeight('bold').setBackground('#dcefc9');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 120); sh.setColumnWidth(2, 330);
    // Avertissement si quelqu'un essaie de modifier l'onglet à la main (le script, lui, peut toujours écrire)
    sh.protect().setDescription('Rempli automatiquement par le script : ne pas modifier').setWarningOnly(true);
  }
  return sh;
}

// À lancer UNE fois : crée l'onglet « Sécurité » et la mise à jour automatique toutes les heures
function installerOngletSecurite() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'majOngletSecurite').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('majOngletSecurite').timeBased().everyHours(1).create();
  securitySheet_();
  majOngletSecurite();
  console.log('📊 Onglet « ' + SECURITY_SHEET + ' » installé : une ligne s’ajoutera en haut chaque heure. Ouvrez le tableau (ou l’application Google Sheets) pour le suivre.');
}

// En cas d'attaque ou à la fin de la saison : plus aucune inscription n'est acceptée,
// le site affiche « les inscriptions sont fermées ». Rien d'autre ne change.
function fermerInscriptions() {
  PropertiesService.getScriptProperties().setProperty('INSCRIPTIONS', 'fermees');
  console.log('🔒 Inscriptions fermées. Pour les rouvrir : lancez ouvrirInscriptions.');
}
function ouvrirInscriptions() {
  PropertiesService.getScriptProperties().deleteProperty('INSCRIPTIONS');
  console.log('🟢 Inscriptions ouvertes.');
}

// Si vous pensez que la clé secrète des jetons a fuité : elle est remplacée, tous les anciens jetons
// deviennent invalides. Les visiteurs en train de remplir le formulaire n'ont rien à faire : le site en redemande un.
function changerCleJetons() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    PropertiesService.getScriptProperties().setProperty('TOKEN_SECRET', Utilities.getUuid() + Utilities.getUuid());
  } finally { lock.releaseLock(); }
  secretCache_ = null;
  console.log('🔑 Nouvelle clé des jetons en place. Les anciens jetons ne fonctionnent plus.');
}
