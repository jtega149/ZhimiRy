"use client";

import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@zhimiry/shared";
import api from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeaderboardTable() {
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    api.get<LeaderboardEntry[]>("/api/leaderboard").then((res) => setRows(res.data));
  }, []);

  if (rows === null) {
    return (
      <div className="flex items-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading leaderboard…
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Level</TableHead>
          <TableHead className="text-right">XP</TableHead>
          <TableHead className="hidden text-right sm:table-cell">Scans</TableHead>
          <TableHead className="hidden text-right md:table-cell">CO₂</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => {
          const rank = i + 1;
          const isSelf = user?.id === r.id;
          const medal =
            rank === 1 ? "bg-amber-400/20" : rank === 2 ? "bg-slate-300/30" : rank === 3 ? "bg-amber-700/20" : "";

          return (
            <TableRow
              key={r.id}
              data-state={isSelf ? "selected" : undefined}
              className={cn(medal, isSelf && "bg-primary/10")}
            >
              <TableCell className="font-medium">{rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {r.image && <AvatarImage src={r.image} alt="" />}
                    <AvatarFallback>{(r.name ?? r.id).slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-[140px] sm:max-w-none">{r.name ?? "Anonymous"}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">{r.level}</Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">{r.xp}</TableCell>
              <TableCell className="hidden text-right sm:table-cell">{r.scanCount}</TableCell>
              <TableCell className="hidden text-right md:table-cell">{r.totalCO2.toFixed(1)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
