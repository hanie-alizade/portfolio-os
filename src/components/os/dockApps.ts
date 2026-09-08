import type { DockAppId } from "@/components/os/appIds";

export type { DockAppId };

export type DockApp = { id: DockAppId; label: string; hint: string; icon: string };

export const dockApps: DockApp[] = [
  {
    id: "about",
    label: "About",
    hint: "This is me",
    icon: "/os/dockIcons/about.png",
  },
  {
    id: "experience",
    label: "Experience",
    hint: "My journey",
    icon: "/os/dockIcons/experience.png",
  },
  {
    id: "nda",
    label: "NDA",
    hint: "Locked work",
    icon: "/os/dockIcons/nda.png",
  },
  {
    id: "case-studies",
    label: "Case Studies",
    hint: "Deep dive",
    icon: "/os/dockIcons/case-studies.png",
  },
  {
    id: "resume",
    label: "Resume",
    hint: "Download CV",
    icon: "/os/dockIcons/resume.png",
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Get in touch",
    icon: "/os/dockIcons/contact.png",
  },
];
