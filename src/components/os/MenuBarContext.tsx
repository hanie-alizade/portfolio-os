"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type MenuBarContextValue = {
  activeMenu: string | null;
  openMenu: (menu: string) => void;
  closeMenu: () => void;
};

const MenuBarContext = createContext<MenuBarContextValue | null>(null);

export function MenuBarProvider({ children }: { children: ReactNode }) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const openMenu = useCallback((menu: string) => {
    setActiveMenu(menu);
  }, []);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  return (
    <MenuBarContext.Provider value={{ activeMenu, openMenu, closeMenu }}>
      {children}
    </MenuBarContext.Provider>
  );
}

export function useMenuBar() {
  const context = useContext(MenuBarContext);
  if (!context) {
    throw new Error("useMenuBar must be used within MenuBarProvider");
  }
  return context;
}
