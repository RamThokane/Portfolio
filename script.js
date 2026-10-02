/* Ram Thokane — portfolio scripts */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const isDark = () => {
    const set = root.getAttribute('data-theme');
    return set ? set === 'dark' : darkQuery.matches;
  };
  const syncThemeBtn = () => {
    themeBtn.classList.toggle('is-dark', isDark());
    themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  };
  themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    syncThemeBtn();
    readColors();
  });
  darkQuery.addEventListener?.('change', () => { syncThemeBtn(); readColors(); });
  syncThemeBtn();

  /* ---------- Hero dot field ---------- */
  const canvas = document.getElementById('field');
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let dots = [];
  let W = 0, H = 0, dpr = 1;
  let colDot = '#c3c7cf', colAccent = '#2b44ff';
  const mouse = { x: -9999, y: -9999, active: false };
  let running = false;
  let t0 = performance.now();

  function readColors() {
    const cs = getComputedStyle(root);
    colDot = cs.getPropertyValue('--dot').trim() || colDot;
    colAccent = cs.getPropertyValue('--accent').trim() || colAccent;
    if (reduceMotion) draw(performance.now());
  }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = W < 600 ? 22 : 28;
    const cols = Math.ceil(W / gap) + 1;
    const rows = Math.ceil(H / gap) + 1;
    const ox = (W - (cols - 1) * gap) / 2;
    const oy = (H - (rows - 1) * gap) / 2;
    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ bx: ox + c * gap, by: oy + r * gap, dx: 0, dy: 0, k: 0 });
      }
    }
  }

  function draw(now) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);

    // Where the "attention" is: the cursor, or a slow wandering point when idle
    let fx, fy, radius, push;
    if (mouse.active) {
      fx = mouse.x; fy = mouse.y; radius = 150; push = 26;
    } else {
      fx = W * (0.62 + 0.25 * Math.sin(t * 0.35));
      fy = H * (0.5 + 0.3 * Math.sin(t * 0.52 + 1.2));
      radius = Math.min(W, H) * 0.32; push = 14;
    }

    for (const d of dots) {
      const vx = d.bx - fx;
      const vy = d.by - fy;
      const dist = Math.hypot(vx, vy);
      let tx = 0, ty = 0, tk = 0;
      if (dist < radius) {
        const f = 1 - dist / radius;
        const s = f * f * push / (dist || 1);
        tx = vx * s; ty = vy * s; tk = f;
      }
      // ease toward the target so the field feels like it has weight
      d.dx += (tx - d.dx) * 0.12;
      d.dy += (ty - d.dy) * 0.12;
      d.k += (tk - d.k) * 0.12;

      const x = d.bx + d.dx;
      const y = d.by + d.dy;
      const r = 1.2 + d.k * 1.9;
      ctx.globalAlpha = 1;
      ctx.fillStyle = d.k > 0.08 ? colAccent : colDot;
      if (d.k > 0.08) ctx.globalAlpha = Math.min(1, 0.25 + d.k * 1.1);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    if (!running) return;
    draw(now);
    requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    requestAnimationFrame(loop);
  }

  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  hero.addEventListener('pointerleave', () => { mouse.active = false; });

  // only animate while the hero is on screen
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start();
    else running = false;
  }).observe(hero);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { build(); if (reduceMotion) draw(performance.now()); }, 150);
  });

  build();
  readColors();
  if (reduceMotion) draw(performance.now());

  /* ---------- Mumbai clock ---------- */
  const clock = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true
  });
  const tick = () => { clock.textContent = fmt.format(new Date()).toUpperCase(); };
  tick();
  setInterval(tick, 15000);

  /* ---------- Nav ---------- */
  const nav = document.querySelector('.nav');
  const navLinks = [...document.querySelectorAll('.nav nav a')];
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById('copyBtn');
  const mail = document.getElementById('mail');
  copyBtn.addEventListener('click', () => {
    const done = () => {
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 1800);
    };
    const fallback = () => {
      const range = document.createRange();
      range.selectNodeContents(mail);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyBtn.textContent = 'Selected, press Ctrl+C';
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(mail.textContent.trim()).then(done, fallback);
    } else {
      fallback();
    }
  });
})();
