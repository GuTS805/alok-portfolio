"use client";

import { useEffect, useRef } from "react";
import "./domain-intro.css";

export default function DomainIntro() {
  const modal = useRef(null);
  const finish = useRef(() => {});

  useEffect(() => {
    const element = modal.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const overflow = document.body.style.overflow;
    let timer;
    const close = () => {
      clearTimeout(timer);
      element.close();
      document.body.style.overflow = overflow;
    };
    finish.current = close;
    // Upgrade the server-rendered opening screen to a focus-trapping modal.
    element.close();
    if (!preference.matches) {
      element.showModal();
      document.body.style.overflow = "hidden";
      timer = setTimeout(close, 3400);
    }
    const onPreference = () => { if (preference.matches) close(); };
    preference.addEventListener("change", onPreference);
    return () => {
      close();
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  return (
    <dialog
      open
      ref={modal}
      className="domain-intro"
      aria-label="Mahoraga wheel opening animation"
      onCancel={(event) => { event.preventDefault(); finish.current(); }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finish.current();
      }}
    >
      <div className="adaptation-mark" aria-hidden="true">
        <div className="adaptation-halo" />
        <svg className="mahoraga-wheel" viewBox="0 0 400 400" fill="none">
          <defs>
            <linearGradient id="wheel-gold" x1="60" y1="35" x2="340" y2="370" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff1c5" />
              <stop offset=".3" stopColor="#c5a060" />
              <stop offset=".55" stopColor="#f2d591" />
              <stop offset="1" stopColor="#745025" />
            </linearGradient>
            <radialGradient id="wheel-bead" cx=".3" cy=".25" r=".8">
              <stop stopColor="#fff2c9" />
              <stop offset=".45" stopColor="#d7b573" />
              <stop offset="1" stopColor="#785229" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="117" stroke="url(#wheel-gold)" strokeWidth="12" />
          <circle cx="200" cy="200" r="108" stroke="#f5dba1" strokeOpacity=".45" strokeWidth="1" />
          {Array.from({ length: 8 }, (_, index) => (
            <g key={index} transform={`rotate(${index * 45} 200 200)`}>
              <path d="M200 176 L200 53" stroke="url(#wheel-gold)" strokeWidth="10" strokeLinecap="round" />
              <path d="M197 164 L197 69" stroke="#fbe9b4" strokeOpacity=".5" strokeWidth="2" />
              <path d="M188 68 Q200 75 212 68" stroke="#977039" strokeWidth="5" />
              <circle cx="200" cy="43" r="19" fill="url(#wheel-bead)" stroke="#e4c889" strokeWidth="1.5" />
            </g>
          ))}
          <circle cx="200" cy="200" r="27" fill="url(#wheel-bead)" stroke="#f3da9c" strokeWidth="3" />
          <circle cx="200" cy="200" r="17" fill="#201a10" stroke="#ae8548" strokeWidth="2" />
          <circle cx="200" cy="200" r="7" fill="url(#wheel-bead)" />
        </svg>
        <p className="adaptation-label"><span>ADAPTING</span><span>ADAPTED</span></p>
        <div className="adaptation-rule" />
      </div>
      <button className="intro-skip" onClick={() => finish.current()}>SKIP INTRO <span aria-hidden="true">↗</span></button>
    </dialog>
  );
}
