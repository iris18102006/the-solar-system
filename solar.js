/* ---------- planets: position, rotation, animation ----------
   pivot  (orbit animation around the sun)
    └ holder (placed at orbit distance, counter-rotated so rings/labels stay level)
        └ planet (spin animation) + label + moon/rings                          */
const PLANETS = [ // name, radius, distance, base, alt, texture, orbit ms, spin ms
  ['Mercury', .35,  5,   '#8c8c8c', '#c9c2b8', 'rock',  12000, 30000],
  ['Venus',   .6,   7.5, '#d9a441', '#f0d9a0', 'bands', 19000, 50000],
  ['Earth',   .65, 10.5, '#1e5fa8', '#3a9d4f', 'earth', 26000,  6000],
  ['Mars',    .45, 13.5, '#b5502d', '#e0a070', 'rock',  36000,  6500],
  ['Jupiter', 1.7, 19,   '#c99a6b', '#7a4b2a', 'bands', 60000,  3500],
  ['Saturn',  1.4, 25,   '#e3cf9a', '#a58c58', 'bands', 85000,  4000],
  ['Uranus',  .95, 30,   '#8fe0e6', '#5fb8c4', 'bands', 120000, 5000],
  ['Neptune', .9,  34,   '#3557d6', '#8fa8ff', 'bands', 150000, 5500]
];

AFRAME.registerComponent('solar', {
  init() {
    const root = this.el;
    const make = (tag, attrs, parent) => {
      const e = document.createElement(tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      (parent || root).appendChild(e); return e;
    };
    const spin = (from, to, dur) =>
      `property: rotation; from: 0 ${from} 0; to: 0 ${to} 0; dur: ${dur}; loop: true; easing: linear`;

    PLANETS.forEach(([name, r, dist, base, alt, kind, orbit, rot], i) => {
      const a = i * 47;
      make('a-ring', { rotation: '-90 0 0', 'radius-inner': dist - .03, 'radius-outer': dist + .03,
        'segments-theta': 96, material: 'color: #6f7bb0; opacity: .35; transparent: true; shader: flat; side: double' });

      const pivot  = make('a-entity', { rotation: `0 ${a} 0`, animation: spin(a, a + 360, orbit) });
      const holder = make('a-entity', { position: `${dist} 0 0`, animation: spin(-a, -a - 360, orbit) }, pivot);

      make('a-sphere', { radius: r, 'segments-width': 48, 'segments-height': 32,
        material: 'roughness: 1; metalness: 0', ctex: `kind: ${kind}; base: ${base}; alt: ${alt}`,
        animation: spin(0, 360, rot) }, holder);

      make('a-plane', { width: 2.6, height: .65, position: `0 ${r + .7} 0`, 'look-at': '[camera]',
        material: 'shader: flat; transparent: true; alphaTest: 0.1; depthWrite: false; side: double', ctex: `kind: label; text: ${name}` }, holder);

      if (name === 'Earth') {
        const mp = make('a-entity', { animation: spin(0, 360, 4000) }, holder);
        make('a-sphere', { radius: .18, position: '1.3 0 0', material: 'roughness: 1',
          ctex: 'kind: rock; base: #aaaaaa; alt: #dddddd' }, mp);
      }
      if (name === 'Saturn') {
        make('a-ring', { rotation: '-72 0 0', 'radius-inner': 1.9, 'radius-outer': 3.2, 'segments-theta': 64,
          material: 'color: #cdb583; opacity: .75; transparent: true; shader: flat; side: double' }, holder);
      }
    });
  }
});
