import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { Users, FolderKanban, CheckSquare, FileText, Clock, Award, Loader2 } from "lucide-react";
import { apiTeams, type Team } from "../../api/teams";

type MainView = "dashboard" | "teams" | "deadlines" | "profile" | "settings";

interface TeamHubDashboardProps {
  onNavigate: (view: MainView) => void;
}

export function TeamHubDashboard({ onNavigate }: TeamHubDashboardProps) {
  const { language } = useLanguage();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiTeams.list()
      .then(setTeams)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalProjects = teams.reduce((sum, t) => sum + t.project_count, 0);
  const totalMembers = teams.reduce((sum, t) => sum + t.member_count, 0);

  const t = {
    welcome: language === "en" ? "Welcome to TeamHub" : "Добро пожаловать в TeamHub",
    subtitle: language === "en" ? "Manage your teams, projects, and technical specifications" : "Управляйте командами, проектами и техническими заданиями",
    quickStats: language === "en" ? "Quick Stats" : "Быстрая статистика",
    myTeams: language === "en" ? "My Teams" : "Мои команды",
    totalProjects: language === "en" ? "Total Projects" : "Всего проектов",
    totalMembers: language === "en" ? "Total Members" : "Всего участников",
    quickActions: language === "en" ? "Quick Actions" : "Быстрые действия",
    createTeam: language === "en" ? "Create Team" : "Создать команду",
    viewDeadlines: language === "en" ? "View Deadlines" : "Смотреть дедлайны",
    myProfile: language === "en" ? "My Profile" : "Мой профиль",
    settings: language === "en" ? "Settings" : "Настройки",
    recentTeams: language === "en" ? "Recent Teams" : "Последние команды",
    viewAll: language === "en" ? "View All" : "Смотреть всё",
    noTeams: language === "en" ? "No teams yet" : "Команд пока нет",
  };

  const stats = [
    { icon: <Users className="h-8 w-8" />, label: t.myTeams, value: String(teams.length), color: "from-emerald-500 to-teal-600" },
    { icon: <FolderKanban className="h-8 w-8" />, label: t.totalProjects, value: String(totalProjects), color: "from-blue-500 to-cyan-600" },
    { icon: <CheckSquare className="h-8 w-8" />, label: t.totalMembers, value: String(totalMembers), color: "from-purple-500 to-indigo-600" },
    { icon: <FileText className="h-8 w-8" />, label: language === "en" ? "Active" : "Активных", value: String(teams.filter(t => t.project_count > 0).length), color: "from-orange-500 to-red-600" },
  ];

  const quickActions = [
    { icon: <Users className="h-5 w-5" />, label: t.createTeam, color: "from-emerald-500 to-teal-600", action: () => onNavigate("teams") },
    { icon: <Clock className="h-5 w-5" />, label: t.viewDeadlines, color: "from-blue-500 to-cyan-600", action: () => onNavigate("deadlines") },
    { icon: <Users className="h-5 w-5" />, label: t.myProfile, color: "from-purple-500 to-indigo-600", action: () => onNavigate("profile") },
    { icon: <Award className="h-5 w-5" />, label: t.settings, color: "from-orange-500 to-red-600", action: () => onNavigate("settings") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.welcome}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.quickStats}</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
        )}
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

      {/* Recent Teams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t.recentTeams}</h2>
          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700" onClick={() => onNavigate("teams")}>
            {t.viewAll}
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.slice(0, 3).map(team => (
              <Card key={team.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("teams")}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {team.member_count} {language === "en" ? "members" : "участников"} · {team.project_count} {language === "en" ? "projects" : "проектов"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>{t.noTeams}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
