"use client";

import { useState, type CSSProperties } from "react";

const BAR_COUNT = 18;

export function MusicWindowContent() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="os-music os-music--player">
      <div
        className={`os-music__visual${playing ? " os-music__visual--active" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <span
            key={index}
            className="os-music__bar"
            style={{ "--bar-i": index } as CSSProperties}
          />
        ))}
      </div>
      <p className="os-music__track">Lofi Beats — Hanie&apos;s Focus Mode</p>
      <p className="os-music__mode">Coding mode / focus mode</p>
      <div className="os-music__controls">
        <button type="button" className="os-music__ctrl" aria-label="Previous track">
          Prev
        </button>
        <button
          type="button"
          className="os-music__ctrl os-music__ctrl--play"
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className="os-music__ctrl" aria-label="Next track">
          Next
        </button>
      </div>
      <div className="os-music__progress" aria-hidden="true">
        <span className="os-music__progress-bar" />
      </div>
      <p className="os-music__time">01:24 / 03:45</p>
    </div>
  );
}
