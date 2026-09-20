"use client";
import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 60;
const MAX_TTL = 10000;
const SPEED = 0.2;
const MOUSE_THRESHOLD = 100;
const MOUSE_REPEL = 3;
const MOUSE_LERP = 0.025; // (lerpAmt 2.5 / 100, matching the original tool's convention)
const BASE_HUE = 185; // cyan/teal
const HUE_RANGE = 40; // drifts toward blue, never past it
const TRAIL_ALPHA = 0.25; // how much of the previous frame is kept (creates soft trails)

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lastX: number;
  lastY: number;
  life: number;
};

export function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return; // static background only, skip entirely

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarsePointer) return; // no real mouse on touch devices, skip entirely

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;
    let rafId: number;
    let visible = true;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      spawnParticle(width, height)
    );

    function spawnParticle(w: number, h: number): Particle {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const angle = Math.random() * Math.PI * 2;
      return {
        x,
        y,
        lastX: x,
        lastY: y,
        vx: Math.cos(angle) * SPEED,
        vy: Math.sin(angle) * SPEED,
        life: Math.floor(Math.random() * MAX_TTL),
      };
    }

    function handleResize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    }

    function handleMouseLeave() {
      mouseActive = false;
    }

    function handleVisibility() {
      visible = document.visibilityState === "visible";
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    function tick() {
      rafId = requestAnimationFrame(tick);
      if (!visible) return; // don't burn CPU on a hidden tab

      // soft trail: paint a low-alpha black rect instead of clearing, so old
      // positions fade out gradually rather than vanishing instantly
      ctx!.fillStyle = `rgba(6, 8, 20, ${TRAIL_ALPHA})`;
      ctx!.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.lastX = p.x;
        p.lastY = p.y;
        p.life++;

        if (mouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_THRESHOLD && dist > 0.001) {
            const strength =
              ((MOUSE_THRESHOLD - dist) / MOUSE_THRESHOLD) * MOUSE_REPEL;
            const nx = dx / dist;
            const ny = dy / dist;
            p.vx += (nx * strength - p.vx) * MOUSE_LERP;
            p.vy += (ny * strength - p.vy) * MOUSE_LERP;
          }
        }

        // gentle drift back toward base speed so particles don't accelerate forever
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
        p.vx += ((p.vx / currentSpeed) * SPEED - p.vx) * 0.01;
        p.vy += ((p.vy / currentSpeed) * SPEED - p.vy) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        if (
          p.x < 0 ||
          p.x > width ||
          p.y < 0 ||
          p.y > height ||
          p.life >= MAX_TTL
        ) {
          Object.assign(p, spawnParticle(width, height));
        }

        const fadeIn = Math.min(p.life / 40, 1); // matches "fade: in" — new particles ease in over ~40 frames
        const hue =
          BASE_HUE + (Math.sin(p.life * 0.01) * 0.5 + 0.5) * HUE_RANGE;

        ctx!.strokeStyle = `hsla(${hue}, 90%, 65%, ${fadeIn * 0.8})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(p.lastX, p.lastY);
        ctx!.lineTo(p.x, p.y);
        ctx!.stroke();
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="os-desktop-bg__particles"
      aria-hidden="true"
    />
  );
}
