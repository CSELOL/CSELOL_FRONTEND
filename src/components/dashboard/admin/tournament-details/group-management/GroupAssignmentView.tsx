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
}

export function GroupAssignmentView({
  tournamentId,
  allTeams,
  currentAssignments,
  onSave,
  onCancel,
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
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Initialize from props if available
  useEffect(() => {
    if (currentAssignments && currentAssignments.length > 0) {
      // Logic to pre-fill groups would go here
      // For now, we start fresh or need a way to parse existing assignments
      // This is a simplified version where we might just reset
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

    const team = active.data.current?.team;
    if (!team) return;

    const overId = over.id as string;

    // Dropped into a group
    if (overId.startsWith("group-")) {
      const targetGroupId = overId;

      // Check if already in this group
      const targetGroup = groups.find((g) => g.id === targetGroupId);
      if (targetGroup?.teams.find((t) => t.id === team.id)) return;

      // Remove from unassigned
      setUnassignedTeams((prev) => prev.filter((t) => t.id !== team.id));

      // Remove from other groups
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          teams: g.teams.filter((t) => t.id !== team.id),
        }))
      );

      // Add to target group
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id === targetGroupId) {
            return { ...g, teams: [...g.teams, team] };
          }
          return g;
        })
      );
    }
  };

  const handleRemoveFromGroup = (teamId: number) => {
    // Find the team object
    let teamToRemove: any = null;
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
      // Add back to unassigned
      setUnassignedTeams((prev) => [...prev, teamToRemove]);
    }
  };

  const addGroup = () => {
    const nextLetter = String.fromCharCode(65 + groups.length); // A, B, C...
    setGroups([
      ...groups,
      {
        id: `group-${nextLetter}`,
        name: `Group ${nextLetter}`,
        teams: [],
      },
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const assignments = groups.flatMap((g) =>
        g.teams.map((t) => ({
          teamId: t.id,
          groupName: g.name, // Or just "A", "B" depending on backend expectation
        }))
      );

      // Clean group names to just be the letter/identifier if needed
      // Assuming backend accepts "Group A" or just "A". Let's send "A", "B" etc.
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white">Group Assignment</h2>
            <Button variant="outline" size="sm" onClick={addGroup}>
              <Plus className="h-4 w-4 mr-2" /> Add Group
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Assignments
            </Button>
          </div>
        </div>

        <div className="flex flex-col h-[700px] gap-6">
          {/* Top: Team Pool (Horizontal Strip) */}
          <div className="bg-zinc-900/30 rounded-lg border border-white/5 p-4 flex-shrink-0">
            <TeamPool teams={unassignedTeams} orientation="horizontal" />
          </div>

          {/* Bottom: Groups (Grid) */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div key={group.id} className="h-[300px] relative group-container">
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
                        setGroups(prev => prev.filter(g => g.id !== group.id));
                    }}
                    title="Remove Group"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeDragItem ? (
          <Card className="p-3 bg-zinc-800 border-primary/50 flex items-center gap-3 w-[200px] shadow-2xl opacity-90">
            {activeDragItem.logo_url && (
              <img
                src={activeDragItem.logo_url}
                alt=""
                className="h-6 w-6 rounded object-cover"
              />
            )}
            <span className="font-bold text-white">{activeDragItem.name}</span>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
