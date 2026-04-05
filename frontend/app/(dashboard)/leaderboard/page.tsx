import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <p className="text-sm text-muted-foreground">Top recyclers by XP.</p>
      <LeaderboardTable />
    </div>
  );
}
