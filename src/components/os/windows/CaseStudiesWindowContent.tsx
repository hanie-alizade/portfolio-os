"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Network,
  Terminal,
  FileJson,
  ChevronRight,
  LockKeyhole,
  ChevronLeft,
  Target,
  ClipboardList,
  Workflow,
  TrendingUp,
} from "lucide-react";
import { useWindowPayload } from "@/components/os/window/WindowManagerContext";

type CaseStudy = {
  id: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  icon: typeof Network;
  image: string;
  situation: string;
  task: string;
  action: string;
  result: string;
};

type CaseStudiesPayload = {
  caseStudyId?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "01",
    title: "Enterprise Microfrontend Architecture",
    company: "Espad",
    description:
      "Re-architecting a large enterprise platform from a frontend monolith to a scalable microfrontend ecosystem.",
    tags: [
      "Module Federation",
      "pnpm",
      "Monorepo",
      "OAuth2 / OIDC",
      "Authorization Code Flow",
      "JWT",
    ],
    icon: Network,
    image: "/os/case-study.png",
    situation:
      "A large enterprise platform was being operated as a frontend monolith.",
    task: "Split the platform into independently deployable applications while maintaining a shared design system/component library across teams.",
    action:
      "Designed a microfrontend architecture using Module Federation with a pnpm-based monorepo. Split the codebase into separate repos — including Espad Component, a standalone microfrontend-based design system (itself composed of multiple apps) consumed by Espad Dashboard like an installable package. OAuth2/OIDC was implemented as part of this architecture, including Authorization Code Flow, JWT session handling, and redirect-based login.",
    result:
      "Independently deployable applications with a shared component library consumed across teams, creating a foundation for parallel team scalability.",
  },
  {
    id: "02",
    title: "Custom gRPC Debug Panel",
    company: "Espad",
    description:
      "A custom internal tool that made gRPC traffic as easy to debug as REST.",
    tags: ["gRPC", "Debugging", "Development Tool", "Logging"],
    icon: Terminal,
    image: "/os/case-study.png",
    situation:
      "The development/staging team didn't have a convenient way to inspect gRPC traffic — REST traffic could easily be inspected through the browser Network tab, but gRPC required a different workflow.",
    task: "Build an internal development/staging tool for intercepting and logging gRPC API calls.",
    action:
      "Built an environment-aware debug panel with a dedicated log view — conceptually, a custom 'Network tab' for gRPC.",
    result:
      "Faster debugging for the frontend team without depending on backend-specific debugging tools.",
  },
  {
    id: "03",
    title: "Schema-Driven Dynamic Form System",
    company: "Boxy",
    description:
      "A schema-driven form system that allowed the frontend to adapt to Zendesk form configuration without code changes.",
    tags: ["Zendesk", "Schema-driven UI", "Dynamic Forms", "React Native"],
    icon: FileJson,
    image: "/os/case-study.png",
    situation:
      "Ticketing was handled through Zendesk. There were five ticket types at the time, with the possibility of more — each with different fields and rules, controlled by Zendesk's configuration.",
    task: "Build a dynamic form system inside the dashboard that could generate the appropriate form directly from the Zendesk response, without requiring frontend code changes to add or change a form.",
    action:
      "Designed a three-layer schema-driven architecture: FormContainer — displays available forms, manages user selection. FormBuilder — interprets the Zendesk response schema (label, placeholder, required state, validation rule, field type). FieldRenderer — renders the actual field based on its type (input, dropdown, attachment, etc.).",
    result:
      "A completely new capability, not a refactor. When Zendesk forms were updated or a new form was added, the frontend adapted without code changes. The architecture was reusable enough that the React Native team reused the same frontend logic instead of implementing a separate system.",
  },
];

