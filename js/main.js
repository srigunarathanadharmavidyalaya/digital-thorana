document.getElementById('yr').textContent = new Date().getFullYear();

/* ── TWINKLE DOTS ── */
(function initDots() {
  const dots = 80;
  for (let i = 0; i < dots; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    const size = 1.5 + Math.random() * 2.5;
    dot.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      --dur:${0.5+Math.random()*1}s;
      animation-delay:${Math.random()*2}s;
    `;
    document.body.appendChild(dot);
  }
})();

/* ── PARTICLE SYSTEM ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, cx, cy;
  const PARTICLES = 120;
  const pool = [];

  const COLOURS = [
    'rgba(245,200,66,',
    'rgba(224,123,16,',
    'rgba(255,240,200,',
    'rgba(200,146,42,',
    'rgba(192,57,43,',
  ];

  /* ── mouse trail (PC only) ── */
  const trail = [];
  let mx = -999, my = -999, moved = false;
  const isDesktop = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktop) {
    document.addEventListener('mousemove', function(e) {
      mx = e.clientX; my = e.clientY; moved = true;
    });
  }

  /* ── click burst ── */
  const burst = [];
  document.addEventListener('click', function(e) {
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1.5 + Math.random() * 3;
      burst.push({
        x: e.clientX, y: e.clientY,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.5,
        size: 2 + Math.random() * 3,
        alpha: 1, decay: 0.02 + Math.random() * 0.025,
        colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      });
    }
  });

  /* ── photo click: rebound + ring particles ── */
  document.querySelectorAll('.photo-node').forEach(function(node) {
    node.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = rect.width / 2;
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8;
        const s = 2 + Math.random() * 3;
        burst.push({
          x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.3,
          size: 2 + Math.random() * 3,
          alpha: 1, decay: 0.018 + Math.random() * 0.02,
          colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
        });
      }
      this.classList.add('rebound');
      setTimeout(function() { window.location.href = href; }, 500);
    });
  });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
  }

  function spawn() {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: cx + Math.cos(angle) * (20 + Math.random() * 80),
      y: cy + Math.sin(angle) * (20 + Math.random() * 80),
      vx: Math.cos(angle) * (0.8 + Math.random() * 1.2),
      vy: Math.sin(angle) * (0.8 + Math.random() * 1.2) - (0.5 + Math.random() * 0.3),
      size: 1.5 + Math.random() * 3.5,
      colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      alpha: 0.4 + Math.random() * 0.6,
      decay: 0.004 + Math.random() * 0.006,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.08 + Math.random() * 0.12,
    };
  }

  for (let i = 0; i < PARTICLES; i++) pool.push(spawn());

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.colour + p.alpha + ')';
    ctx.fill();
    if (p.size > 3) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = p.colour + (p.alpha * 0.15) + ')';
      ctx.fill();
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    /* ambient pool */
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.4;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) { Object.assign(pool[i], spawn()); continue; }
      drawParticle(p);
    }

    /* mouse trail */
    if (isDesktop && moved) {
      moved = false;
      for (let i = 0; i < 2; i++) {
        const a = Math.random() * Math.PI * 2;
        trail.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * 0.15, vy: Math.sin(a) * 0.15 - 0.08,
          size: 1.5 + Math.random() * 1.5,
          alpha: 0.7, decay: 0.025 + Math.random() * 0.015,
          colour: 'rgba(245,200,66,',
        });
      }
    }
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
      if (p.alpha <= 0) { trail.splice(i, 1); continue; }
      drawParticle(p);
    }

    /* click burst */
    for (let i = burst.length - 1; i >= 0; i--) {
      const p = burst[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.04;
      p.alpha -= p.decay;
      if (p.alpha <= 0) { burst.splice(i, 1); continue; }
      drawParticle(p);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  tick();
})();

/* ── GENERATE 3-LAYER LOTUS PETALS ── */
(function buildLotus() {
  const bgLayer   = document.getElementById('layerBackground');
  const sideLayer = document.getElementById('layerSide');
  const mainLayer = document.getElementById('layerMain');
  if (!bgLayer || !sideLayer || !mainLayer) return;

  const SEGMENTS = 6;

  for (let i = 0; i < SEGMENTS; i++) {
    const angle = i * 60;

    const bg = document.createElement('div');
    bg.className = 'petal';
    bg.style.transform = `translate(-50%,-50%) rotate(${angle + 30 + 135}deg)`;
    bgLayer.appendChild(bg);

    const sideA = document.createElement('div');
    sideA.className = 'petal';
    sideA.style.transform = `translate(-50%,-50%) rotate(${angle + 15 + 135}deg)`;
    sideLayer.appendChild(sideA);

    const sideB = document.createElement('div');
    sideB.className = 'petal';
    sideB.style.transform = `translate(-50%,-50%) rotate(${angle - 15 + 135}deg)`;
    sideLayer.appendChild(sideB);

    const main = document.createElement('div');
    main.className = 'petal';
    main.style.transform = `translate(-50%,-50%) rotate(${angle + 135}deg)`;
    mainLayer.appendChild(main);
  }
})();

/* ── SPIN PHOTO NODES (JS-driven orbit, images stay upright) ── */
(function spinPhotos() {
  const photos = document.querySelectorAll('.photo-node');
  const container = document.getElementById('lotusContainer');
  if (!photos.length || !container) return;

  const RADIUS_PCT = 29;
  const PERIOD = 35000;
  let paused = false;
  let lastTime = 0;
  let totalOffset = 0;

  photos.forEach(photo => {
    photo.addEventListener('mouseenter', () => {
      paused = true;
      container.classList.add('paused');
    });
    photo.addEventListener('mouseleave', () => {
      paused = false;
      container.classList.remove('paused');
    });
  });

  function frame(now) {
    if (!lastTime) lastTime = now;

    if (!paused) {
      const dt = now - lastTime;
      totalOffset = (totalOffset + dt) % PERIOD;
      const offsetRad = -(totalOffset / PERIOD) * 2 * Math.PI;

      const w = container.offsetWidth;
      const h = container.offsetHeight;
      const r = Math.min(w, h) * (RADIUS_PCT / 100);
      const cx = w / 2;
      const cy = h / 2;

      const step = 360 / photos.length;
      for (let i = 0; i < photos.length; i++) {
        const baseAngle = ((i * step) - 90) * (Math.PI / 180);
        const total = baseAngle + offsetRad;
        const x = (cx + Math.cos(total) * r) / w * 100;
        const y = (cy + Math.sin(total) * r) / h * 100;
        photos[i].style.left = x + '%';
        photos[i].style.top  = y + '%';
      }
    }

    lastTime = now;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  window.addEventListener('resize', () => { /* positions update on next frame */ });
})();

