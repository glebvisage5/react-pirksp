import { useState, useEffect } from "react";
import { useLanguage } from "../../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { Loader2 } from "lucide-react";
import { KanbanBoard } from "../KanbanBoard";
import { apiTeams, type TeamTask } from "../../../api/teams";

interface TeamKanbanProps {
  teamId: string;
}

export function TeamKanban({ teamId }: TeamKanbanProps) {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiTeams.tasks(teamId)
      .then(setTasks)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  const handleTaskMove = async (taskId: string, newStatus: TeamTask["status"]) => {
    try {
      const updated = await apiTeams.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      toast.success(language === "en" ? "Task moved" : "Задача перемещена");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await apiTeams.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success(language === "en" ? "Task deleted" : "Задача удалена");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <KanbanBoard
      tasks={tasks}
      onTaskMove={handleTaskMove}
      onTaskDelete={handleTaskDelete}
    />
  );
}
