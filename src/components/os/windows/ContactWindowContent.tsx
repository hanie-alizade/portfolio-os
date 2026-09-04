import { CONTACT } from "@/lib/contact";

export function ContactWindowContent() {
  return (
    <div className="os-contact">
      <header className="os-contact__header">
        <p className="os-eyebrow">Get in touch</p>
        <h3 className="os-window-heading">Let&apos;s Connect</h3>
        <p className="os-window-copy">
          Open to conversations about frontend engineering, product collaboration,
          and meaningful work.
        </p>
      </header>

      <dl className="os-contact__list">
        <div className="os-contact__item">
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </dd>
        </div>
        <div className="os-contact__item">
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a>
          </dd>
        </div>
        <div className="os-contact__item">
          <dt>Location</dt>
          <dd>{CONTACT.location}</dd>
        </div>
        <div className="os-contact__item">
          <dt>LinkedIn</dt>
          <dd>
            <a href={CONTACT.linkedin.href} target="_blank" rel="noopener noreferrer">
              {CONTACT.linkedin.label}
            </a>
          </dd>
        </div>
        <div className="os-contact__item">
          <dt>GitHub</dt>
          <dd>
            <a href={CONTACT.github.href} target="_blank" rel="noopener noreferrer">
              {CONTACT.github.label}
            </a>
          </dd>
        </div>
      </dl>

      <a href={CONTACT.resumePath} download className="os-btn os-btn--primary os-contact__cv">
        Download CV
      </a>
    </div>
  );
}
