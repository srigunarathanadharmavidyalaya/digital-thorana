(function initAudioSceneSync() {
  const audio = document.getElementById('storyAudio');
  const stage = document.querySelector('.stage-inner');
  const panelRing = stage?.querySelector('.panel-ring');
  const panels = stage?.querySelectorAll('.narrative-panel');
  if (!audio || !panelRing || !panels?.length) return;

  const count = panels.length;
  const angleStep = 360 / count;

  const sceneTimeline = [
    { start: 0, end: 20 },
    { start: 20, end: 40 },
    { start: 40, end: 60 },
    { start: 60, end: 80 },
    { start: 80, end: 100 },
    { start: 100, end: 122 },
  ];

  let currentScene = -1;
  let transitioning = false;
  let overlay = null;
  let audioStarted = false;

  function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function zoomIn(panel) {
    if (overlay) return;
    const img = panel?.querySelector('img');
    if (!img) return;

    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:rgba(5,2,8,0.92);opacity:0;transition:opacity 0.6s ease;';
    const i = document.createElement('img');
    i.src = img.src;
    i.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain;border-radius:4px;box-shadow:0 0 40px rgba(200,146,42,0.3);transform:scale(0.3);transition:transform 0.8s cubic-bezier(0.4,0,0.2,1);';
    el.appendChild(i);
    stage.appendChild(el);
    overlay = el;
    el.offsetHeight;
    el.style.opacity = '1';
    i.style.transform = 'scale(1)';
    await delay(800);
  }

  async function zoomOut() {
    if (!overlay) return;
    overlay.querySelector('img').style.transform = 'scale(0.3)';
    overlay.style.opacity = '0';
    await delay(600);
    overlay.remove();
    overlay = null;
  }

  function updatePanels(index) {
    const rot = -(angleStep * index);
    panelRing.style.transform = `rotate(${rot}deg)`;
    panels.forEach((p, i) => {
      p.classList.remove('scene-active', 'scene-adjacent');
      p.style.transform = `rotate(${-rot}deg)`;
    });
    panels[index]?.classList.add('scene-active');
    panels[(index + 1) % count]?.classList.add('scene-adjacent');
    panels[(index - 1 + count) % count]?.classList.add('scene-adjacent');
  }

  async function goToScene(index) {
    if (transitioning || index === currentScene) return;
    transitioning = true;

    await zoomOut();
    updatePanels(index);
    await delay(1200);

    if (audioStarted || !audio.paused) {
      await zoomIn(panels[index]);
    }

    currentScene = index;
    transitioning = false;
  }

  function onTimeUpdate(time) {
    let next = -1;
    for (let i = 0; i < sceneTimeline.length; i++) {
      if (time >= sceneTimeline[i].start && time < sceneTimeline[i].end) {
        next = i;
        break;
      }
    }
    if (next === -1 || next === currentScene || transitioning) return;
    goToScene(next);
  }

  audio.addEventListener('timeupdate', () => onTimeUpdate(audio.currentTime));

  audio.addEventListener('play', () => {
    audioStarted = true;
    if (currentScene >= 0 && !overlay) {
      zoomIn(panels[currentScene]);
    }
    onTimeUpdate(audio.currentTime);
  });

  audio.addEventListener('ended', async () => {
    if (transitioning) return;
    transitioning = true;
    await zoomOut();
    panelRing.style.transform = 'rotate(0deg)';
    panels.forEach(p => {
      p.classList.remove('scene-active', 'scene-adjacent');
      p.style.transform = 'rotate(0deg)';
    });
    currentScene = -1;
    transitioning = false;
  });

  currentScene = 0;
  panels[0]?.classList.add('scene-active');
  panels[1]?.classList.add('scene-adjacent');
  panels[count - 1]?.classList.add('scene-adjacent');

  document.addEventListener('entry-complete', () => {
    audio.play().catch(() => {
      const o = document.createElement('div');
      o.id = 'audioStartOverlay';
      o.className = 'audio-start-overlay';
      o.innerHTML = '<div class="overlay-content"><span class="overlay-icon">☸</span><p>Click anywhere to start the story</p></div>';
      document.body.appendChild(o);
      const start = e => {
        audio.play();
        o.classList.add('fade-out');
        setTimeout(() => o.remove(), 600);
        document.removeEventListener('click', start);
        document.removeEventListener('touchstart', start);
      };
      document.addEventListener('click', start);
      document.addEventListener('touchstart', start);
    });
  }, { once: true });
})();
