import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  Network,
  Terminal,
  FileJson,
  ChevronRight,
  LockKeyhole,
  ChevronLeft,
  Target,
  Workflow,
  TrendingUp,
  Radio,
  Activity,
} from "lucide-react";
import { useWindowPayload } from "@/components/os/window/WindowManagerContext";
import { useIsCompactViewport } from "@/hooks/useIsCompactViewport";

type CaseStudy = {
  id: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  icon: typeof Network;
  image: string;
  situation: ReactNode;
  action: ReactNode;
  result: ReactNode;
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
    image: "/os/case-study.webp",
    situation: (
      <>
        A large enterprise platform was being operated as a <strong>frontend monolith</strong>. The
        goal was to split it into independently deployable applications while maintaining a{" "}
        <span className="accent">shared design system</span> and component library across teams.
      </>
    ),
    action: (
      <>
        Designed a <strong>microfrontend architecture</strong> using <code>Module Federation</code>{" "}
        with a pnpm-based monorepo. Split the codebase into separate repos, including{" "}
        <code>Espad Component</code>, a standalone microfrontend-based design system (itself
        composed of multiple apps) consumed by <code>Espad Dashboard</code> like an installable
        package.
        <br />
        <br />
        OAuth2/OIDC was implemented as part of this architecture, including{" "}
        <span className="accent">Authorization Code Flow</span>, JWT session handling, and
        redirect-based login.
      </>
    ),
    result: (
      <>
        Independently deployable applications with a{" "}
        <span className="accent">shared component library</span> consumed across teams, creating a
        foundation for <strong>parallel team scalability</strong>.
      </>
    ),
  },
  {
    id: "02",
    title: "Custom gRPC Debug Panel",
    company: "Espad",
    description: "A custom internal tool that made gRPC traffic as easy to debug as REST.",
    tags: ["gRPC", "Debugging", "Development Tool", "Logging"],
    icon: Terminal,
    image: "/os/case-study.webp",
    situation: (
      <>
        The development and staging team had no convenient way to inspect{" "}
        <strong>gRPC traffic</strong>. REST calls could be inspected directly through the
        browser&apos;s Network tab, but gRPC needed a different workflow.
        <br />
        <br />
        The goal was to build an internal tool for{" "}
        <span className="accent">intercepting and logging</span> gRPC API calls.
      </>
    ),
    action: (
      <>
        Built an environment-aware debug panel with a dedicated log view: conceptually, a{" "}
        <strong>custom &apos;Network tab&apos; for gRPC</strong>.
      </>
    ),
    result: (
      <>
        Faster debugging for the frontend team without depending on{" "}
        <span className="accent">backend-specific debugging tools</span>.
      </>
    ),
  },
  {
    id: "03",
    title: "Schema-Driven Dynamic Form System",
    company: "Boxy",
    description:
      "A schema-driven form system that allowed the frontend to adapt to Zendesk form configuration without code changes.",
    tags: ["Zendesk", "Schema-driven UI", "Dynamic Forms", "React Native"],
    icon: FileJson,
    image: "/os/case-study.webp",
    situation: (
      <>
        Ticketing was handled through <strong>Zendesk</strong>, with five ticket types at the time
        and the possibility of more, each with different fields and rules controlled by
        Zendesk&apos;s own configuration.
        <br />
        <br />
        The goal was to build a <span className="accent">dynamic form system</span> inside the
        dashboard that could generate the right form directly from the Zendesk response, without
        requiring frontend code changes to add or change a form.
      </>
    ),
    action: (
      <>
        Designed a <strong>three-layer schema-driven architecture</strong>:
        <br />
        <br />
        <code>FormContainer</code> displays available forms and manages user selection.
        <br />
        <code>FormBuilder</code> interprets the Zendesk response schema (label, placeholder,
        required state, validation rule, field type).
        <br />
        <code>FieldRenderer</code> renders the actual field based on its type (input, dropdown,
        attachment, etc.).
      </>
    ),
    result: (
      <>
        A <strong>completely new capability</strong>, not a refactor. When Zendesk forms were
        updated or a new form was added, the frontend adapted without code changes.
        <br />
        <br />
        The architecture was reusable enough that the{" "}
        <span className="accent">React Native team</span> reused the same frontend logic instead of
        implementing a separate system.
      </>
    ),
  },
  {
    id: "04",
    title: "Cross-Microfrontend Action Bus",
    company: "Espad",
    description:
      "A lightweight, event-based communication layer letting independent microfrontends trigger actions in each other without direct coupling.",
    tags: ["Microfrontends", "Event-Driven", "Shell Architecture", "Cross-App Communication"],
    icon: Radio,
    image: "/os/case-study.webp",
    situation: (
      <>
        Espad&apos;s platform was composed of several <strong>independent microfrontends</strong>{" "}
        (Supplier, Evaluator, User Management, Tender, etc) coordinated by a central{" "}
        <code>Shell</code> application.
        <br />
        <br />
        Some user actions in one microfrontend needed to immediately affect another, for example
        updating the Header, or trigger navigation to an inactive microfrontend before running an
        action there. Directly importing one microfrontend&apos;s internals from another would have
        broken their independence.
      </>
    ),
    action: (
      <>
        Designed a Shell-based communication layer called the <strong>Action Bus</strong>.
        <br />
        <br />
        Each microfrontend declared the actions it exposed, and any other microfrontend could
        dispatch them through a shared{" "}
        <div className="os-case-studies__sar-body-code">
          runAction(
          <br />
          &nbsp;&nbsp;app: SUPLIER_APP,
          <br />
          &nbsp;&nbsp;action: SUPLIER_ACTIONS.ABC,
          <br />
          &nbsp;&nbsp;payload
          <br />)
        </div>
        paired with a hook for dispatching and listening.
        <br />
        <br />
        Communication ran over <span className="accent">browser-level events</span> rather than a
        shared state store, so microfrontends never imported each other&apos;s code. If the target
        microfrontend wasn&apos;t currently active, the Shell used the URL as the source of truth to
        navigate to it first, then executed the action.
        <br />
        <br />
        Multiple actions were processed through a queue, sequentially, to avoid{" "}
        <strong>race conditions</strong> between concurrent cross-app calls.
      </>
    ),
    result: (
      <>
        Microfrontends coordinated behavior through a{" "}
        <span className="accent">stable action contract</span> instead of direct dependencies, each
        still owning its own internal state.
        <br />
        <br />
        Inactive-target actions fell back to <strong>URL navigation</strong> automatically, and
        queued execution kept cross-app calls predictable under rapid triggering.
      </>
    ),
  },
  {
    id: "05",
    title: "Production Error Observability with Sentry",
    company: "Boxy",
    description:
      "Structured error tracking, performance tracing, and session replay for a production React app, tuned to stay useful without flooding Sentry with noise or sensitive data.",
    tags: ["Sentry", "Error Tracking", "Performance Monitoring", "Session Replay"],
    icon: Activity,
    image: "/os/case-study.webp",
    situation: (
      <>
        Boxy&apos;s production React app had error tracking, but similar-looking errors, like{" "}
        <code>AxiosError 404</code> vs <code>500</code>, were hard to tell apart, with no context on
        which API failed, which route it happened on, or what led to it.
        <br />
        <br />
        Production traffic was far higher than staging, so{" "}
        <span className="accent">telemetry needed to be controlled</span> rather than captured in
        full, and sensitive data like Authorization headers could never reach Sentry.
      </>
    ),
    action: (
      <>
        Set up <strong>Sentry (@sentry/react)</strong> with environment- and release-aware
        configuration, resolved from hostname when explicit env vars weren&apos;t set, and disabled
        entirely in local development.
        <br />
        <br />
        Built <strong>custom fingerprinting</strong> for Axios errors (method, endpoint, and status,
        e.g. <code>axios-GET-/api/orders-404</code>) instead of grouping everything under one
        generic AxiosError, and tagged each error with its endpoint, HTTP method, status, and a
        classified type (server, client, or network).
        <br />
        <br />
        Stripped Authorization headers in <code>beforeSend</code> before any event left the browser.
        Enabled browser and React Router tracing, profiling, and session replay with{" "}
        <span className="accent">environment-aware sampling</span>: full visibility in staging, and
        in production 20% of traces and replay sessions but 100% replay on any error. Removed
        console breadcrumbs in production to cut noise.
      </>
    ),
    result: (
      <>
        Errors became <strong>groupable and filterable</strong> by endpoint and status instead of
        one generic bucket, with route, breadcrumbs, replay, and a performance trace attached to
        every event.
        <br />
        <br />
        Production telemetry volume stayed controlled while staging kept full visibility, and
        Authorization tokens never reached Sentry.
      </>
    ),
  },
];

