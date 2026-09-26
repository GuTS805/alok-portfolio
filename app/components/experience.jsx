"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "../data/site";

const ExperienceContext = createContext(null);
const navigation = [
  ["01", "Work", "work"],
  ["02", "About", "about"],
  ["03", "Open source", "open-source"],
  ["04", "Contact", "contact"],
];

function trapFocus(event) {
  if (event.key !== "Tab") return;
  const items = [
    ...event.currentTarget.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex="0"]',
    ),
  ].filter((element) => element.getClientRects().length);
  const first = items[0];
  const last = items[items.length - 1];
  if (!first) return;
  if (
    event.shiftKey &&
    (document.activeElement === first ||
      !event.currentTarget.contains(document.activeElement))
  ) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last ||
      !event.currentTarget.contains(document.activeElement))
  ) {
    event.preventDefault();
    first.focus();
  }
}

export function ExperienceProvider({ children }) {
  const [domain, setDomain] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [palette, setPalette] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    try {
      setDomain(localStorage.getItem("alok-domain") === "on");
    } catch {
      /* Storage is optional. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.domain = domain ? "on" : "off";
    document.documentElement.dataset.motion = paused ? "paused" : "running";
  }, [domain, paused]);
  const toggleDomain = () =>
    setDomain((value) => {
      try {
        localStorage.setItem("alok-domain", value ? "off" : "on");
      } catch {
        /* Private browsing can deny storage. */
      }
      return !value;
    });
  useEffect(() => {
    const key = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k" &&
        !event.target.closest(
          "input, textarea, select, [contenteditable='true']",
        )
      ) {
        event.preventDefault();
        setPalette((value) => !value);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    const controller = new AbortController();
    const options = { signal: controller.signal };
    let frame = 0;
    let heroVisible = true;
    const hero = document.querySelector(".hero");
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = root.scrollHeight - innerHeight;
        root.style.setProperty(
          "--scroll-progress",
          max > 0 ? scrollY / max : 0,
        );
        root.dataset.scrolled = scrollY > 40 ? "true" : "false";
        if (hero && heroVisible && !paused && !media.matches)
          hero.style.setProperty(
            "--hero-scroll",
            `${Math.min(scrollY * 0.13, 90)}px`,
          );
      });
    };
    const visibility = () => {
      root.dataset.hidden = document.hidden ? "true" : "false";
    };
    addEventListener("scroll", update, { ...options, passive: true });
    addEventListener("resize", update, options);
    document.addEventListener("visibilitychange", visibility, options);
    update();
    visibility();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.target === hero) {
            heroVisible = entry.isIntersecting;
            root.dataset.heroVisible = heroVisible ? "true" : "false";
          } else if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    if (hero) observer.observe(hero);
    document
      .querySelectorAll(".reveal, .contribution-group")
      .forEach((element) => observer.observe(element));
    const reset = () => {
      hero?.style.setProperty("--pointer-x", "0px");
      hero?.style.setProperty("--pointer-y", "0px");
      if (paused || media.matches)
        hero?.style.setProperty("--hero-scroll", "0px");
    };
    hero?.addEventListener(
      "pointermove",
      (event) => {
        if (
          paused ||
          media.matches ||
          !fine.matches ||
          event.pointerType === "touch"
        )
          return;
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty(
          "--pointer-x",
          `${(event.clientX / rect.width - 0.5) * -10}px`,
        );
        hero.style.setProperty(
          "--pointer-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * -6}px`,
        );
      },
      options,
    );
    hero?.addEventListener("pointerleave", reset, options);
    media.addEventListener("change", reset, options);
    reset();
    return () => {
      controller.abort();
      observer.disconnect();
      cancelAnimationFrame(frame);
      reset();
    };
  }, [pathname, paused]);
  return (
    <ExperienceContext.Provider
      value={{
        domain,
        toggleDomain,
        paused,
        setPaused,
        sound,
        setSound,
        setPalette,
      }}
    >
      {children}
      {sound && (
        <iframe
          className="sound-frame"
          title="Optional domain soundtrack"
          tabIndex={-1}
          aria-hidden="true"
          allow="autoplay"
          src="https://www.youtube-nocookie.com/embed/vxTLtmpnKn8?start=50&autoplay=1&controls=0&loop=1&playlist=vxTLtmpnKn8"
        />
      )}
      <CommandPalette open={palette} close={() => setPalette(false)} />
    </ExperienceContext.Provider>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [menu, setMenu] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const { setPalette } = useContext(ExperienceContext);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const modal = dialog.current;
    const oldOverflow = document.body.style.overflow;
    modal.showModal();
    modal.querySelector("button")?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = oldOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [menu]);
  const target = (id) => (pathname === "/" ? `#${id}` : `/#${id}`);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="logo" href="/" aria-label="Alok home">
          ALOK<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.slice(0, 3).map(([number, title, id]) => (
            <a
              key={id}
              href={target(id)}
              aria-current={active === id ? "location" : undefined}
            >
              <small>{number}</small>
              {title}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="command-trigger"
            aria-label="⌘ K — Open command palette"
            onClick={() => setPalette(true)}
          >
            ⌘ K
          </button>
          <a className="nav-contact" href={target("contact")}>
            CONTACT <span>↗</span>
          </a>
        </div>
        <button
          ref={trigger}
          className="menu-trigger"
          aria-label="MENU ＋ — Open navigation menu"
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          onClick={() => setMenu(true)}
        >
          MENU <span aria-hidden="true">＋</span>
        </button>
      </header>
      <noscript>
        <nav className="nojs-nav" aria-label="Section navigation">
          {navigation.map(([, title, id]) => (
            <a key={id} href={target(id)}>
              {title}
            </a>
          ))}
        </nav>
      </noscript>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Navigation"
        onKeyDown={trapFocus}
        onCancel={(event) => {
          event.preventDefault();
          setMenu(false);
        }}
      >
        <div className="mobile-menu-top">
          <span className="logo">
            ALOK<span>.</span>
          </span>
          <button
            className="close-button"
            onClick={() => setMenu(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>
        <p className="eyebrow muted">CHOOSE YOUR DESTINATION</p>
        <nav aria-label="Mobile navigation">
          {navigation.map(([number, title, id]) => (
            <a key={id} href={target(id)} onClick={() => setMenu(false)}>
              <small>{number}</small>
              {title}
              <span>↗</span>
            </a>
          ))}
        </nav>
        <a className="text-link" href={site.resume} download>
          Download résumé ↓
        </a>
        <p className="mono muted">BUILT WITH INTENT. INSPIRED BY CHAOS.</p>
      </dialog>
    </>
  );
}

export function CollapseDomain() {
  const [busy, setBusy] = useState(false);
  const running = useRef(false);
  const timers = useRef([]);
  const { paused } = useContext(ExperienceContext);
  useEffect(() => {
    const cancel = () => {
      timers.current.forEach(clearTimeout);
      running.current = false;
      setBusy(false);
      document.querySelector(".hero")?.removeAttribute("data-collapse");
    };
    const key = (event) => {
      if (event.key === "Escape") cancel();
    };
    document.addEventListener("keydown", key);
    return () => {
      timers.current.forEach(clearTimeout);
      document.removeEventListener("keydown", key);
      document.querySelector(".hero")?.removeAttribute("data-collapse");
    };
  }, []);
  function collapse(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    if (running.current) return;
    const hero = document.querySelector(".hero");
    const work = document.querySelector("#work");
    if (!work) {
      location.hash = "work";
      return;
    }
    const finish = () => {
      history.replaceState(null, "", "#work");
      work.scrollIntoView({
        behavior:
          paused || matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
      });
      document.querySelector("#work-title")?.focus({ preventScroll: true });
    };
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    running.current = true;
    setBusy(true);
    hero.dataset.collapse = "charging";
    timers.current = [
      setTimeout(() => {
        hero.dataset.collapse = "cutting";
      }, 250),
      setTimeout(() => {
        hero.dataset.collapse = "fading";
      }, 600),
      setTimeout(finish, 950),
      setTimeout(() => {
        hero.removeAttribute("data-collapse");
        running.current = false;
        setBusy(false);
      }, 1500),
    ];
  }
  return (
    <a
      href="#work"
      className="button primary domain-trigger"
      onClick={collapse}
      aria-disabled={busy}
      aria-label="Collapse domain, explore selected work"
    >
      <span aria-hidden="true">⛩</span>
      <span>{busy ? "COLLAPSING…" : "COLLAPSE DOMAIN"}</span>
      <span aria-hidden="true">↘</span>
    </a>
  );
}

export function AtmosphereControls() {
  const { domain, toggleDomain, paused, setPaused, sound, setSound } =
    useContext(ExperienceContext);
  return (
    <div className="atmosphere-controls" aria-label="Experience settings">
      <button onClick={toggleDomain} aria-pressed={domain}>
        DOMAIN <span>{domain ? "ON" : "OFF"}</span>
      </button>
      <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
        {paused ? "PLAY MOTION ▷" : "PAUSE MOTION Ⅱ"}
      </button>
      <button
        onClick={() => setSound(!sound)}
        aria-pressed={sound}
        title="Optional soundtrack hosted by YouTube"
      >
        SOUND <span>{sound ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}

export function CopyEmail() {
  const [message, setMessage] = useState("");
  const timeout = useRef(null);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function copy() {
    clearTimeout(timeout.current);
    try {
      await navigator.clipboard.writeText(site.email);
      setMessage("COPIED TO CLIPBOARD");
    } catch {
      setMessage(`Copy unavailable. Select the email address or use Email me.`);
    }
    timeout.current = setTimeout(() => setMessage(""), 5000);
  }
  return (
    <div className="copy-control">
      <button className="text-link" id="copy-email" onClick={copy}>
        Copy email <span aria-hidden="true">⧉</span>
      </button>
      <span className="copy-status" role="status">
        {message}
      </span>
    </div>
  );
}

function CommandPalette({ open, close }) {
  const ref = useRef(null);
  const { toggleDomain, domain } = useContext(ExperienceContext);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    ref.current.showModal();
    ref.current.querySelector("button")?.focus();
    document.body.style.overflow = "hidden";
    setMessage("");
    return () => {
      ref.current?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  function keys(event) {
    trapFocus(event);
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nodes = [
      ...ref.current.querySelectorAll(".command-list a, .command-list button"),
    ];
    const index = nodes.indexOf(document.activeElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? nodes.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + nodes.length) %
            nodes.length;
    nodes[next]?.focus();
  }
  return (
    <dialog
      ref={ref}
      className="command-palette"
      aria-labelledby="command-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={keys}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            close();
        }
      }}
    >
      <div className="command-heading">
        <h2 id="command-title">DOMAIN COMMANDS</h2>
        <button
          className="close-button"
          aria-label="Close command palette"
          onClick={close}
        >
          ×
        </button>
      </div>
      <div className="command-list">
        {navigation.map(([number, title, id]) => (
          <a href={`/#${id}`} onClick={close} key={id}>
            <span>
              <small>{number}</small>Go to {title}
            </span>
            <span>↗</span>
          </a>
        ))}
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          Open GitHub <span>↗</span>
        </a>
        <a href={site.resume} download onClick={close}>
          Download résumé <span>↓</span>
        </a>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(site.email);
              setMessage("COPIED TO CLIPBOARD");
            } catch {
              setMessage(site.email);
            }
          }}
        >
          Copy email <span>⧉</span>
        </button>
        <button
          onClick={() => {
            toggleDomain();
            close();
          }}
        >
          Domain expansion <span>{domain ? "ON → OFF" : "OFF → ON"}</span>
        </button>
      </div>
      <p className="mono muted" role="status">
        {message || "↑ ↓ TO MOVE · ENTER TO SELECT · ESC TO CLOSE"}
      </p>
    </dialog>
  );
}

