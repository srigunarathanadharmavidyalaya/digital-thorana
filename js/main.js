document.getElementById('yr').textContent = new Date().getFullYear();

/* ── TWINKLE DOTS ── */
(function initDots() {
  const dots = 40;
  for (let i = 0; i < dots; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    const size = 1.5 + Math.random() * 2.5;
    dot.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      --dur:${2+Math.random()*3}s;
      animation-delay:${Math.random()*4}s;
    `;
    document.body.appendChild(dot);
  }
})();

/* ── PARTICLE SYSTEM ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, cx, cy;
  const PARTICLES = 55;
  const pool = [];

  const COLOURS = [
    'rgba(245,200,66,',
    'rgba(224,123,16,',
    'rgba(255,240,200,',
    'rgba(200,146,42,',
    'rgba(192,57,43,',
  ];

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
      vx: Math.cos(angle) * (0.12 + Math.random() * 0.32),
      vy: Math.sin(angle) * (0.12 + Math.random() * 0.32) - (0.2 + Math.random() * 0.2),
      size: 1.5 + Math.random() * 3.5,
      colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      alpha: 0.4 + Math.random() * 0.6,
      decay: 0.004 + Math.random() * 0.006,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  for (let i = 0; i < PARTICLES; i++) pool.push(spawn());

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.4;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) { Object.assign(pool[i], spawn()); continue; }
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

      for (let i = 0; i < photos.length; i++) {
        const baseAngle = ((i * 60) - 90) * (Math.PI / 180);
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

/* ── PHOTO CLICK NAVIGATION ── */
document.querySelectorAll('.photo-node').forEach(node => {
  node.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    e.preventDefault();
    this.style.transform = 'translate(-50%,-50%) scale(1.3)';
    setTimeout(() => { window.location.href = href; }, 200);
  });
});
