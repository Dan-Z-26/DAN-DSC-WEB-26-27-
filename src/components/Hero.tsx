import { useEffect, useRef, useState, useCallback } from 'react';
import Header from './Header';

/* ─── useTypewriter hook ─────────────────────────────────── */
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* ─── Constants ──────────────────────────────────────────── */
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4';
const SENSITIVITY = 0.8;

const TYPEWRITER_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?';

const PILL_LABELS = [
  'Pitch us an idea',
  'Come work here',
  'Send a brief hello',
  'See how we operate',
];

/* ─── Hero component ─────────────────────────────────────── */
export default function Hero() {
  /* video scrub refs */
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef<number | null>(null);
  const targetTime = useRef(0);
  const isSeeking = useRef(false);

  /* pill visibility */
  const [pillsVisible, setPillsVisible] = useState(false);

  /* typewriter */
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT);

  /* ── Video mouse-scrub ────────────────────────────────── */
  const seekToTarget = useCallback(() => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    isSeeking.current = true;
    v.currentTime = targetTime.current;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const v = videoRef.current;
      if (!v || !isFinite(v.duration)) return;

      if (prevX.current !== null) {
        const delta = e.clientX - prevX.current;
        const offset =
          (delta / window.innerWidth) * SENSITIVITY * v.duration;
        targetTime.current = Math.max(
          0,
          Math.min(v.duration, targetTime.current + offset)
        );

        if (!isSeeking.current) {
          seekToTarget();
        }
      }
      prevX.current = e.clientX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [seekToTarget]);

  const handleSeeked = useCallback(() => {
    const v = videoRef.current;
    isSeeking.current = false;
    if (v && Math.abs(v.currentTime - targetTime.current) > 0.01) {
      seekToTarget();
    }
  }, [seekToTarget]);

  /* ── Show pills 400ms after mount ─────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* ── Copy email helper ────────────────────────────────── */
  const copyEmail = () => {
    navigator.clipboard.writeText('hello@mainframe.co');
  };

  return (
    <div
      id="home"
      style={{
        minHeight: '100vh',
        background: '#fff',
        letterSpacing: '-0.02em',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Inline marquee styles (preserved) ──────────── */}
      <style>{`
        @keyframes dsc-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dsc-marquee-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 40px;
          overflow: hidden;
          background: #111827;
          color: #fff;
          display: flex;
          align-items: center;
          white-space: nowrap;
          z-index: 150;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .dsc-marquee-content {
          display: flex;
          animation: dsc-marquee 45s linear infinite;
        }
        .dsc-marquee-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .dsc-marquee-star {
          color: #14a3a3;
          margin: 0 32px;
          font-size: 14px;
        }
      `}</style>

      {/* ── Marquee banner (preserved) ─────────────────── */}
      <div className="dsc-marquee-container">
        <div className="dsc-marquee-content">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="dsc-marquee-item">UPCOMING HACKATHON: CODEFEST 2026</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">NEW WORKSHOPS EVERY WEEK</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">JOIN THE OPEN SOURCE REVOLUTION</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">EMPOWERING STUDENT DEVELOPERS</div>
              <div className="dsc-marquee-star">★</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Header (preserved) ─────────────────────────── */}
      <Header active="home" />

      {/* ── Background video (fixed, mouse-scrub) ──────── */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '70% center',
          zIndex: 0,
        }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ── Hero section ───────────────────────────────── */}
      <section
        className="mainframe-hero relative w-full overflow-hidden h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10"
        style={{ height: '100dvh', zIndex: 1 }}
      >
        <div className="max-w-xl relative z-10">
          {/* 1 — Blurred intro label */}
          <div
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              marginBottom: '1.25rem',
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#000',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* 2 — Typewriter text */}
          <p
            style={{
              color: '#000',
              marginBottom: '1.25rem',
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '54px',
            }}
          >
            {displayed}
            {!done && (
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1.1em',
                  backgroundColor: '#000',
                  verticalAlign: 'middle',
                  marginLeft: '2px',
                  animation: 'blink 1s step-end infinite',
                }}
              />
            )}
          </p>

          {/* 3 — Action pill buttons */}
          <div
            className="flex flex-wrap"
            style={{
              gap: '0.25rem 0',
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {/* White pills */}
            {PILL_LABELS.map((label) => (
              <button
                key={label}
                className="inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 mx-[0.2em] mb-[0.4em] transition-colors duration-200"
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  border: '1px solid rgba(0,0,0,0.1)',
                  paddingTop: '0.3em',
                  paddingBottom: '0.3em',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
              >
                {label}
              </button>
            ))}

            {/* Outline email pill */}
            <button
              onClick={copyEmail}
              className="inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 mx-[0.2em] mb-[0.4em] gap-2 sm:gap-3 transition-colors duration-200"
              style={{
                backgroundColor: 'transparent',
                color: '#fff',
                border: '1px solid #fff',
                paddingTop: '0.3em',
                paddingBottom: '0.3em',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <span>
                Reach us:{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px' }}>
                  hello@mainframe.co
                </span>
              </span>
              {/* Copy icon — two overlapping rectangles */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
