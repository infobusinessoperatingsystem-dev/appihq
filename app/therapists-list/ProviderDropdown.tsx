"use client";

import { useEffect, useRef, useState } from "react";

const providers = [
  { id: "massage", label: "Massage therapists", buttonLabel: "Massage", enabled: true },
  { id: "cleaners", label: "Cleaners", buttonLabel: "Cleaners", enabled: false },
  { id: "hairdressers", label: "Hairdressers", buttonLabel: "Hairdressers", enabled: false },
  { id: "makeup-artists", label: "Makeup artists", buttonLabel: "Makeup artists", enabled: false },
  { id: "painters", label: "Painters", buttonLabel: "Painters", enabled: false },
  { id: "electricians", label: "Electrician", buttonLabel: "Electrician", enabled: false },
  { id: "plumbers", label: "Plumbers", buttonLabel: "Plumbers", enabled: false },
  { id: "carpenters", label: "Carpenters", buttonLabel: "Carpenters", enabled: false },
];

export default function ProviderDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Service category: ${selectedProvider.buttonLabel}`}
        onClick={() => setIsOpen((open) => !open)}
        className="app-button app-button-brand"
      >
        {selectedProvider.buttonLabel}
        <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Service providers"
          className="absolute right-0 z-50 mt-2 max-h-64 w-64 overflow-y-auto rounded-md border border-app-border bg-app-surface p-1 shadow-xl"
        >
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              role="option"
              aria-selected={selectedProvider.id === provider.id}
              disabled={!provider.enabled}
              onClick={() => {
                if (!provider.enabled) return;
                setSelectedProvider(provider);
                setIsOpen(false);
              }}
              className="flex min-h-11 w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm text-app-ink transition-colors enabled:hover:bg-app-surface-muted disabled:cursor-not-allowed disabled:text-app-ink-muted/70"
            >
              <span>{provider.label}</span>
              {provider.enabled ? (
                <span className="text-xs font-medium text-app-primary">Available</span>
              ) : (
                <span className="text-[11px] text-app-ink-muted">Coming later</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
