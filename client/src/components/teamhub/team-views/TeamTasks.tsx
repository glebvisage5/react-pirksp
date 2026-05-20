import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useLanguage } from "../../../lib/language-context";
import { KanbanBoard } from "../KanbanBoard";
import { toast } from "sonner@2.0.3";
import { 
  CheckSquare, 
  Plus, 
  Search, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutList,
  LayoutGrid
} from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  project: string;
  projectId: string;
  dueDate: string;
  createdAt: string;
}

interface TeamTasksProps {
  teamId: string;
}

export function TeamTasks({ teamId }: TeamTasksProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const [tasksState, setTasksState] = useState<Task[]>([
    {
      id: "1",
      title: language === "en" ? "Implement user authentication" : "Реализовать аутентификацию",
      description: language === "en" ? "Add OAuth and email/password login" : "Добавить OAuth и вход по email",
      status: "in-progress",
      priority: "high",
      assignee: language === "en" ? "John Doe" : "Иван Петров",
      project: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
      projectId: "1",
      dueDate: "2024-02-15",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      title: language === "en" ? "Design dashboard mockups" : "Создать макеты панели управления",
      description: language === "en" ? "Create high-fidelity designs" : "Создать детальные дизайны",
      status: "review",
      priority: "medium",
      assignee: language === "en" ? "Jane Smith" : "Мария Сидорова",
      project: language === "en" ? "Dashboard Redesign" : "Редизайн панели управления",
      projectId: "2",
      dueDate: "2024-02-10",
      createdAt: "2024-01-18",
    },
    {
      id: "3",
      title: language === "en" ? "Setup CI/CD pipeline" : "Настроить CI/CD пайплайн",
      description: language === "en" ? "Configure GitHub Actions" : "Настроить GitHub Actions",
      status: "todo",
      priority: "high",
      assignee: language === "en" ? "Alex Johnson" : "Алексей Иванов",
      project: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
      projectId: "1",
      dueDate: "2024-02-20",
      createdAt: "2024-01-25",
    },
    {
      id: "4",
      title: language === "en" ? "Write API documentation" : "Написать документацию API",
      description: language === "en" ? "Document all endpoints" : "Задокументировать все эндпоинты",
      status: "done",
      priority: "low",
      assignee: language === "en" ? "John Doe" : "Иван Петров",
      project: language === "en" ? "API Integration" : "Интеграция API",
      projectId: "3",
      dueDate: "2024-02-05",
      createdAt: "2024-01-15",
    },
    {
      id: "5",
      title: language === "en" ? "Fix navigation bugs" : "Исправить баги навигации",
      description: language === "en" ? "Issues on iOS devices" : "Проблемы на iOS устройствах",
      status: "in-progress",
      priority: "urgent",
      assignee: language === "en" ? "Jane Smith" : "Мария Сидорова",
      project: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
      projectId: "1",
      dueDate: "2024-02-08",
      createdAt: "2024-01-28",
    },
    {
      id: "6",
      title: language === "en" ? "Security audit review" : "Проверка аудита безопасности",
      description: language === "en" ? "Review findings and recommendations" : "Проверить результаты и рекомендации",
      status: "todo",
      priority: "medium",
      assignee: language === "en" ? "Alex Johnson" : "Алексей Иванов",
      project: language === "en" ? "Security Audit" : "Аудит безопасности",
      projectId: "4",
      dueDate: "2024-02-18",
      createdAt: "2024-01-22",
    },
  ]);

  const projects = [
    { id: "1", name: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения" },
    { id: "2", name: language === "en" ? "Dashboard Redesign" : "Редизайн панели управления" },
    { id: "3", name: language === "en" ? "API Integration" : "Интеграция API" },
    { id: "4", name: language === "en" ? "Security Audit" : "Аудит безопасности" },
  ];

  const assignees = [
    language === "en" ? "John Doe" : "Иван Петров",
    language === "en" ? "Jane Smith" : "Мария Сидорова",
    language === "en" ? "Alex Johnson" : "Алексей Иванов",
  ];

  const t = {
    tasks: language === "en" ? "Tasks" : "Задачи",
    subtitle: language === "en" ? "Manage team tasks and track progress" : "Управление задачами команды",
    createTask: language === "en" ? "Create Task" : "Создать задачу",
    search: language === "en" ? "Search tasks..." : "Поиск задач...",
    filterAll: language === "en" ? "All Projects" : "Все проекты",
    filterAllAssignees: language === "en" ? "All Members" : "Все участники",
    kanbanView: language === "en" ? "Kanban" : "Канбан",
    listView: language === "en" ? "List" : "Список",
    priorityLow: language === "en" ? "Low" : "Низкий",
    priorityMedium: language === "en" ? "Medium" : "Средний",
    priorityHigh: language === "en" ? "High" : "Высокий",
    priorityUrgent: language === "en" ? "Urgent" : "Срочно",
    view: language === "en" ? "View" : "Просмотр",
    edit: language === "en" ? "Edit" : "Редактировать",
    delete: language === "en" ? "Delete" : "Удалить",
    noTasks: language === "en" ? "No tasks found" : "Задачи не найдены",
    createFirst: language === "en" ? "Create your first task" : "Создайте первую задачу",
    taskMoved: language === "en" ? "Task moved successfully" : "Задача успешно перемещена",
  };

  const handleTaskMove = (taskId: string, newStatus: Task["status"]) => {
    setTasksState(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    toast.success(t.taskMoved);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasksState(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success(language === "en" ? "Task deleted" : "Задача удалена");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent":
        return t.priorityUrgent;
      case "high":
        return t.priorityHigh;
      case "medium":
        return t.priorityMedium;
      case "low":
        return t.priorityLow;
      default:
        return priority;
    }
  };

  const filteredTasks = tasksState.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === "all" || task.projectId === filterProject;
    const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee;
    return matchesSearch && matchesProject && matchesAssignee;
  });

  const renderTaskCard = (task: Task) => (
    <Card key={task.id} className="p-4 hover:shadow-md transition-all cursor-pointer">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-2 flex-1">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                {t.view}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                {t.edit}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleTaskDelete(task.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
            {getPriorityText(task.priority)}
          </Badge>
          <Badge variant="outline" className="text-xs">{task.project}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{task.assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckSquare className="h-6 w-6" />
          {t.tasks}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAllAssignees}</SelectItem>
              {assignees.map(assignee => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t.createTask}
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={view === "kanban" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("kanban")}
          className={view === "kanban" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          {t.kanbanView}
        </Button>
        <Button
          variant={view === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("list")}
          className={view === "list" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""}
        >
          <LayoutList className="h-4 w-4 mr-2" />
          {t.listView}
        </Button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {view === "kanban" ? (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskMove={handleTaskMove}
            onTaskDelete={handleTaskDelete}
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(renderTaskCard)
            ) : (
              <Card className="p-12">
                <div className="text-center space-y-3">
                  <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="font-semibold">{t.noTasks}</h3>
                  <p className="text-sm text-muted-foreground">{t.createFirst}</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
