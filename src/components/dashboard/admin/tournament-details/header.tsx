import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TournamentHeaderProps {
  tournament: any;
  onRefresh: () => void;
}

export function TournamentHeader({
  tournament,
  onRefresh,
}: TournamentHeaderProps) {
  if (!tournament) return null;

  const formatDateDisplay = (isoString: string | null) => {
    if (!isoString) return "TBD";
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/admin/tournaments">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">
              {tournament.tournament_name}
            </h1>
            <Badge
              className={
                tournament.status === "running"
                  ? "bg-red-500 animate-pulse"
                  : "bg-zinc-500"
              }
            >
              {tournament.status}
            </Badge>
          </div>
          <p className="text-zinc-400 text-sm flex items-center gap-2 mt-1">
            ID: #{tournament.id} • <Calendar className="h-3 w-3" />{" "}
            {formatDateDisplay(tournament.start_date)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="border-white/10 text-zinc-400 hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
        <Button variant="destructive" className="font-bold">
          <AlertTriangle className="mr-2 h-4 w-4" /> Delete Event
        </Button>
      </div>
    </div>
  );
}
