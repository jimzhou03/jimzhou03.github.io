"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type TransitionPhase = "idle" | "exit" | "hold" | "enter";
type TransitionTheme = "ink" | "paper";

type AsciiTransitionContextValue = {
  beginNavigation: (href: string) => boolean;
};

const AsciiTransitionContext = createContext<AsciiTransitionContextValue>({
  beginNavigation: () => false,
});

const TRANSITION_ROUTES = new Set(["/", "/projects"]);
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:/.-+*";
const EXIT_DURATION = 330;
const ENTER_DURATION = 380;

function normalizePath(path: string) {
  const cleanPath = path.split("#")[0].split("?")[0];
  if (cleanPath === "/") return cleanPath;
  return cleanPath.replace(/\/$/, "");
}

function seededNoise(column: number, row: number, salt = 0) {
  const value = Math.sin(column * 127.1 + row * 311.7 + salt * 74.7) * 43758.5453;
  return value - Math.floor(value);
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function transitionThemeFor(path: string): TransitionTheme {
  return normalizePath(path) === "/projects" ? "ink" : "paper";
}

export function AsciiTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const targetPathRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [theme, setTheme] = useState<TransitionTheme>("ink");
  const [headerHeight, setHeaderHeight] = useState(82);

  const measureHeader = useCallback(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    setHeaderHeight(Math.max(0, Math.round(header.getBoundingClientRect().height)));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const initialMeasure = window.requestAnimationFrame(measureHeader);
    window.addEventListener("resize", measureHeader, { passive: true });
    return () => {
      window.cancelAnimationFrame(initialMeasure);
      window.removeEventListener("resize", measureHeader);
    };
  }, [measureHeader]);

  useEffect(() => {
    const targetPath = targetPathRef.current;
    if (phase !== "hold" || !targetPath) return;
    if (normalizePath(pathname) !== normalizePath(targetPath)) return;

    window.requestAnimationFrame(() => {
      measureHeader();
      setPhase("enter");
    });
  }, [measureHeader, pathname, phase]);

  const beginNavigation = useCallback(
    (href: string) => {
      const currentPath = normalizePath(pathname);
      const targetPath = normalizePath(href);
      const isIndexWorkTransition =
        TRANSITION_ROUTES.has(currentPath) &&
        TRANSITION_ROUTES.has(targetPath) &&
        currentPath !== targetPath;

      if (!isIndexWorkTransition || reducedMotionRef.current) return false;
      if (activeRef.current) return true;

      activeRef.current = true;
      targetPathRef.current = href;
      setTheme(transitionThemeFor(targetPath));
      measureHeader();
      setPhase("exit");
      return true;
    },
    [measureHeader, pathname],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase === "idle") return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const cellSize = window.innerWidth < 700 ? 11 : 13;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    const width = window.innerWidth;
    const height = Math.max(1, window.innerHeight - headerHeight);
    const background = theme === "ink" ? "#050505" : "#f2efe7";
    const foreground = theme === "ink" ? "#f1ead9" : "#0a0a09";
    const monoFont = getComputedStyle(document.body)
      .getPropertyValue("--font-mono")
      .trim() || '"Courier New"';
    const duration = phase === "exit" ? EXIT_DURATION : ENTER_DURATION;
    const startedAt = performance.now();
    let animationFrame = 0;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    document.documentElement.dataset.asciiTransition = "active";

    const draw = (timestamp: number) => {
      const rawProgress = Math.min(1, (timestamp - startedAt) / duration);
      const progress = easeInOutCubic(rawProgress);
      const columns = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      context.clearRect(0, 0, width, height);
      context.font = `${Math.max(8, cellSize - 3)}px ${monoFont}, Consolas, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellSize;
          const y = row * cellSize;
          const noise = seededNoise(column, row);
          const drift = (column / Math.max(1, columns - 1)) * 0.24 +
            (row / Math.max(1, rows - 1)) * 0.13;
          const threshold = Math.min(1.12, progress * 1.38 - drift);
          const covered = phase === "exit"
            ? noise < threshold
            : phase === "enter"
              ? noise >= threshold
              : true;

          if (!covered) continue;

          context.fillStyle = background;
          context.fillRect(x, y, cellSize + 0.7, cellSize + 0.7);

          const edgeDistance = Math.abs(noise - threshold);
          const glyphVisible = phase === "hold"
            ? seededNoise(column, row, 2) > 0.84
            : edgeDistance < 0.17 || seededNoise(column, row, 3) > 0.94;

          if (!glyphVisible) continue;

          const glyphIndex = Math.floor(seededNoise(column, row, 5) * GLYPHS.length);
          const flicker = 0.5 + seededNoise(column, row, Math.floor(timestamp / 65)) * 0.46;
          context.fillStyle = theme === "ink"
            ? `rgba(241,234,217,${flicker})`
            : `rgba(10,10,9,${flicker * 0.78})`;
          context.fillText(GLYPHS[glyphIndex], x + cellSize / 2, y + cellSize / 2 + 0.5);
        }
      }

      const scanPosition = phase === "enter" ? (1 - progress) * height : progress * height;
      const scanGradient = context.createLinearGradient(0, scanPosition - 38, 0, scanPosition + 38);
      scanGradient.addColorStop(0, "transparent");
      scanGradient.addColorStop(0.5, foreground);
      scanGradient.addColorStop(1, "transparent");
      context.globalAlpha = phase === "hold" ? 0 : 0.08;
      context.fillStyle = scanGradient;
      context.fillRect(0, scanPosition - 38, width, 76);
      context.globalAlpha = 1;

      if (rawProgress < 1 && phase !== "hold") {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      if (phase === "exit") {
        setPhase("hold");
        const targetPath = targetPathRef.current;
        if (targetPath) router.push(targetPath);
      } else if (phase === "enter") {
        delete document.documentElement.dataset.asciiTransition;
        targetPathRef.current = null;
        activeRef.current = false;
        setPhase("idle");
        window.requestAnimationFrame(() => {
          const heading = document.querySelector<HTMLElement>("[data-route-focus], h1");
          if (!heading) return;
          heading.classList.add("ascii-transition-focus-target");
          heading.tabIndex = -1;
          heading.addEventListener(
            "blur",
            () => {
              heading.classList.remove("ascii-transition-focus-target");
              heading.removeAttribute("tabindex");
            },
            { once: true },
          );
          heading.focus({ preventScroll: true });
        });
      }
    };

    if (phase === "hold") {
      draw(startedAt + 1);
    } else {
      animationFrame = window.requestAnimationFrame(draw);
    }

    return () => window.cancelAnimationFrame(animationFrame);
  }, [headerHeight, phase, router, theme]);

  return (
    <AsciiTransitionContext.Provider value={{ beginNavigation }}>
      {children}
      <div
        className={`ascii-page-transition is-${phase} is-${theme}`}
        style={{ top: headerHeight }}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} />
        <span className="ascii-transition-label">
          {theme === "ink" ? "INDEX / WORK" : "WORK / INDEX"}
        </span>
      </div>
      <span className="sr-only" aria-live="polite">
        {phase === "idle" ? "" : "Changing page"}
      </span>
    </AsciiTransitionContext.Provider>
  );
}

export function AsciiTransitionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const { beginNavigation } = useContext(AsciiTransitionContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (beginNavigation(href)) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
