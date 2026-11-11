"use client";

import { useEffect, useRef, useState } from "react";

type ToastMessage = "share" | "book" | null;

type ProfileActionsProps = {
  therapistName: string;
  therapistSlug?: string;
};

function useToastTimeout() {
  const [toast, setToast] = useState<ToastMessage>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: ToastMessage) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast(message);
    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { showToast, toast };
}

export function ShareButton({ therapistName }: ProfileActionsProps) {
  const { showToast, toast } = useToastTimeout();

  async function handleShare() {
    const shareData = {
      title: `${therapistName} on Appi`,
      text: `View ${therapistName}'s therapist profile on Appi.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }

    showToast("share");
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Share ${therapistName}'s profile`}
        onClick={handleShare}
        className="app-icon-button-overlay"
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
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 10.5 6.8-4" />
          <path d="m8.6 13.5 6.8 4" />
        </svg>
      </button>

      {toast ? <ProfileToast toast={toast} /> : null}
    </>
  );
}

import { useRouter } from "next/navigation";

export function BookButton({ therapistName, therapistSlug }: ProfileActionsProps) {
  const { showToast, toast } = useToastTimeout();
  const router = useRouter();

  function handleBook() {
    // If slug provided, navigate to booking page, otherwise show temporary toast
    if (therapistSlug) {
      router.push(`/therapists-list/${therapistSlug}/book`);
      return;
    }

    showToast("book");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleBook}
        className="app-button app-button-primary min-h-14 min-w-40 px-7 text-base"
      >
        Book {therapistName}
      </button>

      {toast ? <ProfileToast toast={toast} /> : null}
    </>
  );
}

function ProfileToast({ toast }: { toast: Exclude<ToastMessage, null> }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-50 w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 rounded-md bg-app-brand px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
    >
      {toast === "share"
        ? "Profile link copied."
        : "Booking will be available soon."}
    </div>
  );
}
