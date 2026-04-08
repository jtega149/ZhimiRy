"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { dashboardNavItems } from "./dashboard-nav-items";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="relative flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-dashboard-nav"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="truncate text-lg font-semibold text-primary">
            ZhimiRy
          </Link>
        </div>
        <nav className="flex items-center gap-3" aria-label="Account">
          {user ? (
            <>
              <span className="hidden max-w-[160px] truncate text-sm text-muted-foreground sm:inline md:max-w-none">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </nav>

        {mobileOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 top-14 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <nav
              id="mobile-dashboard-nav"
              className="absolute left-0 right-0 top-full z-50 border-b bg-card shadow-md md:hidden"
            >
              <ul className="flex flex-col gap-0.5 p-2 pb-3">
                {dashboardNavItems.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors",
                        pathname === href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
