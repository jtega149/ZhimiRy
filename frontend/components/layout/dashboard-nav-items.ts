import type { LucideIcon } from "lucide-react";
import { Leaf, History, Trophy, MapPin, User } from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/scan", label: "Scan", icon: Leaf },
  { href: "/history", label: "History", icon: History },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/profile", label: "Profile", icon: User },
];
