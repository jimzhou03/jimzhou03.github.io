"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  lane: number;
};

const languageTokens = [
  "知识",
  "语境",
  "推理",
  "语言",
  "模型",
  "context",
  "token",
  "evidence",
];

const tokenPositions = [
  { x: 0.28, y: 0.24 },
  { x: 0.48, y: 0.16 },
  { x: 0.24, y: 0.49 },
  { x: 0.49, y: 0.42 },
  { x: 0.36, y: 0.76 },
  { x: 0.64, y: 0.29 },
  { x: 0.6, y: 0.62 },
  { x: 0.72, y: 0.78 },
];

export default function GravityField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let particles: Particle[] = [];

    const resetParticle = (particle: Particle, randomX = false) => {
      particle.x = randomX ? Math.random() * width * 0.78 : width * (0.04 + Math.random() * 0.12);
      particle.y = height * (0.12 + Math.random() * 0.76);
      particle.vx = 0.14 + Math.random() * 0.28;
      particle.vy = (Math.random() - 0.5) * 0.08;
      particle.size = Math.random() > 0.86 ? 1.9 : 0.55 + Math.random() * 0.75;
      particle.alpha = 0.2 + Math.random() * 0.5;
      particle.lane = Math.floor(Math.random() * 5);
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

      particles = Array.from({ length: width < 700 ? 58 : 112 }, () => {
        const particle = {} as Particle;
        resetParticle(particle, true);
        return particle;
      });
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);

      const planetX = width * 1.03;
      const planetY = height * 0.48;
      const orbitRadius = Math.min(width * 0.54, height * 0.66);

      particles.forEach((particle, index) => {
        const dx = planetX - particle.x;
        const dy = planetY - particle.y;
        const distance = Math.max(80, Math.hypot(dx, dy));
        const gravity = Math.min(0.016, 2.7 / distance);
        const laneWave = Math.sin(frame * 0.006 + particle.lane * 1.27 + index * 0.08);

        particle.vx += (dx / distance) * gravity;
        particle.vy += (dy / distance) * gravity + laneWave * 0.0015;

        if (pointer.active) {
          const pdx = particle.x - pointer.x;
          const pdy = particle.y - pointer.y;
          const pointerDistance = Math.max(24, Math.hypot(pdx, pdy));
          if (pointerDistance < 150) {
            const repel = (1 - pointerDistance / 150) * 0.12;
            particle.vx += (pdx / pointerDistance) * repel;
            particle.vy += (pdy / pointerDistance) * repel;
          }
        }

        particle.vx *= 0.994;
        particle.vy *= 0.994;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (
          particle.x > width * 0.92 ||
          particle.y < -40 ||
          particle.y > height + 40 ||
          Math.hypot(planetX - particle.x, planetY - particle.y) < orbitRadius * 0.32
        ) {
          resetParticle(particle);
        }

        const trail = 12 + particle.size * 8;
        context.strokeStyle = `rgba(10,10,9,${particle.alpha * 0.12})`;
        context.lineWidth = 0.55;
        context.beginPath();
        context.moveTo(particle.x - particle.vx * trail, particle.y - particle.vy * trail);
        context.quadraticCurveTo(
          particle.x - particle.vx * trail * 0.35,
          particle.y - particle.vy * trail * 0.35 + laneWave * 6,
          particle.x,
          particle.y,
        );
        context.stroke();

        context.fillStyle = `rgba(10,10,9,${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      languageTokens.forEach((token, index) => {
        const position = tokenPositions[index];
        const floatX = Math.sin(frame * 0.0025 + index * 1.2) * 9;
        const floatY = Math.cos(frame * 0.002 + index) * 7;
        const x = width * position.x + floatX;
        const y = height * position.y + floatY;
        const pointerShiftX = pointer.active ? (pointer.x - width / 2) * 0.012 : 0;
        const pointerShiftY = pointer.active ? (pointer.y - height / 2) * 0.008 : 0;

        context.fillStyle = `rgba(10,10,9,${index < 5 ? 0.72 : 0.56})`;
        context.font = `${index < 5 ? 500 : 450} ${index < 5 ? 18 : 15}px ${
          index < 5 ? '"Songti SC", "SimSun", Georgia, serif' : 'Arial, sans-serif'
        }`;
        context.textAlign = "center";
        context.fillText(token, x + pointerShiftX, y + pointerShiftY);
      });

      if (!reducedMotion && !document.hidden) {
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

    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    stage.addEventListener("pointermove", handlePointer, { passive: true });
    stage.addEventListener("pointerleave", clearPointer);
    resize();
    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      stage.removeEventListener("pointermove", handlePointer);
      stage.removeEventListener("pointerleave", clearPointer);
    };
  }, []);

  return (
    <div className="gravity-visual" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gravity-planet" src="/planet-surface.png" alt="" />
      <canvas ref={canvasRef} className="gravity-canvas" />
    </div>
  );
}
