import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Trophy, Clock, TrendingUp, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../../lib/language-context";
import { useUser } from "../../lib/user-context";
import { apiTasks, type UserTask, type UserStats } from "../../api/tasks";
import { apiCourses, type Course } from "../../api/courses";

interface TaskCardProps {
  task: UserTask;
  onClick: (id: string) => void;
  language: string;
}

const TaskCard = ({ task, onClick, language }: TaskCardProps) => {
  const statusLabels: Record<string, string> = {
    done: language === "en" ? "Completed" : "Завершено",
    "in-progress": language === "en" ? "In Progress" : "В процессе",
    todo: language === "en" ? "Pending" : "Ожидает",
    review: language === "en" ? "Review" : "На проверке",
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "done": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "review": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return language === "en" ? "No deadline" : "Без срока";
    return new Date(dateStr).toLocaleDateString(language === "en" ? "en-US" : "ru-RU", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onClick(task.id)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="mb-1">{task.title}</h4>
            <p className="text-sm text-muted-foreground">{task.course_title ?? "—"}</p>
          </div>
          <Badge className={getStatusColor()} variant="secondary">
            {statusLabels[task.status] ?? task.status}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{language === "en" ? "Progress" : "Прогресс"}</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{language === "en" ? "Due:" : "Срок:"} {formatDate(task.due_date)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface Props {
  onTaskClick: (taskId: string) => void;
}

export function DashboardHome({ onTaskClick }: Props) {
  const { language } = useLanguage();
  const { user } = useUser();

  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      apiTasks.list({ limit: 4 }),
      apiCourses.enrolled(4),
      apiTasks.stats(),
    ])
      .then(([t, c, s]) => {
        setTasks(t);
        setCourses(c);
        setStats(s);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const t = {
    title: language === "en" ? "Dashboard Overview" : "Обзор дашборда",
    subtitle: language === "en" ? "Track your progress and stay on top of your tasks" : "Отслеживайте прогресс и контролируйте задачи",
    taskProgress: language === "en" ? "My Tasks" : "Мои задачи",
    myCourses: language === "en" ? "My Courses" : "Мои курсы",
    stats: language === "en" ? "Statistics" : "Статистика",
    upcomingDeadlines: language === "en" ? "Upcoming Deadlines" : "Предстоящие дедлайны",
    viewAllTasks: language === "en" ? "View All Tasks" : "Все задачи",
    viewAllCourses: language === "en" ? "View All Courses" : "Все курсы",
    points: language === "en" ? "points" : "баллов",
    overallProgress: language === "en" ? "Overall Progress" : "Общий прогресс",
    tasksCompleted: language === "en" ? "Tasks Completed" : "Задач выполнено",
    coursesEnrolled: language === "en" ? "Courses Enrolled" : "Курсов записано",
    inProgress: language === "en" ? "In Progress" : "В процессе",
    noTasks: language === "en" ? "No tasks assigned yet" : "Задачи ещё не назначены",
    noCourses: language === "en" ? "No courses enrolled yet" : "Вы ещё не записаны на курсы",
    urgent: language === "en" ? "Urgent" : "Срочно",
    loading: language === "en" ? "Loading..." : "Загрузка...",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  // Задачи с ближайшим дедлайном (есть дата + не done)
  const upcomingDeadlines = tasks
    .filter((t) => t.due_date && t.status !== "done")
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3);

  const isUrgent = (dateStr: string | null) => {
    if (!dateStr) return false;
    return (new Date(dateStr).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="text-center sm:text-left">
        <h2>{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{stats.tasks_completed}</div>
              <p className="text-sm text-muted-foreground mt-1">{t.tasksCompleted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{stats.tasks_in_progress}</div>
              <p className="text-sm text-muted-foreground mt-1">{t.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{stats.courses_enrolled}</div>
              <p className="text-sm text-muted-foreground mt-1">{t.coursesEnrolled}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{stats.overall_progress}%</div>
              <p className="text-sm text-muted-foreground mt-1">{t.overallProgress}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Tasks — 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.taskProgress}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t.noTasks}</p>
              ) : (
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={onTaskClick} language={language} />
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => onTaskClick("")}>
                {t.viewAllTasks}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Deadlines sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.upcomingDeadlines}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {language === "en" ? "No upcoming deadlines" : "Дедлайнов нет"}
                </p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onTaskClick(task.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.course_title ?? "—"}</p>
                      </div>
                      {isUrgent(task.due_date) && (
                        <Badge variant="destructive" className="shrink-0 text-xs">{t.urgent}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(task.due_date!).toLocaleDateString(language === "en" ? "en-US" : "ru-RU", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t.myCourses}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t.noCourses}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{course.thumbnail_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{course.instructor_name ?? "—"}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{language === "en" ? "Progress" : "Прогресс"}</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {course.completed_lessons}/{course.total_lessons} {language === "en" ? "lessons" : "уроков"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="w-full mt-4">
            {t.viewAllCourses}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
