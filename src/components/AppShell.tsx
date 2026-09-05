import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, LayoutDashboard, BookOpen, RefreshCw, Wifi, WifiOff, Sprout } from "lucide-react";
import type { ReactNode } from "react";
import { useAgri } from "@/lib/agri-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/scan", label: "Scanner", icon: Leaf },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/guide", label: "Guide", icon: BookOpen },
  { to: "/sync", label: "Sync", icon: RefreshCw },
] as const;

function ConnectionPill() {
  const { online, toggleOnline, pending } = useAgri();
  return (
    <button
      type="button"
      onClick={toggleOnline}
      aria-pressed={online}
      aria-label={online ? "Connected. Tap to simulate going offline" : "Offline. Tap to simulate connecting"}
      className={cn(
        "flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors",
        online
          ? "border-success bg-success text-success-foreground"
          : "border-warning bg-warning text-warning-foreground",
      )}
    >
      {online ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
      <span>{online ? "Online" : "Offline"}</span>
      {pending > 0 && (
        <span className="rounded-full bg-background/25 px-1.5 text-xs tabular-nums">{pending}</span>
      )}
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { pending } = useAgri();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-2 border-border bg-sidebar p-5 md:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="size-6" />
          </span>
          <div>
            <p className="text-base font-bold leading-tight text-foreground">AgriSense AI</p>
            <p className="text-xs font-medium text-muted-foreground">Zero Hunger · SDG 2</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {label}
                {to === "/sync" && pending > 0 && (
                  <span className="ml-auto rounded-full bg-warning px-2 py-0.5 text-xs font-bold text-warning-foreground tabular-nums">
                    {pending}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <ConnectionPill />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b-2 border-border bg-card px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sprout className="size-5" />
          </span>
          <span className="text-base font-bold">AgriSense AI</span>
        </div>
        <ConnectionPill />
      </header>

      <main className="pb-28 md:pb-10 md:pl-64">
        <div className="mx-auto w-full max-w-4xl px-4 py-5 md:px-8 md:py-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t-2 border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-xl",
                  active && "bg-primary text-primary-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>
              {label}
              {to === "/sync" && pending > 0 && (
                <span className="absolute right-[22%] top-1 size-2.5 rounded-full bg-warning ring-2 ring-card" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
