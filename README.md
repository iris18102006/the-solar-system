# 🪐 VR Solar System

A tiny WebVR solar system built with [A-Frame](https://aframe.io) — no build step, no image files.
Open `index.html` in a browser (or a headset) and fly around.

## Features
- **3D scene, positioning & rotation** – every planet sits in a `pivot → holder → planet` entity chain
- **Animations** – orbits, planet spin, Earth's moon and the sun all use A-Frame's `animation` component
- **Textures** – generated procedurally on a `<canvas>` (bands, craters, continents, sun spots), so there are no assets to host
- **VR ready** – WebXR button in the bottom-right corner
- **Free flight** – mouse look, WASD, plus up/down

## Controls
| Key | Action |
|-----|--------|
| Mouse drag | Look around |
| W A S D | Move |
| Scroll wheel | Zoom in / out |
| E / Space | Up |
| Q / Shift | Down |

## Run locally
```bash
git clone <your-repo-url>
cd vr-solar-system
python3 -m http.server 8000   # then open http://localhost:8000
```
Double-clicking `index.html` also works.

## Deploy with GitHub Pages
Repo → **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
Your site will be at `https://<username>.github.io/<repo>/`.

## Project structure
```
index.html                scene + camera rig
style.css                 HUD styling
components.js             custom A-Frame components: ctex, stars, updown, start-pitch, wheel-zoom
solar.js                  planet data + "solar" component that builds the system
aframe-v1.5.0.min.js      A-Frame 1.5.0 (self-hosted, works offline)
```

## Ideas / roadmap
- [ ] Click a planet for an info panel
- [ ] Asteroid belt
- [ ] Time-speed control

## License
MIT
