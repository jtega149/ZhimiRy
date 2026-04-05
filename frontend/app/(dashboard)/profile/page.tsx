"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { CO2Tracker } from "@/components/gamification/CO2Tracker";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return <p className="text-muted-foreground">Sign in to view your profile.</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{user.name ?? "Recycler"}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <StreakBadge days={user.streakCount} />
          </div>
          <XPBar xp={user.xp} level={user.level} />
        </CardContent>
      </Card>
      <CO2Tracker totalKg={user.totalCO2} />
    </div>
  );
}