function SarBody({ text }: { text: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  return (
    <div className="os-case-studies__sar-body-wrap">
      <div
        ref={ref}
        className={`os-case-studies__sar-body${
          expanded ? " os-case-studies__sar-body--expanded" : ""
        }`}
      >
        {text}
      </div>
      {(isClamped || expanded) && (
        <button
          type="button"
          className="os-case-studies__sar-toggle"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export function CaseStudiesWindowContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isCompact = useIsCompactViewport();
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [isEntering, setIsEntering] = useState(false);
  const payload = useWindowPayload<CaseStudiesPayload>("case-studies");
  const activeStudy = CASE_STUDIES[activeIndex];

  useEffect(() => {
    if (payload?.caseStudyId) {
      const index = CASE_STUDIES.findIndex((study) => study.id === payload.caseStudyId);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [payload]);

  useEffect(() => {
    if (!isCompact) return;
    setIsEntering(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsEntering(true));
    });
  }, [mobileView, isCompact]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? CASE_STUDIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === CASE_STUDIES.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    if (isCompact) {
      setMobileView("detail");
    }
  };

  return (
    <div className="os-case-studies">
      {!isCompact || mobileView === "list" ? (
        <div
          className={`os-case-studies__sidebar${
            isEntering && mobileView === "list" ? " os-case-studies__sidebar--entering" : ""
          }`}
        >
          <div className="os-case-studies__sidebar-header">
            <h3 className="os-case-studies__sidebar-title">Case Studies</h3>
            <p className="os-case-studies__sidebar-subtitle">Selected engineering work</p>
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
                  <Icon className="os-case-studies__item-icon" size={20} strokeWidth={1.75} />
                  <div className="os-case-studies__item-content">
                    <span className="os-case-studies__item-title">{study.title}</span>
                    <span className="os-case-studies__item-company">{study.company}</span>
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
                <p className="os-case-studies__nda-heading">Real work. Under NDA.</p>
                <p className="os-case-studies__nda-body">
                  Some projects can&apos;t be shown publicly, but the challenges, decisions and
                  impact are real.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {!isCompact || mobileView === "detail" ? (
        <div
          className={`os-case-studies__main${
            isEntering && mobileView === "detail" ? " os-case-studies__main--entering" : ""
          }`}
        >
          <div className="os-case-studies__content">
            {isCompact && mobileView === "detail" && (
              <button
                type="button"
                className="os-case-studies__back-button"
                onClick={() => setMobileView("list")}
                aria-label="Back to case studies list"
              >
                <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
                <span>Case Studies</span>
              </button>
            )}
            <div className="os-case-studies__breadcrumb">
              <span>Case Studies</span>
              <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
              <span>{activeStudy.title}</span>
            </div>
            <div className="os-case-studies__company-badge">{activeStudy.company}</div>
            <div className="os-case-studies__hero">
              <div className="os-case-studies__hero-image os-window-content__media os-window-content__media--plain">
                <img
                  src={activeStudy.image}
                  alt={`Visual representation of ${activeStudy.title}`}
                  width={430}
                  height={319}
                  className="os-case-studies__hero-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="os-case-studies__hero-text">
                <h2 className="os-case-studies__title">{activeStudy.title}</h2>
                <p className="os-case-studies__description">{activeStudy.description}</p>
                <div className="os-case-studies__tags">
                  {activeStudy.tags.map((tag) => (
                    <span key={tag} className="os-case-studies__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="os-case-studies__sar-grid">
              <div className="os-case-studies__sar-card">
                <div className="os-case-studies__sar-icon-wrapper">
                  <Target
                    size={24}
                    strokeWidth={1.75}
                    className="os-case-studies__sar-icon"
                    aria-hidden="true"
                  />
                </div>
                <h4 className="os-case-studies__sar-heading">Situation</h4>
                <SarBody key={`${activeStudy.id}-situation`} text={activeStudy.situation} />
              </div>
              <div className="os-case-studies__sar-card">
                <div className="os-case-studies__sar-icon-wrapper">
                  <Workflow
                    size={24}
                    strokeWidth={1.75}
                    className="os-case-studies__sar-icon"
                    aria-hidden="true"
                  />
                </div>
                <h4 className="os-case-studies__sar-heading">Action</h4>
                <SarBody key={`${activeStudy.id}-action`} text={activeStudy.action} />
              </div>
              <div className="os-case-studies__sar-card">
                <div className="os-case-studies__sar-icon-wrapper">
                  <TrendingUp
                    size={24}
                    strokeWidth={1.75}
                    className="os-case-studies__sar-icon"
                    aria-hidden="true"
                  />
                </div>
                <h4 className="os-case-studies__sar-heading">Result</h4>
                <SarBody key={`${activeStudy.id}-result`} text={activeStudy.result} />
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
                      index === activeIndex ? " os-case-studies__pagination-indicator--active" : ""
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
      ) : null}
    </div>
  );
}