export function CaseStudiesWindowContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const payload = useWindowPayload<CaseStudiesPayload>("case-studies");
  const activeStudy = CASE_STUDIES[activeIndex];

  useEffect(() => {
    if (payload?.caseStudyId) {
      const index = CASE_STUDIES.findIndex(
        (study) => study.id === payload.caseStudyId
      );
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [payload]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? CASE_STUDIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === CASE_STUDIES.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="os-case-studies">
      <div className="os-case-studies__sidebar">
        <div className="os-case-studies__sidebar-header">
          <h3 className="os-case-studies__sidebar-title">Case Studies</h3>
          <p className="os-case-studies__sidebar-subtitle">
            Selected engineering work
          </p>
        </div>
        <div className="os-case-studies__list">
          {CASE_STUDIES.map((study, index) => {
            const Icon = study.icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={study.id}
                type="button"
                className={`os-case-studies__item${
                  isActive ? " os-case-studies__item--active" : ""
                }`}
                onClick={() => handleSelect(index)}
                aria-label={`Select ${study.title}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="os-case-studies__item-number">{study.id}</span>
                <Icon
                  className="os-case-studies__item-icon"
                  size={20}
                  strokeWidth={1.75}
                />
                <div className="os-case-studies__item-content">
                  <span className="os-case-studies__item-title">
                    {study.title}
                  </span>
                  <span className="os-case-studies__item-company">
                    {study.company}
                  </span>
                </div>
                <ChevronRight
                  className="os-case-studies__item-chevron"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
        <div className="os-case-studies__nda-notice">
          <div className="os-case-studies__nda-divider" />
          <div className="os-case-studies__nda-content">
            <LockKeyhole
              size={16}
              strokeWidth={1.75}
              className="os-case-studies__nda-icon"
              aria-hidden="true"
            />
            <div className="os-case-studies__nda-text">
              <p className="os-case-studies__nda-heading">
                Real work. Under NDA.
              </p>
              <p className="os-case-studies__nda-body">
                Some projects can't be shown publicly, but the challenges,
                decisions and impact are real.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="os-case-studies__main">
        <div className="os-case-studies__content">
          <div className="os-case-studies__breadcrumb">
            <span>Case Studies</span>
            <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
            <span>{activeStudy.title}</span>
          </div>
          <div className="os-case-studies__company-badge">
            {activeStudy.company}
          </div>
          <div className="os-case-studies__hero">
            <div className="os-case-studies__hero-image os-window-content__media os-window-content__media--plain">
              <Image
                src={activeStudy.image}
                alt={`Visual representation of ${activeStudy.title}`}
                width={430}
                height={319}
                className="os-case-studies__hero-img"
                loading="lazy"
              />
            </div>
            <div className="os-case-studies__hero-text">
              <h2 className="os-case-studies__title">{activeStudy.title}</h2>
              <p className="os-case-studies__description">
                {activeStudy.description}
              </p>
              <div className="os-case-studies__tags">
                {activeStudy.tags.map((tag) => (
                  <span key={tag} className="os-case-studies__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="os-case-studies__star-grid">
            <div className="os-case-studies__star-card">
              <div className="os-case-studies__star-icon-wrapper">
                <Target
                  size={24}
                  strokeWidth={1.75}
                  className="os-case-studies__star-icon"
                  aria-hidden="true"
                />
              </div>
              <h4 className="os-case-studies__star-heading">Situation</h4>
              <p className="os-case-studies__star-body">
                {activeStudy.situation}
              </p>
            </div>
            <div className="os-case-studies__star-card">
              <div className="os-case-studies__star-icon-wrapper">
                <ClipboardList
                  size={24}
                  strokeWidth={1.75}
                  className="os-case-studies__star-icon"
                  aria-hidden="true"
                />
              </div>
              <h4 className="os-case-studies__star-heading">Task</h4>
              <p className="os-case-studies__star-body">{activeStudy.task}</p>
            </div>
            <div className="os-case-studies__star-card">
              <div className="os-case-studies__star-icon-wrapper">
                <Workflow
                  size={24}
                  strokeWidth={1.75}
                  className="os-case-studies__star-icon"
                  aria-hidden="true"
                />
              </div>
              <h4 className="os-case-studies__star-heading">Action</h4>
              <p className="os-case-studies__star-body">{activeStudy.action}</p>
            </div>
            <div className="os-case-studies__star-card">
              <div className="os-case-studies__star-icon-wrapper">
                <TrendingUp
                  size={24}
                  strokeWidth={1.75}
                  className="os-case-studies__star-icon"
                  aria-hidden="true"
                />
              </div>
              <h4 className="os-case-studies__star-heading">Result</h4>
              <p className="os-case-studies__star-body">{activeStudy.result}</p>
            </div>
          </div>
          <div className="os-case-studies__navigation">
            <button
              type="button"
              className="os-case-studies__nav-button"
              onClick={handlePrevious}
              aria-label="Previous case study"
            >
              <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
              <span>Previous</span>
            </button>
            <div className="os-case-studies__pagination">
              {CASE_STUDIES.map((study, index) => (
                <button
                  key={study.id}
                  type="button"
                  className={`os-case-studies__pagination-indicator${
                    index === activeIndex
                      ? " os-case-studies__pagination-indicator--active"
                      : ""
                  }`}
                  onClick={() => handleSelect(index)}
                  aria-label={`Go to case study ${study.id}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                >
                  {study.id}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="os-case-studies__nav-button"
              onClick={handleNext}
              aria-label="Next case study"
            >
              <span>Next</span>
              <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
