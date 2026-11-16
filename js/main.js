/* =====================  CONFIGURATION  ===================== */
// Début de la cérémonie officielle (heure de Garack = UTC+0)
const EVENT_START = "2027-01-02T17:00:00Z";
// Vidéos YouTube : mettre l'identifiant (ce qui suit "youtu.be/" ou "v=")
const VIDEOS = {
  ceremonie: "",              // ← à renseigner : lien du QR « cérémonie officielle »
  accueil:   "sieSeoyPvvg"    // QR « accueil populaire » (https://youtu.be/sieSeoyPvvg)
};
/* ========================================================== */

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
let lang = localStorage.getItem("gg-lang") || "fr";

/* ---------- titre lettre par lettre (français uniquement) */
function buildTitle() {
  const t = $("#title"); t.textContent = "";
  if (lang === "ar") { t.textContent = "كامو كرك"; t.setAttribute("aria-label", "كامو كرك"); return; }
  t.setAttribute("aria-label", "Gamou de Garack");
  let i = 0;
  "Gamou de Garack".split(" ").forEach((w, n, a) => {
    const s = document.createElement("span"); s.className = "w";
    [...w].forEach(ch => { const c = document.createElement("span"); c.className = "c"; c.style.setProperty("--i", i++); c.textContent = ch; s.append(c); });
    t.append(s); if (n < a.length - 1) t.append(" ");
  });
}

/* ---------- langue FR / AR */
function applyLang() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $$("[data-ar]").forEach(el => {
    if (el.dataset.fr === undefined) el.dataset.fr = el.innerHTML;
    el.innerHTML = lang === "ar" ? el.dataset.ar : el.dataset.fr;
  });
  document.title = lang === "ar" ? "كامو كرك 2027 — دعوة رسمية" : "Gamou de Garack 2027 — Invitation officielle";
  buildTitle(); initVideos();
}
$("#lang").addEventListener("click", () => { lang = lang === "fr" ? "ar" : "fr"; localStorage.setItem("gg-lang", lang); applyLang(); });

/* ---------- étoiles + particules dorées (animées en CSS) */
(function sky() {
  const r = (a, b) => a + Math.random() * (b - a), sk = $("#sky"), pt = $("#parts");
  for (let i = 0; i < 70; i++) { const e = document.createElement("i"); e.className = "star";
    e.style.cssText = `--x:${r(0,100)}%;--y:${r(0,70)}%;--s:${r(1,3)}px;--d:${r(2.5,6)}s;--l:${-r(0,6)}s;--o:${r(.4,1)}`; sk.append(e); }
  for (let i = 0; i < 34; i++) { const e = document.createElement("i"); e.className = "p";
    e.style.cssText = `--x:${r(0,100)}%;--s:${r(3,9)}px;--d:${r(9,20)}s;--l:${-r(0,20)}s;--dx:${r(-120,120)}px`; pt.append(e); }
})();

/* ---------- compte à rebours */
(function countdown() {
  const end = new Date(EVENT_START).getTime(), els = { d: $("#d"), h: $("#h"), m: $("#m"), s: $("#s") };
  const set = (el, v) => { v = String(v).padStart(2, "0"); if (el.textContent !== v) { el.textContent = v; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } };
  const run = () => { let t = Math.max(0, end - Date.now()) / 1000;
    set(els.d, Math.floor(t / 86400)); set(els.h, Math.floor(t % 86400 / 3600)); set(els.m, Math.floor(t % 3600 / 60)); set(els.s, Math.floor(t % 60)); };
  run(); setInterval(run, 1000);
})();

/* ---------- apparition au défilement */
(function reveal() {
  $$(".tl li").forEach((li, i) => li.style.setProperty("--k", i % 9));
  $$(".rv").forEach((el, i) => { if (!el.closest(".hero")) el.style.setProperty("--dl", (i % 4) * .08 + "s"); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".rv").forEach(el => io.observe(el));
  setTimeout(() => $$(".hero .rv").forEach((el, i) => setTimeout(() => el.classList.add("in"), 900 + i * 220)), 100);
})();

/* ---------- vidéos YouTube (chargées au clic) */
function initVideos() {
  $$(".vcard").forEach(card => {
    const id = VIDEOS[card.dataset.video], box = $(".vthumb", card);
    box.innerHTML = '<button class="play" aria-label="Lire"><i></i></button>'; box.classList.remove("soon");
    box.style.backgroundImage = "";
    if (!id) { box.classList.add("soon"); box.dataset.soon = lang === "ar" ? "الفيديو قريبًا" : "Vidéo bientôt disponible"; $(".play", box).style.display = "none"; return; }
    box.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;
    $(".play", box).addEventListener("click", () => {
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    });
  });
}
applyLang();
