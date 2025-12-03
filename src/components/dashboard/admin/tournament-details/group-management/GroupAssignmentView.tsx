import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { TeamPool } from "./TeamPool";
import { GroupBucket } from "./GroupBucket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { assignTeamsToGroupsAPI } from "@/api/tournaments";
import type { Team } from "@/api/teams";

interface GroupAssignmentViewProps {
  tournamentId: string;
  allTeams: Team[];
  currentAssignments?: any[]; // Optional initial state
  onSave: () => void;
  onCancel: () => void;
  /**
   * Called whenever the groups state changes (add/remove/drag). Allows parent component to keep the groups in sync.
   */
  onGroupsChange?: (groups: { id: string; name: string; teams: Team[] }[]) => void;
}

export function GroupAssignmentView({
  tournamentId,
  allTeams,
  currentAssignments,
  onSave,
  onCancel,
  onGroupsChange,
}: GroupAssignmentViewProps) {
  const [groups, setGroups] = useState<{ id: string; name: string; teams: Team[] }[]>([
    { id: "group-A", name: "Group A", teams: [] },
    { id: "group-B", name: "Group B", teams: [] },
  ]);
  const [unassignedTeams, setUnassignedTeams] = useState<Team[]>(allTeams);
  const [activeDragItem, setActiveDragItem] = useState<Team | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Propagate groups to parent whenever they change
  const updateGroups = (newGroups: typeof groups) => {
    setGroups(newGroups);
    onGroupsChange?.(newGroups);
  };

  // Initialize from props if available (not used currently)
  useEffect(() => {
    if (currentAssignments && currentAssignments.length > 0) {
      // TODO: map assignments to groups if backend provides this shape
    }
  }, [currentAssignments]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragItem(active.data.current?.team);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (!over) return;
    const team = active.data.current?.team as Team;
    if (!team) return;
    const overId = over.id as string;
    const sourceId = active.id as string;

    const removeFromSource = () => {
      if (sourceId.startsWith("pool-team-")) {
        setUnassignedTeams((prev) => prev.filter((t) => t.id !== team.id));
      } else if (sourceId.startsWith("group-team-")) {
        updateGroups(
          groups.map((g) => ({
            ...g,
            teams: g.teams.filter((t) => t.id !== team.id),
          }))
        );
      }
    };

    if (overId.startsWith("group-")) {
      const targetGroupId = overId;
      const targetGroup = groups.find((g) => g.id === targetGroupId);
      if (targetGroup?.teams.find((t) => t.id === team.id)) return;
      removeFromSource();
      updateGroups(
        groups.map((g) =>
          g.id === targetGroupId ? { ...g, teams: [...g.teams, team] } : g
        )
      );
    } else if (overId === "team-pool") {
      if (unassignedTeams.find((t) => t.id === team.id)) return;
      removeFromSource();
      setUnassignedTeams((prev) => [...prev, team]);
    }
  };

  const handleRemoveFromGroup = (teamId: number) => {
    let teamToRemove: Team | null = null;
    groups.forEach((g) => {
      const found = g.teams.find((t) => t.id === teamId);
      if (found) teamToRemove = found;
    });
    if (teamToRemove) {
      updateGroups(
        groups.map((g) => ({ ...g, teams: g.teams.filter((t) => t.id !== teamId) }))
      );
      setUnassignedTeams((prev) => [...prev, teamToRemove!]);
    }
  };

  const addGroup = () => {
    const nextLetter = String.fromCharCode(65 + groups.length);
    updateGroups([
      ...groups,
      { id: `group-${nextLetter}`, name: `Group ${nextLetter}`, teams: [] },
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const assignments = groups.flatMap((g) =>
        g.teams.map((t) => ({ teamId: t.id, groupName: g.name }))
      );
      const cleanAssignments = assignments.map((a) => ({
        ...a,
        groupName: a.groupName.replace("Group ", ""),
      }));
      await assignTeamsToGroupsAPI(tournamentId, cleanAssignments);
      toast.success("Groups assigned successfully!");
      onSave();
    } catch (error) {
      toast.error("Failed to save assignments");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={addGroup}>
              <Plus className="h-4 w-4 mr-2" /> Add Group
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Assignments
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Groups */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <div key={group.id} className="relative group-container">
                  <GroupBucket
                    id={group.id}
                    name={group.name}
                    teams={group.teams}
                    onRemoveTeam={handleRemoveFromGroup}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/container:opacity-100 transition-opacity"
                    onClick={() => {
                      if (group.teams.length > 0) {
                        toast.error("Remove all teams from the group first");
                        return;
                      }
                      updateGroups(groups.filter((g) => g.id !== group.id));
                    }}
                    title="Remove Group"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Team Pool */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/30 rounded-lg border border-white/5 p-4 sticky top-4">
              <TeamPool teams={unassignedTeams} orientation="vertical" />
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeDragItem ? (
          <Card className="p-2 bg-zinc-800 border-primary/50 flex items-center gap-2 w-[180px] shadow-2xl opacity-90">
            {activeDragItem.logo_url && (
              <img src={activeDragItem.logo_url} alt="" className="h-5 w-5 rounded object-cover" />
            )}
            <span className="font-bold text-sm text-white truncate">{activeDragItem.name}</span>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
