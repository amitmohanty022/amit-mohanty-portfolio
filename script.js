(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- custom cursor ---------- */
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  (function follow() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();
  document.querySelectorAll("a, button, .reaction, .gallery, input, #sketch").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  /* ---------- scroll progress ---------- */
  const progress = document.getElementById("progress");
  addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.08 + "s";
    io.observe(el);
  });

  /* ---------- typing text ---------- */
  const words = ["artist.", "athlete.", "creator.", "always training."];
  const typed = document.getElementById("typed");
  let w = 0, c = 0, del = false;
  (function type() {
    const word = words[w];
    typed.textContent = word.slice(0, c);
    if (!del && c < word.length) c++;
    else if (del && c > 0) c--;
    else if (!del) { del = true; return setTimeout(type, 1500); }
    else { del = false; w = (w + 1) % words.length; }
    setTimeout(type, del ? 45 : 95);
  })();

  /* ---------- glitch on load ---------- */
  const glitch = document.querySelector(".glitch");
  glitch.classList.add("active");
  setTimeout(() => glitch.classList.remove("active"), 700);

  /* ---------- magnetic elements ---------- */
  if (finePointer) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .4s cubic-bezier(.2,.8,.2,1)";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 400);
      });
    });
  }

  /* ---------- tilt cards ---------- */
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.transform = `perspective(700px) rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });

  /* ---------- hero particles ---------- */
  const pc = document.getElementById("particles");
  const pctx = pc.getContext("2d");
  let parts = [], sparks = [], pw, ph;
  const mouse = { x: -9999, y: -9999 };
  function sizeParticles() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    pw = pc.offsetWidth; ph = pc.offsetHeight;
    pc.width = pw * dpr; pc.height = ph * dpr;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(110, Math.floor((pw * ph) / 14000));
    parts = Array.from({ length: n }, () => ({
      x: rand(0, pw), y: rand(0, ph), vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3), r: rand(1, 2.2),
    }));
  }
  sizeParticles();
  addEventListener("resize", sizeParticles);
  const hero = document.querySelector(".hero");
  hero.addEventListener("mousemove", (e) => {
    const r = pc.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });
  hero.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const r = pc.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    for (let i = 0; i < 40; i++) {
      const a = rand(0, Math.PI * 2), s = rand(1, 6);
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hue: Math.random() < 0.5 ? "198,255,61" : "124,92,255" });
    }
  });
  function drawParticles() {
    pctx.clearRect(0, 0, pw, ph);
    for (const p of parts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140 && d > 0) { p.vx += (dx / d) * 0.35; p.vy += (dy / d) * 0.35; }
      p.vx *= 0.97; p.vy *= 0.97;
      p.vx += rand(-0.02, 0.02); p.vy += rand(-0.02, 0.02);
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = pw; if (p.x > pw) p.x = 0;
      if (p.y < 0) p.y = ph; if (p.y > ph) p.y = 0;
    }
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          pctx.strokeStyle = `rgba(245,245,245,${(1 - d / 120) * 0.15})`;
          pctx.beginPath(); pctx.moveTo(a.x, a.y); pctx.lineTo(b.x, b.y); pctx.stroke();
        }
      }
      const md = Math.hypot(parts[i].x - mouse.x, parts[i].y - mouse.y);
      if (md < 200) {
        pctx.strokeStyle = `rgba(198,255,61,${(1 - md / 200) * 0.5})`;
        pctx.beginPath(); pctx.moveTo(parts[i].x, parts[i].y); pctx.lineTo(mouse.x, mouse.y); pctx.stroke();
      }
    }
    pctx.fillStyle = "rgba(245,245,245,.7)";
    for (const p of parts) { pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); pctx.fill(); }
    sparks = sparks.filter((s) => s.life > 0);
    for (const s of sparks) {
      s.x += s.vx; s.y += s.vy; s.vx *= 0.95; s.vy *= 0.95; s.vy += 0.05; s.life -= 0.02;
      pctx.fillStyle = `rgba(${s.hue},${s.life})`;
      pctx.beginPath(); pctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2); pctx.fill();
    }
    requestAnimationFrame(drawParticles);
  }
  if (!reduceMotion) drawParticles();

  /* ---------- sketch pad ---------- */
  const sk = document.getElementById("sketch");
  const sctx = sk.getContext("2d");
  let color = "#f5f5f5", brush = 6, mirror = false, drawing = false, last = null, hue = 0;
  function sizeSketch() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const saved = sk.width ? sctx.getImageData(0, 0, sk.width, sk.height) : null;
    sk.width = sk.offsetWidth * dpr; sk.height = sk.offsetHeight * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.lineCap = "round"; sctx.lineJoin = "round";
    if (saved) sctx.putImageData(saved, 0, 0);
  }
  sizeSketch();
  addEventListener("resize", sizeSketch);

  const pos = (e) => { const r = sk.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function stroke(a, b) {
    const col = color === "rainbow" ? `hsl(${(hue += 3) % 360},90%,60%)` : color;
    sctx.strokeStyle = col; sctx.lineWidth = brush;
    sctx.beginPath(); sctx.moveTo(a.x, a.y); sctx.lineTo(b.x, b.y); sctx.stroke();
    if (mirror) {
      const W = sk.offsetWidth;
      sctx.beginPath(); sctx.moveTo(W - a.x, a.y); sctx.lineTo(W - b.x, b.y); sctx.stroke();
    }
  }
  sk.addEventListener("pointerdown", (e) => { drawing = true; last = pos(e); sk.setPointerCapture(e.pointerId); stroke(last, last); });
  sk.addEventListener("pointermove", (e) => { if (!drawing) return; const p = pos(e); stroke(last, p); last = p; });
  ["pointerup", "pointercancel"].forEach((ev) => sk.addEventListener(ev, () => (drawing = false)));

  document.querySelectorAll(".swatch").forEach((s) => s.addEventListener("click", () => {
    document.querySelector(".swatch.active")?.classList.remove("active");
    s.classList.add("active"); color = s.dataset.color;
  }));
  document.getElementById("brush").addEventListener("input", (e) => (brush = +e.target.value));
  const mirrorBtn = document.getElementById("mirror");
  mirrorBtn.addEventListener("click", () => {
    mirror = !mirror; mirrorBtn.textContent = `mirror: ${mirror ? "on" : "off"}`; mirrorBtn.classList.toggle("on", mirror);
  });
  document.getElementById("clear").addEventListener("click", () => sctx.clearRect(0, 0, sk.width, sk.height));
  document.getElementById("save").addEventListener("click", () => {
    const out = document.createElement("canvas");
    out.width = sk.width; out.height = sk.height;
    const o = out.getContext("2d");
    o.fillStyle = "#0a0a0b"; o.fillRect(0, 0, out.width, out.height); o.drawImage(sk, 0, 0);
    const a = document.createElement("a");
    a.download = "my-drawing.png"; a.href = out.toDataURL("image/png"); a.click();
  });

  /* ---------- generative gallery ---------- */
  const palette = ["#c6ff3d", "#7c5cff", "#ff4d6d", "#3dd6ff", "#f5f5f5"];
  const pick = () => palette[Math.floor(Math.random() * palette.length)];
  const styles = [
    function circles(g, S) {
      for (let i = 0; i < 9; i++) {
        g.strokeStyle = pick(); g.lineWidth = rand(1, 4);
        g.beginPath(); g.arc(rand(S * .2, S * .8), rand(S * .2, S * .8), rand(10, S * .4), 0, Math.PI * 2); g.stroke();
      }
    },
    function flow(g, S) {
      const f = rand(0.005, 0.02), col = pick();
      for (let i = 0; i < 260; i++) {
        let x = rand(0, S), y = rand(0, S);
        g.strokeStyle = col; g.globalAlpha = 0.35; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x, y);
        for (let k = 0; k < 30; k++) {
          const a = (Math.sin(x * f) + Math.cos(y * f)) * Math.PI;
          x += Math.cos(a) * 3; y += Math.sin(a) * 3; g.lineTo(x, y);
        }
        g.stroke();
      }
      g.globalAlpha = 1;
    },
    function grid(g, S) {
      const n = 6, s = S / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        g.strokeStyle = Math.random() < 0.15 ? "#c6ff3d" : "#f5f5f5"; g.lineWidth = 2;
        g.beginPath();
        if (Math.random() < 0.5) { g.moveTo(i * s, j * s); g.lineTo(i * s + s, j * s + s); }
        else { g.moveTo(i * s + s, j * s); g.lineTo(i * s, j * s + s); }
        g.stroke();
      }
    },
    function blocks(g, S) {
      for (let i = 0; i < 7; i++) {
        g.fillStyle = pick(); g.globalAlpha = rand(0.5, 1);
        g.fillRect(rand(0, S * .8), rand(0, S * .8), rand(20, S * .5), rand(4, S * .3));
      }
      g.globalAlpha = 1;
    },
    function rays(g, S) {
      const cx = S / 2, cy = S / 2, col = pick();
      for (let i = 0; i < 90; i++) {
        const a = (i / 90) * Math.PI * 2, r = rand(S * .15, S * .48);
        g.strokeStyle = i % 9 === 0 ? col : "rgba(245,245,245,.5)";
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.stroke();
      }
    },
    function waves(g, S) {
      for (let k = 0; k < 14; k++) {
        g.strokeStyle = k % 4 === 0 ? pick() : "rgba(245,245,245,.6)"; g.lineWidth = 1.5;
        const amp = rand(5, 25), fr = rand(0.01, 0.05), ph = rand(0, 6);
        g.beginPath();
        for (let x = 0; x <= S; x += 4) g.lineTo(x, (k + 1) * (S / 15) + Math.sin(x * fr + ph) * amp);
        g.stroke();
      }
    },
  ];
  const gallery = document.getElementById("gallery");
  function paint(cv, i) {
    const S = 400, g = cv.getContext("2d");
    cv.width = cv.height = S;
    g.fillStyle = "#0e0e10"; g.fillRect(0, 0, S, S);
    styles[i % styles.length](g, S);
  }
  styles.forEach((_, i) => {
    const cv = document.createElement("canvas");
    cv.className = "reveal"; cv.title = "Click to regenerate";
    paint(cv, i);
    cv.addEventListener("click", () => paint(cv, i));
    cv.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    cv.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    gallery.appendChild(cv);
    io.observe(cv);
  });

  /* ---------- reaction test ---------- */
  const box = document.getElementById("reaction");
  const rTitle = document.getElementById("rTitle"), rSub = document.getElementById("rSub");
  let state = "idle", timer, startT;
  let best = +localStorage.getItem("reactionBest") || 0;
  const showBest = () => (rSub.textContent = `best: ${best ? best + " ms" : "—"}`);
  showBest();
  function react() {
    if (state === "idle" || state === "done") {
      state = "wait"; box.className = "reaction wait";
      rTitle.textContent = "Wait for green..."; rSub.textContent = "don't click yet";
      timer = setTimeout(() => {
        state = "go"; box.className = "reaction go";
        rTitle.textContent = "CLICK!"; rSub.textContent = "now now now"; startT = performance.now();
      }, rand(1200, 3500));
    } else if (state === "wait") {
      clearTimeout(timer); state = "done"; box.className = "reaction";
      rTitle.textContent = "Too early!"; rSub.textContent = "click to try again";
    } else if (state === "go") {
      const t = Math.round(performance.now() - startT);
      state = "done"; box.className = "reaction";
      const verdict = t < 200 ? "Elite reflexes ⚡" : t < 260 ? "Athlete level 💪" : t < 350 ? "Solid. Keep training." : "Warm-up round?";
      if (!best || t < best) { best = t; localStorage.setItem("reactionBest", t); }
      rTitle.textContent = `${t} ms · ${verdict}`;
      rSub.textContent = `best: ${best} ms · click to go again`;
    }
  }
  box.addEventListener("pointerdown", react);
  box.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); react(); } });
})();
