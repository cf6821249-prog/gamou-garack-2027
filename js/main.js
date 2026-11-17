/* =====================  CONFIGURATION  ===================== */
// Début de la cérémonie officielle (heure de Garack = UTC+0)
const EVENT_START = "2027-01-02T17:00:00Z";
// Vidéos YouTube : identifiant (ce qui suit "youtu.be/")
const VIDEOS = {
  ceremonie: "LiOYMSNlSPU",   // QR « cérémonie officielle » (https://youtu.be/LiOYMSNlSPU)
  accueil:   "sieSeoyPvvg"    // QR « accueil populaire »
};
/* ========================================================== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
let lang = localStorage.getItem("gg-lang") || "fr";

/* ---------- titre lettre par lettre (FR) */
function buildTitle() {
  const t = $("#title"); t.textContent = "";
  if (lang === "ar") { t.textContent = "كامو كرك"; t.setAttribute("aria-label", "كامو كرك"); return; }
  t.setAttribute("aria-label", "Gamou de Garack"); let i = 0;
  "Gamou de Garack".split(" ").forEach((w, n, a) => {
    const s = document.createElement("span"); s.className = "w";
    [...w].forEach(ch => { const c = document.createElement("span"); c.className = "c"; c.style.setProperty("--i", i++); c.textContent = ch; s.append(c); });
    t.append(s); if (n < a.length - 1) t.append(" ");
  });
}
/* ---------- mots qui s'allument */
function splitWords() {
  const el = $("#w1"); const txt = el.textContent.trim(); el.textContent = "";
  txt.split(/\s+/).forEach((w, i, a) => { const s = document.createElement("span"); s.textContent = w; el.append(s); if (i < a.length - 1) el.append(" "); });
}
/* ---------- langue FR / AR */
function applyLang() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $$("[data-ar]").forEach(el => { if (el.dataset.fr === undefined) el.dataset.fr = el.innerHTML; el.innerHTML = lang === "ar" ? el.dataset.ar : el.dataset.fr; });
  document.title = lang === "ar" ? "كامو كرك 2027 — دعوة رسمية" : "Gamou de Garack 2027 — Invitation officielle";
  buildTitle(); splitWords(); initVideos(); tick();
}
$("#lang").addEventListener("click", () => { lang = lang === "fr" ? "ar" : "fr"; localStorage.setItem("gg-lang", lang); applyLang(); });

/* ---------- étoiles */
(function () { const r = (a, b) => a + Math.random() * (b - a), sk = $("#sky");
  for (let i = 0; i < 60; i++) { const e = document.createElement("i"); e.className = "star";
    e.style.cssText = `--x:${r(0,100)}%;--y:${r(0,100)}%;--s:${r(1,2.6)}px;--d:${r(2.5,6)}s;--l:${-r(0,6)}s;--o2:${r(.3,.9)}`; sk.append(e); } })();

/* ---------- scroll : hero épinglé, progression, mots, menu actif */
const hero = $(".hero"), bar = $("#bar"), navLinks = $$(".lnav nav a"), secs = navLinks.map(a => $(a.getAttribute("href")));
let ticking = false;
function tick() {
  const vh = innerHeight, sy = scrollY, H = document.documentElement.scrollHeight - vh;
  bar.style.setProperty("--sp", H > 0 ? sy / H : 0);
  const rect = hero.getBoundingClientRect(), p = clamp(-rect.top / (rect.height - vh));
  hero.style.setProperty("--e", ease(clamp((p - .1) / .55)).toFixed(4));
  hero.style.setProperty("--o", (1 - clamp((p - .08) / .28)).toFixed(4));
  hero.style.setProperty("--t", p.toFixed(4));
  hero.style.setProperty("--h", clamp((p - .64) / .2).toFixed(4));
  const w = $("#w1"), wr = w.getBoundingClientRect(), sp = $$("span", w);
  const wp = clamp((vh * .82 - wr.top) / (wr.height + vh * .35)), n = Math.round(wp * sp.length);
  sp.forEach((s, i) => s.classList.toggle("on", i < n));
  let cur = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * .4) cur = i; });
  navLinks.forEach((a, i) => a.classList.toggle("on", i === cur));
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
addEventListener("resize", tick);

/* ---------- compte à rebours */
(function () {
  const end = new Date(EVENT_START).getTime(), E = { d: $("#d"), h: $("#h"), m: $("#m"), s: $("#s") };
  const set = (el, v) => { v = String(v).padStart(2, "0"); if (el.textContent !== v) { el.textContent = v; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } };
  const run = () => { const t = Math.max(0, end - Date.now()) / 1000; set(E.d, Math.floor(t / 86400)); set(E.h, Math.floor(t % 86400 / 3600)); set(E.m, Math.floor(t % 3600 / 60)); set(E.s, Math.floor(t % 60)); };
  run(); setInterval(run, 1000);
})();

/* ---------- apparition au défilement */
(function () {
  $$(".rv").forEach((el, i) => el.style.setProperty("--dl", (i % 3) * .09 + "s"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".rv").forEach(el => io.observe(el));
})();

/* ---------- carrousel des temps forts */
(function () {
  const car = $("#car"), cards = $$(".card", car), chips = $$("#chips button");
  const setOn = i => chips.forEach((c, k) => c.classList.toggle("on", k === i));
  chips.forEach((c, i) => c.addEventListener("click", () => { cards[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); setOn(i); }));
  let t; car.addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(() => {
    const mid = car.getBoundingClientRect().left + car.clientWidth / 2; let best = 0, bd = 1e9;
    cards.forEach((c, i) => { const r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } }); setOn(best); }, 60); }, { passive: true });
})();

/* ---------- programme : onglets */
(function () {
  const btns = $$("#seg button"), panels = [$("#p0"), $("#p1")];
  panels.forEach(p => $$("li", p).forEach((li, i) => li.style.setProperty("--k", i)));
  btns.forEach((b, i) => b.addEventListener("click", () => { btns.forEach((x, k) => x.classList.toggle("on", k === i));
    panels.forEach((p, k) => { p.classList.toggle("on", k === i); if (k === i) $$("li", p).forEach(li => { li.style.animation = "none"; void li.offsetWidth; li.style.animation = ""; }); }); }));
})();

/* ---------- vidéos YouTube (chargées au clic) */
function initVideos() {
  $$(".vcard").forEach(card => {
    const id = VIDEOS[card.dataset.video], box = $(".vthumb", card);
    box.innerHTML = '<button class="play" aria-label="Lire"><i></i></button>'; box.classList.remove("soon"); box.style.backgroundImage = "";
    if (!id) { box.classList.add("soon"); box.dataset.soon = lang === "ar" ? "الفيديو قريبًا" : "Vidéo bientôt disponible"; $(".play", box).style.display = "none"; return; }
    box.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;
    $(".play", box).addEventListener("click", () => { box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; });
  });
}
applyLang();
