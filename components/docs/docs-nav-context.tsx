"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Bridges the handbook navigation from the docs layout up to the global
 * SiteHeader's mobile drawer. The header lives in the root layout and cannot
 * read the docs layout's data directly, so the docs layout registers the nav
 * (the sidebar + search, already rendered as elements) here and the header
 * pulls it into the drawer when you are in the handbook. On the portfolio the
 * value is null and the drawer falls back to the portfolio anchors.
 */
type DocsNav = ReactNode | null;

interface DocsNavStore {
  nav: DocsNav;
  setNav: (nav: DocsNav) => void;
}

const DocsNavCtx = createContext<DocsNavStore | null>(null);

export function DocsNavProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<DocsNav>(null);
  return (
    <DocsNavCtx.Provider value={{ nav, setNav }}>
      {children}
    </DocsNavCtx.Provider>
  );
}

/** Read the registered handbook nav (used by the header drawer). */
export function useDocsNav(): DocsNav {
  return useContext(DocsNavCtx)?.nav ?? null;
}

/**
 * Register handbook nav for the drawer while this component is mounted (i.e.
 * while you are inside the docs layout); clears it on unmount so leaving the
 * handbook restores the portfolio menu.
 */
export function RegisterDocsNav({ nav }: { nav: ReactNode }) {
  const store = useContext(DocsNavCtx);
  useEffect(() => {
    store?.setNav(nav);
    return () => store?.setNav(null);
  }, [store, nav]);
  return null;
}
