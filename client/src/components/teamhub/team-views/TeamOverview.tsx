import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { useLanguage } from "../../../lib/language-context";
import {
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Activity
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { apiTeams, type Team, type TeamTask } from "../../../api/teams";

interface TeamOverviewProps {
  team: Team;
}

export function TeamOverview({ team }: TeamOverviewProps) {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<TeamTask[]>([]);

  useEffect(() => {
    apiTeams.tasks(team.id).then(setTasks).catch(() => {});
  }, [team.id]);

  const doneCount = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;

  const t = {
    overview: language === "en" ? "Team Overview" : "Обзор команды",
    statistics: language === "en" ? "Statistics" : "Статистика",
    recentTasks: language === "en" ? "Recent Tasks" : "Последние задачи",
    projects: language === "en" ? "Projects" : "Проекты",
    tasks: language === "en" ? "Tasks" : "Задачи",
    members: language === "en" ? "Members" : "Участники",
    completedTasks: language === "en" ? "Completed" : "Завершено",
    noTasks: language === "en" ? "No tasks yet" : "Задач пока нет",
    priority: language === "en" ? "Priority" : "Приоритет",
  };

  const stats = [
    {
      icon: <FolderKanban className="h-6 w-6" />,
      label: t.projects,
      value: String(team.project_count),
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      label: t.tasks,
      value: String(tasks.length),
      sub: `${doneCount} ${t.completedTasks.toLowerCase()}`,
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: t.members,
      value: String(team.member_count),
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      label: language === "en" ? "In Progress" : "В работе",
      value: String(inProgressTasks),
      color: "from-orange-500 to-red-600",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t.overview}</h2>
        <p className="text-muted-foreground mt-1">{team.description}</p>
      </div>

      {/* Statistics Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t.statistics}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  {stat.sub && <p className="text-xs text-muted-foreground">{stat.sub}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t.recentTasks}
        </h3>
        <Card className="p-6">
          <div className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    <CheckSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {task.assignee_name && <span>{task.assignee_name}</span>}
                      {task.due_date && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.due_date}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className={`${getPriorityColor(task.priority)} border text-xs shrink-0`}>
                    {task.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>{t.noTasks}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
