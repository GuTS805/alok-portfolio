"use client";

import { useEffect, useState } from "react";

// Reads prefers-reduced-motion only after mount so the first client render
// always matches the server-rendered (non-reduced) markup, avoiding a
// hydration mismatch when the visitor's OS has reduced motion enabled.
export function useSafeReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const matches = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- OS motion preference is only knowable client-side, after the SSR-matching first paint
      setReduced(true);
    }
  }, []);

  return reduced;
}
