# Digital Thorana — ඩිජිටල් තොරණ

A pure HTML/CSS/JS digital Vesak thorana (pandal) featuring Jataka tales arranged on a rotating lotus wheel. Each petal links to a story page with an animated Buddhist frame, chasing/flickering lights, and a slideshow or video of the tale.

**Live preview:** Open `index.html` in any browser — no build steps needed.

---

## Project plan

### File structure

```
index.html                   ← Main lotus landing page
css/main.css                 ← Lotus wheel layout, particles, responsive
js/main.js                   ← Particle system + petal click handler
assets/
  shared-css/thorana-frame.css  ← Story page border frame + slideshow styles
  shared-js/lights.js           ← Animated chasing lights + initSlideshow()
  audio/                        ← Place audio files here
Materials/                     ← Reference thorana photos (not linked in code)
stories/
  story-01/                    ← Wessantara Jataka
    index.html                 ← Story page
    css/story.css              ← Story-specific theme
    js/story.js                ← Keyboard nav, swipe, lazy-load, video end
  story-02/                    ← Mahosadha Jataka  (template ready)
  story-03/                    ← Kulavaka Jataka   (template ready)
  story-04/   ...  story-11/  ← Not yet created
```

### Main page (index.html)

- **Lotus wheel** rotates 360° counter-clockwise at 35s per rotation.
- **Petals** (diamond-shaped cards) orbit the wheel. Each has a thumbnail image and a number badge.
- **Particle canvas** emits gold/saffron/ruby/white particles from the centre.
- **Hover/pause:** on desktop the wheel pauses on hover; petal labels appear. On mobile, labels are always visible.
- **Click a petal** → navigates to the story page.

### Story page structure

Each story page (`stories/story-NN/index.html`) consists of:

1. **Thorana border frame** — fixed full-viewport frame with ruby/gold repeating stripes and corner ornaments.
2. **Animated lights canvas** — bulbs chase around the border (configurable: chasing or random-flicker mode).
3. **Back button** — returns to main menu.
4. **Story title** in Sinhala and English, with spinning dharma wheel.
5. **Video player** (or slideshow fallback) — plays the team's story video. When video ends, replay/main-menu buttons appear.
6. **Story text** — summary in Sinhala + English.
7. **Audio player** — optional background chanting/sutta (team provides).

### How to add a new story

1. Copy the `story-01/` folder to `stories/story-NN/`.
2. Edit `index.html`:
   - Change `<title>`, `<h1>`, story name in Sinhala/English.
   - Replace slide `<img src>` with your team's raw GitHub URLs.
   - Update story text in Sinhala + English.
3. Edit `css/story.css` — change background tint/gradient, title colour, accent colours.
4. Edit `js/story.js` — keyboard/swipe code is reusable; add any story-specific logic.
5. Add a petal in `index.html` root:
   ```html
   <div class="petal-wrap" style="--i:N">
     <a class="petal-card" href="stories/story-NN/index.html">
       <div class="petal-frame">
         <img class="petal-img" src="..." alt="..." onerror="this.src='assets/img/thumb-placeholder.svg'"/>
         <div class="petal-overlay"></div>
         <span class="petal-num">NN</span>
       </div>
       <span class="petal-label">NAME<br/>Sinhala</span>
     </a>
   </div>
   ```
6. Increment `--petals` in `css/main.css` if needed.
7. Set the thumbnail `src` to a Wikimedia Commons Jataka image or your team's raw GitHub URL.

### Image and video workflow

- **Placeholder images** are currently Wikimedia Commons URLs + `onerror` fallback.
- **Team images:** upload to your GitHub repo, then reference as:
  `https://raw.githubusercontent.com/YOUR_USERNAME/digital-thorana/main/stories/story-NN/media/scene-XX.jpg`
- **Team video:** the story page has a `<video>` element. When the video ends, JavaScript shows replay and main-menu buttons (see `stories/story-01/js/story.js`).
- **Audio:** team replaces the `<audio src>` placeholder.

### Lights system

`assets/shared-js/lights.js` provides two animation modes:

1. **Chase mode** (default) — bulbs light up in sequence around the border.
2. **Flicker mode** — bulbs flicker randomly for a more traditional thorana feel.

Toggle via the `MODE` constant at the top of `lights.js` (`'chase'` or `'flicker'`).

Magic constant `BORDER = 18` must match CSS `--frame-border` in `thorana-frame.css`.

### Key CSS variables

| Variable         | Default | Purpose                        |
|------------------|---------|--------------------------------|
| `--petals`       | 11      | Number of petals on the wheel  |
| `--r`            | 230px   | Petal orbit radius (desktop)   |
| `--pw` / `--ph`  | 108/126 | Petal card width/height        |
| `--frame-border` | 18px    | Thorana border strip width     |
| `--gold`         | #f5c842 | Primary gold colour            |

### Colour palette

- Gold: `#f5c842`, `#c8922a`
- Saffron: `#e07b10`
- Ruby: `#8b1a1a`, `#c0392b`
- Teal: `#1a8a7a`
- Night: `#080508`, `#120910`
- Ivory: `#fdf3e3`, `#c9b48a`

### Design notes

- The lotus layout uses CSS `clip-path: polygon()` to create diamond-shaped petal cards. Each petal is positioned with `rotate()` + `translateY()` using CSS custom properties.
- The wheel spins via `@keyframes spinLotus` (35s linear, counter-clockwise). Cards counter-spin to stay upright.
- The thorana frame uses `repeating-linear-gradient` for the striped border.
- Google Fonts: `Noto Serif Sinhala` (body text) + `Cinzel Decorative` (English accents).

### No build tools

This is a pure static site. No npm, no bundlers, no preprocessors. Open `index.html` in a browser to preview changes.

---

## Credits

- Reference thorana photos in `Materials/` — original source photos.
- Jataka thumbnail images: Wikimedia Commons.
- Inspired by traditional Sri Lankan Vesak thorana (pandal) designs.
