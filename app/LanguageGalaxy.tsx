"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  pulse: number;
};

const chineseOrbit = ["语言", "语义", "句法", "语境", "词法", "知识", "检索", "生成"];
const englishOrbit = ["LANGUAGE", "MEANING", "SYNTAX", "CONTEXT", "KNOWLEDGE", "RETRIEVAL"];
const signalOrbit = ["中", "文", "NLP", "RAG", "KG", "语", "言", "学"];

export default function LanguageGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = canvas?.parentElement;
    if (!canvas || !wrapper) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frame = 0;
    let animationFrame = 0;

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
      stars = Array.from({ length: Math.max(90, Math.floor(width / 8)) }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: index % 17 === 0 ? 1.7 : Math.random() * 0.9 + 0.2,
        alpha: 0.22 + Math.random() * 0.68,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const drawOrbitText = (
      words: string[],
      radiusX: number,
      radiusY: number,
      rotation: number,
      speed: number,
      fontSize: number,
      alpha: number,
    ) => {
      context.save();
      context.rotate(rotation);
      context.fillStyle = `rgba(241,235,219,${alpha})`;
      context.font = `${fontSize}px "Songti SC", "SimSun", Georgia, serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      words.forEach((word, index) => {
        const angle = (index / words.length) * Math.PI * 2 + frame * speed;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        const tangent = Math.atan2(Math.cos(angle) * radiusY, -Math.sin(angle) * radiusX);
        context.save();
        context.translate(x, y);
        context.rotate(tangent);
        context.fillText(`${word} ·`, 0, 0);
        context.restore();
      });
      context.restore();
    };

    const draw = () => {
      frame += 1;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      context.clearRect(0, 0, width, height);
      const background = context.createRadialGradient(
        width * 0.68,
        height * 0.44,
        10,
        width * 0.6,
        height * 0.5,
        Math.max(width, height) * 0.8,
      );
      background.addColorStop(0, "#191815");
      background.addColorStop(0.3, "#0b0b0a");
      background.addColorStop(1, "#030303");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        const shimmer = reduceMotion ? star.alpha : star.alpha + Math.sin(frame * 0.012 + star.pulse) * 0.16;
        context.fillStyle = `rgba(241,235,219,${Math.max(0.08, shimmer)})`;
        context.beginPath();
        context.arc(
          star.x + pointer.x * (star.radius / 18),
          star.y + pointer.y * (star.radius / 18),
          star.radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      });

      const compact = width < 720;
      const cx = compact ? width * 0.56 : width * 0.7;
      const cy = compact ? height * 0.39 : height * 0.47;
      const planetRadius = compact ? Math.min(width * 0.19, 92) : Math.min(width * 0.115, 165);

      context.save();
      context.translate(cx + pointer.x * 10, cy + pointer.y * 8);

      const orbitScale = compact ? 0.68 : 1;
      context.strokeStyle = "rgba(241,235,219,.16)";
      context.lineWidth = 0.7;
      [
        [planetRadius * 2.25 * orbitScale, planetRadius * 0.72 * orbitScale, -0.13],
        [planetRadius * 3.05 * orbitScale, planetRadius * 1.18 * orbitScale, 0.22],
        [planetRadius * 3.75 * orbitScale, planetRadius * 1.62 * orbitScale, -0.3],
      ].forEach(([radiusX, radiusY, rotation], index) => {
        context.save();
        context.rotate(rotation);
        context.setLineDash(index === 1 ? [3, 7] : []);
        context.beginPath();
        context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      });

      drawOrbitText(
        chineseOrbit,
        planetRadius * 2.28 * orbitScale,
        planetRadius * 0.73 * orbitScale,
        -0.13,
        reduceMotion ? 0 : 0.00065,
        compact ? 9 : 12,
        0.92,
      );
      drawOrbitText(
        englishOrbit,
        planetRadius * 3.08 * orbitScale,
        planetRadius * 1.2 * orbitScale,
        0.22,
        reduceMotion ? 0 : -0.00042,
        compact ? 7 : 9,
        0.65,
      );
      drawOrbitText(
        signalOrbit,
        planetRadius * 3.77 * orbitScale,
        planetRadius * 1.64 * orbitScale,
        -0.3,
        reduceMotion ? 0 : 0.00028,
        compact ? 8 : 10,
        0.4,
      );

      const halo = context.createRadialGradient(0, 0, planetRadius * 0.86, 0, 0, planetRadius * 1.55);
      halo.addColorStop(0, "rgba(241,235,219,.25)");
      halo.addColorStop(0.4, "rgba(241,235,219,.07)");
      halo.addColorStop(1, "rgba(241,235,219,0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(0, 0, planetRadius * 1.55, 0, Math.PI * 2);
      context.fill();

      const planet = context.createRadialGradient(
        -planetRadius * 0.4,
        -planetRadius * 0.46,
        planetRadius * 0.08,
        0,
        0,
        planetRadius,
      );
      planet.addColorStop(0, "#f3eddd");
      planet.addColorStop(0.46, "#b9b2a2");
      planet.addColorStop(0.82, "#5e5b54");
      planet.addColorStop(1, "#171715");
      context.fillStyle = planet;
      context.beginPath();
      context.arc(0, 0, planetRadius, 0, Math.PI * 2);
      context.fill();

      context.globalCompositeOperation = "multiply";
      context.strokeStyle = "rgba(28,27,24,.34)";
      context.lineWidth = 1.1;
      for (let index = 0; index < 19; index += 1) {
        const arcRadius = planetRadius * (0.22 + ((index * 19) % 67) / 100);
        const start = (index * 1.71) % (Math.PI * 2);
        context.beginPath();
        context.arc(
          Math.sin(index * 4.2) * planetRadius * 0.2,
          Math.cos(index * 2.7) * planetRadius * 0.18,
          arcRadius,
          start,
          start + 0.55 + (index % 4) * 0.18,
        );
        context.stroke();
      }
      context.globalCompositeOperation = "source-over";

      context.fillStyle = "rgba(241,235,219,.78)";
      context.font = `${compact ? 8 : 9}px "Courier New", monospace`;
      context.textAlign = "center";
      context.fillText("MEANING / 意义", 0, 3);
      context.restore();

      if (!reduceMotion && !document.hidden) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const handlePointer = (event: PointerEvent) => {
      const bounds = wrapper.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.2;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 1.2;
    };

    const resetPointer = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);
    wrapper.addEventListener("pointermove", handlePointer, { passive: true });
    wrapper.addEventListener("pointerleave", resetPointer);
    resize();
    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      wrapper.removeEventListener("pointermove", handlePointer);
      wrapper.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="language-galaxy-canvas" aria-hidden="true" />;
}
