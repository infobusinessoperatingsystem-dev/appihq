"use client";

import { useEffect, useRef, useState } from "react";

type FavoriteButtonProps = {
  therapistName: string;
};

export default function FavoriteButton({ therapistName }: FavoriteButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleFavoriteClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowToast(true);
    timeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label={`Save ${therapistName} as a favorite`}
        aria-pressed="false"
        onClick={handleFavoriteClick}
        className="inline-flex size-10 items-center justify-center rounded-full bg-white/95 text-zinc-950 shadow-sm ring-1 ring-black/10 transition hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black dark:bg-black/85 dark:text-zinc-50 dark:ring-white/15 dark:hover:bg-black dark:focus:ring-white"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 0 1 7.1-7.1l.4.4.4-.4a5 5 0 0 1 7.1 7.1Z" />
        </svg>
      </button>

      {showToast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 rounded-lg bg-zinc-950 px-4 py-3 text-center text-sm font-medium text-white shadow-lg dark:bg-white dark:text-zinc-950"
        >
          Sign in will be needed to save favorites.
        </div>
      ) : null}
    </>
  );
}
