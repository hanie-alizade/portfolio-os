import Image from "next/image";

const CASE_STUDIES = [
  {
    id: 1,
    title: "Enterprise Microfrontend Architecture",
    company: "Espad",
    situation:
      "A large enterprise platform was being operated as a frontend monolith.",
    task: "Split the platform into independently deployable applications while maintaining a shared design system/component library across teams.",
    action:
      "Designed a microfrontend architecture using Module Federation with a pnpm-based monorepo. Split the codebase into separate repos — including Espad Component, a standalone microfrontend-based design system (itself composed of multiple apps) consumed by Espad Dashboard like an installable package. OAuth2/OIDC was implemented as part of this architecture, including Authorization Code Flow, JWT session handling, and redirect-based login.",
    result:
      "Independently deployable applications with a shared component library consumed across teams, creating a foundation for parallel team scalability.",
  },
  {
    id: 2,
    title: "Custom gRPC Debug Panel",
    company: "Espad",
    situation:
      "The development/staging team didn't have a convenient way to inspect gRPC traffic — REST traffic could easily be inspected through the browser Network tab, but gRPC required a different workflow.",
    task: "Build an internal development/staging tool for intercepting and logging gRPC API calls.",
    action:
      "Built an environment-aware debug panel with a dedicated log view — conceptually, a custom 'Network tab' for gRPC.",
    result:
      "Faster debugging for the frontend team without depending on backend-specific debugging tools.",
  },
  {
    id: 3,
    title: "Schema-Driven Dynamic Form System",
    company: "Boxy",
    situation:
      "Ticketing was handled through Zendesk. There were five ticket types at the time, with the possibility of more — each with different fields and rules, controlled by Zendesk's configuration.",
    task: "Build a dynamic form system inside the dashboard that could generate the appropriate form directly from the Zendesk response, without requiring frontend code changes to add or change a form.",
    action:
      "Designed a three-layer schema-driven architecture: FormContainer — displays available forms, manages user selection. FormBuilder — interprets the Zendesk response schema (label, placeholder, required state, validation rule, field type). FieldRenderer — renders the actual field based on its type (input, dropdown, attachment, etc.).",
    result:
      "A completely new capability, not a refactor. When Zendesk forms were updated or a new form was added, the frontend adapted without code changes. The architecture was reusable enough that the React Native team reused the same frontend logic instead of implementing a separate system.",
  },
] as const;

export function NdaVaultWindowContent() {
  return (
    <div className="os-nda">
      <div className="os-nda__hero">
        <div className="os-nda__copy">
          <p className="os-eyebrow os-eyebrow--danger">Restricted Access</p>
          <h3 className="os-window-heading os-window-heading--danger">
            ACCESS DENIED
          </h3>
          <p className="os-window-copy">These projects protected under NDA.</p>
          <p className="os-window-copy">But I can show you...</p>
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
      <div className="os-nda__studies">
        {CASE_STUDIES.map((study) => (
          <article key={study.id} className="os-nda__study">
            <div className="os-nda__study-header">
              <h4 className="os-nda__study-title">{study.title}</h4>
              <span className="os-nda__study-company">{study.company}</span>
            </div>
            <div className="os-nda__study-content">
              <div className="os-nda__study-section">
                <h5>Situation</h5>
                <p>{study.situation}</p>
              </div>
              <div className="os-nda__study-section">
                <h5>Task</h5>
                <p>{study.task}</p>
              </div>
              <div className="os-nda__study-section">
                <h5>Action</h5>
                <p>{study.action}</p>
              </div>
              <div className="os-nda__study-section">
                <h5>Result</h5>
                <p>{study.result}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
