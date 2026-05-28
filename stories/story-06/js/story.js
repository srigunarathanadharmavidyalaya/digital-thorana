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
    { start: 20, end: 52 },
    { start: 52, end: 78 },
    { start: 78, end: 104 },
    { start: 104, end: 130 },
    { start: 130, end: 161 },
  ];

  let currentScene = -1;

  function updateScene(time) {
    let nextScene = -1;
    for (let i = 0; i < sceneTimeline.length; i++) {
      if (time >= sceneTimeline[i].start && time < sceneTimeline[i].end) {
        nextScene = i;
        break;
      }
    }

    if (nextScene === -1 || nextScene === currentScene) return;

    currentScene = nextScene;

    const rotation = -(angleStep * currentScene);
    panelRing.style.transform = `rotate(${rotation}deg)`;

    panels.forEach((panel, i) => {
      panel.classList.remove('scene-active', 'scene-adjacent');

      const counterRotation = -rotation;
      panel.style.transform = `rotate(${counterRotation}deg)`;

      if (i === currentScene) {
        panel.classList.add('scene-active');
      } else {
        const nextIdx = (currentScene + 1) % count;
        const prevIdx = (currentScene - 1 + count) % count;
        if (i === nextIdx || i === prevIdx) {
          panel.classList.add('scene-adjacent');
        }
      }
    });
  }

  audio.addEventListener('timeupdate', () => updateScene(audio.currentTime));
  audio.addEventListener('play', () => updateScene(audio.currentTime));

  audio.addEventListener('ended', () => {
    panelRing.style.transform = 'rotate(0deg)';
    panels.forEach((panel, i) => {
      panel.classList.remove('scene-active', 'scene-adjacent');
      panel.style.transform = 'rotate(0deg)';
    });
    currentScene = -1;
  });

  updateScene(0);

  audio.play().catch(() => {
    const overlay = document.createElement('div');
    overlay.id = 'audioStartOverlay';
    overlay.className = 'audio-start-overlay';
    overlay.innerHTML = `
      <div class="overlay-content">
        <span class="overlay-icon">☸</span>
        <p>Click anywhere to start the story</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const start = e => {
      audio.play();
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 600);
      document.removeEventListener('click', start);
      document.removeEventListener('touchstart', start);
    };
    document.addEventListener('click', start);
    document.addEventListener('touchstart', start);
  });
})();
