import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { 
  Users, 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  Calendar,
  Clock,
  Award
} from "lucide-react";
import { Badge } from "../ui/badge";

type MainView = "dashboard" | "teams" | "deadlines" | "profile" | "settings";

interface TeamHubDashboardProps {
  onNavigate: (view: MainView) => void;
}

export function TeamHubDashboard({ onNavigate }: TeamHubDashboardProps) {
  const { language } = useLanguage();

  const t = {
    welcome: language === "en" ? "Welcome to TeamHub" : "Добро пожаловать в TeamHub",
    subtitle: language === "en" ? "Manage your teams, projects, and technical specifications" : "Управляйте командами, проектами и техническими заданиями",
    quickStats: language === "en" ? "Quick Stats" : "Быстрая статистика",
    myTeams: language === "en" ? "My Teams" : "Мои команды",
    activeProjects: language === "en" ? "Active Projects" : "Активные проекты",
    tasksInProgress: language === "en" ? "Tasks in Progress" : "Задачи в работе",
    specifications: language === "en" ? "Specifications" : "Технические задания",
    recentActivity: language === "en" ? "Recent Activity" : "Недавняя активность",
    viewAll: language === "en" ? "View All" : "Смотреть всё",
    quickActions: language === "en" ? "Quick Actions" : "Быстрые действия",
    createTeam: language === "en" ? "Create Team" : "Создать команду",
    newProject: language === "en" ? "New Project" : "Новый проект",
    buildSpec: language === "en" ? "Build Spec" : "Создать ТЗ",
    inviteMembers: language === "en" ? "Invite Members" : "Пригласить участников",
  };

  const stats = [
    { icon: <Users className="h-8 w-8" />, label: t.myTeams, value: "3", color: "from-emerald-500 to-teal-600" },
    { icon: <FolderKanban className="h-8 w-8" />, label: t.activeProjects, value: "8", color: "from-blue-500 to-cyan-600" },
    { icon: <CheckSquare className="h-8 w-8" />, label: t.tasksInProgress, value: "24", color: "from-purple-500 to-indigo-600" },
    { icon: <FileText className="h-8 w-8" />, label: t.specifications, value: "12", color: "from-orange-500 to-red-600" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "spec",
      title: language === "en" ? "Mobile App Specification v2.0 created" : "Создано ТЗ для мобильного приложения v2.0",
      team: "Mobile Dev Team",
      time: language === "en" ? "2 hours ago" : "2 часа назад",
      badge: language === "en" ? "New" : "Новое",
    },
    {
      id: 2,
      type: "project",
      title: language === "en" ? "Website Redesign project updated" : "Обновлён проект редизайна сайта",
      team: "Design Team",
      time: language === "en" ? "5 hours ago" : "5 часов назад",
      badge: language === "en" ? "Updated" : "Обновлено",
    },
    {
      id: 3,
      type: "task",
      title: language === "en" ? "15 tasks completed this week" : "15 задач выполнено на этой неделе",
      team: "All Teams",
      time: language === "en" ? "1 day ago" : "1 день назад",
      badge: language === "en" ? "Achievement" : "Достижение",
    },
  ];

  const quickActions = [
    { 
      icon: <Users className="h-5 w-5" />, 
      label: t.createTeam, 
      color: "from-emerald-500 to-teal-600",
      action: () => onNavigate("teams")
    },
    { 
      icon: <Clock className="h-5 w-5" />, 
      label: language === "en" ? "View Deadlines" : "Смотреть дедлайны", 
      color: "from-blue-500 to-cyan-600",
      action: () => onNavigate("deadlines")
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: language === "en" ? "My Profile" : "Мой профиль", 
      color: "from-purple-500 to-indigo-600",
      action: () => onNavigate("profile")
    },
    { 
      icon: <Award className="h-5 w-5" />, 
      label: language === "en" ? "Settings" : "Настройки", 
      color: "from-orange-500 to-red-600",
      action: () => onNavigate("settings")
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.welcome}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.quickStats}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.quickActions}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all group"
              onClick={action.action}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t.recentActivity}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-emerald-600 hover:text-emerald-700"
            onClick={() => onNavigate("teams")}
          >
            {t.viewAll}
          </Button>
        </div>
        <Card className="divide-y">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{activity.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {activity.badge}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {activity.team}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
