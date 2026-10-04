// Fill these in; any empty link is hidden automatically.
const LINKS = { linkedin: "https://linkedin.com/in/surender-nadar", github: "https://github.com/Surender-Nadar", email: "surendernadar3@gmail.com", x: "", phone: "", resume: "" };
// x: your X profile URL. phone: e.g. "+91XXXXXXXXXX" (shows a call button). resume: e.g. "resume.pdf". Empty = hidden.

document.querySelectorAll("[data-link]").forEach(a => {
  const k = a.dataset.link, v = LINKS[k];
  if (!v) { if (a.hasAttribute("data-keep")) a.hidden = false; return; }
  a.hidden = false;
  a.href = k === "email" ? "mailto:" + v : k === "phone" ? "tel:" + v : v;
  if (k === "linkedin" || k === "github" || k === "x") { a.target = "_blank"; a.rel = "noopener"; }
  if (k === "resume") a.setAttribute("download", "");
});
document.getElementById("yr").textContent = new Date().getFullYear();

// scroll progress + sticky nav
const bar = document.getElementById("bar"), nav = document.getElementById("nav");
let tick = false;
addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { const h = document.documentElement;
  bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`; nav.classList.toggle("stuck", scrollY > 40); tick = false; }); }, { passive: true });

// mobile menu
const menu = document.getElementById("menu"), links = document.getElementById("links");
menu.onclick = () => menu.setAttribute("aria-expanded", links.classList.toggle("open"));
links.onclick = e => { if (e.target.tagName === "A") { links.classList.remove("open"); menu.setAttribute("aria-expanded", false); } };

// active section highlight
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.querySelectorAll("a").forEach(a => a.classList.toggle("on", a.hash === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => io.observe(s));

// status cycler
const states = ["currently enjoying life to the fullest", "currently publishing pages", "currently planning my next meal", "currently on a songs loop", "currently deciding which movie is next", "currently up for a good chat"];
let i = 0;
document.getElementById("status").onclick = () => { i = (i + 1) % states.length; document.getElementById("statusText").textContent = states[i]; };

// soft cursor glow (one fixed layer, compositor-only)
const glow = document.querySelector(".glow"); let gp = false, gx = 0, gy = 0;
if (matchMedia("(hover:hover) and (prefers-reduced-motion:no-preference)").matches)
  addEventListener("pointermove", e => { gx = e.clientX; gy = e.clientY; if (gp) return; gp = true; requestAnimationFrame(() => { glow.style.transform = `translate3d(${gx}px,${gy}px,0)`; gp = false; }); }, { passive: true });

// terminal
const out = document.getElementById("out"), cmd = document.getElementById("cmd");
const CMDS = {
  help: ["commands: whoami, work, aem, food, social, instagram, batman, spiderman, heisenberg, pinkman, clear"],
  whoami: ["Surender Nadar. Suri to friends.", "Publishing Lead Analyst + web developer. Mumbai."],
  work: ["BlackRock (now), Accenture (2024-2026).", "Mostly: Adobe Experience Manager."],
  aem: ["pages, templates, forms, workflows, DAM.", "yes, all of them."],
  food: ["always open to suggestions.", "new dish? new cuisine? yes."],
  social: ["LinkedIn ✅  X ✅  phone ✅", "WhatsApp 〰️ (barely)  Instagram 🚫"],
  instagram: ["Nope. Please don't reach out there."],
  batman: ["I'm Batman. 🦇"], spiderman: ["Thwip! 🕸️"], heisenberg: ["Say my name.", "...Suri, actually. 😎"], pinkman: ["Yeah, science! 🧪"]
};
CMDS.spidey = CMDS.spiderman;
function print(t, cls) { const d = document.createElement("div"); if (cls) d.className = cls; d.textContent = t; out.append(d); while (out.children.length > 60) out.firstChild.remove(); out.scrollTop = out.scrollHeight; }
function run(raw) {
  const c = raw.trim().toLowerCase(); if (!c) return;
  if (c === "clear") { out.textContent = ""; return; }
  print("$ " + c, "cmdline");
  (CMDS[c] || ["command not found: " + c, "tap one of the buttons below 👇"]).forEach(l => print(l));
  if (c === "batman" && !document.body.classList.contains("gotham")) setMode("gotham");
  if ((c === "spiderman" || c === "spidey") && !document.body.classList.contains("spidey")) setMode("spidey");
  if (c === "pinkman") say("Yeah, science! 🧪");
  if (c === "heisenberg") say("Say my name. 🧪");
}
document.getElementById("termf").onsubmit = e => { e.preventDefault(); run(cmd.value); cmd.value = ""; };
document.querySelectorAll("[data-c]").forEach(b => b.onclick = () => run(b.dataset.c));
print("Welcome to Suri's corner. 👋", "hi"); print("Tap a command below, or type one and press Enter.");

// Hero modes: Batman + Spider-Man
const body = document.body, mbtns = document.querySelectorAll(".mode-btn"), toast = document.getElementById("toast"); let tt, lastCmd = "";
const MSG = { gotham: "I'm Batman. 🦇", spidey: "Thwip! Your friendly neighbourhood Suri 🕸️", none: "Back to normal Suri" };
function say(t) { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2200); }
function setMode(m) {
  const same = body.classList.contains(m); body.classList.remove("gotham", "spidey"); if (!same) body.classList.add(m);
  mbtns.forEach(b => { b.setAttribute("aria-pressed", String(!same && b.dataset.m === m)); b.classList.remove("nudge"); });
  document.getElementById("statusText").textContent = same ? states[i] : (m === "gotham" ? "I'm Batman." : "currently your friendly neighbourhood Suri");
  say(same ? MSG.none : MSG[m]); if (!same) bats(16, innerWidth / 2, innerHeight * .7, m === "spidey" ? "🕷️" : "");
}
mbtns.forEach(b => b.onclick = () => setMode(b.dataset.m));
document.querySelectorAll(".batbtn").forEach(b => b.onclick = () => setMode("gotham"));
addEventListener("keydown", e => { if (/INPUT|TEXTAREA/.test(document.activeElement.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase(); if (k === "b") setMode("gotham"); if (k === "s") setMode("spidey"); });

// introvert / extrovert switch
const mode = document.getElementById("mode"), persona = document.getElementById("persona");
mode.onclick = () => { const on = mode.getAttribute("aria-checked") !== "true"; mode.setAttribute("aria-checked", on);
  persona.textContent = on ? "Weekends are for the temple, movies, playlists and food experiments. Parties? Pass. Social media? Retired. Phone call? Maybe." : "Calls, meetings, stakeholder chats: I show up, speak up and keep things moving."; };

// Game 1: Gotham Flap
(() => {
  const c = document.getElementById("flap"), x = c.getContext("2d"), W = 320, H = 400, sc = document.getElementById("fscore");
  let y, v, pipes, noodles, score, run, over, t;
  const best = () => { try { return +localStorage.flapBest || 0; } catch (e) { return 0; } };
  function reset() { y = H / 2; v = 0; pipes = []; noodles = []; score = 0; t = 0; run = false; over = false; draw(); sc.textContent = `tap to start · best ${best()}`; }
  function flap() { if (over) { reset(); return; } if (!run) { run = true; loop(); } v = -6.2; }
  function draw() {
    x.clearRect(0, 0, W, H); x.fillStyle = "#1b1a28"; x.strokeStyle = "#ffd400"; x.lineWidth = 2;
    pipes.forEach(p => { x.fillRect(p.x, 0, 46, p.g); x.strokeRect(p.x, -2, 46, p.g + 2); x.fillRect(p.x, p.g + 120, 46, H); x.strokeRect(p.x, p.g + 120, 46, H); });
    x.font = "26px serif"; x.textAlign = "center"; noodles.forEach(n => x.fillText("🍜", n.x, n.y));
    x.save(); x.translate(60, y); x.rotate(Math.max(-.5, Math.min(.8, v / 10))); x.font = "32px serif"; x.fillText("🦇", 0, 10); x.restore();
  }
  function loop() {
    if (!run) return; t++; v += .32; y += v;
    if (t % 90 === 1) { const g = 60 + Math.random() * (H - 240); pipes.push({ x: W, g, s: false }); if (Math.random() < .5) noodles.push({ x: W + 23, y: g + 60 }); }
    pipes.forEach(p => p.x -= 2.2); noodles.forEach(n => n.x -= 2.2);
    pipes = pipes.filter(p => p.x > -50); noodles = noodles.filter(n => n.x > -20);
    pipes.forEach(p => { if (!p.s && p.x + 46 < 60) { p.s = true; score++; }
      if (72 > p.x && 48 < p.x + 46 && (y - 12 < p.g || y + 12 > p.g + 120)) over = true; });
    noodles = noodles.filter(n => { if (Math.hypot(n.x - 60, n.y - y) < 24) { score += 2; return false; } return true; });
    if (y > H || y < 0) over = true;
    draw(); sc.textContent = `score ${score} · best ${best()}`;
    if (over) { run = false; try { if (score > best()) localStorage.flapBest = score; } catch (e) {} sc.textContent = `Crashed at ${score}. Best ${best()}. Tap to retry`; return; }
    requestAnimationFrame(loop);
  }
  c.addEventListener("pointerdown", e => { e.preventDefault(); flap(); });
  c.addEventListener("keydown", e => { if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); flap(); } });
  reset();
})();

// Game 2: clear the rooftops
(() => {
  const g = document.getElementById("roofs"), s = document.getElementById("wscore"), b = document.getElementById("wgo");
  const cells = [...Array(9)].map(() => { const e = document.createElement("button"); e.className = "roof"; e.setAttribute("aria-label", "Rooftop"); g.append(e); return e; });
  let score = 0, time = 0, tm, sp, run = false;
  const best = () => { try { return +localStorage.roofBest || 0; } catch (e) { return 0; } };
  const clear = e => { delete e.dataset.on; e.textContent = ""; };
  const show = () => { s.textContent = `${score} caught · ${time}s left · best ${best()}`; };
  cells.forEach(e => e.onclick = () => { if (!run || !e.dataset.on) return; score = Math.max(0, score + (e.dataset.on === "b" ? 1 : -2)); clear(e); show(); });
  function pop() { const e = cells[Math.random() * 9 | 0]; if (e.dataset.on) return; const bad = Math.random() < .78; e.dataset.on = bad ? "b" : "g"; e.textContent = bad ? "🦹" : "🐈"; setTimeout(() => clear(e), 750); }
  b.onclick = () => {
    clearInterval(tm); clearInterval(sp); cells.forEach(clear); score = 0; time = 30; run = true; b.textContent = "Restart"; show();
    sp = setInterval(pop, 520);
    tm = setInterval(() => { time--; show(); if (time <= 0) { run = false; clearInterval(tm); clearInterval(sp); cells.forEach(clear);
      try { if (score > best()) localStorage.roofBest = score; } catch (e) {} s.textContent = `Time! ${score} caught. Best ${best()}.`; b.textContent = "Play again"; } }, 1000);
  };
})();

// Bats on click (Gotham mode) + good vibes
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
function bats(n, cx, cy, html) {
  if (reduce) return;
  for (let k = 0; k < n; k++) {
    const s = document.createElement("span"); s.className = "fb";
    s.innerHTML = html || '<svg viewBox="0 0 100 50"><use href="#bat"/></svg>';
    s.style.cssText = `left:${cx}px;top:${cy}px;--dx:${(Math.random() - .5) * 600}px;--dy:${-100 - Math.random() * 400}px;--r:${(Math.random() - .5) * 60}deg;width:${html ? 24 : 24 + Math.random() * 30}px;font-size:${24 + Math.random() * 16}px`;
    document.body.append(s); setTimeout(() => s.remove(), 1700);
  }
}
addEventListener("click", e => { if (e.target.closest("canvas,.modes,.batbtn")) return; if (body.classList.contains("gotham")) bats(4, e.clientX, e.clientY); else if (body.classList.contains("spidey")) bats(4, e.clientX, e.clientY, "🕷️"); });
document.getElementById("love").onclick = e => { const r = e.target.getBoundingClientRect(); bats(10, r.left + r.width / 2, r.top, "💛"); };

// count-up stats
const nums = document.querySelectorAll("[data-n]");
const cio = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; cio.unobserve(en.target);
  const el = en.target, n = +el.dataset.n, suf = el.dataset.suf || ""; let k = 0;
  if (reduce) { el.textContent = n + suf; return; }
  const id = setInterval(() => { k = Math.min(n, k + Math.ceil(n / 40)); el.textContent = k + (k === n ? suf : ""); if (k === n) clearInterval(id); }, 30); }), { threshold: .6 });
nums.forEach(n => cio.observe(n));

// Photo pile. Run optimize-photos.py first (creates photos/N.jpg and photos/t/N.jpg), then set COUNT.
const COUNT = 24, SHOW = 9;
const PHOTOS = Array.from({ length: COUNT }, (_, i) => ({ src: `photos/${i + 1}.jpeg`, thumb: `photos/t/${i + 1}.jpg`, cap: `Snap ${i + 1}` }));
(() => {
  const pile = document.getElementById("pile"), dlg = document.getElementById("dlg"), big = dlg.querySelector("img"), cap = dlg.querySelector("p");
  let z = 1, cur = 0, moved = false;
  function load(img, list) { let k = 0; const next = () => { if (k >= list.length) { img.onerror = null; img.src = "placeholder.svg"; return; } img.src = list[k++]; }; img.onerror = next; next(); }
  function open(i) {
    cur = (i + COUNT) % COUNT; big.alt = PHOTOS[cur].cap; cap.textContent = `${PHOTOS[cur].cap} · ${cur + 1} / ${COUNT}`;
    load(big, [PHOTOS[cur].src, PHOTOS[cur].thumb]); if (!dlg.open) dlg.showModal();
  }
  const cards = Array.from({ length: Math.min(SHOW, COUNT) }, () => {
    const f = document.createElement("figure"); f.className = "snap"; f.tabIndex = 0; f.setAttribute("role", "button");
    f.innerHTML = '<img alt="" loading="lazy" decoding="async"><figcaption></figcaption>';
    const im = f.querySelector("img"); im.onload = () => f.classList.toggle("land", im.naturalWidth > im.naturalHeight);
    ["pointerenter", "focus"].forEach(ev => f.addEventListener(ev, () => f.classList.add("dev")));
    f.onclick = () => { if (!moved) open(+f.dataset.i); };
    f.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(+f.dataset.i); } };
    f.onpointerdown = e => {
      f.style.zIndex = ++z; moved = false;
      if (e.pointerType !== "mouse") return;
      const sx = e.clientX, sy = e.clientY, ol = f.offsetLeft, ot = f.offsetTop; f.setPointerCapture(e.pointerId);
      f.onpointermove = m => { if (Math.hypot(m.clientX - sx, m.clientY - sy) > 5) { moved = true; f.classList.add("drag"); }
        if (moved) { f.style.left = Math.min(pile.clientWidth - f.offsetWidth, Math.max(0, ol + m.clientX - sx)) + "px"; f.style.top = Math.min(pile.clientHeight - f.offsetHeight, Math.max(0, ot + m.clientY - sy)) + "px"; } };
      f.onpointerup = () => { f.onpointermove = f.onpointerup = null; f.classList.remove("drag"); setTimeout(() => moved = false, 0); };
    };
    pile.append(f); return f;
  });
  function deal() {
    const idx = [...Array(COUNT).keys()].sort(() => Math.random() - .5);
    cards.forEach((f, n) => { const i = idx[n]; f.dataset.i = i; f.classList.remove("dev", "land"); f.setAttribute("aria-label", "Open " + PHOTOS[i].cap);
      f.querySelector("figcaption").textContent = PHOTOS[i].cap; load(f.querySelector("img"), [PHOTOS[i].thumb, PHOTOS[i].src]); });
    cards.forEach(f => { f.style.left = Math.random() * Math.max(0, pile.clientWidth - f.offsetWidth) + "px"; f.style.top = Math.random() * Math.max(0, pile.clientHeight - f.offsetHeight) + "px"; f.style.transform = `rotate(${Math.random() * 24 - 12}deg)`; });
  }
  deal();
  document.getElementById("toss").onclick = deal;
  document.getElementById("dc").onclick = () => dlg.close();
  document.getElementById("dp").onclick = () => open(cur - 1);
  document.getElementById("dn").onclick = () => open(cur + 1);
  dlg.onclick = e => { if (e.target === dlg) dlg.close(); };
  dlg.onkeydown = e => { if (e.key === "ArrowLeft") open(cur - 1); if (e.key === "ArrowRight") open(cur + 1); };
})();

// copy email, rotating intro line
document.getElementById("copy").onclick = () => { const t = "surendernadar3@gmail.com";
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => say("Email copied ✨"), () => say(t)); };
const rot = document.getElementById("rot"), R = ["an introvert with a corporate extrovert mode", "a food explorer", "a movies and songs person", "a Batman and Spider-Man fan", "a weekend temple-goer", "a phone-call person"]; let ri = 0;
if (!reduce) setInterval(() => { ri = (ri + 1) % R.length; rot.style.opacity = 0; setTimeout(() => { rot.textContent = R[ri]; rot.style.opacity = 1; }, 250); }, 2600);

// achievements, periodic table, dish roulette
document.querySelectorAll(".ach").forEach(b => b.onclick = () => { const r = b.getBoundingClientRect(); say("🏆 Achievement unlocked: " + b.textContent); bats(8, r.left + r.width / 2, r.top, "🏆"); });
(() => {
  const D = ["🍛 Pav bhaji", "🥞 Masala dosa", "🍚 Biryani", "🍜 Ramen", "🍝 Pasta", "🥟 Momos", "🌮 Tacos", "🍣 Sushi", "🥙 Falafel wrap", "🍲 Pho", "🍱 Bibimbap", "🍢 Vada pav", "🥘 Gujarati thali", "🍖 Rogan josh", "🍗 Chettinad chicken", "🥥 Appam with stew", "🍕 Wood-fired pizza", "🍔 A really good burger"];
  const pick = document.getElementById("pick"), cnt = document.getElementById("dcount"); let n = 0, busy = false;
  const r = () => D[Math.random() * D.length | 0];
  document.getElementById("spin").onclick = () => {
    if (busy) return; n++; busy = true; let t = 0;
    const id = setInterval(() => { pick.textContent = r(); if (reduce || ++t > 8) { clearInterval(id); busy = false; cnt.textContent = `${n} spin${n > 1 ? "s" : ""}. New cuisine unlocked?`; } }, 70);
  };
})();

// Suri radar
(() => {
  const D = {
    li: ["🤝 LinkedIn", "Send me a connection request. This is the best place to find me.", LINKS.linkedin, "Open LinkedIn"],
    x: ["𝕏 (formerly Twitter)", "Say hi on X. I'm here too.", LINKS.x, "Open X"],
    ph: ["📞 Phone", "Just call me: +91 70451 64903", "tel:+917045164903", "Call now"],
    wa: ["💬 WhatsApp", "Barely active there. Don't wait for a reply.", "", ""],
    ip: ["🦇🕷️ In person", "Legendary sighting. My friends spot me on the street once or twice a year. I'm Batman. Or Spider-Man. Can't say.", "", ""],
    ig: ["📷 Instagram", "No signal. Please don't reach out there. I haven't used it in years.", "", ""]
  };
  const t = document.getElementById("rdt"), p = document.getElementById("rdp"), a = document.getElementById("rda"), blips = document.querySelectorAll(".blip");
  function show(k) {
    const [title, text, link, label] = D[k]; t.textContent = title; p.textContent = text;
    a.hidden = !link; if (link) { a.href = link; a.textContent = label; if (!link.startsWith("tel:")) { a.target = "_blank"; a.rel = "noopener"; } else { a.removeAttribute("target"); } }
    blips.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.k === k)));
  }
  document.querySelectorAll("[data-k]").forEach(b => b.onclick = () => show(b.dataset.k));
  show("li");
})();

// roaming characters
document.querySelectorAll(".wk,.peek").forEach(b => b.onclick = () => { const s = b.firstElementChild; s.classList.remove("hop"); void s.offsetWidth; s.classList.add("hop"); say(b.dataset.q); });

// mini page builder
(() => {
  const pg = document.getElementById("pg"), flow = [...document.querySelectorAll("#flow li")], msg = document.getElementById("pubmsg"), pub = document.getElementById("pub");
  const T = {
    hero: '<div class="blk k-hero"><small>Hero</small><i style="width:70%"></i><i style="width:45%"></i></div>',
    teaser: '<div class="blk k-teaser"><span></span><div><small>Teaser</small><i style="width:80%"></i><i style="width:55%"></i></div></div>',
    form: '<div class="blk k-form"><small>Form</small><i style="width:100%"></i><i style="width:100%"></i><u>Submit</u></div>',
    cards: '<div class="blk k-cards"><small>Cards</small><div><s></s><s></s><s></s></div></div>',
    chart: '<div class="blk k-chart"><small>Chart</small><div><s style="height:30%"></s><s style="height:60%"></s><s style="height:45%"></s><s style="height:85%"></s></div></div>',
    footer: '<div class="blk k-footer"><small>Footer</small></div>' };
  let list = [], busy = false;
  const render = () => { pg.innerHTML = list.length ? list.map(k => T[k]).join("") : '<p class="empty">Your page is empty. Add components 👆</p>'; };
  const reset = () => { flow.forEach(li => li.className = ""); msg.textContent = ""; };
  document.querySelectorAll("[data-b]").forEach(b => b.onclick = () => { if (busy || list.length >= 8) return; list.push(b.dataset.b); render(); reset(); });
  document.getElementById("undo").onclick = () => { if (busy) return; list.pop(); render(); reset(); };
  function done() {
    busy = false; const all = new Set(list).size === 6;
    msg.textContent = all ? "Live! Yeah, science! 🧪 Every component used." : !list.includes("hero") ? "Live! No hero though. Brave. 🎉" : "Live! Published. 🎉";
    const r = pub.getBoundingClientRect(); bats(10, r.left + r.width / 2, r.top, "🎉");
  }
  pub.onclick = () => {
    if (busy) return; reset();
    if (!list.length) { msg.textContent = "Add something first. Even I can't publish air. 😄"; return; }
    busy = true; flow.forEach((li, n) => setTimeout(() => { li.className = "on"; if (n === flow.length - 1) done(); }, reduce ? 0 : 650 * (n + 1)));
  };
  render();
})();
