"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "../../content/projects";

type HaloWord = {
  label: string;
  orbit: number;
  phase: number;
  size: number;
  speed: number;
};

const projectWords: Record<string, string[]> = {
  "ai-teaching-assistant": [
    "RAG",
    "KNOWLEDGE GRAPH",
    "DIFY",
    "APACHE AGE",
    "POSTGRESQL",
    "LLM",
    "RETRIEVAL",
    "EVIDENCE",
    "GLM-4-9B",
    "LORA",
    "CCL25",
    "EVALUATION",
  ],
  "ccl25-hate-speech": [
    "GLM-4-9B",
    "LORA",
    "MS-SWIFT",
    "CHINESE NLP",
    "CCL25",
    "EVALUATION",
    "SFT",
    "STRUCTURED OUTPUT",
    "RAG",
    "DIFY",
    "KNOWLEDGE GRAPH",
    "APACHE AGE",
  ],
};

const fallbackPlacement = [
  { left: "18%", top: "38%", scale: 1.9 },
  { left: "14%", top: "61%", scale: 1.2 },
  { left: "69%", top: "29%", scale: 1.45 },
  { left: "29%", top: "75%", scale: 0.85 },
  { left: "75%", top: "69%", scale: 0.9 },
  { left: "79%", top: "46%", scale: 1.65 },
  { left: "27%", top: "29%", scale: 0.8 },
  { left: "70%", top: "58%", scale: 1 },
  { left: "61%", top: "20%", scale: 0.78 },
  { left: "63%", top: "79%", scale: 0.88 },
  { left: "82%", top: "35%", scale: 0.72 },
  { left: "38%", top: "23%", scale: 0.76 },
];

function buildHalo(words: string[]): HaloWord[] {
  return Array.from({ length: 42 }, (_, index) => ({
    label: words[index % words.length],
    orbit: index % 3,
    phase: (index / 42) * Math.PI * 2 + (index % 4) * 0.22,
    size: index % 11 === 0 ? 2.08 : index % 7 === 0 ? 1.5 : index % 3 === 0 ? 1.08 : 0.72,
    speed: index % 2 === 0 ? 1 : -0.72,
  }));
}