export function BotvueDemo() {
  const [different, setDifferent] = useState(true);
  return (
    <div className="crawler-demo">
      <div className="demo-heading">
        <span className="mono">RESPONSE COMPARISON</span>
        <button
          className="demo-toggle"
          aria-pressed={different}
          onClick={() => setDifferent(!different)}
        >
          {different ? "SHOW MATCHING" : "SHOW DIVERGENCE"} ↗
        </button>
      </div>
      <div className="comparison-panels">
        <div>
          <span className="mono muted">HUMAN VIEW</span>
          <p className="http-status">200 OK</p>
          <div className="response-lines">
            <i />
            <i />
            <i />
          </div>
          <p>Article content received.</p>
        </div>
        <div className={different ? "is-divergent" : ""}>
          <span className="mono muted">AI CRAWLER VIEW</span>
          <p className="http-status">200 OK</p>
          <div className="response-lines">
            <i />
            <i />
            <i />
          </div>
          <p aria-live="polite">
            {different
              ? "Content missing. Status unchanged."
              : "Article content received."}
          </p>
        </div>
      </div>
      <div className="demo-foot">
        <span className={different ? "red" : "muted"}>
          {different ? "↳ DIVERGENCE DETECTED" : "↳ RESPONSES MATCH"}
        </span>
        <span>ILLUSTRATIVE · NOT A LIVE SCAN</span>
      </div>
    </div>
  );
}
