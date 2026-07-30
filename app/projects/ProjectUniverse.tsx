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
    "DOMAIN KG",
    "BKT",
    "DIFY",
    "APACHE AGE",
    "POSTGRESQL",
    "RETRIEVAL",
    "EVIDENCE",
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
  ],
};

function buildHalo(words: string[]): HaloWord[] {
  return Array.from({ length: words.length }, (_, index) => ({
    label: words[index % words.length],
    orbit: index % 3,
    phase: (index / words.length) * Math.PI * 2 + (index % 3) * 0.18,
    size: index % 6 === 0 ? 1.32 : index % 3 === 0 ? 1.08 : 0.84,
    speed: index % 2 === 0 ? 1 : -0.76,
  }));
}

export default function ProjectUniverse() {
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const haloRef = useRef(buildHalo(projectWords[projects[0].slug]));
  const activeProject = projects[activeIndex];

  useEffect(() => {
    haloRef.current = buildHalo(projectWords[activeProject.slug]);
  }, [activeProject.slug]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = canvas?.parentElement;
    if (!canvas || !wrapper) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const texture = new Image();
    texture.src = "/planet-surface.webp";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let inViewport = true;
    let redraw = () => {};
    let stars: Array<{ x: number; y: number; radius: number; alpha: number }> = [];
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
      const time = reducedMotion ? 0 : frame * 0.00105 * word.speed;
      const angle = word.phase + time;
      const depth = Math.sin(angle);
      if ((depth >= 0) !== drawFront) return;

      const x = Math.cos(angle) * planetRadius * orbitScale;
      const y = Math.sin(angle) * planetRadius * verticalScale;
      const perspective = 0.72 + (depth + 1) * 0.24;
      const fontSize = Math.max(13, planetRadius * 0.095 * word.size * perspective);
      const alpha = drawFront ? 0.43 + depth * 0.36 : 0.19 + (depth + 1) * 0.1;
      context.font = `${word.size > 1.3 ? 400 : 500} ${fontSize}px ${
        word.size > 1.3 ? 'Georgia, "Times New Roman", serif' : '"Courier New", monospace'
      }`;
      const rawX = centerX + x + pointer.x * 8;
      const rawY = centerY + y + pointer.y * 5;

      context.save();
      context.translate(rawX, rawY);
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
        const sourceSize = Math.min(texture.naturalWidth, texture.naturalHeight);
        const sourceX = (texture.naturalWidth - sourceSize) / 2;
        const sourceY = (texture.naturalHeight - sourceSize) / 2;
        context.save();
        context.translate(centerX, centerY);
        context.rotate(reducedMotion ? 0 : frame * 0.00022);
        context.drawImage(
          texture,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          -radius * 1.46,
          -radius * 1.46,
          radius * 2.92,
          radius * 2.92,
        );
        context.restore();
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
      animationFrame = 0;
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

      haloRef.current.forEach((word) => drawWord(word, centerX, centerY, radius, false));

      const glow = context.createRadialGradient(centerX, centerY, radius * 0.65, centerX, centerY, radius * 1.8);
      glow.addColorStop(0, "rgba(241,234,217,.12)");
      glow.addColorStop(1, "rgba(241,234,217,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2);
      context.fill();

      drawPlanet(centerX, centerY, radius);
      haloRef.current.forEach((word) => drawWord(word, centerX, centerY, radius, true));

      if (!reducedMotion && !document.hidden && inViewport) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };
    redraw = draw;

    const resume = () => {
      if (!animationFrame && !reducedMotion && !document.hidden && inViewport) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

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
      { rootMargin: "140px 0px" },
    );
    resizeObserver.observe(wrapper);
    visibilityObserver.observe(wrapper);
    wrapper.addEventListener("pointermove", handlePointer, { passive: true });
    wrapper.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    texture.addEventListener("load", resume, { once: true });
    resize();
    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      wrapper.removeEventListener("pointermove", handlePointer);
      wrapper.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

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
              <article
                className={activeIndex === index ? "active" : ""}
                key={project.slug}
                onPointerEnter={() => setActiveIndex(index)}
              >
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
          <canvas ref={canvasRef} className="project-halo-canvas" aria-hidden="true" />
          <p className="project-halo-caption">
            SELECT A PROJECT TO SHIFT THE FIELD
          </p>
        </div>
      </div>
    </section>
  );
}
