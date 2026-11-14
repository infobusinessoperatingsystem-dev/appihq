import Link from "next/link";

const links = [
  { href: "/host/availability", label: "Availability & settings" },
  { href: "/host/sessions", label: "Incoming sessions" },
];

export default function HostNav() {
  return (
    <nav aria-label="Host workspace" className="mt-5">
      <ul className="flex gap-2 overflow-x-auto">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full border border-app-border bg-app-canvas px-4 text-sm font-medium text-app-ink transition-colors hover:border-app-primary hover:text-app-primary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
