"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Search, UserRound } from "lucide-react";

const navigationItems = [
  { label: "Explore", href: "/", icon: Search },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Account", href: "/account", icon: UserRound },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return (
      pathname === "/" ||
      pathname.startsWith("/therapists-list") ||
      pathname.startsWith("/book/")
    );
  }

  if (href === "/bookings") {
    return pathname.startsWith("/bookings") || pathname.startsWith("/booking");
  }

  if (href === "/account") {
    return pathname.startsWith("/account") || pathname.startsWith("/host");
  }

  return pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-app-border bg-app-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgb(33_21_79/0.08)] backdrop-blur"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {navigationItems.map(({ label, href, icon: Icon }) => {
          const isActive = isActivePath(pathname, href);

          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-app-primary"
                    : "text-app-ink-muted hover:text-app-primary"
                }`}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
