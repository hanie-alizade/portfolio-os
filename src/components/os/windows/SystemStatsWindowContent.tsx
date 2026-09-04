"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const COFFEE_OVERFLOW = 500;
const COFFEE_TICK_MS = 10;

const PARTICLE_FRAGMENTS = [
  "01",
  "ERR",
  "COF",
  "!",
  "☕",
  "OVERFLOW",
  "FF",
  "LOW",
  "CA",
  "FE",
] as const;

function StatWave({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      className={`os-stats__wave ${className ?? ""}`}
      viewBox="0 0 120 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 16 Q15 4 30 14 T60 12 T90 16 T120 8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.85"
      />
    </svg>
  );
}

function CoffeeParticles() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const particleCount = 12;
    const particles: HTMLElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isText = Math.random() > 0.4;
      const particle = document.createElement("div");

      if (isText) {
        particle.textContent =
          PARTICLE_FRAGMENTS[
            Math.floor(Math.random() * PARTICLE_FRAGMENTS.length)
          ];
        particle.className = "os-coffee-particle os-coffee-particle--text";
      } else {
        particle.className = "os-coffee-particle os-coffee-particle--rect";
      }

      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = (Math.random() - 0.5) * 360;

      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);
      particle.style.setProperty("--rot", `${rot}deg`);

      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.transform = "translate(-50%, -50%)";

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div
      ref={particlesRef}
      className="os-coffee-effect__particles"
      aria-hidden="true"
    />
  );
}

function useAnimatedExperience() {
  const [experience, setExperience] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const startDate = new Date(2020, 0, 1);
    const currentDate = new Date();
    const yearsDiff =
      currentDate.getFullYear() -
      startDate.getFullYear() +
      (currentDate.getMonth() - startDate.getMonth()) / 12;
    const targetExperience = Math.max(1, Math.floor(yearsDiff));

    if (prefersReducedMotion) {
      setExperience(targetExperience);
      hasAnimated.current = true;
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setExperience(Math.floor(easedProgress * targetExperience));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return experience;
}

function useAnimatedInterfaces() {
  const [interfaces, setInterfaces] = useState(0);
  const [showInfinity, setShowInfinity] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setShowInfinity(true);
      hasAnimated.current = true;
      return;
    }

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setInterfaces(Math.floor(easedProgress * 3000));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setShowInfinity(true);
        hasAnimated.current = true;
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return { interfaces, showInfinity };
}

function useAnimatedProgress(targetPercent: number = 80) {
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setProgress(targetPercent);
      hasAnimated.current = true;
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      setProgress(easedProgress * targetPercent);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
      }
    };

    requestAnimationFrame(animate);
  }, [targetPercent]);

  return progress;
}

export function SystemStatsWindowContent() {
  const experience = useAnimatedExperience();
  const { interfaces, showInfinity } = useAnimatedInterfaces();
  const bugsProgress = useAnimatedProgress(80);

  const [coffee, setCoffee] = useState(4);
  const [overflow, setOverflow] = useState(false);
  const [microShake, setMicroShake] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (overflow) return;

    const id = window.setInterval(() => {
      setCoffee((current) => {
        if (current >= COFFEE_OVERFLOW) {
          setOverflow(true);
          setMicroShake(true);
          setShowParticles(true);
          setGlitch(true);

          window.setTimeout(() => setMicroShake(false), 300);
          window.setTimeout(() => setGlitch(false), 300);
          window.setTimeout(() => setShowParticles(false), 500);

          return current;
        }
        return current + Math.floor(Math.random() * 3) + 1;
      });
    }, COFFEE_TICK_MS);

    return () => window.clearInterval(id);
  }, [overflow]);

  return (
    <div className="os-stats os-stats--rich">
      <div className="os-stats__row">
        <div className="os-stats__meta">
          <span>EXPERIENCE</span>
          <span className="os-stats__value">
            {String(experience).padStart(2, "0")}+
          </span>
        </div>
        <p className="os-stats__sub">years</p>
        {/* <StatWave color="var(--os-accent)" className="os-stats__wave--pulse" /> */}
      </div>

      <div className="os-stats__row">
        <div className="os-stats__meta">
          <span>INTERFACES BUILT</span>
          <span className="os-stats__value os-stats__value--infinity">
            {showInfinity ? "∞" : interfaces}
          </span>
        </div>
        <p className="os-stats__sub">and counting</p>
        {/* <StatWave */}
        {/*   color="var(--os-cyan)" */}
        {/*   className="os-stats__wave--pulse os-stats__wave--delay" */}
        {/* /> */}
      </div>

      <div className="os-stats__row">
        <div className="os-stats__meta">
          <span>BUGS FIXED</span>
        </div>
        <div className="os-stats__track" aria-hidden="true">
          <div
            className="os-stats__fill os-stats__fill--bugs"
            style={{ width: `${bugsProgress}%` }}
          />
        </div>
        <p className="os-stats__sub">and counting</p>
        {/* <StatWave color="var(--os-pink)" /> */}
      </div>

      <div
        className={`os-stats__row os-coffee-row${
          microShake ? " os-coffee-row--micro-shake" : ""
        }`}
      >
        <div className="os-stats__meta os-coffee-effect">
          <span>COFFEE</span>
          {overflow ? (
            <span
              className={`os-stats__error os-coffee-error${
                glitch ? " os-coffee-error--glitch" : ""
              }`}
            >
              COFFEE OVERFLOW
            </span>
          ) : (
            <span className="os-stats__value os-stats__value--coffee">
              {coffee}
            </span>
          )}
          {overflow && showParticles && <CoffeeParticles />}
          {overflow && <div className="os-coffee-effect__flash" />}
        </div>
        {!overflow ? (
          // <StatWave
          //   color="var(--os-warning)"
          //   className="os-stats__wave--pulse"
          // />
          <p className="os-stats__sub">Keep grinding!</p>
        ) : (
          <p className="os-stats__sub os-stats__sub--error">
            System overloaded. Too much caffeine detected.
          </p>
        )}
      </div>
    </div>
  );
}
