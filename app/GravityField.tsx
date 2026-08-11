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
  baseSpeed: number;
  stretch: number;
};

type GravityToken = {
  label: string;
  x: number;
  y: number;
  baseY: number;
  size: number;
  alpha: number;
  lane: number;
  index: number;
  baseSpeed: number;
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
  "retrieval",
  "RAG",
];

const STREAM_SPEED = 2.75;

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
    const reducedMotionFrameInterval = 1000 / 15;
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let lastDrawTime = 0;
    let inViewport = true;
    let particles: Particle[] = [];
    let tokens: GravityToken[] = [];
    let blackHole = { x: 0, y: 0, radius: 0, influence: 0 };

    const streamY = (lane: number, lanes: number) =>
      height * (0.11 + (lane / Math.max(1, lanes - 1)) * 0.78);

    const resetParticle = (particle: Particle, firstPass = false) => {
      particle.x = firstPass ? Math.random() * width * 0.86 : -16 - Math.random() * width * 0.22;
      particle.lane = Math.floor(Math.random() * 11);
      particle.y = streamY(particle.lane, 11) + (Math.random() - 0.5) * height * 0.07;
      const scaleRoll = Math.random();
      particle.size =
        scaleRoll > 0.975
          ? 5.2 + Math.random() * 3.2
          : scaleRoll > 0.87
            ? 2.1 + Math.random() * 2.7
            : scaleRoll > 0.48
              ? 0.9 + Math.random() * 1.35
              : 0.32 + Math.random() * 0.7;
      particle.stretch = 0.72 + Math.random() * 0.8;
      particle.baseSpeed = (0.4 + Math.random() * 0.76 + particle.size * 0.016) * STREAM_SPEED;
      particle.vx = particle.baseSpeed;
      particle.vy = (Math.random() - 0.5) * 0.055;
      particle.alpha = 0.18 + Math.random() * 0.66;
    };

    const resetToken = (token: GravityToken, firstPass = false) => {
      token.lane = token.index % 5;
      token.x = firstPass
        ? width * (0.08 + ((token.index * 0.137) % 0.52))
        : -70 - Math.random() * width * 0.75;
      token.baseY = streamY(token.lane, 5) + (token.index % 2 ? 13 : -10);
      token.y = token.baseY;
      token.baseSpeed = (0.18 + (token.index % 3) * 0.035) * STREAM_SPEED;
      token.alpha = token.index < 5 ? 0.76 : 0.54;
      token.size = token.index < 5 ? 20 : 15;
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
        influence: Math.max(horizonBounds.width * 2.65, Math.min(width, height) * 0.58),
      };

      particles = Array.from({ length: width < 700 ? 184 : 380 }, () => {
        const particle = {} as Particle;
        resetParticle(particle, true);
        return particle;
      });

      tokens = languageTokens.map((label, index) => {
        const token = { label, index } as GravityToken;
        resetToken(token, true);
        return token;
      });

      if (!animationFrame) draw();
    };

    const drawDistortedStream = () => {
      const leftEdge = Math.max(0, blackHole.x - blackHole.influence * 0.9);
      const rightEdge = Math.min(width, blackHole.x + blackHole.influence * 0.82);

      context.save();
      context.lineWidth = 0.55;
      for (let lane = 0; lane < 9; lane += 1) {
        const y = streamY(lane, 9);
        const side = y <= blackHole.y ? -1 : 1;
        const separation = Math.max(
          blackHole.radius * 1.22,
          Math.abs(y - blackHole.y) * 0.58 + blackHole.radius * 0.74,
        );
        const lensY = blackHole.y + side * separation;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(leftEdge, y);
        context.bezierCurveTo(
          blackHole.x - blackHole.radius * 2.2,
          y,
          blackHole.x - blackHole.radius * 1.42,
          lensY,
          blackHole.x - blackHole.radius * 1.04,
          lensY,
        );
        context.strokeStyle = `rgba(10,10,9,${0.035 + (lane % 3) * 0.012})`;
        context.stroke();

        context.beginPath();
        context.moveTo(blackHole.x + blackHole.radius * 1.04, lensY);
        context.bezierCurveTo(
          blackHole.x + blackHole.radius * 1.46,
          lensY,
          blackHole.x + blackHole.radius * 2.08,
          y,
          rightEdge,
          y,
        );
        context.lineTo(width, y);
        context.stroke();
      }
      context.restore();
    };

    const applyPointerRepulsion = (particle: Particle, range = 145, strength = 0.15) => {
      if (!pointer.active) return;
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.max(18, Math.hypot(dx, dy));
      if (distance >= range) return;
      const repel = (1 - distance / range) * strength;
      particle.vx += (dx / distance) * repel;
      particle.vy += (dy / distance) * repel;
    };

    const drawParticles = () => {
      particles.forEach((particle, index) => {
        const dx = blackHole.x - particle.x;
        const dy = blackHole.y - particle.y;
        const distance = Math.max(8, Math.hypot(dx, dy));
        const field = distance < blackHole.influence ? 1 - distance / blackHole.influence : 0;
        const gravity = field * field * 0.052;
        const swirl = field * field * 0.016;
        const laneWave = Math.sin(frame * 0.008 + particle.lane * 0.84 + index * 0.05);

        particle.vx += (particle.baseSpeed - particle.vx) * 0.018;
        particle.vy += laneWave * 0.0008;
        particle.vx += (dx / distance) * gravity + (-dy / distance) * swirl;
        particle.vy += (dy / distance) * gravity + (dx / distance) * swirl;
        applyPointerRepulsion(particle);
        particle.vx *= 0.993;
        particle.vy *= 0.991;

        const speed = Math.hypot(particle.vx, particle.vy);
        const maxSpeed = 4.8 * STREAM_SPEED;
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        const nextDistance = Math.hypot(blackHole.x - particle.x, blackHole.y - particle.y);
        if (
          nextDistance < blackHole.radius * 0.82 ||
          particle.x > width + 38 ||
          particle.y < -36 ||
          particle.y > height + 36
        ) {
          resetParticle(particle);
          return;
        }

        const nearHorizon = nextDistance < blackHole.radius * 1.36;
        const particleSpeed = Math.max(0.01, Math.hypot(particle.vx, particle.vy));
        const trailLength = Math.min(46, 9 + particleSpeed * 7.5);
        const particleColor = nearHorizon ? "242,239,231" : "10,10,9";
        const fade =
          nextDistance < blackHole.radius * 1.08
            ? Math.max(0, (nextDistance - blackHole.radius * 0.82) / (blackHole.radius * 0.26))
            : 1;

        context.strokeStyle = `rgba(${particleColor},${particle.alpha * 0.18 * fade})`;
        context.lineWidth = nearHorizon ? 0.85 : 0.5;
        context.beginPath();
        context.moveTo(
          particle.x - (particle.vx / particleSpeed) * trailLength,
          particle.y - (particle.vy / particleSpeed) * trailLength,
        );
        context.lineTo(particle.x, particle.y);
        context.stroke();

        context.fillStyle = `rgba(${particleColor},${particle.alpha * fade})`;
        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(Math.atan2(particle.vy, particle.vx));
        context.beginPath();
        context.ellipse(
          0,
          0,
          particle.size * particle.stretch,
          particle.size,
          0,
          0,
          Math.PI * 2,
        );
        context.fill();
        if (particle.size > 3.4) {
          context.strokeStyle = `rgba(${particleColor},${particle.alpha * 0.28 * fade})`;
          context.lineWidth = 0.65;
          context.beginPath();
          context.arc(
            -particle.size * 0.18,
            -particle.size * 0.12,
            particle.size * 0.28,
            0,
            Math.PI * 2,
          );
          context.stroke();
        }
        context.restore();
      });
    };

    const drawTokens = () => {
      tokens.forEach((token) => {
        const fieldStart = blackHole.x - blackHole.influence * 0.9;
        const fieldLength = Math.max(1, blackHole.x - fieldStart);
        const field = Math.max(0, Math.min(1, (token.x - fieldStart) / fieldLength));
        const absorbStart = blackHole.x - blackHole.radius * 2.05;
        const absorbEnd = blackHole.x - blackHole.radius * 0.72;
        const absorb = Math.max(
          0,
          Math.min(1, (token.x - absorbStart) / Math.max(1, absorbEnd - absorbStart)),
        );

        token.x += token.baseSpeed * (1 + field * 2.2);
        const targetY = token.baseY + (blackHole.y - token.baseY) * Math.pow(field, 2.35);
        token.y += (targetY - token.y) * (0.014 + field * 0.075);

        if (token.x >= absorbEnd || token.y < 30 || token.y > height - 30) {
          resetToken(token);
          return;
        }

        if (token.x < 48) return;
        const fade = 1 - Math.pow(absorb, 1.55);
        const stretch = 1 + absorb * 1.25;
        const font = `${token.index < 5 ? 500 : 450} ${token.size}px ${
          token.index < 5 ? '"Songti SC", "SimSun", Georgia, serif' : 'Arial, sans-serif'
        }`;

        context.save();
        context.translate(token.x, token.y);
        context.scale(stretch, Math.max(0.7, 1 - absorb * 0.28));
        context.font = font;
        context.textAlign = "center";
        context.textBaseline = "middle";
        if (absorb > 0.12) {
          [3, 2, 1].forEach((ghost) => {
            context.fillStyle = `rgba(10,10,9,${token.alpha * fade * (0.045 * ghost)})`;
            context.fillText(token.label, -ghost * absorb * 9, 0);
          });
        }
        context.fillStyle = `rgba(10,10,9,${token.alpha * fade})`;
        context.fillText(token.label, 0, 0);
        context.restore();
      });
    };

    const drawPointerField = () => {
      if (!pointer.active) return;
      context.beginPath();
      context.arc(pointer.x, pointer.y, 27, 0, Math.PI * 2);
      context.strokeStyle = "rgba(10,10,9,.34)";
      context.lineWidth = 0.65;
      context.stroke();
    };

    const draw = (timestamp = performance.now()) => {
      animationFrame = 0;

      // Keep the field alive for visitors whose OS requests reduced motion.
      // Rendering fewer frames preserves that preference without turning the
      // canvas into a random still image that only changes after a refresh.
      if (
        reducedMotion &&
        lastDrawTime &&
        timestamp - lastDrawTime < reducedMotionFrameInterval
      ) {
        if (!document.hidden && inViewport) {
          animationFrame = window.requestAnimationFrame(draw);
        }
        return;
      }

      lastDrawTime = timestamp;
      frame += 1;
      context.clearRect(0, 0, width, height);
      drawDistortedStream();
      drawParticles();
      drawTokens();
      drawPointerField();

      if (!document.hidden && inViewport) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const resume = () => {
      if (!animationFrame && !document.hidden && inViewport) {
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
        if (inViewport) {
          resume();
        } else {
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
      <canvas ref={canvasRef} className="gravity-canvas" />
      <span className="gravity-interaction-hint">
        LEFT → RIGHT · MOVE CURSOR TO SCATTER THE STREAM
      </span>
    </div>
  );
}
