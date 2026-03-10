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
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border)] h-auto md:h-screen flex flex-col pt-4 md:pt-8 px-2 md:px-4 bg-[var(--background)] shrink-0">
      <div className="mb-4 md:mb-12 px-2 md:px-4 pb-2 md:pb-4 md:border-b border-[var(--border)] flex justify-between items-center md:items-start md:flex-col">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--foreground)]">ASAP</h1>
          <p className="text-[10px] md:text-xs text-[var(--muted-foreground)] mt-1 uppercase tracking-wider hidden md:block">Pipeline Auth</p>
        </div>
        {/* Mobile User Avatar */}
        <div className="md:hidden w-8 h-8 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-xs font-medium shrink-0">
          U
        </div>
      </div>
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-1 w-full hide-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-md text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-[var(--muted)] text-[var(--foreground)] font-medium"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto py-6 px-4 hidden md:block">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-xs font-medium shrink-0">
            U
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium">User</span>
            <span className="text-xs text-[var(--muted-foreground)] truncate">user@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
