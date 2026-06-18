"use client";

import { useEffect, useRef } from "react";

const FPS = 10;
const FRAME_MS = 1000 / FPS;
const SCALE = 3;

function drawNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // Bias toward bright specks — reads as TV snow on black, not mud
    const value = (100 + Math.random() * 155) | 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

/** Animated TV static snow — dark-mode hero only. */
export function HeroTvStatic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    let rafId = 0;
    let lastFrame = 0;
    let running = true;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width < 2 || height < 2) return;
      const w = Math.max(1, Math.floor(width / SCALE));
      const h = Math.max(1, Math.floor(height / SCALE));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      drawNoise(ctx, w, h);
    };

    const tick = (now: number) => {
      if (!running) return;
      rafId = requestAnimationFrame(tick);

      if (reducedMotion) return;
      if (now - lastFrame < FRAME_MS) return;

      lastFrame = now;
      drawNoise(ctx, canvas.width, canvas.height);
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (!reducedMotion) {
        lastFrame = 0;
      } else {
        drawNoise(ctx, canvas.width, canvas.height);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    motionQuery.addEventListener("change", onMotionChange);

    // Re-measure after layout — hidden→visible toggle can report 0×0 on first paint
    const layoutRetry = requestAnimationFrame(() => {
      resize();
      if (!reducedMotion) {
        rafId = requestAnimationFrame(tick);
      }
    });

    return () => {
      running = false;
      cancelAnimationFrame(layoutRetry);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 hidden dark:block"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none h-full w-full opacity-70 mix-blend-screen [image-rendering:pixelated]"
      />
    </div>
  );
}
