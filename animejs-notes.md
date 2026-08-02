## anime.js v4 quick reference (use this exact syntax — v4 changed significantly from v3)

Install: `npm install animejs`

Import only named functions — there is no global `anime` object anymore:
```js
import { animate, createTimeline, stagger, svg, utils } from 'animejs';
```

Basic animation:
```js
animate('.symbol-path', {
  strokeDashoffset: [utils.setDashoffset, 0],
  duration: 800,
  ease: 'outExpo'
});
```

Timeline (use this to sequence/overlap all 5 beats):
```js
const tl = createTimeline({ defaults: { ease: 'outExpo' } });

tl.add('.bracket-left', { strokeDashoffset: [utils.setDashoffset, 0], duration: 400 })
  .add('.slash', { strokeDashoffset: [utils.setDashoffset, 0], duration: 400 }, '-=250')
  .add('.bracket-right', { strokeDashoffset: [utils.setDashoffset, 0], duration: 400 }, '-=250')
  .add('.dsc-text', { opacity: [0, 1], scale: [0.9, 1], duration: 400 }, '+=100')
  .add('.dsc-text', { opacity: [1, 0], duration: 300 }, '+=200')
  .add('.wordmark-text', { opacity: [0, 1], duration: 600 }, '-=200')
  .add('.subtitle-text', { opacity: [0, 1], translateY: [8, 0], duration: 300 }, '-=300');
```

Stagger (for staggering multiple elements, e.g. per-letter reveal):
```js
animate('.letter-span', {
  opacity: [0, 1],
  translateY: [10, 0],
  delay: stagger(30)
});
```

SVG line-draw helper: `utils.setDashoffset` auto-calculates `stroke-dasharray`/`stroke-dashoffset` from the path's actual length — no manual measuring needed.

SVG shape morph (optional, for beat 3 if doing a true morph instead of crossfade):
```js
import { svg } from 'animejs';
animate('#dsc-shape', { points: svg.morphTo('#full-name-shape'), duration: 700 });
```

Do NOT use v3 syntax: no `anime({...})`, no `anime.timeline()`, no global `anime` object.
