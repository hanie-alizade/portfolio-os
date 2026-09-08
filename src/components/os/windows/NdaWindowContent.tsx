"use client";

import Image from "next/image";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";
import {
  Layers,
  Lightbulb,
  Puzzle,
  Wrench,
  TrendingUp,
  Lock,
} from "lucide-react";

const CATEGORY_CARDS = [
  { label: "Architecture", Icon: Layers, color: "var(--os-accent)" },
  { label: "My Approach", Icon: Lightbulb, color: "var(--os-cyan)" },
  { label: "Challenges", Icon: Puzzle, color: "var(--os-warning)" },
  { label: "Solutions", Icon: Wrench, color: "var(--os-green)" },
  { label: "Impact", Icon: TrendingUp, color: "var(--os-pink)" },
] as const;

export function NdaWindowContent() {
  const { openWindow } = useWindowManager();

  return (
    <div className="os-nda">
      <div className="os-nda__hero">
        <div className="os-nda__copy">
          <p className="os-eyebrow os-eyebrow--danger">Restricted Access</p>
          <div className="flex gap-2 items-center my-1">
            <Lock size={20} strokeWidth={2} style={{ color: "#fb7185" }} />
            <h3 className="os-window-heading os-window-heading--danger">
              ACCESS DENIED
            </h3>
          </div>
          <p className="os-window-copy">
            These projects are protected under NDA. But I can show you...
          </p>
          <div className="flex max-w-80 items-center justify-center flex-wrap gap-2 my-3">
            {CATEGORY_CARDS.map((card) => (
              <div
                key={card.label}
                className="flex flex-col items-center justify-center min-w-[6rem] h-[4.75rem] gap-1.5  px-0.5 rounded-sm border bg-white/5 text-xs text-os-text-muted"
                style={{
                  borderColor: `color-mix(in srgb, ${card.color} 5%, var(--os-border))`,
                  background: `color-mix(in srgb, ${card.color} 10%, transparent)`,
                }}
              >
                <card.Icon
                  size={26}
                  strokeWidth={1.75}
                  style={{ color: card.color }}
                />
                <span>{card.label}</span>
              </div>
            ))}
          </div>
          <p className="os-window-copy max-w-96 mt-4">
            Most of the products I've built, including enterprise dashboards,
            internal panels, and healthcare platforms, are under active NDAs, so
            I can't share live links or real screens.
          </p>
          <p className="os-window-copy mt-5">
            This interactive reconstruction demonstrates the same type of
            frontend systems and problem-solving, without exposing confidential
            product details.
          </p>
          <button
            type="button"
            className="os-btn os-btn--primary mt-7"
            onClick={() => openWindow("case-studies")}
          >
            VIEW CASE STUDIES →
          </button>
        </div>
      </div>
      <div className="os-window-content__media os-window-content__media--plain os-nda__media">
        <Image
          src="/os/nda-vault.png"
          alt="Stylized vault door representing NDA-protected work"
          width={1536}
          height={1024}
          className="os-window-media-image"
          loading="lazy"
        />
      </div>
    </div>
  );
}
