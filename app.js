/* SosaWraps — one script for both pages. No build step, no dependencies. */

// ── SET THIS ────────────────────────────────────────────────
// The shop's number, in +1XXXXXXXXXX form. Left empty, the quote form copies
// the request to the clipboard and opens the Instagram DM instead.
const SHOP_PHONE = "";
const SHOP_IG = "https://ig.me/m/sosawraps";
// ────────────────────────────────────────────────────────────

/* The work grid reads from here. `src` is an image; add `video` to the same
   entry and the tile plays it in the lightbox instead. Drop new files in
   images/work (and video/work) and add a line — nothing else to touch. */
const WORK = [
  { src: "images/work/m3-tint.jpg",      title: "BMW M3 Competition", sub: "20% ceramic — sides & back" },
  { src: "images/work/camaro-satin.jpg", title: "Chevrolet Camaro",   sub: "Satin Black — full wrap" },
  { src: "images/work/c8-side.jpg",      title: "C8 Corvette",        sub: "Satin Black",              video: "video/work/c8-side.mp4" },
  { src: "images/work/camry-red.jpg",    title: "Toyota Camry",       sub: "Velvet Gloss Red — hood",  video: "video/work/camry-red.mp4" },
];

// how many empty 9:16 slots to draw while WORK is empty
const SLOTS = 4;

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, props) => Object.assign(document.createElement(tag), props);

const yr = $("#yr");
if (yr) yr.textContent = new Date().getFullYear();

/* ── dust ───────────────────────────────────────────────
   Seeded rather than tiled, so the field never reads as a
   pattern. Count follows the viewport — a phone doesn't get a
   desktop's worth of animated nodes. */
const dust = $("#dust");
if (dust && !reduced) {
  const TINT = [["#ffffff", 52], ["#ffd9df", 26], ["#ff8296", 22]];
  const tint = () => {
    let r = Math.random() * 100;
    for (const [hex, w] of TINT) if ((r -= w) <= 0) return hex;
    return TINT[0][0];
  };
  const n = Math.round(Math.min(220, Math.max(60, (innerWidth * innerHeight) / 6000)));
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const mote = el("i");
    const size = Math.random();
    mote.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    mote.style.top = `${(Math.random() * 100).toFixed(2)}%`; // field is 200% tall, so this is the top half
    mote.style.setProperty("--s", `${(size * 1.5 + 0.7).toFixed(1)}px`);
    mote.style.setProperty("--c", tint());
    mote.style.setProperty("--o", (0.18 + size * 0.34).toFixed(2)); // bigger ones sit closer
    mote.style.setProperty("--t", `${(4 + Math.random() * 7).toFixed(1)}s`);
    mote.style.setProperty("--d", `${(Math.random() * 8).toFixed(2)}s`);
    frag.append(mote);
  }
  dust.append(frag);
}

/* ── nav goes solid once you leave the hero ─────────────── */
const nav = $("#nav");
if (nav) {
  const onScroll = () => (nav.dataset.stuck = String(scrollY > 40));
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── scroll reveal ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries, obs) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      obs.unobserve(e.target);
    }),
  { rootMargin: "0px 0px -10% 0px" }
);
$$("[data-reveal]").forEach((n) => revealObserver.observe(n));

/* ── autoplay, but only while it's on screen ────────────
   Safari checks muted and playsInline as properties, not only as attributes,
   before it will autoplay. Nothing loads or decodes until it scrolls into
   view, so four videos on one page cost about as much as one. */
const rollWhenSeen = (v) => {
  v.muted = true;
  v.playsInline = true;
  const roll = () => {
    if (v.preload === "none") v.preload = "auto", v.load();
    v.play().catch(() => {});
  };
  new IntersectionObserver(([e]) => (e.isIntersecting ? roll() : v.pause()), { threshold: 0.15 }).observe(v);
};

const heroVideo = $(".hero__video");
if (heroVideo && !reduced) rollWhenSeen(heroVideo);
else if (heroVideo) {
  heroVideo.removeAttribute("autoplay");
  heroVideo.pause();
}

