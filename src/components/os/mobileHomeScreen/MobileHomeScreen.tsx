"use client";
import Image from "next/image";
import { SystemStatsWindowContent } from "@/components/os/windows/SystemStatsWindowContent";
import { dockApps } from "@/components/os/dockApps";
import { useMobileAppLauncher } from "./useMobileAppLauncher";

export function MobileHomeScreen({ hidden }: { hidden?: boolean }) {
  const launch = useMobileAppLauncher();

  return (
    <div className={`os-mobile-home${hidden ? " os-mobile-home--hidden" : ""}`}>
      <div className="os-mobile-home__widget">
        <SystemStatsWindowContent />
      </div>

      <div className="os-mobile-home__grid" role="list">
        {dockApps.map((app) => (
          <button
            key={app.id}
            type="button"
            role="listitem"
            className="os-mobile-home__app"
            aria-label={`${app.label}: ${app.hint}`}
            onClick={() => launch(app.id)}
          >
            <span className="os-mobile-home__app-icon">
              <Image src={app.icon} alt="" width={48} height={48} />
            </span>
            <span className="os-mobile-home__app-label">{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
