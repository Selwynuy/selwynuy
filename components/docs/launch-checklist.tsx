"use client";

import { useEffect, useMemo, useState } from "react";
import {
  groupedItems,
  itemsForType,
  type ChecklistItem,
  type ProjectType,
  type Requirement,
} from "@/lib/docs/launch-checklist";

/**
 * Interactive launch checklist. Fully client-side (no backend): it reads the
 * typed checklist from lib/docs/launch-checklist.ts, filters by project type
 * and requirement level, and tracks which items you have ticked in
 * localStorage so progress survives a refresh. The same data feeds the prose,
 * so the list never diverges.
 */

const STORAGE_KEY = "launch-checklist:v1";

const TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "marketing", label: "Marketing site" },
  { value: "app", label: "Web app" },
  { value: "ecommerce", label: "E-commerce" },
];

const REQ_LABEL: Record<Requirement, string> = {
  required: "Required",
  recommended: "Recommended",
  optional: "Optional",
};

const REQ_DOT: Record<Requirement, string> = {
  required: "bg-accent",
  recommended: "bg-foreground/50",
  optional: "bg-foreground/25",
};

export function LaunchChecklist() {
  const [type, setType] = useState<ProjectType>("all");
  const [hideOptional, setHideOptional] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Hydrate ticked state once on mount. The reads are synchronous, but the
  // state updates are deferred to a microtask so they are not called
  // synchronously inside the effect body.
  useEffect(() => {
    let stored: Record<string, boolean> | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      // ignore malformed storage
    }
    const id = requestAnimationFrame(() => {
      if (stored) setChecked(stored);
      setLoaded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Persist on change (only after the initial hydrate, so we never clobber).
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [checked, loaded]);

  const groups = useMemo(() => {
    return groupedItems(type)
      .map((g) => ({
        ...g,
        items: hideOptional
          ? g.items.filter((i) => i.requirement !== "optional")
          : g.items,
      }))
      .filter((g) => g.items.length > 0);
  }, [type, hideOptional]);

  const visibleItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const doneCount = visibleItems.filter((i) => checked[i.id]).length;
  const total = visibleItems.length;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  function reset() {
    setChecked({});
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl bg-surface-raised shadow-soft-sm ring-1 ring-hairline">
      {/* Controls + progress */}
      <div className="border-b border-hairline p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
            Building
          </span>
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              aria-pressed={type === opt.value}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                type === opt.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-foreground/[0.05] text-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="shrink-0 font-mono text-xs text-muted">
            {doneCount}/{total} ({pct}%)
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={hideOptional}
              onChange={(e) => setHideOptional(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--accent)]"
            />
            Hide optional
          </label>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-xs text-subtle underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Grouped items */}
      <div className="divide-y divide-hairline">
        {groups.map((group) => (
          <fieldset key={group.category} className="p-5">
            <legend className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
              {group.category}
            </legend>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  checked={!!checked[item.id]}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function ChecklistRow({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label className="group flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-foreground/[0.03]">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`text-sm font-medium transition-colors ${
                checked
                  ? "text-subtle line-through"
                  : "text-foreground"
              }`}
            >
              {item.label}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-subtle">
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${REQ_DOT[item.requirement]}`}
              />
              {REQ_LABEL[item.requirement]}
            </span>
          </span>
          <span
            className={`mt-0.5 block text-xs leading-relaxed ${
              checked ? "text-subtle/70" : "text-muted"
            }`}
          >
            {item.detail}
            {item.slug && (
              <>
                {" "}
                <a
                  href={`/docs/${item.slug}`}
                  className="text-accent underline-offset-2 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Learn how
                </a>
              </>
            )}
          </span>
        </span>
      </label>
    </li>
  );
}

/** Static, non-interactive count for prose (e.g. "29 checks across 6 areas"). */
export function checklistStats(type: ProjectType = "all") {
  const items = itemsForType(type);
  return {
    total: items.length,
    required: items.filter((i) => i.requirement === "required").length,
  };
}
