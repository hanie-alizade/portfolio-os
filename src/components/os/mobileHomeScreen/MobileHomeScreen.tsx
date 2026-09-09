"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { dockApps } from "@/components/os/dockApps";
import { useMobileAppLauncher } from "./useMobileAppLauncher";

const SystemStatsWindowContent = dynamic(
  () =>
    import("@/components/os/windows/SystemStatsWindowContent").then(
      (m) => m.SystemStatsWindowContent
    ),
  {
    ssr: false,
    loading: () => <div className="os-window__body" aria-busy="true" />,
  }
);

export function MobileHomeScreen({ hidden }: { hidden?: boolean }) {
  const launch = useMobileAppLauncher();

  // Show apps from index 4 onwards (remaining apps not in Dock)
  const remainingApps = dockApps.slice(4);

  return (
    <div className={`os-mobile-home${hidden ? " os-mobile-home--hidden" : ""}`}>
      <div className="os-mobile-home__widget">
        <SystemStatsWindowContent />
      </div>

      <div className="os-mobile-home__grid" role="list">
        {remainingApps.map((app) => (
          <div
            key={app.id}
            role="listitem"
            className="os-mobile-home__app-wrapper"
          >
            <button
              type="button"
              className="os-mobile-home__app"
              aria-label={`${app.label}: ${app.hint}`}
              onClick={() => launch(app.id)}
            >
              <span className="os-mobile-home__app-icon">
                <Image src={app.icon} alt="" width={48} height={48} />
              </span>
              <span className="os-mobile-home__app-label">{app.label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
