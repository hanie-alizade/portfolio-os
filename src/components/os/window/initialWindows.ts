import type { CreateWindowInput } from "./types";

export const INITIAL_WINDOWS: CreateWindowInput[] = [
  {
    id: "about",
    appId: "about",
    title: "About Me",
    bounds: { x: 350, y: 15, width: 700, height: 400 },
    isOpen: true,
    isOpenOnMobile: false,
  },
  {
    id: "nda",
    appId: "nda",
    title: "NDA",
    bounds: { x: 24, y: 30, width: 790, height: 520 },
    isOpen: false,
    isOpenOnMobile: false,
  },
  {
    id: "case-studies",
    appId: "case-studies",
    title: "Case Studies",
    bounds: { x: 100, y: 14, width: 1200, height: 650 },
    isOpen: false,
    isOpenOnMobile: false,
  },
  {
    id: "contact",
    appId: "contact",
    title: "Contact",
    bounds: { x: 1000, y: 150, width: 380, height: 420 },
    isOpen: false,
    isOpenOnMobile: false,
  },
  {
    id: "experience",
    appId: "experience",
    title: "Experience",
    bounds: { x: 60, y: 15, width: 630, height: 600 },
    isOpen: false,
    isOpenOnMobile: false,
  },
  {
    id: "resume",
    appId: "resume",
    title: "Resume",
    bounds: { x: 180, y: 20, width: 790, height: 550 },
    isOpen: false,
    isOpenOnMobile: false,
  },
];
