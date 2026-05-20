import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Trash2,
  Edit,
  User
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  dueDate: string;
  sourceSpec?: string;
}

export function Tasks() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Реализовать авторизацию",
      description: "Создать систему входа и регистрации пользователей",
      project: "Mobile App Redesign",
      assignee: "Иван Петров",
      status: "in-progress",
      priority: "high",
      createdAt: "2024-01-20",
      dueDate: "2024-02-15",
      sourceSpec: "Mobile App Spec v2.0"
    },
    {
      id: "2",
      title: "Дизайн главного экрана",
      description: "Создать макеты нового главного экрана приложения",
      project: "Mobile App Redesign",
      assignee: "Мария Сидорова",
      status: "done",
      priority: "high",
      createdAt: "2024-01-18",
      dueDate: "2024-02-01",
    },
    {
      id: "3",
      title: "API для профиля пользователя",
      description: "Разработать REST API эндпоинты для управления профилем",
      project: "API v2 Development",
      assignee: "Алексей Иванов",
      status: "review",
      priority: "medium",
      createdAt: "2024-01-25",
      dueDate: "2024-02-20",
    },
    {
      id: "4",
      title: "Написать тесты для модуля оплаты",
      description: "Unit и интеграционные тесты",
      project: "E-commerce Platform",
      assignee: "Иван Петров",
      status: "todo",
      priority: "medium",
      createdAt: "2024-02-01",
      dueDate: "2024-02-25",
    },
    {
      id: "5",
      title: "Оптимизация базы данных",
      description: "Добавить индексы и оптимизировать запросы",
      project: "API v2 Development",
      assignee: "Алексей Иванов",
      status: "todo",
      priority: "low",
      createdAt: "2024-02-03",
      dueDate: "2024-03-01",
    },
  ]);

  const t = {
    tasks: language === "en" ? "Tasks" : "Задачи",
    subtitle: language === "en" ? "Manage and track your team's tasks" : "Управляйте и отслеживайте задачи команды",
    createTask: language === "en" ? "Create Task" : "Создать задачу",
    search: language === "en" ? "Search tasks..." : "Поиск задач...",
    all: language === "en" ? "All" : "Все",
    todo: language === "en" ? "To Do" : "К выполнению",
    inProgress: language === "en" ? "In Progress" : "В работе",
    review: language === "en" ? "Review" : "На проверке",
    done: language === "en" ? "Done" : "Выполнено",
    high: language === "en" ? "High" : "Высокий",
    medium: language === "en" ? "Medium" : "Средний",
    low: language === "en" ? "Low" : "Низкий",
    priority: language === "en" ? "Priority" : "Приоритет",
    assignee: language === "en" ? "Assignee" : "Исполнитель",
    project: language === "en" ? "Project" : "Проект",
    dueDate: language === "en" ? "Due Date" : "Срок",
    fromSpec: language === "en" ? "From Spec" : "Из ТЗ",
    edit: language === "en" ? "Edit" : "Редактировать",
    delete: language === "en" ? "Delete" : "Удалить",
    // Create Task Dialog
    taskTitle: language === "en" ? "Task Title" : "Название задачи",
    taskDescription: language === "en" ? "Description" : "Описание",
    selectProject: language === "en" ? "Select Project" : "Выберите проект",
    selectAssignee: language === "en" ? "Assign to" : "Назначить",
    selectPriority: language === "en" ? "Priority" : "Приоритет",
    selectStatus: language === "en" ? "Status" : "Статус",
    create: language === "en" ? "Create" : "Создать",
    cancel: language === "en" ? "Cancel" : "Отмена",
    createTaskTitle: language === "en" ? "Create New Task" : "Создать новую задачу",
    createTaskDesc: language === "en" ? "Add a new task to your project" : "Добавьте новую задачу в проект",
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "review":
        return <AlertCircle className="h-4 w-4" />;
      case "done":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "from-gray-500 to-slate-600";
      case "in-progress":
        return "from-blue-500 to-cyan-600";
      case "review":
        return "from-orange-500 to-yellow-600";
      case "done":
        return "from-emerald-500 to-teal-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const groupedTasks = {
    todo: filteredTasks.filter(t => t.status === "todo"),
    "in-progress": filteredTasks.filter(t => t.status === "in-progress"),
    review: filteredTasks.filter(t => t.status === "review"),
    done: filteredTasks.filter(t => t.status === "done"),
  };

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: Task = {
      id: String(tasks.length + 1),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      project: formData.get("project") as string,
      assignee: formData.get("assignee") as string,
      status: (formData.get("status") as Task["status"]) || "todo",
      priority: (formData.get("priority") as Task["priority"]) || "medium",
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: formData.get("dueDate") as string,
    };
    setTasks([newTask, ...tasks]);
    setIsCreateDialogOpen(false);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="p-4 hover:shadow-md transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium mb-1">{task.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                {t.edit}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                {t.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={getPriorityColor(task.priority) as any}>
            {t[task.priority as keyof typeof t]}
          </Badge>
          {task.sourceSpec && (
            <Badge variant="outline" className="text-xs">
              {t.fromSpec}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {task.assignee}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.dueDate}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.tasks}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createTask}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.createTaskTitle}</DialogTitle>
              <DialogDescription>{t.createTaskDesc}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t.taskTitle}</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.taskDescription}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">{t.selectProject}</Label>
                  <Select name="project" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mobile App Redesign">Mobile App Redesign</SelectItem>
                      <SelectItem value="API v2 Development">API v2 Development</SelectItem>
                      <SelectItem value="Landing Page">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">{t.selectAssignee}</Label>
                  <Select name="assignee" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Иван Петров">Иван Петров</SelectItem>
                      <SelectItem value="Мария Сидорова">Мария Сидорова</SelectItem>
                      <SelectItem value="Алексей Иванов">Алексей Иванов</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">{t.selectPriority}</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">{t.high}</SelectItem>
                      <SelectItem value="medium">{t.medium}</SelectItem>
                      <SelectItem value="low">{t.low}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t.selectStatus}</Label>
                  <Select name="status" defaultValue="todo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">{t.todo}</SelectItem>
                      <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                      <SelectItem value="review">{t.review}</SelectItem>
                      <SelectItem value="done">{t.done}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">{t.dueDate}</Label>
                  <Input id="dueDate" name="dueDate" type="date" required />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  {t.create}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedTasks).map(([status, taskList]) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getStatusColor(status)} flex items-center justify-center text-white`}>
                  {getStatusIcon(status)}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {t[status.replace("-", "") as keyof typeof t] || status}
                  </h3>
                  <p className="text-xs text-muted-foreground">{taskList.length}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {taskList.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {taskList.length === 0 && (
                <Card className="p-4 border-dashed">
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? "No tasks" : "Нет задач"}
                  </p>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
