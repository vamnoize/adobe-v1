"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/curate", label: "Curation View", icon: ImageIcon },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[var(--border)] h-screen flex flex-col pt-8 px-4 bg-[var(--background)]">
      <div className="mb-12 px-4 shadow-sm pb-4 border-b border-[var(--border)]">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">ASAP</h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1 uppercase tracking-wider">Pipeline Auth</p>
      </div>
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[var(--muted)] text-[var(--foreground)] font-medium"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto py-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-xs font-medium">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">User</span>
            <span className="text-xs text-[var(--muted-foreground)]">user@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
