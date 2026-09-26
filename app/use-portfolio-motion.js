"use client";
import { useEffect } from "react";

export function usePortfolioMotion(paused) {
  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    const cleanups = [];
    let frame = 0;
    const progress = document.querySelector(".scroll-progress");
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
      });
    };
    addEventListener("scroll", update, { ...options, passive: true });
    addEventListener("resize", update, options);
    update();

    // Only meaningful while the domain is expanded (gated in CSS via
    // .domain-active); tracks downward scrolling specifically so assets
    // catch fire as you scroll further into the page, not on scroll-up.
    let lastY = scrollY;
    let fireTimer;
    const igniteOnScroll = () => {
      if (reduced.matches) return;
      const y = scrollY;
      if (y > lastY) {
        document.documentElement.classList.add("is-scrolling-down");
        clearTimeout(fireTimer);
        fireTimer = setTimeout(
          () => document.documentElement.classList.remove("is-scrolling-down"),
          260,
        );
      }
      lastY = y;
    };
    addEventListener("scroll", igniteOnScroll, { ...options, passive: true });
    cleanups.push(() => {
      clearTimeout(fireTimer);
      document.documentElement.classList.remove("is-scrolling-down");
    });
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.08 },
      );
      document
        .querySelectorAll(".reveal")
        .forEach((element) => observer.observe(element));
      document.documentElement.classList.add("js");
      cleanups.push(() => observer.disconnect());
    }
    document.querySelectorAll(".hero, .project-visual").forEach((element) => {
      const hero = element.matches(".hero");
      const target = hero ? element.querySelector(".shrine-image") : element;
      let pointerFrame = 0;
      const reset = () => {
        cancelAnimationFrame(pointerFrame);
        target.style.transform = "";
      };
      element.addEventListener(
        "pointermove",
        (event) => {
          if (
          paused ||
          ["playing", "settling"].includes(document.documentElement.dataset.domainIntro) ||
            reduced.matches ||
            !fine.matches ||
            event.pointerType === "touch"
          )
            return;
          const rect = element.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          cancelAnimationFrame(pointerFrame);
          pointerFrame = requestAnimationFrame(() => {
            target.style.transform = hero
              ? `translate(${x * -14}px, ${y * -10}px)`
              : `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
            element.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
            element.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
          });
        },
        options,
      );
      element.addEventListener("pointerleave", reset, options);
      element.addEventListener("pointercancel", reset, options);
      reduced.addEventListener("change", reset, options);
      cleanups.push(reset);
    });
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      cleanups.forEach((fn) => fn());
      document.documentElement.classList.remove("js");
    };
  }, [paused]);
}
