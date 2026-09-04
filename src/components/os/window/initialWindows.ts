import type { CreateWindowInput } from "./types";

export const INITIAL_WINDOWS: CreateWindowInput[] = [
  {
    id: "about",
    appId: "about",
    title: "About Me",
    bounds: { x: 8, y: 5, width: 500, height: 320 },
    isOpen: true,
  },
  {
    id: "nda",
    appId: "nda",
    title: "NDA Vault",
    bounds: { x: 24, y: 300, width: 490, height: 310 },
    isOpen: true,
  },
  {
    id: "contact",
    appId: "contact",
    title: "Contact",
    bounds: { x: 120, y: 150, width: 380, height: 420 },
    isOpen: false,
  },
  {
    id: "experience",
    appId: "experience",
    title: "Experience",
    bounds: { x: 80, y: 80, width: 440, height: 300 },
    isOpen: false,
  },
  {
    id: "resume",
    appId: "resume",
    title: "Resume",
    bounds: { x: 180, y: 70, width: 400, height: 320 },
    isOpen: false,
  },
];
