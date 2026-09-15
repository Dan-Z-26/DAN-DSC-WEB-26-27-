/**
 * GallerySpiral
 * Developer Students Club • SRM IST Ramapuram
 *
 * Activities ride a real 3D helix — a coil leaning across the canvas that turns
 * under its own power and answers the reader's scroll.
 *
 *   offsetᵢ = wrap(i − focus)            signed distance, recycled mod count
 *   θᵢ      = offsetᵢ · ANGLE_STEP       position around the coil
 *   xᵢ      = sin θᵢ · RADIUS − offsetᵢ · LEAN_X
 *   yᵢ      = offsetᵢ · V_STEP
 *   zᵢ      = cos θᵢ · DEPTH
 *
 * Depth is genuine rather than faked with scale: the canvas carries a CSS
 * `perspective`, so translateZ does the near/far projection a camera would, and
 * each panel yaws with the coil (rotateY) instead of sliding flat across it.
 * That perspective distortion is what reads as a helix rather than a wave.
 *
 * MOTION — `focus` is a fractional index that advances on its own at
 * AUTO_SPEED. Scrolling adds an impulse to `boost`, which decays back to zero,
 * so the coil accelerates (or reverses) under the reader and then returns to
 * its own cadence. Pointing at the coil eases the idle turn to a stop, since a
 * panel that drifts away mid-reach cannot be read or clicked.
 *
 * Everything is integrated against elapsed time, not per frame, so the coil
 * turns at the same rate on a 60Hz panel and a 120Hz one.
 *
 * WRAPPING — offsets wrap into ±count/2, which is what lets five panels turn
 * forever. ANGLE_STEP is derived so the set spans whole turns and θ therefore
 * matches across the seam; y does not, so panels fade to nothing before the
 * boundary and recycle unseen.
 *
 * Below MOBILE_BREAKPOINT the coil is abandoned entirely — panels on a coil are
 * unreadable at 375px — and inline transforms are cleared so the CSS vertical
 * stack takes over.
 */

import { useEffect, useRef } from 'react';
import ActivitySquircle from './ActivitySquircle';
import { ACTIVITIES } from './activityData';

const SECTION_HEADING_ID = 'gallery-spiral-heading';

/** Whole turns of the coil across the full set. Has to be a whole number: it is
 *  what makes the angle continuous where the offsets wrap. */
const TURNS = 1;

/** Coil metrics, in coil units (see COIL_SPAN). V_STEP runs down the axis,
 *  LEAN_X leans that axis across the canvas (the diagonal band), RADIUS is the
 *  sideways swing and DEPTH the toward/away one, which the perspective
 *  projects. */
const V_STEP = 21;
const LEAN_X = 22;
const RADIUS = 20;
const DEPTH = 34;

/** Panel width in the same units — kept in step with --slot-size in
 *  gallery.css, which sizes the panel off the unit this writes. */
const SLOT_UNITS = 30;

/** Room the coil needs across the canvas: the panel one step out from the
 *  front reaches RADIUS + LEAN_X, and carries its own half-width past that.
 *  The unit shrinks to fit this on viewports too narrow to hold it, which is
 *  what stops a tablet in portrait from slicing the coil down both sides. */
const COIL_SPAN = 2 * (RADIUS + LEAN_X) + SLOT_UNITS;

/** Winding direction seen looking down the axis. At -1 the swing pushes the
 *  same way the axis leans, so the coil reads as one band climbing to the
 *  right; at 1 the two cancel and the coil collapses into a column. */
const DIRECTION = -1;

/** Panel attitude, in degrees, at its most extreme point of the turn. Panels
 *  turn with the coil but not fully tangent to it — a truly tangent panel goes
 *  edge-on at the sides and disappears. */
const YAW_MAX = 40;
const PITCH_MAX = 8;
const ROLL_MAX = 5;

/** Size of the panel at the front of the coil versus the rest. Perspective
 *  already does most of the near/far scaling; this is the extra emphasis that
 *  marks one panel as the subject of the frame. */
const FOCUS_SCALE = 1;
const REST_SCALE = 0.88;

/** Opacity floor for panels away from the front. */
const REST_OPACITY = 0.82;

/** Fraction of the half-span travelled before a panel starts fading. It must
 *  reach zero by the span's end or the recycle would be visible as a jump. */
const FADE_START = 0.5;

/** Idle turn rate, in activities per second. One panel every ~5s; a full turn
 *  of the coil takes about half a minute. */
const AUTO_SPEED = 0.19;

/** Scroll impulse, in activities-per-second gained per pixel scrolled, and the
 *  ceiling on it — past roughly two panels a second the coil is a blur. */
