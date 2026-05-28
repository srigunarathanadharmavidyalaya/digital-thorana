(function initThoranaStage() {
  const stage = document.querySelector('.stage-inner');
  if (!stage) return;

  const panels = stage.querySelectorAll('.narrative-panel');
  if (!panels.length) return;

  const panelRing = stage.querySelector('.panel-ring');
  const count = panels.length;
  const angleStep = 360 / count;
  const radius = 32;

  function positionPanels() {
    const w = stage.offsetWidth;
    const h = stage.offsetHeight;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * (radius / 100);

    panels.forEach((panel, i) => {
      const angle = (angleStep * i) - 90;
      const rad = (angle * Math.PI) / 180;
      const x = cx + Math.cos(rad) * r;
      const y = cy + Math.sin(rad) * r;
      const pw = panel.offsetWidth || 1;
      const ph = panel.offsetHeight || 1;
      panel.style.left = (x - pw / 2) + 'px';
      panel.style.top = (y - ph / 2) + 'px';
    });
  }

  positionPanels();
  window.addEventListener('resize', positionPanels);

  /* ── CHASE LIGHT ANIMATION ── */
  const chaseDisabled = stage.closest('.thorana-stage')?.hasAttribute('data-disable-chase');
  if (!chaseDisabled) {
    let chaseIndex = 0;
    const CHASE_INTERVAL = 600;

    setInterval(() => {
      panels.forEach(p => p.classList.remove('active-glow'));
      if (panels.length) {
        panels[chaseIndex].classList.add('active-glow');
        chaseIndex = (chaseIndex + 1) % panels.length;
      }
    }, CHASE_INTERVAL);
  }

  /* ── SVG ARCH ANIMATION ── */
  const archLines = stage.querySelectorAll('.arch-line');
  if (archLines.length) {
    let offset = 0;
    setInterval(() => {
      offset = (offset + 1) % 20;
      archLines.forEach(line => {
        line.setAttribute('stroke-dashoffset', offset);
      });
    }, 150);
  }
})();

/* ── SLIDESHOW INIT ── */
function initSlideshow(intervalMs = 5000) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.querySelector('.slide-arrow.prev');
  const nextBtn = document.querySelector('.slide-arrow.next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), intervalMs);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });
  prevBtn?.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  goTo(0);
  startTimer();
}

document.addEventListener('DOMContentLoaded', () => {
  initSlideshow(5500);
  initThoranaStage();
});
