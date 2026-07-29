"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Drifter = {
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  phase: number;
  speed: number;
  radius: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const scope = gsap.context(() => {
      const heroCopy = document.querySelectorAll(".orbital-hero-copy > *");
      if (heroCopy.length) {
        gsap.from(heroCopy, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
        });
      }

      const galaxyCaption = document.querySelector(".galaxy-caption");
      if (galaxyCaption) {
        gsap.from(galaxyCaption, {
          x: 22,
          opacity: 0,
          duration: 1,
          delay: 0.35,
          ease: "power3.out",
        });
      }

      gsap.utils
        .toArray<HTMLElement>(
          [
            ".editorial-intro",
            ".question-orbits article",
            ".featured-window",
            ".life-preview-card",
            ".home-closing",
            ".work-window",
            ".photo-archive-entry",
            ".about-story-grid > *",
            ".interest-orbit-list article",
            ".case-editorial-grid > *",
            ".system-route article",
            ".evaluation-panel article",
          ].join(", "),
        )
        .forEach((element) => {
          gsap.from(element, {
            y: 42,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          });
        });

      const slowOrbits = document.querySelectorAll(
        ".project-ring, .work-planet-ring, .case-title-orbit",
      );
      if (slowOrbits.length) {
        gsap.to(slowOrbits, {
          rotate: 360,
          duration: 70,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
      }
    });

    return () => scope.revert();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let drifters: Drifter[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drifters = Array.from({ length: width < 720 ? 16 : 28 }, (_, index) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          anchorX: x,
          anchorY: y,
          phase: Math.random() * Math.PI * 2,
          speed: 0.004 + Math.random() * 0.006,
          radius: index % 6 === 0 ? 3 : 1.2,
        };
      });
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(11,11,11,.18)";
      context.fillStyle = "rgba(11,11,11,.58)";
      context.lineWidth = 0.7;

      drifters.forEach((point, index) => {
        const driftX = Math.sin(frame * point.speed + point.phase) * 32;
        const driftY = Math.cos(frame * point.speed * 0.72 + point.phase) * 24;
        let targetX = point.anchorX + driftX;
        let targetY = point.anchorY + driftY;

        if (pointer.active) {
          const dx = pointer.x - targetX;
          const dy = pointer.y - targetY;
          const distance = Math.hypot(dx, dy);
          if (distance < 240) {
            const pull = (1 - distance / 240) * 0.14;
            targetX += dx * pull;
            targetY += dy * pull;
          }
        }

        point.x += (targetX - point.x) * 0.045;
        point.y += (targetY - point.y) * 0.045;

        const next = drifters[(index + 3) % drifters.length];
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.quadraticCurveTo(
          (point.x + next.x) / 2 + Math.sin(frame * 0.006 + index) * 28,
          (point.y + next.y) / 2 + Math.cos(frame * 0.005 + index) * 24,
          next.x,
          next.y,
        );
        context.stroke();

        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (pointer.active) {
        context.beginPath();
        context.arc(pointer.x, pointer.y, 28, 0, Math.PI * 2);
        context.strokeStyle = "rgba(11,11,11,.48)";
        context.stroke();
      }

      if (!reducedMotion && !document.hidden) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    let animationFrame = 0;
    const handlePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const clearPointer = () => { pointer.active = false; };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("pointerleave", clearPointer);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("pointerleave", clearPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field kinetic-field" aria-hidden="true" />;
}