export default function ProjectUniverse() {
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeProject = projects[activeIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = canvas?.parentElement;
    if (!canvas || !wrapper) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const texture = new Image();
    texture.src = "/planet-surface.png";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let redraw = () => {};
    let stars: Array<{ x: number; y: number; radius: number; alpha: number }> = [];
    const halo = buildHalo(projectWords[activeProject.slug]);

    const resize = () => {
      const bounds = wrapper.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.max(55, Math.floor(width / 15)) }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: index % 13 === 0 ? 1.35 : 0.35 + Math.random() * 0.55,
        alpha: 0.18 + Math.random() * 0.48,
      }));
      if (document.hidden) redraw();
    };

    const drawWord = (
      word: HaloWord,
      centerX: number,
      centerY: number,
      planetRadius: number,
      drawFront: boolean,
    ) => {
      const orbitScale = [1.65, 2.18, 2.6][word.orbit];
      const verticalScale = [0.74, 1.08, 1.42][word.orbit];
      const time = reducedMotion ? 0 : frame * 0.00055 * word.speed;
      const angle = word.phase + time;
      const depth = Math.sin(angle);
      if ((depth >= 0) !== drawFront) return;

      const x = Math.cos(angle) * planetRadius * orbitScale;
      const y = Math.sin(angle) * planetRadius * verticalScale;
      const perspective = 0.72 + (depth + 1) * 0.24;
      const fontSize = Math.max(8, planetRadius * 0.105 * word.size * perspective);
      const alpha = drawFront ? 0.43 + depth * 0.36 : 0.19 + (depth + 1) * 0.1;
      context.font = `${word.size > 1.3 ? 400 : 500} ${fontSize}px ${
        word.size > 1.3 ? 'Georgia, "Times New Roman", serif' : '"Courier New", monospace'
      }`;
      const textWidth = context.measureText(word.label).width;
      const rawX = centerX + x + pointer.x * 8;
      const rawY = centerY + y + pointer.y * 5;
      const safeX = Math.min(width - textWidth / 2 - 10, Math.max(textWidth / 2 + 10, rawX));
      const safeY = Math.min(height - fontSize - 10, Math.max(fontSize + 10, rawY));

      context.save();
      context.translate(safeX, safeY);
      context.fillStyle = `rgba(241,234,217,${Math.max(0.07, alpha)})`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(word.label, 0, 0);
      context.restore();
    };

    const drawPlanet = (centerX: number, centerY: number, radius: number) => {
      context.save();
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.clip();

      if (texture.complete && texture.naturalWidth > 0) {
        const textureHeight = radius * 2;
        const textureWidth = textureHeight * (texture.naturalWidth / texture.naturalHeight);
        const drift = reducedMotion ? textureWidth * 0.12 : (frame * 0.18) % textureWidth;
        let x = centerX - radius - drift;
        while (x > centerX - radius) x -= textureWidth;
        while (x < centerX + radius) {
          context.drawImage(texture, x, centerY - radius, textureWidth, textureHeight);
          x += textureWidth;
        }
      } else {
        context.fillStyle = "#c8c0ae";
        context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      }

      const lighting = context.createRadialGradient(
        centerX - radius * 0.42,
        centerY - radius * 0.45,
        radius * 0.08,
        centerX,
        centerY,
        radius * 1.12,
      );
      lighting.addColorStop(0, "rgba(255,252,240,.42)");
      lighting.addColorStop(0.42, "rgba(255,252,240,.08)");
      lighting.addColorStop(0.73, "rgba(10,10,9,.36)");
      lighting.addColorStop(1, "rgba(0,0,0,.92)");
      context.fillStyle = lighting;
      context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      const terminator = context.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
      terminator.addColorStop(0, "rgba(0,0,0,0)");
      terminator.addColorStop(0.48, "rgba(0,0,0,.08)");
      terminator.addColorStop(0.78, "rgba(0,0,0,.48)");
      terminator.addColorStop(1, "rgba(0,0,0,.94)");
      context.fillStyle = terminator;
      context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      context.restore();

      context.strokeStyle = "rgba(241,234,217,.34)";
      context.lineWidth = 0.8;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();
    };

    const draw = () => {
      frame += 1;
      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      context.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        context.fillStyle = `rgba(241,234,217,${star.alpha})`;
        context.beginPath();
        context.arc(star.x + pointer.x * star.radius * 3, star.y + pointer.y * star.radius * 3, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      const compact = width < 760;
      const centerX = compact ? width * 0.52 : width * 0.5;
      const centerY = compact ? height * 0.5 : height * 0.51;
      const radius = compact ? Math.min(width * 0.2, 118) : Math.min(width * 0.205, height * 0.27, 220);

      context.save();
      context.translate(pointer.x * 10, pointer.y * 6);
      context.strokeStyle = "rgba(241,234,217,.16)";
      context.lineWidth = 0.7;
      [
        [radius * 2.45, radius * 0.82, -0.14],
        [radius * 3.25, radius * 1.22, 0.16],
      ].forEach(([rx, ry, rotation], index) => {
        context.save();
        context.translate(centerX, centerY);
        context.rotate(rotation);
        context.setLineDash(index === 0 ? [] : [3, 7]);
        context.beginPath();
        context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      });
      context.restore();

      halo.forEach((word) => drawWord(word, centerX, centerY, radius, false));

      const glow = context.createRadialGradient(centerX, centerY, radius * 0.65, centerX, centerY, radius * 1.8);
      glow.addColorStop(0, "rgba(241,234,217,.12)");
      glow.addColorStop(1, "rgba(241,234,217,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2);
      context.fill();

      drawPlanet(centerX, centerY, radius);
      halo.forEach((word) => drawWord(word, centerX, centerY, radius, true));

      if (!reducedMotion && !document.hidden) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };
    redraw = draw;

    const handlePointer = (event: PointerEvent) => {
      const bounds = wrapper.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.1;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 1.1;
    };

    const resetPointer = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const handleVisibility = () => {
      if (!document.hidden) draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    wrapper.addEventListener("pointermove", handlePointer, { passive: true });
    wrapper.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    texture.addEventListener("load", draw, { once: true });
    resize();
    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      wrapper.removeEventListener("pointermove", handlePointer);
      wrapper.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [activeProject.slug]);

  return (
    <section className="project-universe" aria-label="Selected work">
      <div className="project-universe-meta">
        <span>WORK / 02</span>
        <span>RESEARCH SYSTEMS · BUILDING WITH CONTEXT</span>
      </div>

      <div className="project-universe-layout">
        <div className="project-universe-index">
          <div className="project-universe-list">
            {projects.map((project, index) => (
              <article className={activeIndex === index ? "active" : ""} key={project.slug}>
                <button type="button" onClick={() => setActiveIndex(index)} aria-pressed={activeIndex === index}>
                  <span>0{index + 1}</span>
                  <h2>{project.title}</h2>
                  <p>{project.tags.slice(0, 3).join(" + ")}</p>
                </button>
                <div>
                  <span>{project.year}</span>
                  <Link href={`/projects/${project.slug}`}>VIEW CASE STUDY ↗</Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="project-halo-stage">
          <div className="project-word-fallback" aria-hidden="true">
            {projectWords[activeProject.slug].map((word, index) => (
              <span
                key={`${word}-${index}`}
                style={{
                  left: fallbackPlacement[index].left,
                  top: fallbackPlacement[index].top,
                  fontSize: `${fallbackPlacement[index].scale}rem`,
                }}
              >
                {word}
              </span>
            ))}
          </div>
          {/* The raster layer keeps the visual present while the animated canvas initializes. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="project-planet-fallback" src="/planet-surface.png" alt="" aria-hidden="true" />
          <canvas ref={canvasRef} className="project-halo-canvas" aria-hidden="true" />
          <p className="project-halo-caption">
            SELECT A PROJECT TO SHIFT THE FIELD
          </p>
        </div>
      </div>
    </section>
  );
}
