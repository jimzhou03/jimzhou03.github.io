"use client";

import { useEffect, useRef, useState } from "react";
import { EditorialGravityScene } from "./gravity/GravityScene";

export default function GravityField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const blackHoleAnchorRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const blackHoleAnchor = blackHoleAnchorRef.current;
    if (!canvas || !stage || !blackHoleAnchor) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: EditorialGravityScene | null = null;
    let inViewport = true;
    let mounted = true;

    try {
      scene = new EditorialGravityScene({
        canvas,
        stage,
        blackHoleAnchor,
        reducedMotion,
        onReady: () => {
          if (mounted) setWebglReady(true);
        },
      });
      scene.start();
    } catch (error) {
      console.warn("WebGL gravity scene unavailable; using the static scientific fallback.", error);
      return;
    }

    const resizeObserver = new ResizeObserver(() => scene?.resize());
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        scene?.setActive(inViewport && !document.hidden);
      },
      { rootMargin: "100px 0px" },
    );

    const handlePointer = (event: PointerEvent) => scene?.setPointer(event.clientX, event.clientY);
    const clearPointer = () => scene?.clearPointer();
    const handleVisibility = () => scene?.setActive(inViewport && !document.hidden);
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      scene?.stop();
      setWebglReady(false);
    };

    resizeObserver.observe(stage);
    visibilityObserver.observe(stage);
    stage.addEventListener("pointermove", handlePointer, { passive: true });
    stage.addEventListener("pointerleave", clearPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    canvas.addEventListener("webglcontextlost", handleContextLost);

    return () => {
      mounted = false;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stage.removeEventListener("pointermove", handlePointer);
      stage.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      scene?.dispose();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`gravity-visual${webglReady ? " is-webgl-ready" : ""}`}
      aria-hidden="true"
    >
      <div ref={blackHoleAnchorRef} className="gravity-black-hole">
        <span className="gravity-lensing-ring" />
        <span className="gravity-accretion gravity-accretion-outer" />
        <span className="gravity-accretion gravity-accretion-inner" />
        <span className="gravity-event-horizon" />
      </div>
      <canvas
        ref={canvasRef}
        className="gravity-webgl-canvas"
        data-gravity-renderer="three-webgl"
      />
    </div>
  );
}
