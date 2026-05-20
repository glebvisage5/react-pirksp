import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Trophy, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface TaskCardProps {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  progress: number;
  status: "completed" | "in-progress" | "pending";
  onClick: (id: string) => void;
  language: "en" | "ru";
}

const TaskCard = ({ id, title, course, dueDate, progress, status, onClick, language }: TaskCardProps) => {
  const statusLabels = {
    completed: language === "en" ? "Completed" : "Завершено",
    "in-progress": language === "en" ? "In Progress" : "В процессе",
    pending: language === "en" ? "Pending" : "Ожидает"
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onClick(id)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{course}</p>
          </div>
          <Badge className={getStatusColor()} variant="secondary">
            {statusLabels[status]}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{language === "en" ? "Progress" : "Прогресс"}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{language === "en" ? "Due:" : "Срок:"} {dueDate}</span>
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

  const t = {
    title: language === "en" ? "Dashboard Overview" : "Обзор дашборда",
    subtitle: language === "en" ? "Track your progress and stay on top of your tasks" : "Отслеживайте прогресс и контролируйте задачи",
    taskProgress: language === "en" ? "Task Progress" : "Прогресс задач",
    upcomingEvents: language === "en" ? "Upcoming Events" : "Предстоящие события",
    leaderboard: language === "en" ? "Leaderboard" : "Рейтинг",
    upcomingDeadlines: language === "en" ? "Upcoming Deadlines" : "Предстоящие дедлайны",
    academicPerformance: language === "en" ? "Academic Performance" : "Академическая успеваемость",
    viewAllTasks: language === "en" ? "View All Tasks" : "Все задачи",
    viewFullCalendar: language === "en" ? "View Full Calendar" : "Полный календарь",
    viewFullLeaderboard: language === "en" ? "View Full Leaderboard" : "Полный рейтинг",
    viewAllDeadlines: language === "en" ? "View All Deadlines" : "Все дедлайны",
    viewDetailedReport: language === "en" ? "View Detailed Report" : "Подробный отчет",
    points: language === "en" ? "points" : "баллов",
    overallGrade: language === "en" ? "Overall Grade" : "Общая оценка",
    urgent: language === "en" ? "Urgent" : "Срочно"
  };

  const tasks = [
    { id: "1", title: "React Assignment", course: "Web Development", dueDate: "Dec 10, 2024", progress: 75, status: "in-progress" as const },
    { id: "2", title: "Database Project", course: "Data Science", dueDate: "Dec 8, 2024", progress: 100, status: "completed" as const },
    { id: "3", title: "Marketing Case Study", course: "Digital Marketing", dueDate: "Dec 15, 2024", progress: 30, status: "in-progress" as const },
    { id: "4", title: "Math Problem Set", course: "Advanced Mathematics", dueDate: "Dec 12, 2024", progress: 0, status: "pending" as const },
  ];

  const upcomingEvents = [
    { title: "Web Development Final", date: "Dec 18, 2024", time: "10:00 AM" },
    { title: "Project Presentation", date: "Dec 20, 2024", time: "2:00 PM" },
    { title: "Team Meeting", date: "Dec 5, 2024", time: "4:00 PM" },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Johnson", points: 2450, avatar: "SJ" },
    { rank: 2, name: "Michael Chen", points: 2380, avatar: "MC" },
    { rank: 3, name: "Emma Davis", points: 2310, avatar: "ED" },
    { rank: 4, name: "You", points: 2250, avatar: "ME", highlight: true },
    { rank: 5, name: "James Wilson", points: 2180, avatar: "JW" },
  ];

  const deadlines = [
    { task: "React Assignment", course: "Web Development", date: "Dec 10", urgent: false },
    { task: "Marketing Case Study", course: "Digital Marketing", date: "Dec 15", urgent: false },
    { task: "Database Project", course: "Data Science", date: "Dec 8", urgent: true },
  ];

  const performance = {
    overall: 87,
    courses: [
      { name: "Web Development", grade: 92, color: "bg-blue-500" },
      { name: "Data Science", grade: 88, color: "bg-green-500" },
      { name: "Digital Marketing", grade: 85, color: "bg-purple-500" },
      { name: "Mathematics", grade: 82, color: "bg-orange-500" },
    ]
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="text-center sm:text-left">
        <h2>{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Task Progress - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.taskProgress}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {tasks.map((task) => (
                  <TaskCard key={task.id} {...task} onClick={onTaskClick} language={language} />
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t.viewAllTasks}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.upcomingEvents}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <p className="font-medium text-sm sm:text-base">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                {t.viewFullCalendar}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {t.leaderboard}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  entry.highlight ? "bg-primary/10 border border-primary/20" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  entry.rank === 1 ? "bg-yellow-500 text-white" :
                  entry.rank === 2 ? "bg-gray-400 text-white" :
                  entry.rank === 3 ? "bg-orange-600 text-white" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.points} {t.points}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              {t.viewFullLeaderboard}
            </Button>
          </CardContent>
        </Card>

        {/* Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {t.upcomingDeadlines}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deadlines.map((deadline, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">{deadline.course}</p>
                  </div>
                  {deadline.urgent && (
                    <Badge variant="destructive" className="shrink-0 text-xs">{t.urgent}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{deadline.date}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              {t.viewAllDeadlines}
            </Button>
          </CardContent>
        </Card>

        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t.academicPerformance}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-4xl mb-1">{performance.overall}%</div>
              <p className="text-sm text-muted-foreground">{t.overallGrade}</p>
            </div>
            <div className="space-y-3">
              {performance.courses.map((course, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{course.name}</span>
                    <span>{course.grade}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${course.color} h-2 rounded-full`}
                      style={{ width: `${course.grade}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              {t.viewDetailedReport}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}