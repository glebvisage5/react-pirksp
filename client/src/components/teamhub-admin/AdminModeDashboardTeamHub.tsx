import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { 
  Users, 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  Activity,
  TrendingUp,
  AlertCircle,
  UserPlus
} from "lucide-react";
import { Badge } from "../ui/badge";

export function AdminModeDashboardTeamHub() {
  const { language } = useLanguage();

  const t = {
    title: language === "en" ? "TeamHub Admin Dashboard" : "Админ-панель TeamHub",
    subtitle: language === "en" ? "Manage all TeamHub entities and monitor system activity" : "Управление всеми сущностями TeamHub и мониторинг активности",
    overview: language === "en" ? "System Overview" : "Обзор системы",
    teams: language === "en" ? "Teams" : "Команды",
    members: language === "en" ? "Members" : "Участники",
    projects: language === "en" ? "Projects" : "Проекты",
    tasks: language === "en" ? "Tasks" : "Задачи",
    specifications: language === "en" ? "Specifications" : "Технические задания",
    recentActivity: language === "en" ? "Recent Activity" : "Недавняя активность",
    viewAll: language === "en" ? "View All" : "Смотреть всё",
    systemAlerts: language === "en" ? "System Alerts" : "Системные уведомления",
    emptyTeams: language === "en" ? "Empty Teams" : "Пустые команды",
    teamsFound: language === "en" ? "teams without members" : "команд без участников",
    activeToday: language === "en" ? "Active Today" : "Активность сегодня",
    activeWeek: language === "en" ? "Active This Week" : "Активность за неделю",
    users: language === "en" ? "users" : "пользователей",
    actions: language === "en" ? "actions" : "действий",
  };

  const stats = [
    { 
      icon: <Users className="h-6 w-6" />, 
      label: t.teams, 
      value: "12", 
      color: "from-emerald-500 to-teal-600",
      change: "+2",
      changeType: "increase"
    },
    { 
      icon: <UserPlus className="h-6 w-6" />, 
      label: t.members, 
      value: "87", 
      color: "from-blue-500 to-cyan-600",
      change: "+12",
      changeType: "increase"
    },
    { 
      icon: <FolderKanban className="h-6 w-6" />, 
      label: t.projects, 
      value: "34", 
      color: "from-purple-500 to-indigo-600",
      change: "+5",
      changeType: "increase"
    },
    { 
      icon: <CheckSquare className="h-6 w-6" />, 
      label: t.tasks, 
      value: "156", 
      color: "from-orange-500 to-red-600",
      change: "+23",
      changeType: "increase"
    },
    { 
      icon: <FileText className="h-6 w-6" />, 
      label: t.specifications, 
      value: "45", 
      color: "from-pink-500 to-rose-600",
      change: "+8",
      changeType: "increase"
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Алексей Иванов",
      action: language === "en" ? "created team" : "создал команду",
      target: "Frontend Development",
      time: language === "en" ? "5 minutes ago" : "5 минут назад",
      type: "team"
    },
    {
      id: 2,
      user: "Мария Петрова",
      action: language === "en" ? "updated specification" : "обновила ТЗ",
      target: "Mobile App v3.0",
      time: language === "en" ? "15 minutes ago" : "15 минут назад",
      type: "spec"
    },
    {
      id: 3,
      user: "Дмитрий Сидоров",
      action: language === "en" ? "completed task" : "завершил задачу",
      target: "API Integration",
      time: language === "en" ? "1 hour ago" : "1 час назад",
      type: "task"
    },
    {
      id: 4,
      user: "Елена Козлова",
      action: language === "en" ? "invited member" : "пригласила участника",
      target: "john.doe@example.com",
      time: language === "en" ? "2 hours ago" : "2 часа назад",
      type: "member"
    },
    {
      id: 5,
      user: "Сергей Новиков",
      action: language === "en" ? "created project" : "создал проект",
      target: "E-commerce Platform",
      time: language === "en" ? "3 hours ago" : "3 часа назад",
      type: "project"
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: language === "en" ? "3 teams have no members assigned" : "3 команды без участников",
      time: language === "en" ? "2 hours ago" : "2 часа назад",
    },
    {
      id: 2,
      type: "info",
      message: language === "en" ? "5 specifications pending review" : "5 ТЗ ожидают проверки",
      time: language === "en" ? "4 hours ago" : "4 часа назад",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.overview}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <Badge variant={stat.changeType === "increase" ? "default" : "secondary"} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t.activeToday}</h3>
              <p className="text-sm text-muted-foreground">{t.users}</p>
            </div>
          </div>
          <p className="text-4xl font-bold">42</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">+15% {language === "en" ? "from yesterday" : "с вчерашнего дня"}</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t.activeWeek}</h3>
              <p className="text-sm text-muted-foreground">{t.actions}</p>
            </div>
          </div>
          <p className="text-4xl font-bold">1,234</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">+8% {language === "en" ? "from last week" : "с прошлой недели"}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t.recentActivity}</h2>
            <Button variant="ghost" size="sm">{t.viewAll}</Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium ${
                  activity.type === "team" ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
                  activity.type === "spec" ? "bg-gradient-to-br from-purple-500 to-indigo-600" :
                  activity.type === "task" ? "bg-gradient-to-br from-orange-500 to-red-600" :
                  activity.type === "member" ? "bg-gradient-to-br from-blue-500 to-cyan-600" :
                  "bg-gradient-to-br from-pink-500 to-rose-600"
                }`}>
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t.systemAlerts}</h2>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border ${
                  alert.type === "warning" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" : 
                  "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.type === "warning" ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
