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

// Define the shape of a Group explicitly
interface Group {
  id: string;
  name: string;
  teams: Team[];
}

interface GroupAssignmentViewProps {
  tournamentId: string;
  initialData: {
    groups: Group[];
    unassigned: Team[];
  };
  onSave: () => void;
  onCancel: () => void;
}

export function GroupAssignmentView({
  tournamentId,
  initialData,
  onSave,
  onCancel,
}: GroupAssignmentViewProps) {
  // Explicitly type the state
  const [groups, setGroups] = useState<Group[]>(initialData.groups || []);
  const [unassignedTeams, setUnassignedTeams] = useState<Team[]>(
    initialData.unassigned || []
  );

  const [activeDragItem, setActiveDragItem] = useState<Team | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when props change (e.g. after data reload)
  useEffect(() => {
    setGroups(initialData.groups || []);
    setUnassignedTeams(initialData.unassigned || []);
  }, [initialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Safe casting
    if (active.data.current && active.data.current.team) {
      setActiveDragItem(active.data.current.team as Team);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    const team = active.data.current?.team as Team;
    if (!team) return;

    const overId = over.id as string;
    const sourceId = active.id as string;

    // Helper to remove from previous location
    const removeFromSource = () => {
      if (sourceId.startsWith("pool-team-")) {
        setUnassignedTeams((prev) => prev.filter((t) => t.id !== team.id));
      } else if (sourceId.startsWith("group-team-")) {
        setGroups((prevGroups) =>
          prevGroups.map((g) => ({
            ...g,
            teams: g.teams.filter((t) => t.id !== team.id),
          }))
        );
      }
    };

    // Logic: Dropped into a Group Bucket
    if (overId.startsWith("group-")) {
      const targetGroupId = overId;

      // Check if team is already in this specific group
      const targetGroup = groups.find((g) => g.id === targetGroupId);
      if (targetGroup?.teams.find((t) => t.id === team.id)) return;

      removeFromSource();

      setGroups((prev) =>
        prev.map((g) =>
          g.id === targetGroupId ? { ...g, teams: [...g.teams, team] } : g
        )
      );
    }
    // Logic: Dropped back into Team Pool
    else if (overId === "team-pool") {
      // Check if already in pool
      if (unassignedTeams.find((t) => t.id === team.id)) return;

      removeFromSource();
      setUnassignedTeams((prev) => [...prev, team]);
    }
  };

  const handleRemoveFromGroup = (teamId: number) => {
    let teamToRemove: Team | null = null;

    // Find the team
    groups.forEach((g) => {
      const found = g.teams.find((t) => t.id === teamId);
      if (found) teamToRemove = found;
    });

    if (teamToRemove) {
      // Remove from groups
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          teams: g.teams.filter((t) => t.id !== teamId),
        }))
      );
      // Add to pool
      setUnassignedTeams((prev) => [...prev, teamToRemove as Team]);
    }
  };

  const addGroup = () => {
    // Determine next letter (A, B, C...)
    const usedNames = groups.map((g) => g.name.replace("Group ", ""));
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const nextLetter = alphabet.find((l) => !usedNames.includes(l)) || "Z";
    const groupId = `group-${nextLetter}`; // This ID must match what GroupBucket expects for droppable

    setGroups([
      ...groups,
      { id: groupId, name: `Group ${nextLetter}`, teams: [] },
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare payload: Map existing groups to assignments
      const groupAssignments = groups.flatMap((g) =>
        g.teams.map((t) => ({
          teamId: t.id,
          groupName: g.name.replace("Group ", ""), // Backend likely expects just "A", "B"
        }))
      );

      // Prepare payload: Map unassigned teams (groupName: null)
      const unassignedAssignments = unassignedTeams.map((t) => ({
        teamId: t.id,
        groupName: null,
      }));

      // Combine
      const payload = [...groupAssignments, ...unassignedAssignments];

      await assignTeamsToGroupsAPI(tournamentId, payload);

      toast.success("Groups saved successfully!");
      onSave(); // Refresh parent data
    } catch (error) {
      toast.error("Failed to save assignments");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={addGroup}>
              <Plus className="h-4 w-4 mr-2" /> Add Group
            </Button>
            <span className="text-sm text-zinc-500">
              {unassignedTeams.length} teams unassigned
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-black font-bold"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Assignments
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Groups Grid (Droppable Areas) */}
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
                      // Move teams back to pool before deleting group
                      setUnassignedTeams((prev) => [...prev, ...group.teams]);
                      setGroups(groups.filter((g) => g.id !== group.id));
                    }}
                    title="Remove Group"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {groups.length === 0 && (
                <div className="col-span-full h-40 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/20">
                  <p className="mb-2">No groups created yet.</p>
                  <Button
                    variant="link"
                    onClick={addGroup}
                    className="text-primary"
                  >
                    Create Group A
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Team Pool (Source) */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/30 rounded-lg border border-white/5 p-4 sticky top-4 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
              <TeamPool teams={unassignedTeams} orientation="vertical" />
            </div>
          </div>
        </div>
      </div>

      {/* Drag Preview */}
      <DragOverlay>
        {activeDragItem ? (
          <Card className="p-2 bg-zinc-800 border-primary/50 flex items-center gap-2 w-[180px] shadow-2xl opacity-90 cursor-grabbing">
            {activeDragItem.logo_url && (
              <img
                src={activeDragItem.logo_url}
                className="w-6 h-6 rounded object-cover"
              />
            )}
            <span className="font-bold text-sm text-white truncate">
              {activeDragItem.name}
            </span>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