/* ── work grid + lightbox ───────────────────────────────── */
const grid = $("#work-grid");
if (grid) {
  // nothing in WORK yet — draw empty slots so the layout is there to fill
  if (!WORK.length) {
    grid.append(...Array.from({ length: SLOTS }, () => el("div", { className: "tile--slot" })));
  } else {
    grid.append(
      ...WORK.map((w, i) => {
        const b = el("button", { className: "tile", type: "button" });
        b.dataset.i = String(i);
        if (w.video && !reduced) {
          const v = el("video", { src: w.video, poster: w.src, muted: true, loop: true, playsInline: true, preload: "none" });
          v.setAttribute("aria-hidden", "true");
          b.append(v);
          rollWhenSeen(v); // only decodes while it's on screen
        } else {
          b.append(el("img", { src: w.src, alt: `${w.title} — ${w.sub}`, loading: i < 2 ? "eager" : "lazy", width: 720, height: 1280 }));
        }
        const cap = el("span", { className: "tile__cap", textContent: w.title });
        cap.append(el("small", { textContent: w.sub }));
        b.append(cap);
        return b;
      })
    );

    const lb = $("#lb"), lbImg = $("#lbImg"), lbVideo = $("#lbVideo"), lbCap = $("#lbCap");

    grid.addEventListener("click", (ev) => {
      const tile = ev.target.closest(".tile");
      if (!tile) return;
      const w = WORK[+tile.dataset.i];
      lbCap.textContent = `${w.title} · ${w.sub}`;
      if (w.video) {
        lbImg.hidden = true;
        lbVideo.hidden = false;
        lbVideo.src = w.video;
        lbVideo.poster = w.src;
        lbVideo.play().catch(() => {});
      } else {
        lbVideo.hidden = true;
        lbVideo.removeAttribute("src");
        lbImg.hidden = false;
        lbImg.src = w.src;
        lbImg.alt = `${w.title} — ${w.sub}`;
      }
      lb.showModal();
    });

    const shut = () => {
      lbVideo.pause();
      lbVideo.removeAttribute("src");
      lb.close();
    };
    $("#lbClose").addEventListener("click", shut);
    lb.addEventListener("close", () => { lbVideo.pause(); lbVideo.removeAttribute("src"); });
    lb.addEventListener("click", (ev) => { if (ev.target === lb) shut(); });
  }
}

/* ── quote form (book.html) ─────────────────────────────── */
const form = $("#quote");
if (form) {
  const status = $("#status"), send = $("#send");
  const val = (n) => (form.elements[n]?.value || "").trim();
  const picked = (n) => $$(`input[name="${n}"]:checked`, form).map((i) => i.value);

  const fail = (msg, focus) => {
    status.dataset.err = "true";
    status.textContent = msg;
    focus?.focus();
    return false;
  };

  // what actually gets sent — one flat list, so the email reads like a work order
  const details = () => {
    const veh = [val("year"), val("make"), val("model")].filter(Boolean).join(" ");
    return [
      ["Name", val("name")],
      ["Phone", val("phone")],
      ["Email", val("email")],
      ["Instagram", val("ig")],
      ["Vehicle", veh],
      ["Wants", picked("service").join(", ")],
      ["Finish", val("finish")],
      ["Color", val("color")],
      ["Timing", val("when")],
      ["Notes", val("notes")],
    ].filter(([, v]) => v);
  };

  const done = () => {
    form.hidden = true;
    $(".bookhead").hidden = true;
    const box = $("#done");
    box.hidden = false;
    const h = box.querySelector("h2");
    h.tabIndex = -1;
    h.focus({ preventScroll: true });
    scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (val("website")) return; // honeypot: bots fill it, people can't see it

    if (!val("name")) return fail("We need a name to put on the quote.", form.elements.name);
    if (!val("phone") && !val("email") && !val("ig"))
      return fail("Leave one way to reach you — phone, email or Instagram.", form.elements.phone);
    if (!picked("service").length) return fail("Tick at least one thing you want done.", $('input[name="service"]', form));
    status.dataset.err = "false";

    const rows = details();
    const msg = [`Quote request — ${val("name")}`, ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n");

    send.classList.add("is-sending");
    status.textContent = "Sending…";

    /* If this build is ever put behind a CRM, /api/book is where it goes.
       Until then the POST 404s and everything below is the real path — the
       request still reaches the shop rather than dying on the floor. */
    try {
      const r = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: val("name"), email: val("email"), website: val("website"), rows }),
      });
      if (r.ok) {
        send.classList.remove("is-sending");
        status.textContent = "";
        return done();
      }
    } catch {
      /* offline, or no endpoint — fall through to the handoff below */
    }
    send.classList.remove("is-sending");

    if (SHOP_PHONE) {
      const sep = /iPhone|iPad|Mac/.test(navigator.userAgent) ? "&" : "?";
      location.href = `sms:${SHOP_PHONE}${sep}body=${encodeURIComponent(msg)}`;
      status.textContent = "Opening your messages — hit send to finish.";
      return done();
    }

    try {
      await navigator.clipboard.writeText(msg);
      status.textContent = "Copied — paste it into the DM that just opened.";
    } catch {
      status.textContent = "Opening Instagram — send us your details in the DM.";
    }
    open(SHOP_IG, "_blank", "noopener");
    done();
  });
}
