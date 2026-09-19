import { InteractiveParticles } from "./InteractiveParticles";

export function DesktopBackground() {
  return (
    <div className="os-desktop-bg" aria-hidden="true">
      <InteractiveParticles />
      <div className="os-desktop-bg__stars" />
      <div className="os-desktop-bg__veil" />
    </div>
  );
}
