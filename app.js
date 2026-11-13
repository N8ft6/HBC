/* Hope Buds Club — all the site's JavaScript (vanilla, no framework), one commented block per feature.
   Loaded at the end of index.html. After editing this file, change the ?v=… number on its <script> tag
   in index.html so visitors get the new version instead of an old copy kept by their browser. */
(() => {
  /* ---------- Shared helpers ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  $('#yr').textContent = new Date().getFullYear();
  const fLogo = $('#fLogo'), nLogo = $('.brand img'); if (fLogo && nLogo) fLogo.src = nLogo.src;

  /* ---------- Language (EN / FR) ---------- */
  let lang = document.documentElement.lang === 'fr' ? 'fr' : 'en';
  const FR = {
    'skip': 'Aller au contenu',
    'uni': "Université d'Alger 1",
    'nav.seed': 'La Graine', 'nav.lab': 'Lab Éco', 'nav.faq': 'FAQ', 'nav.contact': 'Contact', 'nav.join': 'Nous rejoindre', 'nav.cells': 'Cellules',
    'a.brand': 'Hope Buds Club, retour en haut', 'a.drop': "Goutte d'eau fragmentée, emblème du club", 'a.ticker': "Flore d'Algérie",
    'a.filter': 'Filtrer les activités', 'a.close': 'Fermer', 'a.top': 'Retour en haut', 'ph.why': 'Une idée de projet, une compétence à partager, une plante que vous aimez…',
    'hero.eyebrow': '🚨 Les inscriptions HBC sont officiellement ouvertes',
    'h1a': 'Nouvelle', 'h1b': 'saison,', 'h1c': 'nouvel espoir.',
    'hero.lede': "Passionné de nature, de science, de créativité ou de travail d'équipe ? Ou simplement à la recherche d'un lieu pour découvrir de nouvelles passions, développer vos compétences et vivre des moments inoubliables ? Alors HBC est fait pour vous ! 🌱",
    'cta.adv': "S'inscrire ici", 'cta.cells': 'Trouvez votre cellule', 'cta.reg': "S'inscrire ici",
    'tag1': '<b>H₂O</b> · source de vie', 'tag2': '<b>36°46′ N</b> · Alger',
    'hf1': 'Écologie &amp; biodiversité', 'hf2': 'Économie circulaire', 'hf3': 'Sensibilisation &amp; recherche',
    'about.eyebrow': 'À propos', 'about.h2': "La Graine <em>d'une idée</em>",
    'about.lead': "Enraciné à la <strong>Faculté des Sciences de l'Université d'Alger 1</strong>, Hope Buds Club a germé d'une conviction simple : <span class=\"hl\">pour protéger la nature, il faut d'abord la comprendre, puis partager ce que l'on apprend</span>. De la paillasse du labo aux espaces verts d'Alger, nous semons la curiosité et faisons pousser l'action pour une planète plus verte et plus vivante.",
    'about.c1': "Nous sommes étudiants en biologie, écologie, chimie et sciences de la Terre. Ensemble, nous transformons les cours en terrain, et le terrain en action : inventaires de biodiversité, ateliers de tri et de réemploi, conférences ouvertes à tous.",
    'about.c2': "Notre ambition : former une génération de jeunes scientifiques algériens qui comprennent l'érosion de la biodiversité et les changements globaux, et qui agissent avec rigueur, sur le campus comme dans tout le pays.",
    'cr1v': 'Observer', 'cr1': "Aller sur le terrain, identifier, compter. Une espèce que l'on ne connaît pas est une espèce que l'on ne peut pas protéger.",
    'cr2v': 'Réduire', 'cr2': "Repenser nos déchets comme une ressource en faisant entrer l'économie circulaire dans le quotidien de la faculté.",
    'cr3v': 'Partager', 'cr3': 'Organiser des séminaires nationaux et des journées de sensibilisation pour que le savoir dépasse les amphis.',
    'sp.pin': "Planche d'herbier", 'sp.dt1': 'Nom', 'sp.dd1': 'Myrte · rihane (ريحان)', 'sp.dt2': 'Famille', 'sp.dt3': 'Usage', 'sp.dd3': 'Médecine traditionnelle', 'sp.dt4': 'Aire', 'sp.dd4': 'Maquis du Tell algérien',
    'lab.eyebrow': "Plan d'activités 2026–2027", 'lab.h2': 'Le Lab <em>Éco</em>',
    'lab.p': "Notre plan 2026–2027, mois par mois : de la journée portes ouvertes en octobre au bilan de l'année en juillet, avec chaque journée mondiale célébrée sur le campus. Filtrez par type d'activité.",
    'flex.h': 'Activités flexibles <em>date à définir</em>', 'flex.p': "Programmées au fil de l'année ; les dates sont communiquées aux membres.",
    'ch.all': 'Tout', 'ch.club': 'Vie du club', 'ch.ate': 'Ateliers', 'ch.ter': 'Sorties &amp; terrain', 'ch.sen': 'Actions &amp; débats', 'ch.day': 'Journées mondiales',
    'faq.eyebrow': 'Questions', 'faq.h2': 'Bon à <em>savoir</em>',
    'faq.p': "L'essentiel avant de planter votre graine. Une autre question ? Écrivez-nous à l'adresse en bas de page.",
    'q1': 'Qui peut rejoindre le club ?', 'a1': "Tous les étudiants de l'Université d'Alger 1, quelle que soit leur filière : biologie, chimie, physique, mathématiques, informatique ou autre.",
    'q2': "Faut-il déjà s'y connaître en écologie ?", 'a2': 'Non. La curiosité suffit : on apprend ensemble, sur le terrain, en atelier et lors des séminaires.',
    'q3': 'Où et quand le club se réunit-il ?', 'a3': "À la Faculté des Sciences, au centre d'Alger. Les membres inscrits reçoivent la date de chaque réunion par e-mail.",
    'q4': 'Que se passe-t-il après mon inscription ?', 'a4': "Vous recevez tout de suite un e-mail de confirmation. Le bureau examine ensuite votre inscription et vous envoie un second e-mail avec sa réponse, votre cellule (votre premier choix si possible) et la date de la prochaine réunion.",
    'q5': 'Puis-je proposer mon propre projet ?', 'a5': "Oui, mentionnez-le dans le formulaire d'inscription. La cellule Développement de projets l'étudiera avec vous et vous aidera à en faire une initiative concrète.",
    'q6': 'Que faites-vous de mes données personnelles ?', 'a6': "Vos réponses sont enregistrées dans un tableau Google privé, visible uniquement par le bureau du club. Elles servent seulement à traiter votre inscription et à vous contacter au sujet du club, et ne sont jamais partagées. Au moment de l'envoi, une vérification anti-robot de Cloudflare (Turnstile) est effectuée. Elles sont conservées le temps de la saison 2026-2027, puis supprimées. Pour consulter, corriger ou supprimer vos données, écrivez à hopebuds.club@univ-alger.dz.",
    'cell.eyebrow': 'Trouvez votre équipe', 'cell.h2': 'Quatre cellules, <em>un seul club</em>',
    'cell.p': "Voici comment le club s'organise. À l'inscription, vous choisissez la cellule que vous aimeriez le plus rejoindre : ce sera votre équipe pour la saison.",
    'cell.join': 'Rejoindre cette cellule', 'cell.any': "Pas encore sûr ? Choisissez « Je suis prêt à rejoindre la cellule où l'on aura besoin de moi » dans le formulaire, et le bureau vous placera là où vous serez le plus utile.",
    'cell.n01': 'Cellule 01', 'cl01h': "Développement de projets", 'cl01p': "La cellule Développement de projets donne vie aux idées et aux projets du HBC. Elle planifie les projets, transforme les idées en initiatives concrètes et cherche des façons créatives d'avoir un vrai impact. Elle veille aussi à ce que les cellules communiquent et avancent ensemble.",
    'cell.n02': 'Cellule 02', 'cl02h': "Activités &amp; Organisation", 'cl02p': "La cellule Activités &amp; Organisation concrétise les plans élaborés par la cellule Développement de projets. Elle organise et coordonne les activités et événements du HBC, des ateliers aux sorties, en veillant à ce que chaque étape se déroule bien et rassemble les membres.",
    'cell.n03': 'Cellule 03', 'cl03h': "Médias &amp; Créativité", 'cl03p': "La cellule Médias &amp; Créativité gère l'identité visuelle et le contenu créatif du HBC. Elle conçoit les publications, crée les visuels, documente les activités et trouve des façons créatives de partager le travail du HBC et de rendre nos initiatives plus visibles.",
    'cell.n04': 'Cellule 04', 'cl04h': "Relations &amp; Partenariats", 'cl04p': "La cellule Relations &amp; Partenariats construit et entretient les relations au sein du HBC et avec les personnes, clubs, organisations et partenaires extérieurs à l'université. Elle gère la communication avec les partenaires et sponsors potentiels, développe des collaborations et cherche des soutiens pour les projets du HBC.",
    'reg.eyebrow': 'Inscription 2026–2027 · Hope Buds Club', 'reg.p': 'Six courtes étapes, environ cinq minutes. Les champs marqués * sont obligatoires.',
    'qz.eyebrow': 'Quiz des cellules · 5 questions · 1 min', 'qz.h': 'Vous hésitez entre les cellules ? <em>Faites le quiz</em>',
    'qz.p': 'Cinq questions rapides sur votre façon de travailler. Nous vous suggérons la cellule qui vous correspond le mieux, ainsi qu\'un deuxième choix.',
    'qz.start': 'Faire le quiz', 'qz.back': 'Retour', 'qz.best': 'Votre cellule idéale', 'qz.missions': 'Ce que vous y ferez',
    'qz.join': 'Rejoindre cette cellule', 'qz.again': 'Refaire le quiz', 'qz.match': 'Votre affinité avec chaque cellule',
    'qz.note': "Ce n'est qu'une suggestion : vous restez libre de choisir n'importe quelle cellule. Vos deux meilleures cellules seront pré-remplies dans le formulaire.",
    'join.eyebrow': 'Inscriptions 2026–2027 · Ouvertes', 'join.h2': "Ne restez pas spectateur. <em>Vivez l'aventure !</em>",
    'join.lede': "Une toute nouvelle aventure vous attend ! 🚀 Que vous soyez là pour apprendre, créer, diriger, explorer ou faire la différence, il y a une place pour vous dans notre communauté. 🤝💚",
    'st1b': 'Apprendre &amp; explorer', 'st1s': 'Des événements passionnants, des activités scientifiques et des ateliers.',
    'st2b': 'Agir pour la planète', 'st2s': 'Des projets environnementaux, des sorties éducatives et bien plus encore.',
    'st3b': 'Grandir ensemble', 'st3s': 'Créer, diriger, faire la différence et vivre des moments inoubliables. ☘️ Grandissons ensemble !',
    'reg.h2': 'Plantez votre <em>graine</em>',
    'l.name': 'Nom complet', 'l.email': 'E-mail', 'l.phone': 'Téléphone <span class="opt">(facultatif)</span>', 'l.student': 'Matricule <span class="opt">(facultatif)</span>',
    'l.field': 'Filière', 'l.year': 'Année', 'l.why': 'Pourquoi voulez-vous nous rejoindre ? <span class="opt">(facultatif)</span>',
    'l.consent': "J'accepte que Hope Buds Club conserve ces informations pour me contacter au sujet des activités du club.",
    'o.choose': 'Choisir…', 'o.bio': 'Biologie', 'o.eco': 'Écologie &amp; environnement', 'o.chem': 'Chimie', 'o.earth': 'Sciences de la Terre',
    'o.phys': 'Physique', 'o.math': 'Mathématiques', 'o.cs': 'Informatique', 'o.other': 'Autre', 'o.phd': 'Doctorat',
    'reg.note': "Ouvert à tous les étudiants de l'Université d'Alger 1.", 'submit': "Envoyer l'inscription",
    'done.text': 'Votre inscription a bien été reçue. Un membre du bureau vous enverra par e-mail la date de la prochaine réunion à la Faculté des Sciences.',
    'done.demo': "Mode démo : ce formulaire n'est pas encore relié à un service d'inscription, rien n'a donc été envoyé ni enregistré.",
    'done.back': 'Retour au site',
    'f.small': 'HBC · Club scientifique', 'f.inst': 'Établissement',
    'f.addr': "Faculté des Sciences<br>Université d'Alger 1 — Benyoucef Benkhedda<br><span>2, rue Didouche Mourad, Alger-Centre<br>Algérie</span>",
    'copy': 'Copier', 'f.tag': 'Là où la curiosité éclot', 'f.rights': 'Tous droits réservés',
    'nav.garden': 'Jardin',
    'g.eyebrow': 'Interactif · Jardin vivant', 'g.h2': 'Faites pousser <em>le jardin du club</em>',
    'g.p': "Touchez le sol pour semer une graine et regardez-la pousser. Sept plantes que l'on rencontre en Algérie se relaient : coquelicot, olivier, figuier de Barbarie, tulipe sauvage… Arrosez le jardin et les papillons suivront.",
    'g.blow': 'survolez ou touchez pour souffler', 'g.blowA': 'Souffler sur le pissenlit', 'g.stageA': 'Jardin interactif. Touchez le sol pour planter une graine.',
    'g.hint': 'Touchez le sol pour planter', 'g.plantBtn': 'Planter une graine', 'g.water': 'Arroser le jardin', 'g.clear': 'Recommencer', 'g.note': 'Votre jardin est conservé sur cet appareil.'
  };
  const STR = {
    en: {
      'theme.toDark': 'Switch to dark mode', 'theme.toLight': 'Switch to light mode', 'lang.aria': 'Passer en français',
      'menu.open': 'Open menu', 'menu.close': 'Close menu',
      stages: ['Stage I · <b>Imbibition</b>', 'Stage II · <b>Radicle</b>', 'Stage III · <b>Cotyledons</b>', 'Stage IV · <b>Bud</b>', 'Stage V · <b>Flowering</b>'],
      'err.name': 'Please enter your full name.', 'err.email': 'Enter a valid email address, like name@example.com.',
      'err.phone': 'Use digits only, for example 0555 12 34 56.', 'err.field': 'Choose your field of study.', 'err.year': 'Choose your year.',
      'err.consent': 'Tick the box so we can contact you.',
      'err.submit': 'Your registration could not be sent. Check your connection and try again. If it keeps failing, email us at the address in the footer.',
      submit: 'Submit registration', sending: 'Sending…', welcome: 'Welcome, <em></em>.',
      copy: 'Copy', copied: 'Copied', selected: 'Selected',
      empty: 'No activity of this type this month.', 'now.today': 'Today at the club', 'now.this': 'This month at the club', 'now.next': 'Coming up', 'now.badge': 'Now', today: 'Today',
      types: { club: 'Club event', ate: 'Workshop', ter: 'Field trip', sen: 'Action', day: 'World day' }
    },
    fr: {
      'theme.toDark': 'Passer en mode sombre', 'theme.toLight': 'Passer en mode clair', 'lang.aria': 'Switch to English',
      'menu.open': 'Ouvrir le menu', 'menu.close': 'Fermer le menu',
      stages: ['Stade I · <b>Imbibition</b>', 'Stade II · <b>Radicule</b>', 'Stade III · <b>Cotylédons</b>', 'Stade IV · <b>Bourgeon</b>', 'Stade V · <b>Floraison</b>'],
      'err.name': 'Veuillez saisir votre nom complet.', 'err.email': 'Saisissez une adresse e-mail valide, par exemple nom@exemple.com.',
      'err.phone': 'Chiffres uniquement, par exemple 0555 12 34 56.', 'err.field': 'Choisissez votre filière.', 'err.year': 'Choisissez votre année.',
      'err.consent': 'Cochez la case pour que nous puissions vous contacter.',
      'err.submit': "Votre inscription n'a pas pu être envoyée. Vérifiez votre connexion et réessayez. Si le problème persiste, écrivez-nous à l'adresse indiquée en bas de page.",
      submit: "Envoyer l'inscription", sending: 'Envoi…', welcome: 'Bienvenue, <em></em>.',
      copy: 'Copier', copied: 'Copié', selected: 'Sélectionné',
      empty: 'Aucune activité de ce type ce mois-ci.', 'now.today': "Aujourd'hui au club", 'now.this': 'Ce mois-ci au club', 'now.next': 'Prochainement', 'now.badge': 'En cours', today: "Aujourd'hui",
      types: { club: 'Événement HBC', ate: 'Atelier', ter: 'Sortie', sen: 'Action', day: 'Journée mondiale' }
    }
  };
  const T = k => (STR[lang][k] ?? STR.en[k]);
  const langHooks = []; const onLang = fn => langHooks.push(fn);
  const i18nEls = $$('[data-i18n]'); i18nEls.forEach(el => { el._en = el.innerHTML; });
  const i18nAttrEls = $$('[data-i18n-attr]').map(el => {
    const pairs = el.dataset.i18nAttr.split(';').map(p => p.split(':'));
    return { el, pairs: pairs.map(([a, k]) => ({ a, k, en: el.getAttribute(a) })) };
  });
  function setLang(l, init) {
    lang = l === 'fr' ? 'fr' : 'en';
    document.documentElement.lang = lang;
    if (!(init && lang === 'en')) {
      i18nEls.forEach(el => { const v = lang === 'fr' && FR[el.dataset.i18n] != null ? FR[el.dataset.i18n] : el._en; if (el.innerHTML !== v) el.innerHTML = v; });
      i18nAttrEls.forEach(({ el, pairs }) => pairs.forEach(({ a, k, en }) => el.setAttribute(a, lang === 'fr' && FR[k] != null ? FR[k] : en)));
    }
    $$('[data-lang-toggle]').forEach(b => { b.setAttribute('aria-label', T('lang.aria')); b.title = T('lang.aria'); $$('span', b).forEach(s => s.classList.toggle('on', s.dataset.l === lang)); });
    if (!init) { langHooks.forEach(fn => { try { fn(); } catch (e) {} }); try { localStorage.setItem('hbc-lang', lang); } catch (e) {} }
  }
  $$('[data-lang-toggle]').forEach(b => b.addEventListener('click', () => setLang(lang === 'fr' ? 'en' : 'fr')));

  /* ---------- Fractured drop: 10 shards tiling the drop ---------- */
  const V = { P1:[0,0],P2:[400,0],P3:[400,500],P4:[0,500],t1:[212,0],b:[236,128],a:[186,150],c:[148,246],d:[272,232],e:[334,304],f:[108,334],g:[222,330],h:[300,404],i:[162,424],l1:[0,206],l2:[0,404],r1:[400,184],r2:[400,364],bt1:[118,500],bt2:[262,500] };
  const cells = [
    ['P1','t1','b','a','c','l1'], ['t1','P2','r1','d','b'], ['b','d','g','c','a'], ['d','r1','r2','e'], ['d','e','h','g'],
    ['l1','c','f','l2'], ['c','g','i','f'], ['l2','f','i','bt1','P4'], ['i','g','h','bt2','bt1'], ['e','r2','P3','bt2','h']
  ];
  const shardG = $('#shards');
  const fills = ['url(#gA)','url(#gB)','#5bbb24','#4eb017','#63c22e','#47a515','url(#gA)','#57b81f','url(#gB)','#4fae19'];
  const shards = cells.map((c, idx) => {
    const pts = c.map(k => V[k]);
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    const g = mk('g', { class: 'shard' }, shardG);
    mk('polygon', { points: pts.map(p => p.join(',')).join(' '), fill: fills[idx] }, g);
    const dx = cx - 200, dy = cy - 300, len = Math.hypot(dx, dy) || 1;
    const s = { g, ux: dx / len, uy: dy / len, k: 0.6 + (idx % 3) * 0.25 };
    if (!reduce) { g.style.transform = `translate(${s.ux * 60}px,${s.uy * 60}px)`; g.style.transitionDelay = (idx * 60) + 'ms'; }
    return s;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => shards.forEach(s => s.g.style.transform = 'translate(0,0)')));
  setTimeout(() => shards.forEach(s => s.g.style.transitionDelay = '0ms'), 1800);

  const stage = $('#dropStage');
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    let raf = 0;
    stage.closest('.hero').addEventListener('pointermove', ev => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        const mx = (ev.clientX - (r.left + r.width / 2)) / r.width, my = (ev.clientY - (r.top + r.height * .6)) / r.height;
        const prox = clamp(1 - Math.hypot(mx, my) * 0.9, 0, 1);
        shards.forEach(s => {
          const open = 3 + prox * 14 * s.k;
          s.g.style.transform = `translate(${s.ux * open + mx * 10 * s.k}px,${s.uy * open + my * 10 * s.k}px)`;
        });
      });
    });
    stage.closest('.hero').addEventListener('pointerleave', () => shards.forEach(s => s.g.style.transform = 'translate(0,0)'));
  }

  /* ---------- Hero background: faint fracture network + nodes ---------- */
  (() => {
    const bg = $('#heroBg');
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pts = []; for (let i = 0; i < 34; i++) pts.push([rnd() * 1440, rnd() * 900]);
    const used = new Set();
    pts.forEach((p, i) => {
      const near = pts.map((q, j) => [j, Math.hypot(q[0] - p[0], q[1] - p[1])]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 2);
      near.forEach(([j, d]) => {
        const key = [i, j].sort().join('-'); if (used.has(key)) return; used.add(key);
        const q = pts[j], mx = (p[0] + q[0]) / 2 + (rnd() - .5) * 40, my = (p[1] + q[1]) / 2 + (rnd() - .5) * 40;
        const path = mk('path', { d: `M${p[0]|0} ${p[1]|0} L${mx|0} ${my|0} L${q[0]|0} ${q[1]|0}` }, bg);
        const L = Math.ceil(d + 60); path.style.setProperty('--len', L); path.style.animationDelay = (rnd() * 1.4).toFixed(2) + 's';
      });
      if (i % 3 === 0) mk('circle', { cx: p[0] | 0, cy: p[1] | 0, r: 2.5 }, bg);
    });
  })();

  /* ---------- Flora ticker ---------- */
  const flora = ['Abies numidica','Cedrus atlantica','Quercus suber','Pistacia lentiscus','Artemisia herba-alba','Myrtus communis','Olea europaea','Rosmarinus officinalis','Juniperus phoenicea','Stipa tenacissima','Chamaerops humilis','Phoenix dactylifera'];
  const tk = $('#ticker'); const html = flora.map(f => `<span>${f}</span>`).join('');
  tk.innerHTML = html + html; tk.lastElementChild && [...tk.children].slice(flora.length).forEach(n => n.setAttribute('aria-hidden', 'true'));

  /* ---------- Annual activity plan 2026–2027 (EN / FR) ---------- */
  // [emoji, type, day-of-month or 0, English, Français]
  // types: club = club event, ate = workshop, ter = field / outing, sen = action & debate, day = world day
  const PLAN = [
    { y: 2026, m: 10, items: [
      ['💚', 'club', 0, 'Open Day', 'Journée portes ouvertes'],
      ['🎉', 'club', 0, 'Welcome Day 2026–2027', "Journée d'accueil 2026–2027"],
      ['🎨', 'ate', 0, 'Art / Pottery Workshop', 'Atelier art / poterie'],
      ['🍎', 'day', 16, 'World Food Day activity', "Activité Journée mondiale de l'alimentation"]
    ]},
    { y: 2026, m: 11, items: [
      ['🎗️', 'sen', 0, 'Shades of Hope — October Rose × November Blue', 'Shades of Hope — Octobre Rose × Novembre Bleu'],
      ['📚', 'ate', 0, 'Scientific Article Workshop', 'Atelier article scientifique'],
      ['🔬', 'day', 10, 'World Science Day activity', 'Activité Journée mondiale de la science']
    ]},
    { y: 2026, m: 12, items: [
      ['🌳', 'ter', 0, 'Planting & Campus Greening Campaign', 'Campagne de plantation & végétalisation du campus'],
      ['♻️', 'sen', 0, 'Colorful Waste-Sorting Containers Project', 'Projet de bacs de tri colorés'],
      ['🌱', 'day', 5, 'World Soil Day', 'Journée mondiale des sols'],
      ['🤝', 'day', 5, 'International Volunteer Day', 'Journée internationale des volontaires']
    ]},
    { y: 2027, m: 1, items: [
      ['🌾', 'club', 0, 'Terre et Traditions — Yennayer Edition', 'Terre et Traditions — édition Yennayer'],
      ['🏺', 'ate', 0, 'Pottery / Traditional Art Workshop', 'Atelier poterie / art traditionnel'],
      ['🌿', 'sen', 0, 'Traditional Plants & Ethnobotany Exhibition', 'Exposition plantes traditionnelles & ethnobotanique']
    ]},
    { y: 2027, m: 2, items: [
      ['🌸', 'club', 0, 'Terre et Traditions — Tafsut Edition', 'Terre et Traditions — édition Tafsut'],
      ['🪷', 'ter', 0, 'Wetland / Nature Reserve Visit', "Visite d'une zone humide / réserve naturelle"],
      ['🪷', 'day', 2, 'World Wetlands Day', 'Journée mondiale des zones humides'],
      ['👩‍🔬', 'day', 11, 'Women & Girls in Science activity', 'Activité Journée des femmes et des filles de science']
    ]},
    { y: 2027, m: 3, items: [
      ['🌲', 'ate', 0, 'Forest Ecology Workshop — with Mr. Messaoud', 'Atelier écologie forestière — avec M. Messaoud'],
      ['🐾', 'ate', 0, 'Building Animal / Insect Shelters', "Construction d'abris pour animaux / insectes"],
      ['🐾', 'day', 3, 'World Wildlife Day', 'Journée mondiale de la vie sauvage'],
      ['🌳', 'day', 21, 'International Day of Forests', 'Journée internationale des forêts'],
      ['💧', 'day', 22, 'World Water Day activity', "Activité Journée mondiale de l'eau"],
      ['♻️', 'day', 30, 'Zero Waste activity', 'Activité zéro déchet']
    ]},
    { y: 2027, m: 4, items: [
      ['🔬', 'club', 0, 'Science Day 2027', 'Science Day 2027'],
      ['🎙️', 'sen', 0, 'English Scientific Debate', 'Débat scientifique en anglais'],
      ['🎤', 'sen', 0, 'Environmental Micro-Trottoir', 'Micro-trottoir environnemental'],
      ['🌍', 'day', 22, 'Earth Day environmental action', 'Action environnementale du Jour de la Terre']
    ]},
    { y: 2027, m: 5, items: [
      ['🌿', 'club', 0, 'HBC Biodiversity Days 2027', 'Journées de la biodiversité HBC 2027'],
      ['🏞️', 'ter', 0, 'Nature Reserve Visit', "Visite d'une réserve naturelle"],
      ['🌱', 'sen', 0, 'Rare Plants Series', 'Série « Plantes rares »'],
      ['🌿', 'day', 12, 'Plant Health activity', 'Activité santé des végétaux'],
      ['🐝', 'day', 20, 'Pollinator / Bee activity', 'Activité pollinisateurs / abeilles'],
      ['🦋', 'day', 22, 'International Day for Biological Diversity', 'Journée internationale de la diversité biologique']
    ]},
    { y: 2027, m: 6, items: [
      ['🌎', 'club', 0, 'HBC Environment Week 2027', "Semaine de l'environnement HBC 2027"],
      ['🌊', 'sen', 0, 'Marine Environment activity', 'Activité environnement marin'],
      ['🥗', 'sen', 0, 'Food Safety activity', 'Activité sécurité alimentaire'],
      ['♻️', 'ate', 0, 'Practical Sustainability / Recycling Workshop', 'Atelier pratique durabilité / recyclage'],
      ['🌎', 'day', 5, 'World Environment Day', "Journée mondiale de l'environnement"],
      ['🥗', 'day', 7, 'World Food Safety Day', 'Journée mondiale de la sécurité sanitaire des aliments'],
      ['🌊', 'day', 8, 'World Oceans Day', 'Journée mondiale des océans'],
      ['🏜️', 'day', 17, 'Desertification & Drought Day', 'Journée de lutte contre la désertification et la sécheresse'],
      ['🍽️', 'day', 18, 'Sustainable Gastronomy Day', 'Journée de la gastronomie durable']
    ]},
    { y: 2027, m: 7, items: [
      ['🎓', 'club', 0, 'SNV Graduation Ceremony 2027', 'Cérémonie de remise des diplômes SNV 2027'],
      ['🏞️', 'ter', 0, 'End-of-Season Nature Trip', 'Sortie nature de fin de saison'],
      ['🤍', 'sen', 0, 'Orphanage / Community Visit', "Visite d'orphelinat / action solidaire"],
      ['📸', 'club', 0, 'HBC 2026–2027 — Year in Review', "HBC 2026–2027 — bilan de l'année"],
      ['🎓', 'day', 15, 'World Youth Skills Day', 'Journée mondiale des compétences des jeunes']
    ]}
  ];
  const FLEX = [
    ['🧪', 'sen', 'Conference: Animal Testing & Authenticity', 'Conférence : expérimentation animale & authenticité'],
    ['🧠', 'ate', 'Mental Health Workshop', 'Atelier santé mentale'],
    ['🎨', 'ate', 'Art Workshops', "Ateliers d'art"],
    ['🏺', 'ate', 'Pottery Workshops', 'Ateliers de poterie'],
    ['🧪', 'ate', 'Practical Scientific Workshops', 'Ateliers scientifiques pratiques'],
    ['🎙️', 'sen', 'English Debates', 'Débats en anglais'],
    ['🎤', 'sen', 'Micro-Trottoirs', 'Micro-trottoirs'],
    ['📚', 'ate', 'Scientific Article Sessions', 'Séances article scientifique'],
    ['🏞️', 'ter', 'Scientific / Environmental Field Trips', 'Sorties scientifiques / environnementales'],
    ['🤍', 'sen', 'Community & Charity Activities', 'Actions solidaires & caritatives']
  ];
  const escH = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const loc = () => lang === 'fr' ? 'fr-FR' : 'en-GB';
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const monthName = (y, m) => cap(new Intl.DateTimeFormat(loc(), { month: 'long' }).format(new Date(y, m - 1, 1)));
  const dayLabel = (y, m, d) => new Intl.DateTimeFormat(loc(), { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
  // within each month: club events, workshops, outings, actions first (plan order), then world days by date
  PLAN.forEach(mo => { mo.items = mo.items.map((it, i) => ({ it, i })).sort((a, b) => ((a.it[1] === 'day') - (b.it[1] === 'day')) || (a.it[2] - b.it[2]) || (a.i - b.i)).map(x => x.it); });

  // Where are we in the plan?
  const today = new Date(), tY = today.getFullYear(), tM = today.getMonth() + 1, tD = today.getDate();
  const ym = (y, m) => y * 12 + m, nowYM = ym(tY, tM);
  const nowMonth = PLAN.findIndex(mo => mo.y === tY && mo.m === tM);
  let nowRef = null, nowKind = '';
  if (nowMonth > -1) {
    const ti = PLAN[nowMonth].items.findIndex(it => it[2] === tD);
    nowRef = [nowMonth, ti > -1 ? ti : 0]; nowKind = ti > -1 ? 'today' : 'this';
  } else if (nowYM < ym(PLAN[0].y, PLAN[0].m)) { nowRef = [0, 0]; nowKind = 'next'; }

  const tl = $('#timeline');
  let curF = 'all'; const openedSeasons = new Set();
  function applyFilter(f) {
    curF = f;
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.f === f ? 'true' : 'false'));
    $$('.season', tl).forEach(row => {
      let shown = 0;
      $$('.act', row).forEach(e => { const on = f === 'all' || e.dataset.t === f; e.hidden = !on; if (on) shown++; });
      $('.mcard', row).hidden = shown === 0;
      $('.empty', row).hidden = shown > 0;
    });
    let fs = 0; $$('#flexGrid .fx-card').forEach(e => { const on = f === 'all' || e.dataset.t === f; e.hidden = !on; if (on) fs++; });
    $('#flexBlock').hidden = fs === 0;
  }
  function renderTimeline() {
    $$('.season', tl).forEach(r => { if (r.classList.contains('open')) openedSeasons.add(r.dataset.i); r.remove(); });
    const TY = T('types'), L = lang === 'fr' ? 4 : 3, badge = `<em class="now-b">${T('now.badge')}</em>`;
    PLAN.forEach((mo, si) => {
      const row = document.createElement('div'); row.className = 'season'; row.dataset.i = si; row.style.setProperty('--r', (si * 36 % 72) + 'deg');
      if (openedSeasons.has(String(si))) { row.dataset.sp = 1; row.classList.add('open'); }
      const isNow = si === nowMonth;
      if (ym(mo.y, mo.m) < nowYM) row.classList.add('past');
      const petals = [0, 72, 144, 216, 288].map(a => `<g transform="rotate(${a} 20 20)"><ellipse class="np" cx="20" cy="9" rx="5" ry="9" style="transition-delay:${a / 600}s"/></g>`).join('');
      const items = mo.items.map((it, ei) => {
        const [ic, t, d] = it, isToday = isNow && d === tD, lead = ei === 0 && t !== 'day';
        const meta = t === 'day' ? `<span class="act-d">${dayLabel(mo.y, mo.m, d)}</span>` : `<span class="tag ${t}">${TY[t]}</span>`;
        return `<li class="act${lead ? ' lead' : ''}${t === 'day' ? ' is-day' : ''}${isToday ? ' today' : ''}" id="act-${si}-${ei}" data-t="${t}">
          <span class="act-ic" aria-hidden="true">${ic}</span>
          <span class="act-t">${escH(it[L])}${isToday ? ` <em class="now-b">${T('today')}</em>` : ''}</span>${meta}</li>`;
      }).join('');
      row.innerHTML = `
        <div class="season-name"><h3>${monthName(mo.y, mo.m)}</h3><span>${mo.y}</span>${isNow ? '<br>' + badge : ''}</div>
        <div class="node"><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="ring" cx="20" cy="20" r="18"/><g>${petals}</g><circle class="nc" cx="20" cy="20" r="5"/></svg></div>
        <div class="events">
          <div class="season-mob">${monthName(mo.y, mo.m)}<span>${mo.y}</span>${isNow ? badge : ''}</div>
          <article class="ev mcard"><ul class="acts">${items}</ul></article>
          <p class="empty" hidden>${T('empty')}</p>
        </div>`;
      tl.appendChild(row);
    });
    $('#flexGrid').innerHTML = FLEX.map(it => `<div class="fx-card" data-t="${it[1]}"><span class="act-ic" aria-hidden="true">${it[0]}</span><span class="act-t">${escH(it[lang === 'fr' ? 3 : 2])}</span><span class="tag ${it[1]}">${TY[it[1]]}</span></div>`).join('');
    const all = [...$$('.act', tl), ...$$('#flexGrid .fx-card')];
    $$('.chip').forEach(ch => { const f = ch.dataset.f; ch.querySelector('.n').textContent = f === 'all' ? all.length : all.filter(e => e.dataset.t === f).length; });
    applyFilter(curF);
    // "Today / this month" pill in the hero
    const pill = $('#nowPill');
    if (nowRef) {
      const mo = PLAN[nowRef[0]], it = mo.items[nowRef[1]];
      $('#nowK').textContent = nowKind === 'today' ? T('now.today') : nowKind === 'this' ? T('now.this') : T('now.next') + ' · ' + monthName(mo.y, mo.m);
      $('#nowT').textContent = it[lang === 'fr' ? 4 : 3];
      pill.href = '#act-' + nowRef[0] + '-' + nowRef[1];
      pill.hidden = false;
    }
  }
  renderTimeline();
  onLang(() => { renderTimeline(); requestAnimationFrame(onScroll); });
  $$('.chip').forEach(ch => ch.addEventListener('click', () => { applyFilter(ch.dataset.f); requestAnimationFrame(onScroll); }));
  $('#nowPill').addEventListener('click', e => {
    if (!nowRef) return;
    const el = $('#act-' + nowRef[0] + '-' + nowRef[1]); if (!el) return;
    if (el.hidden) applyFilter('all');
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  });

  /* ---------- Germination scene ---------- */
  const prep = el => { const L = el.getTotalLength(); el.style.strokeDasharray = L; el.style.strokeDashoffset = L; return L; };
  const gRoot = $('#gRoot'), gRoot2 = $('#gRoot2'), gRoot3 = $('#gRoot3'), gStem = $('#gStem');
  const Ls = [gRoot, gRoot2, gRoot3, gStem].map(prep);
  const gLeafL = $('#gLeafL'), gLeafR = $('#gLeafR'), petals = $$('.g-petal');
  let lastStage = -1; onLang(() => { lastStage = -1; });
  const germ = $('#graine'), germStage = $('#germStage'), germPct = $('#germPct');
  function drawGerm(p) {
    gRoot.style.strokeDashoffset = Ls[0] * (1 - seg(p, 0, .3));
    gRoot2.style.strokeDashoffset = Ls[1] * (1 - seg(p, .15, .35));
    gRoot3.style.strokeDashoffset = Ls[2] * (1 - seg(p, .2, .4));
    gStem.style.strokeDashoffset = Ls[3] * (1 - seg(p, .3, .6));
    const lf = seg(p, .5, .72);
    gLeafL.style.transform = `scale(${lf})`; gLeafR.style.transform = `scale(${seg(p, .55, .78)})`;
    const bud = seg(p, .6, .75), open = seg(p, .82, 1);
    petals.forEach(pt => { const r = +pt.dataset.r; pt.style.transform = `rotate(${r * open}deg) scale(${bud * (0.55 + 0.45 * open)}, ${bud})`; });
    const st = p < .15 ? 0 : p < .45 ? 1 : p < .7 ? 2 : p < .88 ? 3 : 4;
    if (st !== lastStage) { germStage.innerHTML = T('stages')[st]; lastStage = st; }
    germPct.textContent = Math.round(p * 100) + ' %';
  }

  /* ---------- Scroll vine ---------- */
  const vineStem = $('#vineStem'), vineLeaves = $('#vineLeaves'); let vineLen = 0, vineItems = [];
  (function buildVine() {
    vineLen = vineStem.getTotalLength(); vineStem.style.strokeDasharray = vineLen; vineStem.style.strokeDashoffset = vineLen;
    for (let k = 1; k <= 11; k++) {
      const t = k / 12, pt = vineStem.getPointAtLength(vineLen * t), pt2 = vineStem.getPointAtLength(vineLen * t + 2);
      const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI + (k % 2 ? -60 : 60) + (k % 2 ? 0 : 180);
      const g = mk('g', { transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})` }, vineLeaves);
      const leaf = mk('path', { class: 'leaf', d: 'M0 0 C 6 -7, 18 -7, 24 0 C 18 7, 6 7, 0 0Z', fill: k % 4 === 0 ? 'var(--blue)' : 'var(--green)' }, g);
      vineItems.push({ t, leaf });
    }
    const end = vineStem.getPointAtLength(vineLen);
    const bud = mk('g', { transform: `translate(${end.x} ${end.y})` }, vineLeaves);
    [-55, 55, -20, 20, 0].forEach((r, i) => {
      const pth = mk('path', { class: 'bud-petal', d: 'M0 0 C -5 -6, -5 -15, 0 -20 C 5 -15, 5 -6, 0 0Z', fill: i < 2 ? 'var(--green)' : i < 4 ? 'var(--blue)' : 'var(--green)', 'data-r': r }, bud);
      pth.style.transform = 'scale(.4,.6)';
      vineItems.push({ t: .985, petal: pth, r });
    });
  })();

  /* ---------- Reveal (pre-hide only things below the fold) ---------- */
  const rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rvs.forEach((el, i) => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); } });
    setTimeout(() => rvs.forEach(el => el.classList.remove('pre')), 6000);
  }

  /* ---------- Theme toggle (light by default, dark on request, remembered) ---------- */
  (() => {
    const root = document.documentElement, btn = $('#themeBtn');
    const eff = () => root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const sync = () => { const d = eff() === 'dark', l = d ? T('theme.toLight') : T('theme.toDark'); btn.dataset.mode = d ? 'dark' : 'light'; btn.setAttribute('aria-label', l); btn.title = l; dispatchEvent(new Event('hbc-theme')); };
    sync(); onLang(sync);
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    btn.addEventListener('click', () => {
      const next = eff() === 'dark' ? 'light' : 'dark';
      const apply = () => { root.setAttribute('data-theme', next); try { localStorage.setItem('hbc-theme', next); } catch (e) {} };
      if (document.startViewTransition && !reduce) {
        const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        const vt = document.startViewTransition(apply);
        vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
      } else apply();
    });
  })();

  /* ---------- Sparkling vegetation ---------- */
  let fxBurst = () => {}, fxRise = () => {}, fxFall = () => {};
  const STAR = r => { const i = (r * .22).toFixed(1); return `M0 ${-r} L${i} ${-i} L${r} 0 L${i} ${i} L0 ${r} L${-i} ${i} L${-r} 0 L${-i} ${-i}Z`; };
  // mirrored hero vine
  (() => { const hv = $('.hv-left'); if (!hv) return; const c = hv.cloneNode(true); c.classList.replace('hv-left', 'hv-right'); hv.after(c); })();
  // grass above the footer, with a few glinting flowers; blades lean away from the cursor
  (() => {
    const svg = $('#grass'); let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const blades = [];
    for (let i = 0, x = -6; x < 1450; i++) {
      const w = 4 + rnd() * 6, h = 26 + rnd() * 60, lean = (rnd() - .5) * 22;
      const og = mk('g', { class: 'bladeg' }, svg), sg = mk('g', { class: 'blade-s' }, og);
      sg.style.setProperty('--dur', (3.6 + rnd() * 3).toFixed(2) + 's'); sg.style.setProperty('--del', (-rnd() * 5).toFixed(2) + 's');
      mk('path', { class: 'blade' + (rnd() < .24 ? ' g' : ''), d: `M${x.toFixed(1)} 91 Q${(x + lean * .3).toFixed(1)} ${(90 - h * .5).toFixed(1)} ${(x + lean + w / 2).toFixed(1)} ${(90 - h).toFixed(1)} Q${(x + lean * .3 + w).toFixed(1)} ${(90 - h * .5).toFixed(1)} ${(x + w).toFixed(1)} 91Z` }, sg);
      if (i % 13 === 6) {
        const tx = x + lean + w / 2, ty = 90 - h;
        mk('circle', { cx: tx.toFixed(1), cy: (ty - 2).toFixed(1), r: 3.2, fill: i % 2 ? 'var(--green)' : 'var(--gold)' }, sg);
        const g = mk('g', { transform: `translate(${tx.toFixed(1)} ${(ty - 2).toFixed(1)})` }, sg);
        const p = mk('path', { class: 'gstar', d: STAR(7), fill: 'var(--gold)' }, g); p.style.setProperty('--d', (rnd() * 4).toFixed(2) + 's');
      }
      blades.push({ g: og, x: x + w / 2 }); x += 7 + rnd() * 7;
    }
    if (reduce) return;
    const box = svg.parentElement; let raf = 0;
    const push = cx => blades.forEach(b => { const d = b.x - cx, ad = Math.abs(d); b.g.style.transform = ad < 90 ? `rotate(${(Math.sign(d) * (1 - ad / 90) * 16).toFixed(1)}deg)` : ''; });
    const onMove = e => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const r = svg.getBoundingClientRect(), sc = r.height / 90, vx = 720 - (r.width / sc) / 2; push(vx + (e.clientX - r.left) / sc); }); };
    box.addEventListener('pointermove', onMove);
    $('#contact').addEventListener('pointermove', e => { if (e.clientY - $('#contact').getBoundingClientRect().top < 80) onMove(e); });
    box.addEventListener('pointerleave', () => blades.forEach(b => b.g.style.transform = ''));
  })();
  // canvas layer: drifting pollen, leaf trail, petal bursts, rising sparks
  if (!reduce) (() => {
    const cv = document.createElement('canvas'); cv.className = 'fx'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    const ctx = cv.getContext('2d'); let W = 0, H = 0, dark = false, frame = 0;
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    const sprite = rgb => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(.22, `rgba(${rgb},.6)`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c; };
    const PAL = {
      light: { glow: ['78,176,23', '11,91,168', '214,160,20'], leaf: ['#4eb017', '#3f9a10', '#6cc83a', '#2e7a0b'], star: '#e0a815', rib: '#ffffff' },
      dark: { glow: ['140,230,90', '120,180,255', '255,220,120'], leaf: ['#6cc83a', '#8bd960', '#4eb017', '#a6e57a'], star: '#ffe08a', rib: '#eaffd8' }
    };
    const SPR = { light: PAL.light.glow.map(sprite), dark: PAL.dark.glow.map(sprite) };
    const checkTheme = () => { dark = (getComputedStyle(document.documentElement).colorScheme || '').includes('dark'); };
    checkTheme(); addEventListener('hbc-theme', checkTheme);
    const R = (a, b) => a + Math.random() * (b - a);
    const target = () => Math.min(55, Math.round(W * H / 26000));
    const newPollen = anyY => ({ x: R(0, W), y: anyY ? R(0, H) : H + 10, vy: R(-.45, -.12), vx: 0, r: R(.8, 2.4), ph: R(0, 6.28), tw: R(.8, 2.2), sw: R(.3, 1.1), c: (Math.random() * 3) | 0 });
    const pollen = []; for (let i = 0; i < target(); i++) pollen.push(newPollen(true));
    const fx = []; const add = p => { if (fx.length < 160) fx.push(p); };
    const leaf = (x, y, o = {}) => add({ k: 'leaf', x, y, vx: o.vx ?? R(-.6, .6), vy: o.vy ?? R(-.4, .3), g: o.g ?? .035, rot: R(0, 6.28), vr: R(-.08, .08), s: o.s ?? R(.6, 1.1), life: 0, max: o.max ?? R(70, 110), c: (Math.random() * 4) | 0, flip: R(0, 6.28) });
    const spark = (x, y, o = {}) => add({ k: 'spark', x, y, vx: o.vx ?? R(-.5, .5), vy: o.vy ?? R(-1.2, -.3), g: o.g ?? .01, rot: R(0, 1), vr: .04, s: o.s ?? R(3, 6), life: 0, max: o.max ?? R(35, 60) });
    fxBurst = (x, y, n = 14) => { for (let i = 0; i < n; i++) { const a = i / n * 6.283 + R(-.2, .2), v = R(1.6, 4.2); leaf(x, y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, g: .07, s: R(.5, .9), max: R(50, 80) }); if (i % 2) spark(x, y, { vx: Math.cos(a) * v * .7, vy: Math.sin(a) * v * .7, g: .02 }); } };
    fxFall = (n = 1) => { for (let i = 0; i < n; i++) leaf(R(0, W), -12, { vx: R(-.6, .6), vy: R(.6, 1.3), g: .006, s: R(.7, 1.15), max: R(170, 260) }); };
    fxRise = (x, y, n = 8) => { for (let i = 0; i < n; i++) spark(x + R(-34, 34), y + R(-6, 6), { vy: R(-2.2, -.8), vx: R(-.4, .4), g: -.004, s: R(3, 5.5) }); };
    let mx = -999, my = -999, lx = 0, ly = 0;
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return; mx = e.clientX; my = e.clientY;
      if (Math.hypot(mx - lx, my - ly) > 40) { lx = mx; ly = my; leaf(mx, my, { vx: R(-.4, .4), vy: R(-.2, .4), g: .03, s: R(.45, .75), max: R(60, 90) }); if (Math.random() < .35) spark(mx + R(-8, 8), my + R(-8, 8), { max: 40 }); }
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { mx = my = -999; });
    document.addEventListener('click', e => { if (e.target.closest('dialog, input, select, textarea')) return; if (e.target.closest('a, button, .ev, .drop-stage')) fxBurst(e.clientX, e.clientY, 12); });
    const star = s => { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? s * .28 : s; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); };
    let last = performance.now();
    function loop(now) {
      const dt = Math.min(3, (now - last) / 16.67); last = now;
      if (++frame % 90 === 0) checkTheme();
      ctx.clearRect(0, 0, W, H);
      const pal = dark ? PAL.dark : PAL.light, spr = dark ? SPR.dark : SPR.light, t = now / 1000;
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
      while (pollen.length < target()) pollen.push(newPollen(false));
      for (let i = pollen.length - 1; i >= 0; i--) {
        const p = pollen[i];
        p.y += p.vy * dt; p.x += (Math.sin(t * p.sw + p.ph) * .25 + p.vx) * dt; p.vx *= .94;
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 14400) { const d = Math.sqrt(d2) || 1, f = (1 - d / 120) * .6; p.vx += dx / d * f; p.y += dy / d * f * dt; }
        if (p.y < -20 || p.x < -30 || p.x > W + 30) { if (pollen.length > target()) pollen.splice(i, 1); else Object.assign(p, newPollen(false)); continue; }
        ctx.globalAlpha = (dark ? .6 : .42) * (.3 + .7 * (.5 + .5 * Math.sin(t * p.tw * 2 + p.ph)));
        const s = p.r * 9; ctx.drawImage(spr[p.c], p.x - s / 2, p.y - s / 2, s, s);
      }
      for (let i = fx.length - 1; i >= 0; i--) {
        const p = fx[i]; p.life += dt;
        if (p.life > p.max) { fx.splice(i, 1); continue; }
        p.vy += p.g * dt; p.vx *= .985; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        const k = p.life / p.max, fade = k < .15 ? k / .15 : 1 - (k - .15) / .85;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        if (p.k === 'leaf') {
          ctx.globalAlpha = fade * .9; ctx.scale(p.s * Math.cos(p.flip + p.life * .08) || .01, p.s);
          ctx.fillStyle = pal.leaf[p.c]; ctx.beginPath(); ctx.moveTo(0, -9); ctx.quadraticCurveTo(7, 0, 0, 9); ctx.quadraticCurveTo(-7, 0, 0, -9); ctx.fill();
          ctx.globalAlpha = fade * .5; ctx.strokeStyle = pal.rib; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.stroke();
        } else {
          const tw = .6 + .4 * Math.sin(p.life * .5), g = p.s * 5;
          ctx.globalAlpha = fade * .7; ctx.drawImage(spr[2], -g / 2, -g / 2, g, g);
          ctx.globalAlpha = fade; ctx.fillStyle = pal.star; star(p.s * tw);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1; requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

  /* ---------- Mobile scroll stem (growing progress bar) ---------- */
  const sprog = $('#sprog'); let spW = 0, spStem = null, spTip = null, spLeaves = [], spP = 0;
  function buildSprog() {
    spW = innerWidth; sprog.setAttribute('viewBox', `0 0 ${spW} 14`); sprog.innerHTML = ''; spLeaves = [];
    spStem = mk('path', { class: 'st', d: `M0 2 L${spW} 2` }, sprog);
    spStem.style.strokeDasharray = `${spW} ${spW + 20}`;
    for (let x = 34, k = 0; x < spW - 12; x += 46, k++) {
      const g = mk('g', { transform: `translate(${x} 2) rotate(${k % 2 ? 150 : 30})` }, sprog);
      spLeaves.push({ x, l: mk('path', { class: 'lf' + (k % 3 === 2 ? ' b' : ''), d: 'M0 0 C 3 -3.6, 9 -3.6, 12 0 C 9 3.6, 3 3.6, 0 0Z' }, g) });
    }
    spTip = mk('circle', { class: 'tip', r: 3, cy: 2, cx: 0 }, sprog);
    sprogUpdate(spP);
  }
  function sprogUpdate(P) {
    spP = P; if (!spStem) return;
    const x = spW * P; spStem.style.strokeDashoffset = spW - x; spTip.setAttribute('cx', x.toFixed(1)); spTip.style.opacity = P > .003 ? 1 : 0;
    spLeaves.forEach(o => o.l.classList.toggle('on', o.x < x - 4));
  }
  buildSprog(); addEventListener('resize', () => { if (innerWidth !== spW) buildSprog(); });

  /* ---------- Cell cards: vine grows when the card is on screen ---------- */
  (() => {
    const cells = $$('.cell-card'); if (!cells.length) return;    if (!('IntersectionObserver' in window) || reduce) { cells.forEach(c => c.classList.add('grown')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('grown'); io.unobserve(e.target); } }), { threshold: .35 });
    cells.forEach(c => io.observe(c));
  })();

  /* ---------- Sprigs that grow beside section titles (re-attached after a language switch) ---------- */
  const sprigHs = []; const reSprig = () => sprigHs.forEach(h => { if (h._sprig && !h.contains(h._sprig)) h.appendChild(h._sprig); }); onLang(reSprig);
  (() => {
    const io = ('IntersectionObserver' in window && !reduce) ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .9 }) : null;
    $$('.sec-title').forEach(h => {
      const s = mk('svg', { class: 'tsprig', viewBox: '0 0 30 44', 'aria-hidden': 'true' });
      mk('path', { class: 'ts', pathLength: 1, d: 'M10 44 C 10 30, 16 22, 14 8' }, s);
      mk('path', { class: 'tl a', d: 'M12 31 C 4 31, 0 25, 0 18 C 8 18, 12 24, 12 31Z' }, s);
      mk('path', { class: 'tl b', d: 'M14 22 C 22 22, 27 16, 28 9 C 20 9, 15 15, 14 22Z' }, s);
      mk('path', { class: 'tb', d: 'M14 9 C 11 6, 11 1, 14 -3 C 17 1, 17 6, 14 9Z' }, s);
      h.appendChild(s); h._sprig = s; sprigHs.push(h); io ? io.observe(s) : s.classList.add('in');
    });
  })();

  /* ---------- Dandelion: blow the seeds away ---------- */
  (() => {
    const fig = $('#dandel'), host = $('#dSeeds'); if (!fig || !host) return;
    const CX = 100, CY = 92, N = 34, seeds = [];
    for (let i = 0; i < N; i++) {
      const a = i * 360 / N + (i % 2 ? 4 : -3), L = 30 + (i % 3) * 4;
      const fly = mk('g', { class: 'dfly' }, host);
      const g = mk('g', { class: 'dseed', transform: `rotate(${a.toFixed(1)} ${CX} ${CY})` }, fly);
      mk('line', { x1: CX, y1: CY - 5, x2: CX, y2: CY - L }, g);
      const top = CY - L; let d = '';
      [-70, -42, -16, 16, 42, 70].forEach(t => { const r = t * Math.PI / 180; d += `M${CX} ${top} L${(CX + Math.sin(r) * 9).toFixed(1)} ${(top - Math.cos(r) * 9).toFixed(1)} `; });
      mk('path', { d }, g); mk('circle', { cx: CX, cy: top, r: 1.3 }, g);
      seeds.push({ fly, a: a * Math.PI / 180, anim: null });
    }
    let blown = false;
    const blow = () => {
      if (blown) return; blown = true;
      if (reduce) { seeds.forEach(s => s.fly.style.opacity = 0); setTimeout(regrow, 2500); return; }
      let last = 0;
      seeds.forEach((s, i) => {
        const out = 40 + Math.random() * 90, wind = 90 + Math.random() * 220;
        const dx = Math.sin(s.a) * out + wind, dy = -Math.cos(s.a) * out * .7 - (40 + Math.random() * 120);
        const dur = 2200 + Math.random() * 2200, del = Math.random() * 500; last = Math.max(last, dur + del);
        s.anim && s.anim.cancel();
        s.anim = s.fly.animate([
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx * .45}px,${dy * .6}px) rotate(${(Math.random() - .5) * 60}deg)`, opacity: 1, offset: .45 },
          { transform: `translate(${dx}px,${dy}px) rotate(${(Math.random() - .5) * 140}deg)`, opacity: 0 }
        ], { duration: dur, delay: del, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
      });
      const r = fig.getBoundingClientRect(); fxRise(r.left + r.width / 2, r.top + r.height * .3, 6);
      setTimeout(regrow, last + 1600);
    };
    function regrow() {
      seeds.forEach((s, i) => {
        s.anim && s.anim.cancel(); s.fly.style.opacity = '';
        if (!reduce) s.anim = s.fly.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 700, delay: i * 25, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      });
      setTimeout(() => { blown = false; }, 1500);
    }
    fig.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') blow(); });
    fig.addEventListener('click', blow);
    fig.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); } });
  })();

  /* ---------- Living garden ---------- */
  (() => {
    const stageEl = $('#gstage'), svg = $('#gsvg'); if (!stageEl || !svg) return;
    const VH = 440, GY = 372; let VW = 1200;
    const Lp = $('#gPlants'), Lb = $('#gBack'), Lf = $('#gFront'), Lr = $('#gRain'), Lfly = $('#gFly'), cloud = $('#gCloud');
    const hint = $('#ghint'), countEl = $('#gcount b'), countWord = $('#gcount span'), KEY = 'hbc-garden-v1', MAX = 26;
    const f1 = n => n.toFixed(1);
    const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const groundY = x => GY + 24 * (x / VW) * (1 - x / VW);
    const bz = (P, t) => {
      const u = 1 - t, x = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], y = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
      const dx = 3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]), dy = 3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1]);
      return { x, y, a: Math.atan2(dy, dx) * 180 / Math.PI };
    };
    const bzD = P => `M${f1(P[0][0])} ${f1(P[0][1])} C ${f1(P[1][0])} ${f1(P[1][1])}, ${f1(P[2][0])} ${f1(P[2][1])}, ${f1(P[3][0])} ${f1(P[3][1])}`;

    /* drawing primitives (all grow with CSS animations) */
    const stem = (c, P, w, col, d, t = 1.2) => { c.stems.push(P); return mk('path', { class: 'gp-stem', pathLength: 1, d: bzD(P), style: `stroke:${col};stroke-width:${w};--d:${d.toFixed(2)}s;--t:${t}s` }, c.g); };
    const leaf = (c, x, y, ang, len, wid, col, d, rib = true) => {
      const lg = mk('g', { transform: `translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})` }, c.g);
      const inner = mk('g', { class: 'gp-leaf', style: `--d:${d.toFixed(2)}s` }, lg);
      mk('path', { d: `M0 0 C ${f1(len * .25)} ${f1(-wid)}, ${f1(len * .7)} ${f1(-wid)}, ${f1(len)} 0 C ${f1(len * .7)} ${f1(wid)}, ${f1(len * .25)} ${f1(wid)}, 0 0Z`, style: `fill:${col}` }, inner);
      if (rib && len > 14) mk('path', { d: `M${f1(len * .08)} 0 L${f1(len * .82)} 0`, style: 'stroke:rgba(255,255,255,.35);stroke-width:1;fill:none' }, inner);
    };
    const petal = (c, x, y, ang, L, w, col, d, extra = '', round = false) => {
      const pg = mk('g', { transform: `translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})` }, c.g);
      const dd = round ? `M0 0 C ${f1(-w)} ${f1(-L * .1)}, ${f1(-w)} ${f1(-L * .95)}, 0 ${f1(-L)} C ${f1(w)} ${f1(-L * .95)}, ${f1(w)} ${f1(-L * .1)}, 0 0Z`
                       : `M0 0 C ${f1(-w)} ${f1(-L * .3)}, ${f1(-w)} ${f1(-L * .8)}, 0 ${f1(-L)} C ${f1(w)} ${f1(-L * .8)}, ${f1(w)} ${f1(-L * .3)}, 0 0Z`;
      mk('path', { class: 'gp-pet', d: dd, style: `fill:${col};--d:${d.toFixed(2)}s;${extra}` }, pg);
    };
    const disc = (c, x, y, r, col, d) => mk('circle', { class: 'gp-pop', cx: f1(x), cy: f1(y), r, style: `fill:${col};--d:${d.toFixed(2)}s` }, c.g);
    const pick = (r, arr) => arr[(r() * arr.length) | 0];

    /* seven species */
    const SPECIES = {
      daisy: { name: 'Glebionis coronaria', common: 'crown daisy', fr: 'chrysanthème couronné', build(c) {
        const r = c.r, h = 130 + r() * 80, dx = (r() - .5) * 50;
        const P = [[0, 0], [(r() - .5) * 30, -h * .35], [dx + (r() - .5) * 30, -h * .7], [dx, -h]];
        stem(c, P, 3, 'var(--green-ink)', 0, 1.3);
        const nl = 2 + (r() * 3 | 0);
        for (let i = 0; i < nl; i++) { const t = .2 + i * .17 + r() * .05, p = bz(P, t), s = i % 2 ? 1 : -1; leaf(c, p.x, p.y, p.a + s * (50 + r() * 20), 24 + r() * 14, 7, i % 2 ? 'var(--green)' : 'var(--green-ink)', .3 + t * 1.1); }
        const top = bz(P, 1), n = 12 + (r() * 5 | 0), col = pick(r, ['#ffffff', '#ffd84a', '#fff1b8']);
        for (let k = 0; k < n; k++) petal(c, top.x, top.y, k * 360 / n, 20 + r() * 4, 5.5, col, 1.25 + k * .03, 'stroke:rgba(16,40,42,.18);stroke-width:.8');
        disc(c, top.x, top.y, 7.5, '#e0a815', 1.2); disc(c, top.x, top.y, 3.4, '#b9780a', 1.35);
        c.heads.push(top);
      } },
      poppy: { name: 'Papaver rhoeas', common: 'corn poppy', fr: 'coquelicot', build(c) {
        const r = c.r, h = 110 + r() * 70, dx = (r() - .5) * 70;
        const P = [[0, 0], [dx * .2, -h * .4], [dx * 1.1, -h * .75], [dx, -h]];
        stem(c, P, 2.2, 'var(--green-ink)', 0, 1.2);
        leaf(c, 0, -8, -150 - r() * 15, 30 + r() * 8, 5.5, 'var(--green)', .2); leaf(c, 0, -12, -30 + r() * 15, 28 + r() * 8, 5.5, 'var(--green-ink)', .35);
        const top = bz(P, 1), rot = r() * 90;
        [0, 180, 90, 270].forEach((a, i) => petal(c, top.x, top.y, a + rot, 21 + r() * 3, 14, i < 2 ? '#c8321f' : '#e4462f', 1.2 + i * .08, '', true));
        disc(c, top.x, top.y, 5, '#2a1d1d', 1.5);
        for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; disc(c, top.x + Math.cos(a) * 7.5, top.y + Math.sin(a) * 7.5, 1.3, '#1b1212', 1.6 + k * .02); }
        c.heads.push(top);
        if (r() < .7) { // a second, nodding bud
          const P2 = [[0, 0], [-dx * .3, -h * .3], [-dx * .7 - 20, -h * .65], [-dx * .5 - 14, -h * .55]];
          stem(c, P2, 1.8, 'var(--green-ink)', .3, 1); const b = bz(P2, 1);
          petal(c, b.x, b.y, b.a + 90, 12, 5, '#6f9a45', 1.2, '', true);
        }
      } },
      tulip: { name: 'Tulipa sylvestris', common: 'wild tulip', fr: 'tulipe sauvage', build(c) {
        const r = c.r, h = 95 + r() * 55;
        const P = [[0, 0], [(r() - .5) * 10, -h * .4], [(r() - .5) * 14, -h * .75], [(r() - .5) * 12, -h]];
        stem(c, P, 3.2, 'var(--green)', 0, 1.1);
        leaf(c, -2, -4, -118 - r() * 15, 60 + r() * 20, 8, 'var(--green)', .2, false); leaf(c, 2, -6, -62 + r() * 15, 55 + r() * 20, 8, 'var(--green-ink)', .35, false);
        const top = bz(P, 1), col = pick(r, ['#ffd23f', '#f5b82e', '#f2a03d']);
        petal(c, top.x, top.y + 6, top.a + 90 - 24, 34, 12, col, 1.15, 'opacity:.85', true);
        petal(c, top.x, top.y + 6, top.a + 90 + 24, 34, 12, col, 1.25, 'opacity:.85', true);
        petal(c, top.x, top.y + 6, top.a + 90, 36, 12.5, col, 1.35, 'stroke:rgba(120,70,0,.25);stroke-width:.8', true);
        c.heads.push({ x: top.x, y: top.y - 14 });
      } },
      lavender: { name: 'Lavandula stoechas', common: 'French lavender', fr: 'lavande papillon', build(c) {
        const r = c.r, n = 4 + (r() * 3 | 0);
        for (let j = 0; j < 4; j++) leaf(c, 0, -3, -90 + (j < 2 ? -1 : 1) * (25 + r() * 35), 26 + r() * 10, 2.6, '#7d9a6a', .1 + j * .08, false);
        for (let i = 0; i < n; i++) {
          const ang = (-90 + (i - (n - 1) / 2) * 13 + (r() - .5) * 6) * Math.PI / 180, h = 90 + r() * 60, ex = Math.cos(ang) * h, ey = Math.sin(ang) * h;
          const P = [[0, 0], [ex * .2, ey * .4], [ex * .75, ey * .75], [ex, ey]], d0 = i * .12;
          stem(c, P, 1.6, '#6d8f5a', d0, 1.1);
          for (let k = 0; k < 7; k++) { const p = bz(P, .74 + k * .04); [-1, 1].forEach(s => petal(c, p.x + s * 1.5, p.y, p.a + 90 + s * 35, 7, 3, k % 2 ? '#9b86e0' : '#7b68c9', 1 + d0 + k * .07)); }
          const tp = bz(P, 1); petal(c, tp.x, tp.y, tp.a + 90 - 18, 11, 4.5, '#b9a6f2', 1.6 + d0, '', true); petal(c, tp.x, tp.y, tp.a + 90 + 18, 11, 4.5, '#b9a6f2', 1.65 + d0, '', true);
          c.heads.push(tp);
        }
      } },
      fern: { name: 'Pteridium aquilinum', common: 'bracken fern', fr: 'fougère aigle', build(c) {
        const r = c.r, n = 5 + (r() * 2 | 0);
        for (let i = 0; i < n; i++) {
          const sp = (i / (n - 1) - .5) * 2, a = (-90 + sp * 55) * Math.PI / 180, L = 95 + r() * 45 - Math.abs(sp) * 20;
          const P = [[0, 0], [Math.cos(a) * L * .4, Math.sin(a) * L * .4], [Math.cos(a) * L * .8 + sp * 20, Math.sin(a) * L * .8], [Math.cos(a) * L * .85 + sp * 34, Math.sin(a) * L * .85 + L * .18 * Math.abs(sp)]];
          const d0 = Math.abs(sp) * .25;
          stem(c, P, 1.8, 'var(--green-ink)', d0, 1.2);
          for (let t = .16; t < .97; t += .1) { const p = bz(P, t), s = 15 * (1 - t) + 4; leaf(c, p.x, p.y, p.a - 68, s, s * .28, 'var(--green)', d0 + t * 1.1 + .1, false); leaf(c, p.x, p.y, p.a + 68, s, s * .28, 'var(--green)', d0 + t * 1.1 + .15, false); }
        }
      } },
      olive: { name: 'Olea europaea', common: 'olive tree', fr: 'olivier', build(c) {
        const r = c.r;
        const br = (x, y, ang, len, depth, d) => {
          const a = ang * Math.PI / 180, ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len, bend = (r() - .5) * 14;
          const P = [[x, y], [x + Math.cos(a) * len * .33 + bend, y + Math.sin(a) * len * .33], [x + Math.cos(a) * len * .66 - bend, y + Math.sin(a) * len * .66], [ex, ey]];
          stem(c, P, depth * 1.7 + 1.2, depth > 1 ? '#8a6a43' : '#7a6a48', d, .7);
          if (depth <= 1) [.45, .75, 1].forEach((t, k) => { const p = bz(P, t); leaf(c, p.x, p.y, p.a + (k % 2 ? 42 : -42), 17 + r() * 5, 3.4, k % 2 ? '#7d9a5a' : '#9bb57a', d + .4 + t * .5, false); });
          if (depth > 0) { const kids = 2 + (r() < .35 ? 1 : 0); for (let k = 0; k < kids; k++) br(ex, ey, ang + (k - (kids - 1) / 2) * (30 + r() * 14) + (r() - .5) * 10, len * (.66 + r() * .12), depth - 1, d + .55); }
          else { if (r() < .5) disc(c, ex, ey, 3.2, '#4b3b5c', d + 1); c.heads.push({ x: ex, y: ey }); }
        };
        br(0, 0, -90 + (r() - .5) * 10, 58 + r() * 18, 3, 0);
      } },
      opuntia: { name: 'Opuntia ficus-indica', common: 'prickly pear', fr: 'figuier de Barbarie', build(c) {
        const r = c.r;
        const pad = (x, y, ang, s, depth, d) => {
          const L = s * 1.45, w = s * .62;
          petal(c, x, y, ang, L, w, depth % 2 ? '#5f9b4a' : '#6eaa55', d, 'stroke:rgba(30,60,20,.25);stroke-width:1', true);
          const rad = ang * Math.PI / 180, tx = x + Math.sin(rad) * L * .92, ty = y - Math.cos(rad) * L * .92;
          for (let k = 0; k < 4; k++) { const tt = .3 + k * .15, ox = (k % 2 ? 1 : -1) * w * .35; disc(c, x + Math.sin(rad) * L * tt + Math.cos(rad) * ox, y - Math.cos(rad) * L * tt + Math.sin(rad) * ox, 1, '#e9f2c8', d + .5); }
          if (depth > 0) { const kids = 1 + (r() < .6 ? 1 : 0); for (let k = 0; k < kids; k++) pad(tx, ty, ang + (kids === 1 ? (r() - .5) * 40 : (k ? 1 : -1) * (24 + r() * 16)), s * .8, depth - 1, d + .55); }
          else { const n = 1 + (r() * 3 | 0); for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 0.35; disc(c, tx + Math.cos(rad + off) * 2, ty - 2, 4.2, r() < .5 ? '#f2b705' : '#c2334d', d + .7 + k * .1); } c.heads.push({ x: tx, y: ty }); }
        };
        pad(0, 4, (r() - .5) * 16, 40 + r() * 10, 2, 0);
      } }
    };
    const TYPES = Object.keys(SPECIES);

    /* scenery */
    function layout() {
      const b = stageEl.getBoundingClientRect(); if (!b.width) return;
      const nVW = Math.max(380, Math.round(VH * b.width / b.height));
      if (nVW === VW && Lb.childNodes.length) return;
      VW = nVW; svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
      $('#gSun').setAttribute('transform', `translate(${VW - 90} 82)`); $('#gMoon').setAttribute('transform', `translate(${VW - 90} 82)`);
      cloud.setAttribute('transform', `translate(${VW / 2} 56)`);
      Lb.innerHTML = ''; Lf.innerHTML = '';
      mk('path', { class: 'g-hill', d: `M0 ${GY - 60} C ${VW * .2} ${GY - 120}, ${VW * .42} ${GY - 40}, ${VW * .6} ${GY - 76} S ${VW * .9} ${GY - 96}, ${VW} ${GY - 50} L ${VW} ${VH} L 0 ${VH}Z` }, Lb);
      mk('path', { class: 'g-hill2', d: `M0 ${GY - 18} C ${VW * .3} ${GY - 56}, ${VW * .55} ${GY - 6}, ${VW * .78} ${GY - 34} S ${VW * .95} ${GY - 30}, ${VW} ${GY - 16} L ${VW} ${VH} L 0 ${VH}Z` }, Lb);
      mk('path', { class: 'g-soil', d: `M0 ${GY} Q ${VW / 2} ${GY + 12} ${VW} ${GY} L ${VW} ${VH} L 0 ${VH}Z` }, Lf);
      mk('path', { class: 'g-edge', d: `M0 ${GY} Q ${VW / 2} ${GY + 12} ${VW} ${GY}` }, Lf);
      const rr = mulberry(11);
      for (let i = 0; i < VW / 40; i++) { const x = rr() * VW, y = groundY(x) + 14 + rr() * 46; mk('ellipse', { class: 'g-peb', cx: f1(x), cy: f1(y), rx: f1(2 + rr() * 5), ry: f1(1.5 + rr() * 2.5) }, Lf); }
      for (let x = 8; x < VW; x += 26 + rr() * 40) { const y = groundY(x) + 1; let d = ''; for (let k = 0; k < 4; k++) { const bx = x + k * 3, h = 6 + rr() * 9, lean = (rr() - .5) * 8; d += `M${f1(bx)} ${f1(y)} Q ${f1(bx + lean * .3)} ${f1(y - h * .6)} ${f1(bx + lean)} ${f1(y - h)} Q ${f1(bx + lean * .3 + 2)} ${f1(y - h * .5)} ${f1(bx + 2.4)} ${f1(y)}Z `; } mk('path', { class: 'g-tuft', d }, Lf); }
      plants.forEach(p => { p.x = p.f * VW; p.base = groundY(p.x) + 3; p.g.setAttribute('transform', `translate(${f1(p.x)} ${f1(p.base)})`); p.heads = p.local.map(h => ({ x: h.x + p.x, y: h.y + p.base })); });
    }

    /* plants */
    const plants = [];
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(plants.map(p => ({ f: +p.f.toFixed(4), t: p.t, s: p.s })))); } catch (e) {} };
    const updCount = () => { const n = plants.length; countEl.textContent = n; countWord.textContent = lang === 'fr' ? (n > 1 ? 'plantes' : 'plante') : (n === 1 ? 'plant' : 'plants'); };
    onLang(updCount); updCount();
    function plantAt(f, type, seed, opts = {}) {
      const x = f * VW, base = groundY(x) + 3;
      const g = mk('g', { class: 'pl', transform: `translate(${f1(x)} ${f1(base)})` }, Lp);
      const r = mulberry(seed);
      const sw = mk('g', { class: 'pl-sway', style: `--sw:${(4.5 + r() * 3).toFixed(2)}s;--sd:${(-r() * 4).toFixed(2)}s` }, g);
      const inner = mk('g', { class: 'pl-in' }, sw);
      const c = { g: inner, r, heads: [], stems: [] };
      SPECIES[type].build(c);
      const p = { g, inner, f, t: type, s: seed, x, base, r, local: c.heads, stems: c.stems, heads: c.heads.map(h => ({ x: h.x + x, y: h.y + base })) };
      plants.push(p);
      while (plants.length > MAX) { const old = plants.shift(); old.g.classList.add('fade'); setTimeout(() => old.g.remove(), 900); }
      updCount(); if (!opts.silent) { save(); label(p); }
      return p;
    }
    function label(p) {
      const el = document.createElement('div'); el.className = 'glabel';
      el.innerHTML = `<i></i><span></span>`; el.querySelector('i').textContent = SPECIES[p.t].name; el.querySelector('span').textContent = lang === 'fr' ? SPECIES[p.t].fr : SPECIES[p.t].common;
      el.style.left = clamp(p.f, .1, .9) * 100 + '%'; el.style.bottom = '12px';
      stageEl.appendChild(el); setTimeout(() => el.remove(), 3300);
    }
    let lastType = '';
    const nextType = () => { let t; do { t = TYPES[(Math.random() * TYPES.length) | 0]; } while (t === lastType); lastType = t; return t; };
    const freeSpot = () => { let best = .5, bd = -1; for (let i = 0; i < 12; i++) { const f = .06 + Math.random() * .88, d = plants.reduce((m, p) => Math.min(m, Math.abs(p.f - f)), 1); if (d > bd) { bd = d; best = f; } } return best; };
    function sow(f, fromY) {
      f = clamp(f, .03, .97);
      const x = f * VW, gy = groundY(x), type = nextType(), seed = (Math.random() * 1e9) | 0;
      hint.classList.add('gone');
      if (reduce || fromY == null) { plantAt(f, type, seed); return; }
      const sd = mk('ellipse', { cx: f1(x), cy: f1(fromY), rx: 4, ry: 5.5, style: 'fill:#9a7444' }, Lr);
      const fall = Math.max(0, gy - fromY);
      sd.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${fall}px)` }], { duration: 260 + fall * 1.1, easing: 'cubic-bezier(.5,0,1,1)', fill: 'forwards' }).onfinish = () => {
        sd.remove();
        for (let i = 0; i < 6; i++) { const a = Math.PI + (i / 5) * Math.PI, dt = mk('circle', { cx: f1(x), cy: f1(gy), r: 1.8 + Math.random() * 1.6, style: 'fill:var(--soil-2,#b39468)' }, Lr);
          dt.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * 16}px,${Math.sin(a) * 12}px)`, opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => dt.remove(); }
        plantAt(f, type, seed);
      };
    }
    function bonus(p) {
      if (!p.stems.length) return;
      const c = { g: p.inner, r: p.r, heads: [], stems: [] };
      for (let k = 0; k < 2; k++) { const P = p.stems[(Math.random() * p.stems.length) | 0], t = .35 + Math.random() * .5, q = bz(P, t); leaf(c, q.x, q.y, q.a + (k ? 55 : -55), 12 + Math.random() * 8, 4, k ? 'var(--green)' : 'var(--green-ink)', .1 + k * .15, false); }
    }

    /* rain */
    let raining = false;
    const water = $('#gWater');
    function rain() {
      if (raining) return; raining = true; water.disabled = true;
      cloud.classList.add('on');
      const n = Math.round(VW / 14);
      for (let i = 0; i < n; i++) {
        const x = VW / 2 - 140 + Math.random() * 280 + (Math.random() - .5) * VW * .5, y1 = groundY(clamp(x, 0, VW)) - 14;
        const ln = mk('line', { class: 'gdrop', x1: f1(x), y1: 0, x2: f1(x - 2.5), y2: 12, style: `--y0:70px;--y1:${f1(y1)}px;--t:${(.45 + Math.random() * .3).toFixed(2)}s;--d:${(.5 + Math.random() * 1.5).toFixed(2)}s` }, Lr);
        setTimeout(() => ln.remove(), 3000);
      }
      setTimeout(() => plants.forEach(p => { p.inner.classList.remove('drink'); p.inner.getBoundingClientRect(); p.inner.classList.add('drink'); bonus(p); }), 1100);
      setTimeout(() => { cloud.classList.remove('on'); raining = false; water.disabled = false; }, 2900);
    }

    /* butterflies */
    const flies = [];
    function makeFly(c1, c2) {
      const g = mk('g', { class: 'bfly' }, Lfly);
      const wing = (side) => { const s = side === 'l' ? -1 : 1, wg = mk('g', { class: 'bw ' + side }, g);
        mk('path', { d: `M0 0 C ${6 * s} -12, ${18 * s} -14, ${16 * s} -3 C ${15 * s} 3, ${8 * s} 4, 0 1Z M0 1 C ${7 * s} 4, ${13 * s} 9, ${9 * s} 13 C ${5 * s} 15, ${s} 9, 0 3Z`, style: `fill:${c1}` }, wg);
        mk('circle', { cx: 10 * s, cy: -6, r: 2.6, style: `fill:${c2}` }, wg); };
      wing('l'); wing('r');
      mk('ellipse', { cx: 0, cy: 2, rx: 1.5, ry: 6.5, style: 'fill:#2a2a2a' }, g);
      mk('path', { d: 'M-0.5 -4 C -2 -9, -4 -11, -5 -12 M0.5 -4 C 2 -9, 4 -11, 5 -12', style: 'stroke:#2a2a2a;stroke-width:.8;fill:none' }, g);
      const f = { g, x: Math.random() * VW, y: 60 + Math.random() * 120, vx: 0, vy: 0, tx: 0, ty: 0, rest: 0, ang: 0, ph: Math.random() * 6, onFlower: false };
      target(f); flies.push(f);
    }
    function target(f) {
      f.g.classList.remove('rest');
      const withHeads = plants.filter(p => p.heads.length);
      if (withHeads.length && Math.random() < .65) { const p = withHeads[(Math.random() * withHeads.length) | 0], h = p.heads[(Math.random() * p.heads.length) | 0]; f.tx = h.x; f.ty = h.y - 6; f.onFlower = true; }
      else { f.tx = 30 + Math.random() * (VW - 60); f.ty = 40 + Math.random() * (GY - 190); f.onFlower = false; }
    }
    let visible = false, raf = 0, lastT = 0;
    function tick(now) {
      if (!visible) { raf = 0; return; }
      const dt = Math.min(3, (now - (lastT || now)) / 16.67); lastT = now;
      flies.forEach(f => {
        if (f.rest > 0) { f.rest -= dt; f.ang += (0 - f.ang) * .1; if (f.rest <= 0) target(f); }
        else {
          const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy) || 1;
          if (d < 5) { if (f.onFlower) { f.rest = 100 + Math.random() * 140; f.vx = f.vy = 0; f.g.classList.add('rest'); } else target(f); }
          else {
            const sp = 1.7; f.vx += (dx / d * sp - f.vx) * .045 * dt; f.vy += (dy / d * sp - f.vy) * .045 * dt;
            f.x += f.vx * dt; f.y += (f.vy + Math.sin(now / 170 + f.ph) * .7) * dt;
            const ta = Math.atan2(f.vy, f.vx) * 180 / Math.PI + 90; let da = ((ta - f.ang + 540) % 360) - 180; f.ang += da * .08 * dt;
          }
        }
        f.g.setAttribute('transform', `translate(${f1(f.x)} ${f1(f.y)}) rotate(${f1(f.ang)}) scale(.95)`);
      });
      raf = requestAnimationFrame(tick);
    }

    /* first visit: restore the saved garden or sow a starter bed */
    let started = false;
    function start() {
      if (started) return; started = true; layout();
      let saved = null; try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
      // only trust well-formed entries: a known species, a position between 0 and 1, an integer seed
      if (Array.isArray(saved)) saved = saved.filter(p => p && typeof p === 'object' && Object.prototype.hasOwnProperty.call(SPECIES, p.t)
        && typeof p.f === 'number' && p.f >= 0 && p.f <= 1 && Number.isInteger(p.s));
      if (Array.isArray(saved) && saved.length) {
        saved.slice(-MAX).forEach((p, i) => setTimeout(() => plantAt(p.f, p.t, p.s, { silent: true }), reduce ? 0 : i * 140));
        hint.classList.add('gone');
      } else {
        const n = VW < 700 ? 4 : 7, order = [...TYPES].sort(() => Math.random() - .5);
        for (let i = 0; i < n; i++) setTimeout(() => plantAt((i + .5) / n + (Math.random() - .5) * .05, order[i % order.length], (Math.random() * 1e9) | 0, { silent: true }), reduce ? 0 : 300 + i * 260);
        setTimeout(save, reduce ? 50 : 300 + n * 260 + 50);
      }
      if (!reduce) { makeFly('#0b5ba8', '#a6d4ff'); makeFly('#f2a03d', '#fff1b8'); }
    }

    svg.addEventListener('click', e => {
      const m = svg.getScreenCTM(); if (!m) return;
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(m.inverse());
      sow(p.x / VW, Math.min(p.y, groundY(p.x) - 6));
    });
    $('#gPlant').addEventListener('click', () => sow(freeSpot(), 40));
    water.addEventListener('click', rain);
    $('#gClear').addEventListener('click', () => {
      plants.splice(0).forEach((p, i) => { setTimeout(() => p.g.classList.add('fade'), i * 40); setTimeout(() => p.g.remove(), 900 + i * 40); });
      try { localStorage.removeItem(KEY); } catch (e) {}
      updCount(); hint.classList.remove('gone');
    });
    addEventListener('resize', () => started && layout());
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => {
        visible = e.isIntersecting;
        if (visible) { start(); if (!raf && flies.length) { lastT = 0; raf = requestAnimationFrame(tick); } }
      }), { threshold: .25 }).observe(stageEl);
    } else { start(); }
  })();

  /* ---------- Main scroll loop ---------- */
  const nav = $('#nav'), tlFill = $('#tlFill'), toTop = $('#toTop');
  /* ---------- Active section in the nav ---------- */
  const spyLinks = $$('.nav ul a, .mnav nav a');
  const spyIds = ['graine', 'lab', 'cellules', 'jardin', 'faq', 'contact'];
  let spyCur = '';
  function spy() {
    let cur = '';
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) cur = 'contact';
    else for (const id of spyIds) { const s = document.getElementById(id); if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = id; }
    if (cur === spyCur) return; spyCur = cur;
    spyLinks.forEach(a => { const on = a.getAttribute('href') === '#' + cur; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger'), mnav = $('#mnav');
  const syncBurger = () => burger.setAttribute('aria-label', T(mnav.hidden ? 'menu.open' : 'menu.close'));
  function openMenu() { mnav.hidden = false; burger.setAttribute('aria-expanded', 'true'); nav.classList.add('menu-open'); document.body.style.overflow = 'hidden'; syncBurger(); }
  function closeMenu() { if (mnav.hidden) return; mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('menu-open'); document.body.style.overflow = ''; syncBurger(); }
  burger.addEventListener('click', () => mnav.hidden ? openMenu() : closeMenu());
  $$('.mnav nav a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !mnav.hidden) { closeMenu(); burger.focus(); } });
  matchMedia('(min-width:1100px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  syncBurger(); onLang(syncBurger);

  let ticking = false, lastY = scrollY, lastFall = 0;
  function onScroll() {
    ticking = false;
    const y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > innerHeight * 1.1);
    spy();
    const P = H > 0 ? clamp(y / H) : 0;
    sprogUpdate(P);
    // a few leaves drift down when the visitor scrolls briskly
    const now = performance.now(), dy = Math.abs(y - lastY); lastY = y;
    if (dy > 70 && now - lastFall > 160) { lastFall = now; fxFall(dy > 220 ? 2 : 1); }
    vineStem.style.strokeDashoffset = vineLen * (1 - P);
    vineItems.forEach(v => {
      if (v.leaf) v.leaf.classList.toggle('on', P >= v.t);
      else { const o = seg(P, .96, 1); v.petal.style.transform = `rotate(${v.r * o}deg) scale(${.4 + .6 * o},${.6 + .4 * o})`; }
    });
    // germination: progress while section passes
    const gr = germ.getBoundingClientRect();
    drawGerm(clamp((innerHeight * .75 - gr.top) / (gr.height * .8)));
    // timeline stem + nodes
    const tr = tl.getBoundingClientRect(), mid = innerHeight * .62;
    tlFill.parentElement.style.setProperty('--p', clamp((mid - tr.top) / tr.height));
    $$('.season', tl).forEach(row => { const r = row.getBoundingClientRect(), o = r.top + 40 < mid; row.classList.toggle('open', o); if (o && !row.dataset.sp) { row.dataset.sp = 1; const n = row.querySelector('.node svg').getBoundingClientRect(); if (n.top > 0 && n.top < innerHeight) fxBurst(n.left + n.width / 2, n.top + n.height / 2, 10); } });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
  if (reduce) { drawGerm(1); }
  onScroll();
  if (reduce) { drawGerm(1); $$('.season').forEach(r => r.classList.add('open')); }

  /* ---------- Registration 2026–2027 (multi-step form, one cell per member) ---------- */
  // Paste the Google Apps Script web-app URL here (ends with /exec) — see apps-script/GUIDE.md.
  // It saves each registration to the club's Google Sheet and emails a confirmation to the new member.
  // Left empty, the form runs in demo mode.
  // ⚠️ If this URL changes, also update connect-src in the security policy (CSP) at the top of index.html.
  const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwFYkGRBzAjsfr7qgj7E4vOuFT65GWUKY8Rec8Fw_TblW3lJIdHnjqasO4Gzad4fD1fuA/exec";
  const L = (en, fr) => ({ en, fr });
  const tx = o => (o && typeof o === 'object') ? (o[lang] != null ? o[lang] : o.en) : (o == null ? '' : String(o));
  const CELLS = [
    { id: 'project', ic: '🌱', n: L('Project Development Cell', 'Cellule Développement de projets'), s: L('Plans projects and turns ideas into concrete initiatives.', 'Planifie les projets et transforme les idées en initiatives concrètes.') },
    { id: 'activities', ic: '⚙️', n: L('Activities & Organisations Cell', 'Cellule Activités & Organisation'), s: L("Organises and runs HBC's workshops, outings and events.", 'Organise et anime les ateliers, sorties et événements du HBC.') },
    { id: 'media', ic: '📸', n: L('Media & Creativity Cell', 'Cellule Médias & Créativité'), s: L('Visual identity, posts, visuals and coverage of activities.', 'Identité visuelle, publications, visuels et couverture des activités.') },
    { id: 'relations', ic: '🤝', n: L('Relations & Partnerships Cell', 'Cellule Relations & Partenariats'), s: L('Links with clubs, organisations, partners and sponsors.', 'Liens avec les clubs, organisations, partenaires et sponsors.') }
  ];
  const ANY = { id: 'any', ic: '🍃', n: L("I'm open to joining any cell where I'm needed", "Je suis prêt à rejoindre la cellule où l'on aura besoin de moi"), s: L("The committee will place you where you're most needed.", 'Le bureau vous placera là où vous serez le plus utile.') };
  const cellOf = id => CELLS.find(c => c.id === id);
  const cellName = id => { const c = cellOf(id); return c ? tx(c.n) : ''; };
  const O = arr => arr.map(a => ({ v: a[0], l: L(a[0], a[1] || a[0]), ic: a[2] || '' }));
  const EXP = O([['Yes', 'Oui', '✅'], ['A little', 'Un peu', '🤏'], ['No, but I want to learn', 'Non, mais je veux apprendre', '❌']]);
  const WHY = L('Why did you choose this cell?', 'Pourquoi avez-vous choisi cette cellule ?');
  const EXPQ = L('Do you already have experience related to this cell?', 'Avez-vous déjà une expérience liée à cette cellule ?');
  const EXPT = L('Tell us briefly about any relevant experience you have.', 'Parlez-nous brièvement de toute expérience utile que vous avez.');
  const STEPS = [
    { id: 'info', t: L('Personal information', 'Informations personnelles'), q: [
      { k: 'name', type: 'text', req: 1, half: 1, ac: 'name', max: 80, l: L('Full name', 'Nom complet') },
      { k: 'email', type: 'email', req: 1, half: 1, ac: 'email', max: 120, l: L('Email address', 'Adresse e-mail') },
      { k: 'faculty', type: 'radio', req: 1, other: 1, cols: 2, l: L('Faculty', 'Faculté'), o: O([['Faculty of Sciences', 'Faculté des Sciences'], ['Faculty of Medicine', 'Faculté de Médecine'], ['Faculty of Law', 'Faculté de Droit'], ['Faculty of Islamic Sciences', 'Faculté des Sciences islamiques']]) },
      { k: 'department', type: 'radio', req: 1, other: 1, cols: 2, l: L('Department', 'Département'), o: O([['Nature and Life Sciences Department', 'Sciences de la nature et de la vie'], ['Computer Sciences Department', 'Informatique'], ['Architecture Department', 'Architecture'], ['Mathematics Department', 'Mathématiques'], ['Material Sciences Department', 'Sciences de la matière']]) },
      { k: 'specialty', type: 'radio', req: 1, other: 1, cols: 2, l: L('Specialty', 'Spécialité'), o: O([['Common core', 'Tronc commun'], ['Food Sciences', 'Sciences alimentaires'], ['Biochemistry', 'Biochimie'], ['Microbiology', 'Microbiologie'], ['Biotechnology', 'Biotechnologie'], ['Biological Sciences', 'Sciences biologiques'], ['Ecology & Environment', 'Écologie & environnement']]) },
      { k: 'level', type: 'select', req: 1, half: 1, l: L('Academic level', "Niveau d'études"), o: O([['L1'], ['L2'], ['L3'], ['M1'], ['M2'], ['PhD', 'Doctorat']]) },
      { k: 'studentId', type: 'text', req: 1, half: 1, max: 30, l: L('Student ID number', 'Numéro de matricule') },
      { k: 'phone', type: 'tel', req: 1, half: 1, ac: 'tel', max: 20, ph: L('05 / 06 / 07 …', '05 / 06 / 07 …'), l: L('Phone number', 'Numéro de téléphone') },
      { k: 'telegram', type: 'text', req: 1, half: 1, max: 60, ph: L('@username', '@pseudo'), l: L('Your Telegram', 'Votre Telegram') }
    ] },
    { id: 'interests', t: L('General interests', "Centres d'intérêt"), d: L('Tell us a little about your interests, hobbies, and areas you enjoy exploring.', "Parlez-nous un peu de vos centres d'intérêt, de vos loisirs et des domaines que vous aimez explorer."), q: [
      { k: 'why', type: 'textarea', req: 1, max: 1200, l: L('Why do you want to join Hope Buds Club?', 'Pourquoi voulez-vous rejoindre Hope Buds Club ?') },
      { k: 'interests', type: 'checks', req: 1, cols: 2, l: L('What are you most interested in?', "Qu'est-ce qui vous intéresse le plus ?"), o: O([['Environment & Ecology', 'Environnement & écologie', '🌱'], ['Science & Research', 'Sciences & recherche', '🔬'], ['Sustainability', 'Durabilité', '🌳'], ['Creativity & Design', 'Créativité & design', '🎨'], ['Media & Content Creation', 'Médias & création de contenu', '📱'], ['Photography & Videography', 'Photo & vidéo', '📸'], ['Events & Activities', 'Événements & activités', '🎉'], ['Project Development & Innovation', 'Développement de projets & innovation', '💡'], ['Partnerships & Communication', 'Partenariats & communication', '🤝'], ['Volunteering & Community Work', 'Bénévolat & action citoyenne', '🙌'], ['Public Speaking & Debates', 'Prise de parole & débats', '🎤'], ['Practical & Scientific Workshops', 'Ateliers pratiques & scientifiques', '🧪']]) },
      { k: 'skills', type: 'checks', req: 1, other: 1, cols: 2, l: L('What skills can you bring to HBC?', 'Quelles compétences pouvez-vous apporter au HBC ?'), o: O([['Leadership', 'Leadership'], ['Organization & Planning', 'Organisation & planification'], ['Teamwork', "Travail d'équipe"], ['Communication', 'Communication'], ['Public Speaking', 'Prise de parole en public'], ['Writing', 'Rédaction'], ['Research', 'Recherche'], ['Graphic Design', 'Design graphique'], ['Photography', 'Photographie'], ['Videography', 'Vidéographie'], ['Video Editing', 'Montage vidéo'], ['Social Media Management', 'Gestion des réseaux sociaux'], ['Event Organization', "Organisation d'événements"], ['Sponsoring / Partnerships', 'Sponsoring / partenariats'], ['Problem Solving', 'Résolution de problèmes'], ['Creativity & Idea Generation', "Créativité & génération d'idées"]]) }
    ] },
    { id: 'team', t: L('Find your team', 'Trouvez votre équipe'), d: L("Here is a short explanation of the club's internal structure. The cell you choose here is the team you will join.", "Voici un court aperçu de l'organisation interne du club. La cellule que vous choisissez ici sera votre équipe."), more: 1, q: [
      { k: 'choice1', type: 'cell', req: 1, any: 1, l: L('Which HBC cell would you MOST like to join?', 'Quelle cellule du HBC aimeriez-vous LE PLUS rejoindre ?') },
      { k: 'why1', type: 'textarea', max: 800, l: WHY },
      { k: 'exp1', type: 'radio', req: 1, cols: 3, l: EXPQ, o: EXP },
      { k: 'expText1', type: 'textarea', max: 800, l: EXPT }
    ] },
    { id: 'second', t: L('Your second choice', 'Votre deuxième choix'), d: L('If your first cell is full, we will consider your second choice.', 'Si votre première cellule est complète, nous tiendrons compte de votre deuxième choix.'), q: [
      { k: 'choice2', type: 'cell', req: 1, l: L('What would be your SECOND choice?', 'Quel serait votre DEUXIÈME choix ?') },
      { k: 'why2', type: 'textarea', max: 800, l: WHY },
      { k: 'exp2', type: 'radio', req: 1, cols: 3, l: EXPQ, o: EXP },
      { k: 'expText2', type: 'textarea', max: 800, l: EXPT }
    ] },
    { id: 'availability', t: L('Availability & commitment', 'Disponibilité & engagement'), d: L('Let us know about your availability and how much time you would be able to dedicate to HBC activities.', 'Dites-nous quelles sont vos disponibilités et combien de temps vous pourrez consacrer aux activités du HBC.'), q: [
      { k: 'availability', type: 'radio', req: 1, cols: 2, l: L('How available are you to participate in HBC activities?', 'Quelle est votre disponibilité pour participer aux activités du HBC ?'), o: O([['Very available', 'Très disponible', '🟢'], ['Generally available', 'Généralement disponible', '📅'], ['Inconsistent availability', 'Disponibilité irrégulière', '🔄'], ['Limited availability', 'Disponibilité limitée', '🔸']]) },
      { k: 'when', type: 'checks', req: 1, other: 1, cols: 2, l: L('When are you generally available?', 'Quand êtes-vous généralement disponible ?'), o: O([['Weekday mornings', 'Matins en semaine', '🌅'], ['Weekday afternoons', 'Après-midis en semaine', '🌞'], ['Weekends', 'Week-ends', '🌿'], ['Depends on my university schedule', 'Selon mon emploi du temps universitaire', '📚']]) },
      { k: 'outside', type: 'radio', req: 1, cols: 3, l: L('Are you willing to participate in activities outside the university when necessary?', "Êtes-vous prêt à participer à des activités hors de l'université si nécessaire ?"), o: O([['Yes', 'Oui', '🟢'], ['It depends on the activity', "Selon l'activité", '🔄'], ['No', 'Non', '🔴']]) },
      { k: 'commitment', type: 'radio', req: 1, cols: 3, l: L('Are you willing to take responsibility for tasks and respect agreed deadlines?', 'Êtes-vous prêt à prendre des tâches en charge et à respecter les délais convenus ?'), o: O([['Yes', 'Oui', '🟢'], ["I'll do my best depending on my availability", 'Je ferai de mon mieux selon mes disponibilités', '💪'], ['No', 'Non', '🔴']]) }
    ] },
    { id: 'goals', t: L('Your ideas & goals', 'Vos idées & objectifs'), d: L('Tell us about your ideas, goals, and what you would like to contribute or achieve through HBC.', 'Partagez vos idées, vos objectifs et ce que vous aimeriez apporter ou accomplir avec le HBC.'), q: [
      { k: 'gain', type: 'radio', req: 1, other: 1, cols: 2, l: L('What do you hope to gain from your HBC experience this year?', "Qu'espérez-vous retirer de votre expérience au HBC cette année ?"), o: O([['New skills', 'Nouvelles compétences', '🌱'], ['Practical experience', 'Expérience pratique', '🧪'], ['Scientific knowledge', 'Connaissances scientifiques', '🔬'], ['Leadership experience', 'Expérience de leadership', '🧭'], ['Communication skills', 'Compétences en communication', '💬'], ['New connections & friendships', 'Nouvelles rencontres & amitiés', '🤝'], ['Volunteering experience', 'Expérience bénévole', '💚'], ['Creativity', 'Créativité', '💡']]) },
      { k: 'activity', type: 'textarea', req: 1, max: 1200, l: L('If you could organize ONE activity or project with HBC this year, what would it be?', "Si vous pouviez organiser UNE activité ou UN projet avec le HBC cette année, ce serait quoi ?") },
      { k: 'ideas', type: 'textarea', max: 1200, l: L('Do you have any ideas or suggestions that could help HBC improve this season?', 'Avez-vous des idées ou suggestions pour aider le HBC à progresser cette saison ?') },
      { k: 'consent', type: 'consent', req: 1, l: L('I agree that Hope Buds Club may keep these details to contact me about club activities.', "J'accepte que Hope Buds Club conserve ces informations pour me contacter au sujet des activités du club.") }
    ], outro: L("Join us today and help shape a more sustainable future! 🌍 Together, let's make a difference in preserving our planet. 🍀💚", 'Rejoignez-nous dès aujourd\'hui et aidez à construire un avenir plus durable ! 🌍 Ensemble, faisons la différence pour préserver notre planète. 🍀💚') }
  ];
  const ALLQ = STEPS.flatMap(s => s.q);
  const QBY = Object.fromEntries(ALLQ.map(q => [q.k, q]));
  const FT = {
    step: L('Step', 'Étape'), of: L('of', 'sur'), next: L('Next', 'Suivant'), back: L('Back', 'Retour'), submit: L('Submit registration', "Envoyer l'inscription"),
    sending: L('Sending…', 'Envoi…'), other: L('Other:', 'Autre :'), specify: L('Specify', 'Précisez'), choose: L('Choose…', 'Choisir…'), optional: L('(optional)', '(facultatif)'),
    req: L('This question is required.', 'Cette question est obligatoire.'), reqOther: L('Please specify your answer.', 'Merci de préciser votre réponse.'),
    email: L('Enter a valid email address, like name@example.com.', 'Saisissez une adresse e-mail valide, par exemple nom@exemple.com.'),
    phone: L('Use digits only, for example 0555 12 34 56.', 'Chiffres uniquement, par exemple 0555 12 34 56.'),
    consent: L('Tick the box so we can contact you.', 'Cochez la case pour que nous puissions vous contacter.'),
    more: L('Read what each cell does', 'Lire le rôle de chaque cellule'),
    busy: L('Many registrations are arriving right now. Your answers are kept: please try again in a few minutes.', "Beaucoup d'inscriptions arrivent en ce moment. Vos réponses sont conservées : réessayez dans quelques minutes."),
    fail: L('Your registration could not be sent. Check your connection and try again. If it keeps failing, email us at the address in the footer.', "Votre inscription n'a pas pu être envoyée. Vérifiez votre connexion et réessayez. Si le problème persiste, écrivez-nous à l'adresse indiquée en bas de page."),
    welcome: L('Thank you, ', 'Merci, '),
    review: L('Your registration has been received. The committee will review it and send you an email with the next steps.', 'Votre inscription a bien été reçue. Le bureau va l\'examiner et vous enverra un e-mail avec la suite.'),
    placed: L(' Your first choice: ', ' Votre premier choix : '),
    placedEnd: L('.', '.'),
    anyDone: L(" Thank you for being open to any cell: we'll place you where you're most needed.", " Merci d'être ouvert à toutes les cellules : nous vous placerons là où vous serez le plus utile."),
    mailSent: L('📩 A confirmation email is on its way to ', '📩 Un e-mail de confirmation vient d\'être envoyé à '),
    mailSentEnd: L('. Not in your inbox within a few minutes? Check your spam folder.', '. Rien reçu d\'ici quelques minutes ? Pensez à vérifier vos spams.'),
    mailFail: L("Your registration is saved, but we couldn't send the confirmation email. Don't worry: the committee will still contact you.", "Votre inscription est bien enregistrée, mais l'e-mail de confirmation n'a pas pu être envoyé. Pas d'inquiétude : le bureau vous contactera quand même."),
    nameBad: L('Please use letters only: spaces, hyphens and apostrophes are fine, but no numbers, dots or links.', 'Utilisez uniquement des lettres : les espaces, tirets et apostrophes sont acceptés, mais pas les chiffres, les points ni les liens.'),
    privacy: L('Your answers are stored in a private Google Sheet that only the club committee can see. We use them only to process your registration and to contact you about the club, and we never share them. When you submit, an anti-robot check by Cloudflare (Turnstile) runs. They are kept for the 2026–2027 season, then deleted. To see, correct or delete your data, write to hopebuds.club@univ-alger.dz.', 'Vos réponses sont enregistrées dans un tableau Google privé, visible uniquement par le bureau du club. Elles servent seulement à traiter votre inscription et à vous contacter au sujet du club, et ne sont jamais partagées. Au moment de l\'envoi, une vérification anti-robot de Cloudflare (Turnstile) est effectuée. Elles sont conservées le temps de la saison 2026-2027, puis supprimées. Pour consulter, corriger ou supprimer vos données, écrivez à hopebuds.club@univ-alger.dz.'),
    closed: L('Registrations are closed for the moment. Follow us on Instagram to know when they reopen.', 'Les inscriptions sont fermées pour le moment. Suivez-nous sur Instagram pour savoir quand elles rouvrent.'),
    captcha: L("The anti-robot check didn't succeed. Your answers are kept: tick the check box above if it is shown, then try again. If it keeps failing, try another browser or turn off your VPN.", "La vérification anti-robot n'a pas abouti. Vos réponses sont conservées : cochez la case de vérification au-dessus si elle est affichée, puis réessayez. Si cela continue, essayez un autre navigateur ou désactivez votre VPN."),
    tsWait: L('One moment: the anti-robot check just above is finishing. If a box appears, tick it.', 'Un instant : la vérification anti-robot juste au-dessus se termine. Si une case apparaît, cochez-la.')
  };
  // Same rules as the Google script (apps-script/Code.gs): letters (Latin, accented or Arabic) separated by a space, ' or -
  const NAME_RE = /^(?=.{2,80}$)[A-Za-z\u00C0-\u024F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF][A-Za-z\u00C0-\u024F\u0300-\u036F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]*(?:[ '\u2019-][A-Za-z\u00C0-\u024F\u0300-\u036F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*$/;
  const EMAIL_RE = /^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;
  const CELL_FULL = {
    project: L("The Project Development Cell focuses on developing and bringing HBC's ideas and projects to life. It works on planning projects, turning ideas into concrete initiatives, and finding creative ways to make a meaningful impact through the club's activities. It also ensures good communication and coordination between the different cells, helping everyone work together effectively.", "La cellule Développement de projets donne vie aux idées et aux projets du HBC. Elle planifie les projets, transforme les idées en initiatives concrètes et cherche des façons créatives d'avoir un vrai impact à travers les activités du club. Elle veille aussi à la bonne communication et à la coordination entre les cellules, pour que tout le monde avance ensemble."),
    activities: L("The Activities & Organisations Cell is responsible for turning the plans developed by the Project Development Cell into reality. It helps organise and coordinate HBC's activities and events, making sure that the different steps of the plan are properly carried out. From workshops and outings to other events, this cell helps ensure that activities run smoothly and bring members together.", "La cellule Activités & Organisation concrétise les plans élaborés par la cellule Développement de projets. Elle organise et coordonne les activités et événements du HBC, en veillant à ce que chaque étape du plan soit bien menée. Des ateliers aux sorties en passant par les autres événements, elle s'assure que tout se déroule bien et rassemble les membres."),
    media: L("The Media & Creativity Cell handles HBC's visual identity and creative content. It works on designing posts, creating visuals, documenting activities, and finding creative ways to share HBC's work and make our initiatives more visible.", "La cellule Médias & Créativité gère l'identité visuelle et le contenu créatif du HBC. Elle conçoit les publications, crée les visuels, documente les activités et trouve des façons créatives de partager le travail du HBC et de rendre nos initiatives plus visibles."),
    relations: L("The Relations & Partnerships Cell focuses on building and maintaining relationships both within HBC and with people, clubs, organisations, and partners outside the university. It also handles communication with potential partners and sponsors, helps develop collaborations, and works on securing sponsorships and opportunities that can support HBC's projects and activities.", "La cellule Relations & Partenariats construit et entretient les relations, au sein du HBC comme avec les personnes, clubs, organisations et partenaires extérieurs à l'université. Elle gère la communication avec les partenaires et sponsors potentiels, aide à développer des collaborations et cherche des sponsors et des opportunités pour soutenir les projets et activités du HBC.")
  };

  const regDialog = $('#regDialog'), regForm = $('#regForm');
  const formView = $('#regFormView'), doneView = $('#regDoneView'), stepsBox = $('#regSteps');
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) { if (typeof txt === 'object') { e._t = txt; e.classList.add('tt'); e.textContent = tx(txt); } else e.textContent = txt; } return e; };
  let uid = 0; const nid = () => 'rq' + (++uid);

  function buildOption(q, o, type, name) {
    const lab = el('label', 'chip'); const inp = el('input'); inp.type = type; inp.name = name; inp.value = o.v;
    lab.append(inp); if (o.ic) lab.append(el('span', 'chip-ic', o.ic)); lab.append(el('span', 'chip-t', o.l)); return lab;
  }
  function buildQ(q) {
    const isSet = ['radio', 'checks', 'cell'].includes(q.type);
    const w = el('div', 'field q'); w.dataset.q = q.k;
    const id = nid(); if (isSet) { w.setAttribute('role', q.type === 'checks' ? 'group' : 'radiogroup'); w.setAttribute('aria-labelledby', id + 'l'); }
    if (q.type === 'consent') {
      const lab = el('label', 'consent'); const inp = el('input'); inp.type = 'checkbox'; inp.name = q.k; inp.id = id;
      lab.append(inp, el('span', null, q.l)); w.append(lab, el('p', 'consent-note', FT.privacy));
    } else {
      const head = el(isSet ? 'div' : 'label', 'q-l'); if (!isSet) head.htmlFor = id; else head.id = id + 'l';
      head.append(el('span', null, q.l)); if (q.req) { const s = el('span', 'q-req', ' *'); s.setAttribute('aria-hidden', 'true'); head.append(s); } else { head.append(' '); head.append(el('span', 'opt', FT.optional)); }
      w.append(head);
      if (q.type === 'textarea') { const t = el('textarea'); t.name = q.k; t.id = id; t.maxLength = q.max || 800; w.append(t); }
      else if (q.type === 'select') {
        const s = el('select'); s.name = q.k; s.id = id; const o0 = el('option', null, FT.choose); o0.value = ''; s.append(o0);
        q.o.forEach(o => { const op = el('option', null, o.l); op.value = o.v; s.append(op); }); w.append(s);
      } else if (q.type === 'radio' || q.type === 'checks') {
        const box = el('div', 'opts c' + (q.cols || 1)); const t = q.type === 'radio' ? 'radio' : 'checkbox';
        q.o.forEach(o => box.append(buildOption(q, o, t, q.k)));
        if (q.other) {
          const lab = el('label', 'chip chip-other'); const inp = el('input'); inp.type = t; inp.name = q.k; inp.value = '__other';
          const txt = el('input'); txt.type = 'text'; txt.name = q.k + '__other'; txt.maxLength = 120; txt.className = 'other-in'; txt._ph = FT.specify; txt.placeholder = tx(FT.specify);
          txt.addEventListener('input', () => { if (txt.value.trim()) inp.checked = true; });
          lab.append(inp, el('span', 'chip-t', FT.other), txt); box.append(lab);
        }
        w.append(box);
      } else if (q.type === 'cell') {
        const box = el('div', 'cellpicks');
        CELLS.concat(q.any ? [ANY] : []).forEach(c => {
          const lab = el('label', 'cellpick' + (c.id === 'any' ? ' any' : '')); const inp = el('input'); inp.type = 'radio'; inp.name = q.k; inp.value = c.id;
          const tx2 = el('span', 'cp-t'); tx2.append(el('b', null, c.n), el('small', null, c.s));
          lab.append(inp, el('span', 'cp-ic', c.ic), tx2); box.append(lab);
        });
        w.append(box);
      } else {
        const i = el('input'); i.type = q.type; i.name = q.k; i.id = id; if (q.max) i.maxLength = q.max; if (q.ac) i.autocomplete = q.ac;
        if (q.ph) { i._ph = q.ph; i.placeholder = tx(q.ph); } w.append(i);
      }
    }
    const err = el('span', 'err'); err.id = 'err-' + q.k; err.setAttribute('role', 'alert'); w.append(err);
    return w;
  }
  STEPS.forEach((s, i) => {
    const sec = el('section', 'rstep'); sec.dataset.step = s.id; sec.hidden = i !== 0;
    if (s.d) sec.append(el('p', 'rstep-d', s.d));
    if (s.more) {
      const det = el('details', 'cell-more'); det.append(el('summary', null, FT.more));
      CELLS.forEach(c => { const p = el('p'); const b = el('b', null, c.n); p.append(el('span', null, c.ic + ' '), b, el('br'), el('span', null, CELL_FULL[c.id])); det.append(p); });
      sec.append(det);
    }
    const qs = el('div', 'qs'); let row = null;
    s.q.forEach(q => {
      const w = buildQ(q);
      if (q.half) { if (!row) { row = el('div', 'row2'); qs.append(row); } row.append(w); if (row.children.length === 2) row = null; }
      else { row = null; qs.append(w); }
    });
    sec.append(qs);
    if (s.outro) sec.append(el('p', 'rstep-outro', s.outro));
    stepsBox.append(sec);
  });

  const trForm = () => {
    $$('.tt', regDialog).forEach(e => { e.textContent = tx(e._t); });
    $$('input, textarea', regDialog).forEach(e => { if (e._ph) e.placeholder = tx(e._ph); });
    $$('.err', regDialog).forEach(e => { if (e._t) e.textContent = tx(e._t); });
    showStep(cur, true);
  };

  /* --- values & validation --- */
  const getQ = k => {
    const q = QBY[k], f = regForm.elements;
    if (q.type === 'checks') {
      const vals = $$(`input[name="${k}"]:checked`, regForm).map(i => i.value);
      return vals.map(v => v === '__other' ? 'Other: ' + (f[k + '__other'].value || '').trim() : v);
    }
    if (q.type === 'radio' || q.type === 'cell') {
      const c = $(`input[name="${k}"]:checked`, regForm); if (!c) return '';
      return c.value === '__other' ? 'Other: ' + (f[k + '__other'].value || '').trim() : c.value;
    }
    if (q.type === 'consent') return !!$(`input[name="${k}"]`, regForm).checked;
    return (f[k].value || '').trim();
  };
  const setErr = (k, msg) => {
    const e = $('#err-' + k); if (!e) return; e._t = msg || null; e.textContent = msg ? tx(msg) : '';
    const w = e.closest('.q'); if (w) w.classList.toggle('bad', !!msg);
  };
  function checkQ(q) {
    const v = getQ(q.k); let m = null;
    const empty = Array.isArray(v) ? !v.length : (v === '' || v === false);
    if (q.req && empty) m = q.type === 'consent' ? FT.consent : FT.req;
    else if ((Array.isArray(v) ? v : [v]).some(x => x === 'Other: ')) m = FT.reqOther;
    else if (q.k === 'name' && v && !NAME_RE.test(v.replace(/\s+/g, ' '))) m = FT.nameBad;
    else if (q.type === 'email' && v && !EMAIL_RE.test(v)) m = FT.email;
    else if (q.type === 'tel' && v && !/^[+0-9 ()-]{8,20}$/.test(v)) m = FT.phone;
    setErr(q.k, m); return !m;
  }
  regForm.addEventListener('input', e => { const w = e.target.closest('.q'); if (w && w.classList.contains('bad')) setErr(w.dataset.q, null); });
  regForm.addEventListener('change', e => {
    const w = e.target.closest('.q'); if (w && w.classList.contains('bad')) setErr(w.dataset.q, null);
    if (e.target.name === 'choice1') syncChoice2();
  });
  function syncChoice2() {
    const c1 = getQ('choice1');
    $$('input[name="choice2"]', regForm).forEach(i => { const off = i.value === c1; i.disabled = off; i.closest('.cellpick').classList.toggle('off', off); if (off && i.checked) i.checked = false; });
    showStep(cur, true);
  }

  /* --- stepping --- */
  let cur = 0;
  const activeSteps = () => STEPS.map((s, i) => i).filter(i => !(STEPS[i].id === 'second' && getQ('choice1') === 'any'));
  function showStep(i, quiet) {
    cur = i; const act = activeSteps(), pos = Math.max(0, act.indexOf(i));
    $$('.rstep', regForm).forEach((s, j) => { s.hidden = j !== i; });
    $('#stNum').textContent = `${tx(FT.step)} ${pos + 1} ${tx(FT.of)} ${act.length}`;
    $('#stName').textContent = tx(STEPS[i].t);
    $('#stBar').style.width = ((pos + 1) / act.length * 100) + '%';
    const last = pos === act.length - 1;
    $('#regBack').hidden = pos === 0; $('#regNext').hidden = last; $('#regSubmit').hidden = !last;
    const tsBox = $('#tsBox'); if (tsBox) { tsBox.hidden = !last; if (last && FORM_ENDPOINT) mountTurnstile(); }
    $('#regNextLabel').textContent = tx(FT.next); $('#regBackLabel').textContent = tx(FT.back);
    if (!$('#regSubmit').disabled) $('#regSubmitLabel').textContent = tx(FT.submit);
    if (!quiet) { regDialog.scrollTop = 0; const f = $$('.rstep', regForm)[i].querySelector('input:not([type=hidden]):not([disabled]), textarea, select'); if (f && matchMedia('(min-width:700px)').matches) setTimeout(() => f.focus({ preventScroll: true }), 60); }
  }
  function validStep(i) {
    let ok = true, first = null;
    STEPS[i].q.forEach(q => { if (!checkQ(q)) { ok = false; first = first || q.k; } });
    if (first) { const w = $(`.q[data-q="${first}"]`, regForm); w && w.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); const f = w && w.querySelector('input, textarea, select'); f && f.focus({ preventScroll: true }); }
    return ok;
  }
  const move = d => { const act = activeSteps(), p = act.indexOf(cur); const n = act[p + d]; if (n != null) showStep(n); };
  $('#regNext').addEventListener('click', () => { if (validStep(cur)) move(1); });
  $('#regBack').addEventListener('click', () => move(-1));

  /* --- Anti-spam token: the Google script signs a token when the form opens and only accepts
         registrations sent at least 15 seconds later, once per token (see apps-script/Code.gs) --- */
  let regToken = null, tokenReq = null;
  function getToken(fresh) {
    if (fresh) { regToken = null; tokenReq = null; }
    if (regToken) return Promise.resolve(regToken);
    if (!tokenReq) tokenReq = fetch(FORM_ENDPOINT + '?action=token').then(r => r.json()).then(j => (regToken = (j && j.token) || null)).catch(() => null).finally(() => { tokenReq = null; });
    return tokenReq;
  }

  /* --- Anti-robot Cloudflare Turnstile: loaded and shown only on the last step of the form, so the check runs
         while the visitor reads it, and they can tick the box if Cloudflare asks. The Google script checks the proof.
         A proof works once and lasts 5 minutes: Turnstile renews it by itself, and we reset it after each use.
         Empty TURNSTILE_SITEKEY = switched off. On localhost, Cloudflare's official test key is used instead. --- */
  const TURNSTILE_SITEKEY = '0x4AAAAAAF_PDRH8ytB3mUiA'; // public key (Cloudflare → Turnstile → HBC inscriptions)
  const TS_KEY = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? '1x00000000000000000000AA' : TURNSTILE_SITEKEY;
  let tsLib = null, tsWidget = null, tsToken = '', tsErrCode = '', tsWaiters = [];
  function loadTurnstile() {
    if (!TURNSTILE_SITEKEY) return Promise.resolve(null);
    if (!tsLib) tsLib = new Promise(resolve => {
      window.hbcTurnstileReady = () => resolve(window.turnstile || null);
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=hbcTurnstileReady';
      s.async = true; s.onerror = () => { tsLib = null; resolve(null); };
      document.head.append(s);
    });
    return tsLib;
  }
  const tsWake = () => { const w = tsWaiters; tsWaiters = []; w.forEach(f => f()); };
  async function mountTurnstile() {
    const ts = await loadTurnstile();
    if (!ts || tsWidget != null) return;
    tsWidget = ts.render('#tsBox', {
      sitekey: TS_KEY, action: 'register', appearance: 'always', language: lang, theme: 'auto', size: 'flexible',
      'refresh-expired': 'auto', retry: 'auto',
      callback: t => { tsToken = t; tsErrCode = ''; tsWake(); },
      'expired-callback': () => { tsToken = ''; },
      'error-callback': code => { tsToken = ''; tsErrCode = String(code || ''); tsWake(); }
    });
  }
  // Returns a fresh proof, waiting (up to 90 s) if the check is still running or needs a tick
  async function getTurnstileProof() {
    if (!TURNSTILE_SITEKEY) return '';
    await mountTurnstile();
    if (!window.turnstile || tsWidget == null) return '';
    if (!tsToken) {
      setErr('submit', FT.tsWait);
      await new Promise(res => { const timer = setTimeout(res, 90000); tsWaiters.push(() => { clearTimeout(timer); res(); }); });
      setErr('submit', null);
    }
    const t = tsToken; tsToken = '';
    return t;
  }
  // After a proof has been sent, ask Turnstile for a new one (each proof works only once)
  function renewTurnstile() { if (window.turnstile && tsWidget != null) { tsToken = ''; try { window.turnstile.reset(tsWidget); } catch (e) {} } }
  const openDlg = d => { if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', ''); };
  const closeDlg = d => { if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); };
  $$('[data-register]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); closeMenu();
    if (!doneView.hidden) { doneView.hidden = true; formView.hidden = false; showStep(0, true); }
    if (b.dataset.cell) { const r = $(`input[name="choice1"][value="${b.dataset.cell}"]`, regForm); if (r) { r.checked = true; syncChoice2(); } }
    if (FORM_ENDPOINT) getToken();
    openDlg(regDialog); regDialog.scrollTop = 0;
  }));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => closeDlg(b.closest('dialog'))));
  regDialog.addEventListener('click', e => { if (e.target === regDialog) closeDlg(regDialog); });

  /* ---------- Cell quiz: 5 questions → best-fit cell ----------
     Each answer gives 3 points to the cell it describes (4 on the last, most direct question)
     and sometimes 1 bonus point to a neighbouring cell. Ties go to the cell picked in Q5, then Q1. */
  (() => {
    const box = $('#quiz'); if (!box) return;
    const intro = $('#qzIntro'), run = $('#qzRun'), res = $('#qzRes');
    const KEYS = ['project', 'activities', 'media', 'relations'];
    const QS = [
      { q: L('The club is organising a beach clean-up. Which job do you grab first?', 'Le club organise un nettoyage de plage. Quelle mission prenez-vous en premier ?'), o: [
        { t: L('Running the day itself: teams, equipment and timing.', 'Gérer le jour J : les équipes, le matériel et les horaires.'), w: { activities: 3 } },
        { t: L('Calling the town hall, associations and sponsors to get bags and gloves.', 'Contacter la mairie, des associations et des sponsors pour obtenir sacs et gants.'), w: { relations: 3 } },
        { t: L("Setting the goal, writing the plan and deciding how we'll measure the impact.", "Fixer l'objectif, rédiger le plan et décider comment mesurer l'impact."), w: { project: 3 } },
        { t: L('Taking the photos and making the video that shows what we did.', "Prendre les photos et monter la vidéo qui montrera ce qu'on a fait."), w: { media: 3 } } ] },
      { q: L('At the end of a project, what makes you proudest?', "À la fin d'un projet, qu'est-ce qui vous procure le plus de fierté ?"), o: [
        { t: L('A visual or a video that people shared and talked about.', 'Un visuel ou une vidéo que les gens ont partagé et commenté.'), w: { media: 3 } },
        { t: L('An idea that started on a blank page and became something real.', "Une idée partie d'une page blanche devenue quelque chose de concret."), w: { project: 3, activities: 1 } },
        { t: L('A new partner or club that agreed to work with us.', 'Un nouveau partenaire ou club qui a accepté de travailler avec nous.'), w: { relations: 3, project: 1 } },
        { t: L('An event where everything ran on time and nobody was left out.', "Un événement où tout s'est déroulé à l'heure, sans laisser personne de côté."), w: { activities: 3 } } ] },
      { q: L('Which of these comes most naturally to you?', 'Laquelle de ces compétences vous vient le plus naturellement ?'), o: [
        { t: L("Approaching people I don't know and convincing them.", 'Aborder des inconnus et les convaincre.'), w: { relations: 3 } },
        { t: L('Breaking a big idea into clear steps and writing it up.', 'Découper une grande idée en étapes claires et la mettre par écrit.'), w: { project: 3 } },
        { t: L('Juggling lists, schedules and last-minute changes.', 'Jongler avec les listes, les plannings et les imprévus de dernière minute.'), w: { activities: 3, project: 1 } },
        { t: L('Design, photography, video editing or creative writing.', "Le design, la photo, le montage vidéo ou l'écriture créative."), w: { media: 3 } } ] },
      { q: L("In a group assignment, you're usually the one who…", "Dans un travail de groupe, c'est souvent vous qui…"), o: [
        { t: L("…comes up with the ideas and makes sure everyone's parts fit together.", "…proposez les idées et veillez à ce que les parties de chacun s'emboîtent."), w: { project: 3, relations: 1 } },
        { t: L('…makes the slides look great and easy to follow.', '…rendez les diapositives belles et faciles à suivre.'), w: { media: 3 } },
        { t: L('…splits up the tasks and checks that everything is on track.', '…répartissez les tâches et vérifiez que tout avance comme prévu.'), w: { activities: 3 } },
        { t: L('…presents in front of the class and answers the questions.', '…présentez devant la classe et répondez aux questions.'), w: { relations: 3, media: 1 } } ] },
      { q: L('Your ideal week at HBC looks like…', 'Votre semaine idéale au HBC, c\'est…'), o: [
        { t: L('Booking a room, preparing the kit and welcoming people to a workshop.', "Réserver une salle, préparer le matériel et accueillir les participants d'un atelier."), w: { activities: 4 } },
        { t: L('Designing the Instagram posts and editing the video of the last outing.', 'Créer les posts Instagram et monter la vidéo de la dernière sortie.'), w: { media: 4 } },
        { t: L('Meeting another club or an NGO to launch a partnership.', 'Rencontrer un autre club ou une ONG pour lancer un partenariat.'), w: { relations: 4 } },
        { t: L('Brainstorming a new project and turning it into an action plan.', "Réfléchir à un nouveau projet et le transformer en plan d'action."), w: { project: 4 } } ] }
    ];
    const RES = {
      project: { ic: '🌱', n: L('Project Development', 'Développement de projets'), tag: L('From ideas to action', "Des idées à l'action"),
        d: L("You like to see the big picture, plan ahead and turn ideas into concrete projects. In the Project Development Cell you'll shape HBC's initiatives and keep all the cells working together.", "Vous aimez avoir une vue d'ensemble, anticiper et transformer les idées en projets concrets. Dans la cellule Développement de projets, vous façonnerez les initiatives du HBC et ferez le lien entre toutes les cellules."),
        m: [L('Write project proposals', 'Rédiger des propositions de projets'), L('Plan goals and timelines', 'Planifier les objectifs et les échéances'), L("Measure each project's impact", "Mesurer l'impact de chaque projet")] },
      activities: { ic: '⚙️', n: L('Activities & Organisations', 'Activités & Organisation'), tag: L('On the ground', 'Sur le terrain'),
        d: L("You're at your best when things are moving: you organise, coordinate and handle the unexpected. The Activities & Organisations Cell turns HBC's plans into workshops, outings and events.", "Vous donnez le meilleur de vous-même quand ça bouge : vous organisez, coordonnez et gérez les imprévus. La cellule Activités & Organisation transforme les plans du HBC en ateliers, sorties et événements."),
        m: [L('Run workshops and outings', 'Animer les ateliers et les sorties'), L('Manage logistics and schedules', 'Gérer la logistique et les plannings'), L('Welcome and guide participants', 'Accueillir et guider les participants')] },
      media: { ic: '📸', n: L('Media & Creativity', 'Médias & Créativité'), tag: L("The club's eye", 'Le regard du club'),
        d: L('You see the world in images and stories. The Media & Creativity Cell gives HBC its look: posts, visuals, photos and videos that make our actions visible.', "Vous voyez le monde en images et en histoires. La cellule Médias & Créativité donne au HBC son identité : publications, visuels, photos et vidéos qui rendent nos actions visibles."),
        m: [L('Design posts and visuals', 'Concevoir les publications et les visuels'), L('Photograph and film activities', 'Photographier et filmer les activités'), L("Run the club's social media", 'Animer les réseaux sociaux du club')] },
      relations: { ic: '🤝', n: L('Relations & Partnerships', 'Relations & Partenariats'), tag: L('Building bridges', 'Créer des liens'),
        d: L('You enjoy meeting people, speaking up and convincing. The Relations & Partnerships Cell connects HBC with clubs, organisations, partners and sponsors.', 'Vous aimez rencontrer des gens, prendre la parole et convaincre. La cellule Relations & Partenariats relie le HBC aux clubs, organisations, partenaires et sponsors.'),
        m: [L('Contact partners and sponsors', 'Contacter partenaires et sponsors'), L('Build collaborations with other clubs', "Construire des collaborations avec d'autres clubs"), L('Represent HBC outside the university', "Représenter le HBC hors de l'université")] }
    };
    const UI = {
      num: L('Question {n} of {t}', 'Question {n} sur {t}'),
      second: L('Suggested second choice: <b></b>', 'Deuxième choix conseillé : <b></b>'),
      hybrid: L('Your profile is split between <b></b> and <b></b>: both would suit you.', 'Votre profil se partage entre <b></b> et <b></b> : les deux vous conviendraient.')
    };
    let step = 0, ans = [], order = KEYS, busy = 0;
    const show = v => { intro.hidden = v !== 'intro'; run.hidden = v !== 'run'; res.hidden = v !== 'res'; };
    const toView = () => { const t = box.getBoundingClientRect().top; if (t < 60 || t > innerHeight * .45) box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
    const restart = d => { d.classList.remove('qz-anim'); void d.offsetWidth; d.classList.add('qz-anim'); };

    function renderQ(fresh) {
      const Q = QS[step];
      $('#qzNum').textContent = tx(UI.num).replace('{n}', step + 1).replace('{t}', QS.length);
      $('#qzBar').style.width = (step / QS.length * 100) + '%';
      $('#qzQ').textContent = tx(Q.q);
      const wrap = $('#qzOpts'); wrap.textContent = '';
      Q.o.forEach((o, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'qz-opt';
        b.setAttribute('aria-pressed', ans[step] === i ? 'true' : 'false');
        const k = document.createElement('b'); k.setAttribute('aria-hidden', 'true'); k.textContent = 'ABCD'[i];
        const s = document.createElement('span'); s.textContent = tx(o.t);
        b.append(k, s); b.addEventListener('click', () => pick(i)); wrap.appendChild(b);
      });
      if (fresh) { restart($('#qzStep')); $('#qzQ').focus({ preventScroll: true }); }
    }
    function pick(i) {
      if (busy) return; busy = 1; ans[step] = i;
      $$('.qz-opt', box).forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
      $('#qzBar').style.width = ((step + 1) / QS.length * 100) + '%';
      setTimeout(() => { busy = 0; if (step < QS.length - 1) { step++; renderQ(true); } else { ans.length = QS.length; showResult(true); } }, reduce ? 120 : 420);
    }
    function scores() {
      const sc = { project: 0, activities: 0, media: 0, relations: 0 };
      ans.forEach((a, qi) => { const w = QS[qi].o[a].w; for (const k in w) sc[k] += w[k]; });
      const main = qi => { const w = QS[qi].o[ans[qi]].w; return Object.keys(w).find(k => w[k] >= 3); };
      const tie = k => (main(QS.length - 1) === k ? 2 : 0) + (main(0) === k ? 1 : 0);
      order = KEYS.slice().sort((a, b) => sc[b] - sc[a] || tie(b) - tie(a) || KEYS.indexOf(a) - KEYS.indexOf(b));
      // percentages that always add up to 100 (largest remainder)
      const tot = KEYS.reduce((s, k) => s + sc[k], 0) || 1, raw = KEYS.map(k => sc[k] * 100 / tot), pct = {};
      const fl = raw.map(Math.floor); let left = 100 - fl.reduce((s, v) => s + v, 0);
      raw.map((v, i) => [v - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
      KEYS.forEach((k, i) => pct[k] = fl[i]);
      return { sc, pct };
    }
    function showResult(fresh) {
      const { sc, pct } = scores(), [a, b] = order, R = RES[a];
      show('res');
      $('#qzIc').textContent = R.ic; $('#qzName').textContent = tx(R.n); $('#qzTag').textContent = tx(R.tag); $('#qzDesc').textContent = tx(R.d);
      const ul = $('#qzMiss'); ul.textContent = ''; R.m.forEach(m => { const li = document.createElement('li'); li.textContent = tx(m); ul.appendChild(li); });
      const bars = $('#qzBars'); bars.textContent = '';
      order.forEach(k => {
        const li = document.createElement('li'); if (k === a) li.className = 'top';
        const row = document.createElement('div'); row.className = 'row';
        const nm = document.createElement('span'); nm.textContent = RES[k].ic + ' ' + tx(RES[k].n);
        const pv = document.createElement('b'); pv.textContent = pct[k] + ' %';
        const trk = document.createElement('div'); trk.className = 'trk'; trk.setAttribute('aria-hidden', 'true');
        const fill = document.createElement('i'); trk.appendChild(fill);
        row.append(nm, pv); li.append(row, trk); bars.appendChild(li);
        if (fresh && !reduce) requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = pct[k] + '%'; })); else fill.style.width = pct[k] + '%';
      });
      const sec = $('#qzSecond'), hybrid = sc[a] - sc[b] <= 2;
      sec.innerHTML = tx(hybrid ? UI.hybrid : UI.second);
      const bs = $$('b', sec); if (hybrid) { bs[0].textContent = tx(R.n); bs[1].textContent = tx(RES[b].n); } else bs[0].textContent = tx(RES[b].n);
      $('#qzJoin').dataset.cell = a;
      if (fresh) { restart(res); toView(); $('#qzName').focus({ preventScroll: true }); }
    }
    $('#qzStart').addEventListener('click', () => { step = 0; ans = []; show('run'); renderQ(true); toView(); });
    $('#qzBack').addEventListener('click', () => { if (busy) return; if (step === 0) { show('intro'); $('#qzStart').focus(); } else { step--; renderQ(true); } });
    $('#qzAgain').addEventListener('click', () => { step = 0; ans = []; show('run'); renderQ(true); toView(); });
    // after the generic [data-register] handler has set choice 1, pre-fill choice 2 with the runner-up
    $('#qzJoin').addEventListener('click', () => { const r = $(`input[name="choice2"][value="${order[1]}"]`, regForm); if (r && !r.disabled) r.checked = true; });
    onLang(() => { if (!run.hidden) renderQ(false); if (!res.hidden) showResult(false); });
  })();

  // Returns { mode: 'sent' | 'demo', mail?: 'sent' | 'failed' }
  // Sent as plain text so the browser makes a "simple" request (no CORS preflight, which Apps Script can't answer).
  // The script may ask to wait (form sent less than 15 s after opening) or for a new token (expired): handled here, invisibly.
  // A Turnstile proof works once and is checked after the wait/token checks, so a new one is fetched except after 'wait'.
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function save(d) {
    if (!FORM_ENDPOINT) return { mode: 'demo' };
    let needProof = true, captchaTries = 0;
    for (let attempt = 0; attempt < 5; attempt++) {
      d.token = await getToken();
      if (!d.token) throw new Error('network');
      if (needProof) d.ts = await getTurnstileProof();
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: JSON.stringify(d) });
      if (!r.ok) throw new Error('http ' + r.status);
      let res = {}; try { res = await r.json(); } catch (e) {}
      if (res.ok) { getToken(true); renewTurnstile(); return { mode: 'sent', mail: res.mail }; } // token and proof work once: prepare the next ones
      needProof = res.error !== 'wait'; // after 'wait' the same proof is still unused
      if (needProof) renewTurnstile();
      if (res.error === 'wait') { await sleep((Math.min(+res.wait || 5, 20) + 1) * 1000); continue; }
      if (res.error === 'expired' || res.error === 'token') { await getToken(true); continue; }
      if (res.error === 'captcha' && ++captchaTries < 2) continue;
      throw new Error(res.error || 'endpoint');
    }
    throw new Error('endpoint');
  }

  regForm.addEventListener('submit', async e => {
    e.preventDefault();
    const act = activeSteps();
    if (act.indexOf(cur) < act.length - 1) { if (validStep(cur)) move(1); return; }
    for (const i of act) { if (!validStep(i)) { showStep(i); validStep(i); return; } }
    const d = { lang }; // the season and the date are set by the Google script, not by the browser
    ALLQ.forEach(q => { if (!(q.k.endsWith('2') || q.k === 'expText2') || getQ('choice1') !== 'any') d[q.k] = getQ(q.k); });
    d.cell = d.choice1 === 'any' ? '' : d.choice1;
    d.website = $('#hpWebsite').value; // anti-spam trap, empty for real visitors
    const btn = $('#regSubmit'), lbl = $('#regSubmitLabel'); btn.disabled = true; lbl.textContent = tx(FT.sending); setErr('submit', null);
    try {
      const res = await save(d);
      $('#demoNote').hidden = res.mode !== 'demo';
      const first = d.name.split(/\s+/)[0];
      const h = $('#doneTitle'), p = $('#doneText'), mn = $('#mailNote'); p.textContent = ''; mn.textContent = ''; mn.hidden = true; mn.classList.remove('warn');
      h.textContent = tx(FT.welcome); h.append(el('em', null, first), '.');
      p.append(tx(FT.review));
      if (d.cell) p.append(tx(FT.placed), el('b', null, cellName(d.cell)), tx(FT.placedEnd)); else p.append(tx(FT.anyDone));
      if (res.mail === 'sent') { mn.append(tx(FT.mailSent), el('b', null, d.email), tx(FT.mailSentEnd)); mn.hidden = false; }
      else if (res.mail === 'failed') { mn.textContent = tx(FT.mailFail); mn.classList.add('warn'); mn.hidden = false; }
      const dp = $('#donePetals'); dp.innerHTML = '';
      [0, 72, 144, 216, 288].forEach((a, i) => { const pe = mk('ellipse', { class: 'dp', cx: 42, cy: 36, rx: 8, ry: 14, fill: i % 2 ? 'var(--green)' : 'var(--green-ink)' }, dp); pe.style.setProperty('--r', a + 'deg'); pe.style.animationDelay = (i * .08) + 's'; });
      formView.hidden = true; doneView.hidden = false; regForm.reset(); syncChoice2(); showStep(0, true); regDialog.scrollTop = 0;
    } catch (err) {
      const why = err && err.message;
      const code = why === 'captcha' && tsErrCode ? ' (code ' + tsErrCode + ')' : ''; // Cloudflare's error code helps the committee diagnose
      setErr('submit', why === 'busy' ? FT.busy : why === 'closed' ? FT.closed : why === 'captcha' ? L(FT.captcha.en + code, FT.captcha.fr + code) : FT.fail);
    } finally { btn.disabled = false; lbl.textContent = tx(FT.submit); }
  });
  showStep(0, true);
  onLang(trForm);

  /* ---------- Copy email ---------- */
  const copyBtn = $('#copyBtn'), addr = $('#mailAddr');
  copyBtn.addEventListener('click', () => {
    const done = () => { copyBtn.textContent = T('copied'); setTimeout(() => copyBtn.textContent = T('copy'), 1800); };
    const fallback = () => { const s = getSelection(), r = document.createRange(); r.selectNodeContents(addr); s.removeAllRanges(); s.addRange(r); copyBtn.textContent = T('selected'); setTimeout(() => copyBtn.textContent = T('copy'), 1800); };
    try { navigator.clipboard.writeText(addr.textContent).then(done, fallback); } catch (e) { fallback(); }
  });

  /* ---------- Start: apply the language once everything is built ---------- */
  setLang(lang, true); reSprig();
})();
