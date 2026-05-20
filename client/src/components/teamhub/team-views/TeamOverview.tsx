import { Card } from "../../ui/card";
import { useLanguage } from "../../../lib/language-context";
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Activity
} from "lucide-react";
import { Badge } from "../../ui/badge";

interface TeamOverviewProps {
  team: {
    id: string;
    name: string;
    description: string;
    members: number;
    projects: number;
  };
}

export function TeamOverview({ team }: TeamOverviewProps) {
  const { language } = useLanguage();

  const t = {
    overview: language === "en" ? "Team Overview" : "Обзор команды",
    statistics: language === "en" ? "Statistics" : "Статистика",
    recentActivity: language === "en" ? "Recent Activity" : "Последние изменения",
    projects: language === "en" ? "Projects" : "Проекты",
    tasks: language === "en" ? "Tasks" : "Задачи",
    members: language === "en" ? "Members" : "Участники",
    specifications: language === "en" ? "Specifications" : "Технические задания",
    activeProjects: language === "en" ? "Active Projects" : "Активные проекты",
    completedTasks: language === "en" ? "Completed Tasks" : "Завершенные задачи",
    weekActivity: language === "en" ? "Activity this week" : "Активность за неделю",
    noActivity: language === "en" ? "No recent activity" : "Нет последних изменений",
    newTask: language === "en" ? "New task created" : "Создана новая задача",
    specUpdated: language === "en" ? "Specification updated" : "Обновлено ТЗ",
    memberJoined: language === "en" ? "New member joined" : "Новый участник присоединился",
    projectCreated: language === "en" ? "Project created" : "Создан проект",
    ago: language === "en" ? "ago" : "назад",
    hours: language === "en" ? "hours" : "часов",
    days: language === "en" ? "days" : "дней",
  };

  // Mock data
  const stats = [
    {
      icon: <FolderKanban className="h-6 w-6" />,
      label: t.projects,
      value: "3",
      change: "+1 " + (language === "en" ? "this month" : "в этом месяце"),
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      label: t.tasks,
      value: "24",
      change: "12 " + (language === "en" ? "completed" : "завершено"),
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: t.members,
      value: String(team.members),
      change: "+2 " + (language === "en" ? "this week" : "на этой неделе"),
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      label: t.specifications,
      value: "8",
      change: "5 " + (language === "en" ? "active" : "активных"),
      color: "from-orange-500 to-red-600",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "task",
      message: t.newTask + ": " + (language === "en" ? "Implement user authentication" : "Реализовать аутентификацию пользователей"),
      user: language === "en" ? "John Doe" : "Иван Петров",
      time: "2 " + t.hours + " " + t.ago,
    },
    {
      id: "2",
      type: "spec",
      message: t.specUpdated + ": " + (language === "en" ? "Mobile App Requirements" : "Требования к мобильному приложению"),
      user: language === "en" ? "Jane Smith" : "Мария Сидорова",
      time: "5 " + t.hours + " " + t.ago,
    },
    {
      id: "3",
      type: "member",
      message: t.memberJoined + ": " + (language === "en" ? "Alex Johnson" : "Алексей Иванов"),
      user: language === "en" ? "Team Leader" : "Лидер команды",
      time: "1 " + t.days + " " + t.ago,
    },
    {
      id: "4",
      type: "project",
      message: t.projectCreated + ": " + (language === "en" ? "Dashboard Redesign" : "Редизайн панели управления"),
      user: language === "en" ? "John Doe" : "Иван Петров",
      time: "2 " + t.days + " " + t.ago,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4" />;
      case "spec":
        return <FileText className="h-4 w-4" />;
      case "member":
        return <Users className="h-4 w-4" />;
      case "project":
        return <FolderKanban className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "task":
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950";
      case "spec":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950";
      case "member":
        return "text-purple-600 bg-purple-50 dark:bg-purple-950";
      case "project":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-950";
    }
  };

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
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t.recentActivity}
        </h3>
        <Card className="p-6">
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{activity.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>{t.noActivity}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Week Activity Summary */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{t.weekActivity}</p>
            <p className="text-2xl font-bold">32 {language === "en" ? "actions" : "действий"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              +15% {language === "en" ? "compared to last week" : "по сравнению с прошлой неделей"}
            </p>
          </div>
          <Badge className="bg-emerald-600 text-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            {language === "en" ? "Growing" : "Рост"}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
