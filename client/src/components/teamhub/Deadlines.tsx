import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useLanguage } from "../../lib/language-context";
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search
} from "lucide-react";
import { Badge } from "../ui/badge";

interface Deadline {
  id: string;
  title: string;
  team: string;
  project: string;
  dueDate: string;
  status: "upcoming" | "today" | "overdue" | "completed";
  priority: "low" | "medium" | "high";
}

export function Deadlines() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [deadlines] = useState<Deadline[]>([
    {
      id: "1",
      title: "Mobile App Release v2.0",
      team: "Mobile Dev Team",
      project: "iOS Application",
      dueDate: "2026-02-05",
      status: "upcoming",
      priority: "high",
    },
    {
      id: "2",
      title: "Design System Documentation",
      team: "Design Team",
      project: "UI/UX Library",
      dueDate: "2026-02-01",
      status: "today",
      priority: "medium",
    },
    {
      id: "3",
      title: "API Integration Testing",
      team: "Backend Team",
      project: "REST API v3",
      dueDate: "2026-01-30",
      status: "overdue",
      priority: "high",
    },
    {
      id: "4",
      title: "User Analytics Report",
      team: "Mobile Dev Team",
      project: "Analytics Dashboard",
      dueDate: "2026-02-10",
      status: "upcoming",
      priority: "low",
    },
  ]);

  const t = {
    deadlines: language === "en" ? "Deadlines" : "Дедлайны",
    subtitle: language === "en" ? "Track all important deadlines across teams" : "Отслеживайте важные дедлайны во всех командах",
    search: language === "en" ? "Search deadlines..." : "Поиск дедлайнов...",
    all: language === "en" ? "All" : "Все",
    upcoming: language === "en" ? "Upcoming" : "Предстоящие",
    today: language === "en" ? "Today" : "Сегодня",
    overdue: language === "en" ? "Overdue" : "Просрочено",
    completed: language === "en" ? "Completed" : "Завершено",
    team: language === "en" ? "Team" : "Команда",
    project: language === "en" ? "Project" : "Проект",
    dueDate: language === "en" ? "Due Date" : "Дедлайн",
    priority: language === "en" ? "Priority" : "Приоритет",
    low: language === "en" ? "Low" : "Низкий",
    medium: language === "en" ? "Medium" : "Средний",
    high: language === "en" ? "High" : "Высокий",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "today":
        return "from-orange-500 to-amber-600";
      case "overdue":
        return "from-red-500 to-rose-600";
      case "upcoming":
        return "from-blue-500 to-indigo-600";
      case "completed":
        return "from-green-500 to-emerald-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "today":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      case "upcoming":
        return <Calendar className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-950";
      case "medium":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950";
      case "low":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-950";
    }
  };

  const filteredDeadlines = deadlines.filter(deadline => {
    const matchesSearch = deadline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deadline.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deadline.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || deadline.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filterButtons = [
    { id: "all", label: t.all },
    { id: "today", label: t.today },
    { id: "upcoming", label: t.upcoming },
    { id: "overdue", label: t.overdue },
    { id: "completed", label: t.completed },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.deadlines}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterButtons.map((filter) => (
            <Button
              key={filter.id}
              variant={filterStatus === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(filter.id)}
              className={filterStatus === filter.id ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filteredDeadlines.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === "en" ? "No deadlines found" : "Дедлайны не найдены"}
            </p>
          </Card>
        ) : (
          filteredDeadlines.map((deadline) => (
            <Card key={deadline.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getStatusColor(deadline.status)} flex items-center justify-center text-white shrink-0`}>
                  {getStatusIcon(deadline.status)}
                </div>

                {/* Deadline Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{deadline.title}</h3>
                    <Badge className={getPriorityColor(deadline.priority)}>
                      {deadline.priority === "high" ? t.high : deadline.priority === "medium" ? t.medium : t.low}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{t.team}:</span>
                      <span>{deadline.team}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{t.project}:</span>
                      <span>{deadline.project}</span>
                    </div>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t.dueDate}</p>
                    <p className="text-sm font-medium">
                      {new Date(deadline.dueDate).toLocaleDateString(language === "en" ? "en-US" : "ru-RU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
