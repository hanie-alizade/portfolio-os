"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/contact";

export function ResumeWindowContent() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="os-resume">
      <header className="os-resume__header">
        <p className="os-eyebrow">Resume</p>
        <h3 className="os-window-heading">Download CV</h3>
        <p className="os-window-copy">
          My professional experience and skills in PDF format.
        </p>
      </header>

      <div className="os-resume__preview">
        {isLoading && (
          <div className="os-resume__loading">
            <div className="os-resume__spinner" />
            <p>Loading preview...</p>
          </div>
        )}
        <iframe
          src={CONTACT.resumePath}
          className="os-resume__iframe"
          onLoad={() => setIsLoading(false)}
          title="Resume PDF Preview"
        />
      </div>

      <a
        href={CONTACT.resumePath}
        download
        className="os-btn os-btn--primary os-resume__download"
      >
        Download Resume
      </a>
    </div>
  );
}