const SCROLL_GAIN = 0.0026;
const MAX_BOOST = 2.2;

/** Exponential decay of the scroll impulse, per second. The coil keeps the
 *  reader's push for about a second before settling back to AUTO_SPEED. */
const BOOST_DAMPING = 2.6;

/** Rate the idle turn eases to a stop when pointed at, and back up when the
 *  pointer leaves. */
const ENGAGE_EASE = 6;

/** Below this much movement the frame would be identical, so it is not painted. */
const SETTLE_EPSILON = 0.0002;

/** The coil is painted at once but held still for this long before it starts
 *  turning, so its loop is not competing with the page's own load. */
const WARMUP_MS = 2200;

const MOBILE_BREAKPOINT = 768;

/** Smoothstep — eases the handover between panels so it accelerates and settles
 *  instead of tracking the index linearly. */
const smoothstep = (t: number) => t * t * (3 - 2 * t);

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export default function GallerySpiral() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const items = Array.from(
      stage.querySelectorAll<HTMLElement>('[data-spiral-item]')
    );
    if (items.length === 0) return;

    const count = items.length;
    const half = count / 2;
    const angleStep = (2 * Math.PI * TURNS) / count;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let focus = 0;
    let painted = Number.NaN;
    let boost = 0;
    let pendingScroll = 0;
    let idleScale = 1;
    let engaged = false;
    let lastScrollY = window.scrollY;
    let last = 0;
    let frame = 0;
    let warmup = 0;
    let warmed = false;
    let running = false;
    let stacked = false;

    // The unit is measured on resize, never per frame. Reading layout inside
    // the rAF loop — right after the previous tick wrote transforms — is
    // read/write thrash and the main source of stutter here.
    let unit = 1;
    const measure = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
      unit = Math.min(vmin, window.innerWidth / COIL_SPAN);
      stage.style.setProperty('--coil-unit', `${unit.toFixed(3)}px`);
    };

    // Remembers the last value written per item, so unchanged properties are
    // never reassigned. zIndex in particular re-sorts the stacking context on
    // every write, which is wasted work when the order has not moved.
    const lastZ: number[] = [];
    const lastHit: boolean[] = [];

    /** Signed distance from the front of the coil, recycled into ±half so a
     *  finite set of panels can turn forever. */
    const wrapOffset = (raw: number) => {
      const o = ((raw + half) % count + count) % count;
      return o - half;
    };

    const paint = () => {
      items.forEach((item, i) => {
        const offset = wrapOffset(i - focus);
        const theta = offset * angleStep;
        const swing = Math.sin(theta) * DIRECTION;
        const depth = Math.cos(theta);

        const x = (swing * RADIUS - offset * LEAN_X) * unit;
        const y = offset * V_STEP * unit;
        const z = depth * DEPTH * unit;

        const yaw = swing * YAW_MAX;
        const pitch = depth * PITCH_MAX;
        const roll = swing * ROLL_MAX;

        // 1 exactly at the front of the coil, easing to 0 one panel away, so
        // the arriving panel grows as the outgoing one settles back.
        const focusAmount = smoothstep(clamp01(1 - Math.abs(offset)));
        const scale = REST_SCALE + (FOCUS_SCALE - REST_SCALE) * focusAmount;

        const edge = Math.abs(offset) / half;
        const fade =
          1 - smoothstep(clamp01((edge - FADE_START) / (1 - FADE_START)));
        const opacity = (REST_OPACITY + (1 - REST_OPACITY) * focusAmount) * fade;

        // The slot's transform is owned entirely by this function, so position,
        // attitude and focus-scale compose here without competing with the
        // comic tilt or the hover-zoom layers below it.
        item.style.transform =
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)` +
          ` rotateY(${yaw.toFixed(2)}deg)` +
          ` rotateX(${pitch.toFixed(2)}deg)` +
          ` rotateZ(${roll.toFixed(2)}deg)` +
          ` scale(${scale.toFixed(3)})`;
        item.style.opacity = opacity.toFixed(3);

        // The canvas keeps a flat transform-style, so painting order is ours to
        // set: nearer panels have to cover the ones behind them.
        const zIndex = 500 + Math.round(z / 4);
        if (lastZ[i] !== zIndex) {
          item.style.zIndex = String(zIndex);
          lastZ[i] = zIndex;
        }

        const hittable = opacity >= 0.25;
        if (lastHit[i] !== hittable) {
          item.style.pointerEvents = hittable ? '' : 'none';
          lastHit[i] = hittable;
        }
      });

      painted = focus;
    };

    const clearStack = () => {
      items.forEach((item, i) => {
        item.style.transform = '';
        item.style.opacity = '';
        item.style.zIndex = '';
        item.style.pointerEvents = '';
        lastZ[i] = Number.NaN;
        lastHit[i] = true;
      });
      painted = Number.NaN;
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);

      if (window.innerWidth < MOBILE_BREAKPOINT) {
        if (!stacked) {
          clearStack();
          stacked = true;
        }
        last = now;
        return;
      }
      stacked = false;

      // Clamped so a tab returning to the foreground resumes where it left off
      // rather than jumping a whole coil's worth of rotation.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (pendingScroll !== 0) {
        boost = Math.min(
          MAX_BOOST,
          Math.max(-MAX_BOOST, boost + pendingScroll * SCROLL_GAIN)
        );
        pendingScroll = 0;
      }
      boost *= Math.exp(-BOOST_DAMPING * dt);
      if (Math.abs(boost) < 0.001) boost = 0;

      idleScale +=
        ((engaged ? 0 : 1) - idleScale) * (1 - Math.exp(-ENGAGE_EASE * dt));

      focus += (AUTO_SPEED * idleScale + boost) * dt;

      // Held to one revolution's worth of index so the float never drifts into
      // a range where its precision starts to show in the transform.
      if (focus > count || focus < -count) focus = wrapOffset(focus);

      if (Number.isNaN(painted) || Math.abs(focus - painted) >= SETTLE_EPSILON) {
        paint();
      }
    };

    const onScroll = () => {
      pendingScroll += window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
    };

    // Pointing at a panel, not merely at the canvas: the coil is full-bleed, so
    // treating the whole band as engaged would leave it parked whenever the
    // reader's cursor happened to rest anywhere over the section.
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('[data-spiral-item]')) engaged = true;
    };

    const onPointerOut = (event: PointerEvent) => {
      const next = event.relatedTarget as Element | null;
      if (!next?.closest('[data-spiral-item]')) engaged = false;
    };

    const onEngage = () => {
      engaged = true;
    };

    const onRelease = () => {
      engaged = false;
    };

    const beginLoop = () => {
      // Scroll travelled while the coil was held still is not a push on it.
      lastScrollY = window.scrollY;
      pendingScroll = 0;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      measure();
      window.addEventListener('scroll', onScroll, { passive: true });

      if (warmed) beginLoop();
      else
        warmup = window.setTimeout(() => {
          warmed = true;
          if (running) beginLoop();
        }, WARMUP_MS);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      // A panel can scroll out from under a resting cursor without a pointerout
      // of its own, which would leave the coil parked when it returns.
      engaged = false;
      window.clearTimeout(warmup);
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };

    const onResize = () => {
      measure();
      if (window.innerWidth >= MOBILE_BREAKPOINT) paint();
    };

    // Only turn while the coil is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '10% 0px' }
    );
    observer.observe(stage);

    measure();
    if (window.innerWidth >= MOBILE_BREAKPOINT) paint();

    window.addEventListener('resize', onResize);
    stage.addEventListener('pointerover', onPointerOver);
    stage.addEventListener('pointerout', onPointerOut);
    stage.addEventListener('focusin', onEngage);
    stage.addEventListener('focusout', onRelease);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      stage.removeEventListener('pointerover', onPointerOver);
      stage.removeEventListener('pointerout', onPointerOut);
      stage.removeEventListener('focusin', onEngage);
      stage.removeEventListener('focusout', onRelease);
      stop();
    };
  }, []);

  return (
    <section className="gallery-spiral" aria-labelledby={SECTION_HEADING_ID}>
      <header className="gallery-spiral-header">
        <span className="gallery-kicker" aria-hidden="true">
          The Archive
        </span>

        <h1 id={SECTION_HEADING_ID} className="gallery-spiral-title">
          What We <span className="gallery-title-split">Actually Do</span>
        </h1>

        <p className="gallery-spiral-description">
          Hackathons, workshops, design jams and the occasional all-nighter.
          Follow the spiral — every panel opens onto the full story.
        </p>

        <svg
          className="gallery-divider"
          viewBox="0 0 320 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M2,7 C40,3 62,10 98,6 C134,2 158,11 196,6 C232,2 258,10 318,5" />
          <path className="gallery-divider-echo" d="M4,10 C42,6 64,12 100,9 C136,5 160,13 198,9 C234,5 260,12 316,8" />
        </svg>
      </header>

      {/* The canvas owns the camera: it carries the perspective the coil's
          depth is projected through. */}
      <div className="gallery-spiral-stage" ref={stageRef}>
        <div className="gallery-spiral-canvas">
          {ACTIVITIES.map((activity, index) => (
            <ActivitySquircle
              key={activity.id}
              activity={activity}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
