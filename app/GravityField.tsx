"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
};

type Token = {
  label: string;
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
  serif: boolean;
};

const tokenLayout: Token[] = [
  { label: "语境", x: 0.18, y: 0.16, size: 20, alpha: 0.72, phase: 0.4, serif: true },
  { label: "知识", x: 0.08, y: 0.36, size: 18, alpha: 0.68, phase: 1.7, serif: true },
  { label: "推理", x: 0.2, y: 0.66, size: 19, alpha: 0.66, phase: 3.1, serif: true },
  { label: "语言", x: 0.42, y: 0.49, size: 18, alpha: 0.6, phase: 4.4, serif: true },
  { label: "模型", x: 0.35, y: 0.84, size: 19, alpha: 0.65, phase: 5.5, serif: true },
  { label: "context", x: 0.48, y: 0.2, size: 14, alpha: 0.52, phase: 2.4, serif: false },
  { label: "token", x: 0.49, y: 0.68, size: 14, alpha: 0.48, phase: 0.9, serif: false },
  { label: "evidence", x: 0.73, y: 0.83, size: 14, alpha: 0.5, phase: 3.7, serif: false },
  { label: "retrieval", x: 0.82, y: 0.24, size: 13, alpha: 0.44, phase: 5.1, serif: false },
  { label: "RAG", x: 0.91, y: 0.69, size: 15, alpha: 0.54, phase: 1.3, serif: false },
];

export default function GravityField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eventHorizonRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const eventHorizon = eventHorizonRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !eventHorizon || !stage) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let inViewport = true;
    let particles: Particle[] = [];
    let blackHole = { x: 0, y: 0, radius: 0 };

    const resetParticle = (particle: Particle, firstPass = false) => {
      particle.x = firstPass ? Math.random() * width : -24 - Math.random() * width * 0.16;
      particle.y = height * (0.08 + Math.random() * 0.84);
      particle.speed = 0.16 + Math.random() * 0.32;
      particle.vx = particle.speed;
      particle.vy = (Math.random() - 0.5) * 0.04;
      const roll = Math.random();
      particle.size = roll > 0.965 ? 3.4 + Math.random() * 2.8 : roll > 0.78 ? 1.4 + Math.random() * 1.7 : 0.35 + Math.random() * 0.9;
      particle.alpha = 0.18 + Math.random() * 0.58;
      particle.phase = Math.random() * Math.PI * 2;
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const horizonBounds = eventHorizon.getBoundingClientRect();
      blackHole = {
        x: horizonBounds.left - bounds.left + horizonBounds.width / 2,
        y: horizonBounds.top - bounds.top + horizonBounds.height / 2,
        radius: horizonBounds.width / 2,
      };

      particles = Array.from({ length: width < 700 ? 64 : 136 }, () => {
        const particle = {} as Particle;
        resetParticle(particle, true);
        return particle;
      });

      if (reducedMotion || !animationFrame) draw();
    };

    const drawParticles = () => {
      const influence = Math.max(blackHole.radius * 4.4, Math.min(width, height) * 0.52);

      particles.forEach((particle, index) => {
        const dx = blackHole.x - particle.x;
        const dy = blackHole.y - particle.y;
        const distance = Math.max(18, Math.hypot(dx, dy));
        const field = distance < influence ? 1 - distance / influence : 0;
        const wave = Math.sin(frame * 0.008 + particle.phase + index * 0.04);

        particle.vx += (particle.speed - particle.vx) * 0.025;
        particle.vy += wave * 0.0009;
        particle.vx += (dx / distance) * field * field * 0.024;
        particle.vy += (dy / distance) * field * field * 0.018;

        if (field > 0.18) {
          particle.vx += (-dy / distance) * field * field * 0.008;
          particle.vy += (dx / distance) * field * field * 0.008;
        }

        if (pointer.active) {
          const pdx = particle.x - pointer.x;
          const pdy = particle.y - pointer.y;
          const pointerDistance = Math.max(16, Math.hypot(pdx, pdy));
          if (pointerDistance < 150) {
            const repel = (1 - pointerDistance / 150) * 0.15;
            particle.vx += (pdx / pointerDistance) * repel;
            particle.vy += (pdy / pointerDistance) * repel;
          }
        }

        particle.vx *= 0.994;
        particle.vy *= 0.992;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const horizonDistance = Math.hypot(blackHole.x - particle.x, blackHole.y - particle.y);
        if (
          horizonDistance < blackHole.radius * 0.92 ||
          particle.x > width + 30 ||
          particle.y < -30 ||
          particle.y > height + 30
        ) {
          resetParticle(particle);
          return;
        }

        const nearHorizon = horizonDistance < blackHole.radius * 1.65;
        const color = nearHorizon ? "242,239,231" : "10,10,9";
        const trail = 4 + Math.hypot(particle.vx, particle.vy) * 9;

        context.strokeStyle = `rgba(${color},${particle.alpha * 0.13})`;
        context.lineWidth = 0.55;
        context.beginPath();
        context.moveTo(particle.x - particle.vx * trail, particle.y - particle.vy * trail);
        context.lineTo(particle.x, particle.y);
        context.stroke();

        context.fillStyle = `rgba(${color},${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });
    };

    const drawPointer = () => {
      if (!pointer.active) return;
      context.beginPath();
      context.arc(pointer.x, pointer.y, 27, 0, Math.PI * 2);
      context.strokeStyle = "rgba(10,10,9,.3)";
      context.lineWidth = 0.65;
      context.stroke();
    };

    const draw = () => {
      animationFrame = 0;
      frame += 1;
      context.clearRect(0, 0, width, height);
      drawParticles();
      drawPointer();

      if (!reducedMotion && !document.hidden && inViewport) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const resume = () => {
      if (!animationFrame && !reducedMotion && !document.hidden && inViewport) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const handlePointer = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        resume();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        if (inViewport) resume();
        else {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { rootMargin: "120px 0px" },
    );

    resizeObserver.observe(stage);
    visibilityObserver.observe(stage);
    stage.addEventListener("pointermove", handlePointer, { passive: true });
    stage.addEventListener("pointerleave", clearPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    resize();
    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stage.removeEventListener("pointermove", handlePointer);
      stage.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="gravity-visual" aria-hidden="true">
      <div className="gravity-black-hole">
        <span className="gravity-lensing-ring" />
        <span className="gravity-accretion gravity-accretion-outer" />
        <span className="gravity-accretion gravity-accretion-inner" />
        <span ref={eventHorizonRef} className="gravity-event-horizon" />
      </div>
      <div className="gravity-meteor-field">
        {Array.from({ length: 30 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="gravity-token-cloud">
        {tokenLayout.map((token) => (
          <span
            className={token.serif ? "is-serif" : undefined}
            key={token.label}
            style={{
              left: `${token.x * 100}%`,
              top: `${token.y * 100}%`,
              fontSize: `${token.size}px`,
              opacity: token.alpha,
              animationDelay: `${token.phase * -0.7}s`,
            }}
          >
            {token.label}
          </span>
        ))}
      </div>
      <canvas ref={canvasRef} className="gravity-canvas" />
      <span className="gravity-interaction-hint">MOVE CURSOR TO SCATTER THE FIELD</span>
    </div>
  );
}
