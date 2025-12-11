import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Loader2,
  Calendar,
  RefreshCw,
  User,
  Trophy,
  Users,
  Swords,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getActivityLogsAPI,
  getActivityLogActionsAPI,
  type ActivityLog,
  type ActivityLogsParams,
} from "@/api/admin";
import { formatDateTime } from "@/lib/formatters";

// Target type options
const TARGET_TYPES = [
  { value: "team", label: "Time", icon: Users },
  { value: "tournament", label: "Torneio", icon: Trophy },
  { value: "match", label: "Partida", icon: Swords },
  { value: "user", label: "Usuário", icon: User },
  { value: "registration", label: "Inscrição", icon: ClipboardList },
];

// Action badge colors
function getActionColor(action: string): string {
  if (action.includes("create") || action.includes("register")) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (action.includes("delete") || action.includes("remove") || action.includes("reject")) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (action.includes("update") || action.includes("approve")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (action.includes("join") || action.includes("leave")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

// Get target icon
function getTargetIcon(targetType: string | null) {
  const found = TARGET_TYPES.find((t) => t.value === targetType);
  return found ? found.icon : FileText;
}

export function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Filter state
  const [actions, setActions] = useState<string[]>([]);
  const [filters, setFilters] = useState<ActivityLogsParams>({
    limit: 50,
    offset: 0,
  });
  const [searchInput, setSearchInput] = useState("");

  // Load action types for dropdown
  useEffect(() => {
    getActivityLogActionsAPI()
      .then(setActions)
      .catch((err) => console.error("Failed to load action types:", err));
  }, []);

  // Load logs
  const loadLogs = useCallback(async (params: ActivityLogsParams, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getActivityLogsAPI(params);
      if (append) {
        setLogs((prev) => [...prev, ...response.logs]);
      } else {
        setLogs(response.logs);
      }
      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Failed to load activity logs:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadLogs(filters);
  }, [loadLogs, filters]);

  // Handle filter changes
  const updateFilter = (key: keyof ActivityLogsParams, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      offset: 0, // Reset pagination on filter change
    }));
  };

  // Handle search
  const handleSearch = () => {
    updateFilter("search", searchInput || undefined);
  };

  // Load more
  const handleLoadMore = () => {
    const newOffset = (filters.offset || 0) + (filters.limit || 50);
    loadLogs({ ...filters, offset: newOffset }, true);
    setFilters((prev) => ({ ...prev, offset: newOffset }));
  };

  // Refresh
  const handleRefresh = () => {
    setFilters((prev) => ({ ...prev, offset: 0 }));
    loadLogs({ ...filters, offset: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Logs de Atividade
          </h1>
          <p className="text-zinc-400 mt-1">
            Visualize todas as ações realizadas no sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
            {total} registros
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-zinc-700"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 rounded-xl border border-white/10 bg-zinc-900/50">
        {/* Search */}
        <div className="lg:col-span-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Buscar por ação, ator, alvo..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 bg-zinc-900 border-white/10"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Type Filter */}
        <Select
          value={filters.action || "all"}
          onValueChange={(v) => updateFilter("action", v)}
        >
          <SelectTrigger className="bg-zinc-900 border-white/10">
            <SelectValue placeholder="Tipo de Ação" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10 max-h-64">
            <SelectItem value="all">Todas as Ações</SelectItem>
            {actions.map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Target Type Filter */}
        <Select
          value={filters.targetType || "all"}
          onValueChange={(v) => updateFilter("targetType", v)}
        >
          <SelectTrigger className="bg-zinc-900 border-white/10">
            <SelectValue placeholder="Tipo de Alvo" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10">
            <SelectItem value="all">Todos os Alvos</SelectItem>
            {TARGET_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter (simplified for now) */}
        <Select
          value="all"
          onValueChange={(v) => {
            if (v === "today") {
              const today = new Date().toISOString().split("T")[0];
              updateFilter("startDate", today);
            } else if (v === "week") {
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
              updateFilter("startDate", weekAgo);
            } else if (v === "month") {
              const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
              updateFilter("startDate", monthAgo);
            } else {
              updateFilter("startDate", undefined);
            }
          }}
        >
          <SelectTrigger className="bg-zinc-900 border-white/10">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10">
            <SelectItem value="all">Todo Período</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <FileText className="h-12 w-12 mb-4" />
            <p>Nenhum log encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => {
              const TargetIcon = getTargetIcon(log.target_type);
              const isExpanded = expandedRow === log.id;

              return (
                <Collapsible
                  key={log.id}
                  open={isExpanded}
                  onOpenChange={() => setExpandedRow(isExpanded ? null : log.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors">
                      {/* Expand Icon */}
                      <div className="text-zinc-600">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="w-40 text-xs text-zinc-500 font-mono shrink-0">
                        {formatDateTime(log.created_at)}
                      </div>

                      {/* Action Badge */}
                      <Badge
                        variant="outline"
                        className={`shrink-0 font-mono text-xs ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </Badge>

                      {/* Actor */}
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <User className="h-3 w-3 text-zinc-600" />
                        <span className="text-sm text-zinc-300 truncate">
                          {log.actor_nickname || log.actor_email || "Sistema"}
                        </span>
                      </div>

                      {/* Target */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <TargetIcon className="h-3 w-3 text-zinc-600 shrink-0" />
                        <span className="text-sm text-zinc-400 truncate">
                          {log.target_name || (log.target_id ? `ID: ${log.target_id}` : "-")}
                        </span>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  {/* Expanded Details */}
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-0 ml-8 mr-4 mb-2 rounded-lg bg-zinc-900/50 border border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm">
                        <div>
                          <span className="text-zinc-500 text-xs uppercase">ID do Log</span>
                          <p className="text-zinc-300 font-mono">{log.id}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-xs uppercase">Actor ID</span>
                          <p className="text-zinc-300 font-mono text-xs truncate">
                            {log.actor_id || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-xs uppercase">Target Type</span>
                          <p className="text-zinc-300">{log.target_type || "-"}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-xs uppercase">Target ID</span>
                          <p className="text-zinc-300">{log.target_id || "-"}</p>
                        </div>
                        {log.ip_address && (
                          <div>
                            <span className="text-zinc-500 text-xs uppercase">IP Address</span>
                            <p className="text-zinc-300 font-mono">{log.ip_address}</p>
                          </div>
                        )}
                        {log.user_agent && (
                          <div className="md:col-span-2">
                            <span className="text-zinc-500 text-xs uppercase">User Agent</span>
                            <p className="text-zinc-300 text-xs truncate">{log.user_agent}</p>
                          </div>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="md:col-span-2">
                            <span className="text-zinc-500 text-xs uppercase">Metadata</span>
                            <pre className="text-zinc-300 text-xs bg-black/30 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="border-white/10"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              "Carregar Mais"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
