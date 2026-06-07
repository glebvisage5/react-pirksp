import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { Loader2, CalendarClock, AlertTriangle, Clock, CheckCircle2, User } from "lucide-react";
import { apiTeams, type TeamTask } from "../../../api/teams";

interface TeamDeadlinesProps {
  teamId: string;
}

export function TeamDeadlines({ teamId }: TeamDeadlinesProps) {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiTeams.tasks(teamId)
      .then(setTasks)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  const t = {
    deadlines: language === "en" ? "Deadlines" : "Дедлайны",
    subtitle: language === "en" ? "Track upcoming and overdue task deadlines" : "Отслеживание сроков задач команды",
    overdue: language === "en" ? "Overdue" : "Просрочено",
    today: language === "en" ? "Today" : "Сегодня",
    upcoming: language === "en" ? "Upcoming" : "Предстоящие",
    completed: language === "en" ? "Completed" : "Завершено",
    noDeadlines: language === "en" ? "No tasks with deadlines" : "Задач с дедлайнами нет",
    assignee: language === "en" ? "Assignee" : "Исполнитель",
    project: language === "en" ? "Project" : "Проект",
  };

  const getDeadlineStatus = (task: TeamTask): "overdue" | "today" | "upcoming" | "completed" | "none" => {
    if (task.status === "done") return "completed";
    if (!task.due_date) return "none";
    const due = new Date(task.due_date);
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (due < todayStart) return "overdue";
    if (due <= todayEnd) return "today";
    return "upcoming";
  };

  const formatDate = (str: string) => {
    const d = new Date(str);
    return d.toLocaleDateString(language === "en" ? "en-GB" : "ru-RU");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const tasksWithDeadlines = tasks
    .filter(t => t.due_date || t.status === "done")
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

  const groups: Record<string, TeamTask[]> = { overdue: [], today: [], upcoming: [], completed: [] };
  for (const task of tasksWithDeadlines) {
    const status = getDeadlineStatus(task);
    if (status !== "none") groups[status].push(task);
  }

  const statusConfig = {
    overdue: { label: t.overdue, icon: <AlertTriangle className="h-4 w-4 text-red-500" />, color: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30" },
    today: { label: t.today, icon: <Clock className="h-4 w-4 text-orange-500" />, color: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30" },
    upcoming: { label: t.upcoming, icon: <CalendarClock className="h-4 w-4 text-blue-500" />, color: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30" },
    completed: { label: t.completed, icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, color: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30" },
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  const hasAny = Object.values(groups).some(g => g.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarClock className="h-6 w-6" />{t.deadlines}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {!hasAny ? (
        <Card className="p-12">
          <div className="text-center">
            <CalendarClock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold">{t.noDeadlines}</h3>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {(["overdue", "today", "upcoming", "completed"] as const).map(status => {
            const group = groups[status];
            if (!group.length) return null;
            const cfg = statusConfig[status];
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  {cfg.icon}
                  <h3 className="font-semibold">{cfg.label} ({group.length})</h3>
                </div>
                <div className="space-y-2">
                  {group.map(task => (
                    <Card key={task.id} className={`p-4 border ${cfg.color}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-medium truncate">{task.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {task.project_title && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{t.project}:</span> {task.project_title}
                              </span>
                            )}
                            {task.assignee_name && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {task.assignee_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {task.due_date && (
                            <span className="text-xs font-medium">{formatDate(task.due_date)}</span>
                          )}
                          <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
