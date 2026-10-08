import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type BootSplashProps = {
  variant: "mobile" | "desktop";
  onComplete: () => void;
};

export function BootSplash({ variant, onComplete }: BootSplashProps) {
  const [stage, setStage] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Skip animation for reduced motion
      setStage(variant === "mobile" ? 5 : 2);
      const timer = setTimeout(() => onComplete(), 50);
      return () => clearTimeout(timer);
    }

    if (variant === "mobile") {
      const timers = [
        setTimeout(() => setStage(1), 200),
        setTimeout(() => setStage(2), 700),
        setTimeout(() => setStage(3), 1200),
        setTimeout(() => setStage(4), 2200),
        setTimeout(() => setStage(5), 5000),
        setTimeout(() => onComplete(), 7000),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      // Desktop variant: shorter timing
      const timers = [
        setTimeout(() => setStage(1), 200),
        setTimeout(() => setStage(2), 1000),
        setTimeout(() => setStage(3), 2300),
        setTimeout(() => onComplete(), 2800),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [onComplete, reducedMotion, variant]);

  return (
    <div
      className={`os-boot-splash${
        stage === (variant === "mobile" ? 5 : 3) ? " os-boot-splash--exit" : ""
      }`}
    >
      {variant === "mobile" ? (
        <div className="os-boot-splash__content">
          <p
            className={`os-boot-splash__line${
              stage >= 1 ? " os-boot-splash__line--in" : ""
            }`}
          >
            Hello,
          </p>
          <h2
            className={`os-boot-splash__line os-boot-splash__line--name${
              stage >= 2 ? " os-boot-splash__line--in" : ""
            }`}
          >
            I&apos;m Hanieh
          </h2>
          <p
            className={`os-boot-splash__line${
              stage >= 3 ? " os-boot-splash__line--in" : ""
            }`}
          >
            Frontend Engineer
          </p>
          <p
            className={`os-boot-splash__line${
              stage >= 4 ? " os-boot-splash__line--in" : ""
            }`}
          >
            I build experiences that
            <br />
            users love.
          </p>
        </div>
      ) : (
        <div className="os-boot-splash__content os-boot-splash__content--desktop">
          <p
            className={`os-boot-splash__boot-line${
              stage >= 1 ? " os-boot-splash__boot-line--in" : ""
            }`}
          >
            booting hanie_os...
          </p>
          <h2
            className={`os-boot-splash__welcome${
              stage >= 2 ? " os-boot-splash__welcome--in" : ""
            }`}
          >
            Welcome.
          </h2>
        </div>
      )}
    </div>
  );
}
