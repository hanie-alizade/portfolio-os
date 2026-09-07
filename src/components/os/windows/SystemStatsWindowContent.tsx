"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplayedYearsOfExperience } from "@/lib/experience";

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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, duration = 1200) {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(easeOutCubic(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reducedMotion]);

  return value;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateTrendLine({
  seed,
  points = 26,
  noise = 4,
  trendFn,
  height = 60,
}: {
  seed: number;
  points?: number;
  noise?: number;
  trendFn: (t: number) => number;
  height?: number;
}) {
  const rand = mulberry32(seed);
  const values: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const base = trendFn(t);
    const jitter = (rand() - 0.5) * noise;
    const y = height - base * (height - 8) - jitter;
    values.push(Math.max(2, Math.min(height - 2, y)));
  }
  return values;
}

const GRAPH_DATA = {
  experience: generateTrendLine({ seed: 1, trendFn: (t) => t, noise: 25 }), // رشد خطی با جهش‌های متوسط
  interfaces: generateTrendLine({
    seed: 2,
    trendFn: (t) => Math.pow(t, 0.8),
    noise: 15,
  }),
  bugs: generateTrendLine({
    seed: 3,
    trendFn: (t) => 1 - Math.pow(1 - t, 2),
    noise: 14,
  }),
  coffee: generateTrendLine({
    seed: 4,
    trendFn: (t) => Math.pow(t, 1),
    noise: 20,
  }),
} as const;

function toJaggedPath(points: readonly number[]): string {
  const stepX = 160 / (points.length - 1);
  return points
    .map(
      (y, i) =>
        `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(1)} ${y.toFixed(1)}`
    )
    .join(" ");
}

function StatGraph({
  color,
  shape,
  isUnstable = false,
}: {
  color: string;
  shape: readonly number[];
  isUnstable?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(!reducedMotion), [reducedMotion]);

  return (
    <svg
      className="os-stats__graph"
      viewBox="0 0 160 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={toJaggedPath(shape)}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "os-stats__graph--animate" : ""}
      />
    </svg>
  );
}

function CoffeeParticles() {
  const particlesRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = particlesRef.current;
    if (!container || reducedMotion) return;

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
  }, [reducedMotion]);

  return (
    <div
      ref={particlesRef}
      className="os-coffee-effect__particles"
      aria-hidden="true"
    />
  );
}

export function SystemStatsWindowContent() {
  const experience = useCountUp(getDisplayedYearsOfExperience(), 1200);
  const interfaces = useCountUp(500, 1600);
  const bugCount = useCountUp(12, 1400);
  const totalBugs = 12;
  const showInfinity = interfaces >= 500;

  const [coffee, setCoffee] = useState(4);
  const [overflow, setOverflow] = useState(false);
  const [microShake, setMicroShake] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [coffeeStarted, setCoffeeStarted] = useState(false);

  useEffect(() => {
    if (overflow || coffeeStarted) return;

    const startCoffee = () => {
      setCoffeeStarted(true);

      const id = window.setInterval(() => {
        setCoffee((current) => {
          if (current >= COFFEE_OVERFLOW) {
            window.clearInterval(id);
            setOverflow(true);
            setMicroShake(true);
            setShowParticles(true);

            window.setTimeout(() => setMicroShake(false), 200);
            window.setTimeout(() => setShowParticles(false), 400);

            return current;
          }
          return current + Math.floor(Math.random() * 8) + 4;
        });
      }, COFFEE_TICK_MS);

      return () => window.clearInterval(id);
    };

    const timer = setTimeout(startCoffee, 900);
    return () => {
      clearTimeout(timer);
    };
  }, [overflow, coffeeStarted]);

  return (
    <div className="os-stats os-stats--portrait">
      {/* Experience Section */}
      <div className="os-stats__section">
        <div className="os-stats__content">
          <div className="os-stats__label">EXPERIENCE</div>
          <div className="os-stats__value os-stats__value--purple">
            {String(experience).padStart(2, "0")}+
          </div>
          <div className="os-stats__sub">years</div>
        </div>
        <div className="os-stats__graph-container">
          <StatGraph color="var(--os-accent)" shape={GRAPH_DATA.experience} />
        </div>
      </div>

      <div className="os-stats__separator" />

      {/* Interfaces Section */}
      <div className="os-stats__section">
        <div className="os-stats__content">
          <div className="os-stats__label">INTERFACES BUILT</div>
          <div className="os-stats__value os-stats__value--cyan">
            {showInfinity ? "∞" : interfaces}
          </div>
          <div className="os-stats__sub">and counting</div>
        </div>
        <div className="os-stats__graph-container">
          <StatGraph color="var(--os-cyan)" shape={GRAPH_DATA.interfaces} />
        </div>
      </div>

      <div className="os-stats__separator" />

      {/* Bugs Section */}
      <div className="os-stats__section">
        <div className="os-stats__content">
          <div className="os-stats__label">BUGS FIXED</div>
          <div className="os-stats__bugs-blocks">
            {Array.from({ length: totalBugs }).map((_, i) => (
              <div
                key={i}
                className={`os-stats__bug-block${
                  i < bugCount ? " os-stats__bug-block--active" : ""
                }`}
              />
            ))}
          </div>
          <div className="os-stats__sub">and counting</div>
        </div>
        <div className="os-stats__graph-container">
          <StatGraph color="var(--os-green)" shape={GRAPH_DATA.bugs} />
        </div>
      </div>

      <div className="os-stats__separator" />

      {/* Coffee Section */}
      <div
        className={`os-stats__section os-coffee-section${
          microShake ? " os-coffee-section--micro-shake" : ""
        }`}
      >
        <div className="os-stats__content">
          <div className="os-stats__label">COFFEE</div>
          {overflow ? (
            <div className="os-stats__coffee-overflow">
              <span className="os-stats__value os-stats__value--error">
                COFFEE OVERFLOW
              </span>
            </div>
          ) : (
            <div className="os-stats__value os-stats__value--coffee">
              {coffee}
            </div>
          )}
          <div className="os-stats__sub">
            {overflow ? "Too much caffeine detected." : "Keep grinding!"}
          </div>
          {overflow && showParticles && <CoffeeParticles />}
          {overflow && <div className="os-coffee-effect__flash" />}
        </div>
        <div className="os-stats__graph-container">
          <StatGraph
            color="var(--os-danger)"
            shape={GRAPH_DATA.coffee}
            isUnstable={true}
          />
        </div>
      </div>
    </div>
  );
}
