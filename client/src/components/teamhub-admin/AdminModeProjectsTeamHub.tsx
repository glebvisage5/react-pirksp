import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { FolderKanban, Users, CheckSquare, Calendar, TrendingUp, Activity } from "lucide-react";
import { Badge } from "../ui/badge";
import { Projects } from "../teamhub/Projects";

// This is the Admin version with enhanced management capabilities
export function AdminModeProjectsTeamHub() {
  const { language } = useLanguage();

  const t = {
    title: language === "en" ? "Projects Management" : "Управление проектами",
    subtitle: language === "en" ? "Manage all projects across teams with full administrative access" : "Управление всеми проектами команд с полным административным доступом",
  };

  return (
    <div className="space-y-6">
      {/* Header with Admin Badge */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <Badge className="bg-red-600 text-white">Admin</Badge>
        </div>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">34</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Total Projects" : "Всего проектов"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">21</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Active" : "Активные"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Tasks" : "Задачи"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Avg Progress" : "Средний прогресс"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects Component with Admin Powers */}
      <Projects onCreateSpec={() => console.log("Create spec from admin")} />
    </div>
  );
}
