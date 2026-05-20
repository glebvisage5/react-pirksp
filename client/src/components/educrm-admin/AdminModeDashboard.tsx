import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  UserCheck,
  Target
} from "lucide-react";
import { useLanguage } from "../../lib/language-context";

export function AdminModeDashboard() {
  const { language } = useLanguage();

  const t = {
    title: language === "en" ? "EduCRM Admin Dashboard" : "Админ панель EduCRM",
    subtitle: language === "en" ? "Manage and monitor all EduCRM entities" : "Управление и мониторинг всех сущностей EduCRM",
    groups: language === "en" ? "Groups" : "Группы",
    students: language === "en" ? "Students" : "Студенты",
    elders: language === "en" ? "Elders" : "Старосты",
    courses: language === "en" ? "Courses" : "Курсы",
    tasks: language === "en" ? "Tasks" : "Задачи",
    avgProgress: language === "en" ? "Average Course Progress" : "Средний прогресс по курсам",
    weekActivity: language === "en" ? "Activity This Week" : "Активность за неделю",
    recentActions: language === "en" ? "Recent Elder Actions" : "Последние действия старост",
    warnings: language === "en" ? "Warnings" : "Предупреждения",
    active: language === "en" ? "Active" : "Активных",
    total: language === "en" ? "Total" : "Всего",
    emptyGroups: language === "en" ? "Empty groups found" : "Найдены пустые группы",
    lowProgress: language === "en" ? "Low course progress" : "Низкий прогресс курсов",
    missedDeadlines: language === "en" ? "Missed deadlines" : "Пропущенные дедлайны",
  };

  const stats = [
    { title: t.groups, value: "24", change: "+3", icon: <Users className="h-5 w-5" />, color: "text-blue-600" },
    { title: t.students, value: "486", change: "+12", icon: <GraduationCap className="h-5 w-5" />, color: "text-green-600" },
    { title: t.elders, value: "32", change: "+2", icon: <UserCheck className="h-5 w-5" />, color: "text-purple-600" },
    { title: t.courses, value: "18", change: "+1", icon: <BookOpen className="h-5 w-5" />, color: "text-orange-600" },
    { title: t.tasks, value: "234", change: "+28", icon: <CheckCircle className="h-5 w-5" />, color: "text-teal-600" },
  ];

  const recentActions = [
    { elder: "Иван Петров", action: "Создал новую задачу для группы FE-301", time: "5 мин назад", group: "FE-301" },
    { elder: "Мария Сидорова", action: "Обновила прогресс курса React Advanced", time: "12 мин назад", group: "FE-302" },
    { elder: "Алексей Иванов", action: "Добавил нового студента в группу", time: "25 мин назад", group: "BE-201" },
    { elder: "Елена Козлова", action: "Проверила задачи по JavaScript", time: "1 час назад", group: "FE-301" },
  ];

  const warnings = [
    { title: t.emptyGroups, count: 2, severity: "medium" },
    { title: t.lowProgress, count: 5, severity: "high" },
    { title: t.missedDeadlines, count: 12, severity: "critical" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={stat.color}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> за неделю
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Average Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t.avgProgress}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold">76%</div>
              <p className="text-sm text-muted-foreground mt-1">По всем курсам</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>React Fundamentals</span>
                <span>82%</span>
              </div>
              <Progress value={82} />
              <div className="flex justify-between text-sm">
                <span>Node.js Backend</span>
                <span>71%</span>
              </div>
              <Progress value={71} />
              <div className="flex justify-between text-sm">
                <span>Database Design</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t.recentActions}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActions.map((action, index) => (
              <div key={index} className="pb-3 border-b last:border-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium">{action.elder}</p>
                  <Badge variant="secondary" className="shrink-0 text-xs">{action.group}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{action.action}</p>
                <p className="text-xs text-muted-foreground">{action.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              {t.warnings}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warnings.map((warning, index) => {
              const severityColors = {
                low: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500",
                medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500",
                high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500",
                critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500",
              };

              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{warning.title}</p>
                    <p className="text-xs text-muted-foreground">{warning.count} {language === "en" ? "items" : "элементов"}</p>
                  </div>
                  <Badge className={severityColors[warning.severity as keyof typeof severityColors]}>
                    {warning.severity}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t.weekActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 78, 82, 71, 89, 76, 84].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-purple-500 via-indigo-600 to-green-500 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${height}%` }} />
                <span className="text-xs text-muted-foreground">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
