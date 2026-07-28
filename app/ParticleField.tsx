"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  tone: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactScreen = window.matchMedia("(max-width: 720px)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let particles: Particle[] = [];

    const palette = [
      "rgba(255, 255, 255, 0.42)",
      "rgba(255, 255, 255, 0.22)",
      "rgba(171, 171, 171, 0.28)",
    ];

    const createParticles = () => {
      const areaTarget = compactScreen ? 32 : Math.min(68, Math.max(46, Math.round(width / 22)));
      particles = Array.from({ length: areaTarget }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.2),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.2),
        size: index % 8 === 0 ? 2.2 : 0.8 + Math.random() * 0.8,
        tone: index % palette.length,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    };

    const render = () => {
      context.clearRect(0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = height + 10;
          if (particle.y > height + 10) particle.y = -10;

          if (pointer.active) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared < 19600 && distanceSquared > 1) {
              const force = (1 - Math.sqrt(distanceSquared) / 140) * 0.022;
              particle.x += dx * force;
              particle.y += dy * force;
            }
          }
        }

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const dx = particle.x - next.x;
          const dy = particle.y - next.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 128) {
            context.beginPath();
            context.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 128) * 0.1})`;
            context.lineWidth = 0.65;
            context.moveTo(particle.x, particle.y);
            context.lineTo(next.x, next.y);
            context.stroke();
          }
        }

        context.beginPath();
        context.fillStyle = palette[particle.tone];
        context.fillRect(
          Math.round(particle.x),
          Math.round(particle.y),
          particle.size,
          particle.size,
        );
      }
    };

    const animate = () => {
      render();
      if (!reducedMotion && !document.hidden) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleVisibilityChange = () => {
      window.cancelAnimationFrame(animationFrame);
      if (!document.hidden && !reducedMotion) animate();
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
