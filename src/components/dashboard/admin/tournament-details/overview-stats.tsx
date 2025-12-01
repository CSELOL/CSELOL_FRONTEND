import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TournamentOverviewStats({
  tournament,
  teamCount,
}: {
  tournament: any;
  teamCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {teamCount} / {tournament.max_teams || 32}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white uppercase">
              {tournament.format?.replace("_", " ") || "Single Elimination"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banner Preview */}
      <div className="h-48 w-full rounded-xl border border-white/10 bg-black relative overflow-hidden">
        {tournament.banner_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${tournament.banner_url})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
            No Banner Uploaded
          </div>
        )}
      </div>
    </div>
  );
}
