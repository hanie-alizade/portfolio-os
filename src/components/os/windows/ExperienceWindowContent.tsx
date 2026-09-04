const EXPERIENCE = [
  {
    company: "Boxy",
    role: "Senior Frontend Engineer",
    period: "Oct 2024–Present",
    achievements: [
      "Developed merchant-facing dashboards with real-time shipment tracking across 15+ order lifecycle flows, supporting 1,000+ orders processed daily.",
      "Implemented role-based access control (5 roles, 20+ permissions) via a custom permission hook and wrapper component.",
      "Raised Lighthouse performance from 85 to 97 through caching, lazy loading, and memoization.",
      "Led an incremental UI migration from Ant Design to shadcn/ui, converting the platform page by page without pausing feature work.",
      "Also built a schema-driven dynamic form system → full story in NDA Vault.",
    ],
  },
  {
    company: "Zynx Health",
    role: "Contract Frontend Engineer",
    period: "Jul–Sep 2024",
    achievements: [
      "Built a GraphQL-backed dynamic form builder for physicians, in Svelte — a new framework picked up specifically for this 3-month contract.",
      "Wrapped Syncfusion components in a custom layer to match the team's existing Ant Design/MUI-style API.",
    ],
  },
  {
    company: "Espad",
    role: "Senior Frontend Engineer",
    period: "Jul 2021–Jun 2024",
    achievements: [
      "Built a permission-based UI system adopted across 50+ files to control access and visibility by role.",
      "Managed complex async state (multi-step API workflows, side effects) with Redux and Redux-Saga.",
      "Led code review and mentorship for a 6-person frontend team, including onboarding and technical interviews.",
      "Also designed the platform's microfrontend architecture and a custom gRPC debug panel → full story in NDA Vault.",
    ],
  },
  {
    company: "Khishavere",
    role: "Frontend Engineer",
    period: "Aug 2019–Jul 2021",
    achievements: [
      "Built a PWA for a counseling platform with offline video playback and push notifications.",
      "Built the platform's marketing site in Next.js for SEO, alongside a React-based application panel.",
    ],
  },
] as const;

export function ExperienceWindowContent() {
  return (
    <div className="os-experience">
      <header className="os-experience__header">
        <p className="os-eyebrow">Career Timeline</p>
        <h3 className="os-window-heading">Experience</h3>
        <p className="os-window-copy">
          My journey building frontend systems and interfaces.
        </p>
      </header>

      <div className="os-experience__timeline">
        {EXPERIENCE.map((job, index) => (
          <article key={job.company} className="os-experience__item">
            <div className="os-experience__marker" />
            <div className="os-experience__content">
              <div className="os-experience__meta">
                <h4 className="os-experience__company">{job.company}</h4>
                <span className="os-experience__role">{job.role}</span>
                <span className="os-experience__period">{job.period}</span>
              </div>
              <ul className="os-experience__achievements">
                {job.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
