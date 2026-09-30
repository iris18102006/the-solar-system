/* Registered BEFORE <a-scene> is parsed (A-Frame requires this). */

/* show any error on screen instead of a silent black page */
function hudMsg(m) { const h = document.getElementById('hud'); if (h) h.insertAdjacentHTML('beforeend', '<br><b>' + m + '</b>'); else document.addEventListener('DOMContentLoaded', () => hudMsg(m)); }
window.addEventListener('error', e => { if (!/permissions policy/i.test(e.message)) hudMsg('Error: ' + e.message); });

/* ---------- procedural textures (no image files needed) ---------- */
AFRAME.registerComponent('ctex', {
  schema: { kind: { default: 'rock' }, base: { default: '#888888' }, alt: { default: '#cccccc' }, text: { default: '' } },
  init() {
    const d = this.data, cv = document.createElement('canvas'), g = cv.getContext('2d');
    const label = d.kind === 'label';
    cv.width = label ? 256 : 512; cv.height = label ? 64 : 256;
    const R = (a, b) => a + Math.random() * (b - a);
    const blob = (col, alpha, n, r0, r1) => {
      g.fillStyle = col; g.globalAlpha = alpha;
      for (let i = 0; i < n; i++) { g.beginPath(); g.arc(R(0, 512), R(0, 256), R(r0, r1), 0, 7); g.fill(); }
      g.globalAlpha = 1;
    };
    if (label) {
      g.font = 'bold 34px system-ui, sans-serif'; g.fillStyle = '#ffffff';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.shadowColor = '#000000'; g.shadowBlur = 6; g.fillText(d.text, 128, 32);
    } else {
      g.fillStyle = d.base; g.fillRect(0, 0, 512, 256);
      if (d.kind === 'bands') {
        g.fillStyle = d.alt;
        for (let y = 0; y < 256; y += 6) { g.globalAlpha = R(0, .5); g.fillRect(0, y, 512, R(3, 14)); }
        g.globalAlpha = 1;
      } else if (d.kind === 'earth') {
        blob(d.alt, 1, 70, 8, 32);
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, 512, 14); g.fillRect(0, 242, 512, 14);
        blob('#ffffff', .25, 50, 10, 30);
      } else if (d.kind === 'sun') {
        blob(d.alt, .5, 300, 4, 20); blob('#ffffff', .15, 80, 4, 12);
      } else {
        blob('#000000', .18, 300, 2, 10); blob(d.alt, .25, 200, 2, 8);
      }
    }
    const tex = new THREE.CanvasTexture(cv);
    const set = () => this.el.setAttribute('material', 'src', tex); // A-Frame accepts a THREE.Texture as src
    if (this.el.hasLoaded) set(); else this.el.addEventListener('loaded', set, { once: true });
  }
});

/* ---------- stars ---------- */
AFRAME.registerComponent('stars', {
  init() {
    const n = 2000, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1, t = Math.random() * 6.283, s = Math.sqrt(1 - u * u), r = 160;
      pos.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.el.setObject3D('mesh', new THREE.Points(geo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false })));
  }
});

/* ---------- fly up / down: E or Space = up, Q or Shift = down ---------- */
AFRAME.registerComponent('updown', {
  schema: { speed: { default: 12 } },
  init() {
    this.keys = {};
    window.addEventListener('keydown', e => { this.keys[e.code] = true; if (e.code === 'Space') e.preventDefault(); });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
  },
  tick(t, dt) {
    const k = this.keys;
    const dir = ((k.KeyE || k.Space) ? 1 : 0) - ((k.KeyQ || k.ShiftLeft || k.ShiftRight) ? 1 : 0);
    if (dir) this.el.object3D.position.y += dir * this.data.speed * dt / 1000;
  }
});


/* ---------- start looking slightly down at the system ---------- */
AFRAME.registerComponent('start-pitch', {
  schema: { type: 'number', default: -22 },
  init() {
    const go = () => { const lc = this.el.components['look-controls'];
      if (lc) lc.pitchObject.rotation.x = THREE.MathUtils.degToRad(this.data); };
    if (this.el.hasLoaded) go(); else this.el.addEventListener('loaded', go, { once: true });
  }
});

/* ---------- mouse wheel = zoom (dolly along the look direction, with easing) ---------- */
AFRAME.registerComponent('wheel-zoom', {
  schema: { speed: { default: 0.4 }, damping: { default: 4 } },
  init() {
    this.v = 0; this.dir = new THREE.Vector3();
    this.onWheel = e => {
      e.preventDefault();
      const d = Math.max(-100, Math.min(100, e.deltaY));
      this.v = Math.max(-150, Math.min(150, this.v - d * this.data.speed)); // scroll up = zoom in
    };
    window.addEventListener('wheel', this.onWheel, { passive: false });
  },
  remove() { window.removeEventListener('wheel', this.onWheel); },
  tick(t, dt) {
    if (Math.abs(this.v) < 0.05) { this.v = 0; return; }
    const o = this.el.object3D, s = dt / 1000;
    this.dir.set(0, 0, -1).applyQuaternion(o.quaternion);
    o.position.addScaledVector(this.dir, this.v * s);
    this.v *= Math.exp(-this.data.damping * s);
  }
});
