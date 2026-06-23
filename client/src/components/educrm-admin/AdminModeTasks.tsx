import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CheckCircle, Plus, Edit, Trash2, Search, Calendar } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Task {
  id: string;
  title: string;
  description: string;
  group: string;
  course: string;
  assignedTo: string;
  dueDate: string;
  status: "completed" | "in-progress" | "pending";
  priority: "high" | "medium" | "low";
}

export function AdminModeTasks() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    group: "",
    course: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  const t = {
    title: language === "en" ? "Task Management" : "Управление задачами",
    subtitle: language === "en" ? "Create, assign, and track tasks" : "Создание, назначение и отслеживание задач",
    createTask: language === "en" ? "Create Task" : "Создать задачу",
    editTask: language === "en" ? "Edit Task" : "Редактировать задачу",
    search: language === "en" ? "Search tasks..." : "Поиск задач...",
    taskTitle: language === "en" ? "Task Title" : "Название задачи",
    description: language === "en" ? "Description" : "Описание",
    group: language === "en" ? "Group" : "Группа",
    course: language === "en" ? "Course" : "Курс",
    assignedTo: language === "en" ? "Assigned To" : "Назначено",
    dueDate: language === "en" ? "Due Date" : "Срок",
    status: language === "en" ? "Status" : "Статус",
    priority: language === "en" ? "Priority" : "Приоритет",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    completed: language === "en" ? "Completed" : "Завершено",
    inProgress: language === "en" ? "In Progress" : "В процессе",
    pending: language === "en" ? "Pending" : "Ожидает",
    high: language === "en" ? "High" : "Высокий",
    medium: language === "en" ? "Medium" : "Средний",
    low: language === "en" ? "Low" : "Низкий",
    all: language === "en" ? "All" : "Все",
    filterByStatus: language === "en" ? "Filter by status" : "Фильтр по статусу",
    filterByGroup: language === "en" ? "Filter by group" : "Фильтр по группе",
    createDialogTitle: language === "en" ? "Create New Task" : "Создать новую задачу",
    createDialogDesc: language === "en" ? "Add a new task for students" : "Добавьте новую задачу для студентов",
    editDialogTitle: language === "en" ? "Edit Task" : "Редактировать задачу",
    editDialogDesc: language === "en" ? "Update task information" : "Обновить информацию о задаче",
  };

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Пройти курс по React",
      description: "Пройти главы 1-5 документации React",
      group: "FE-301",
      course: "React Fundamentals",
      assignedTo: "Группа FE-301",
      dueDate: "2024-12-10",
      status: "in-progress",
      priority: "high"
    },
    {
      id: "2",
      title: "Задание по проектированию БД",
      description: "Разработать схему для интернет-магазина",
      group: "BE-201",
      course: "Database Design",
      assignedTo: "Группа BE-201",
      dueDate: "2024-12-08",
      status: "completed",
      priority: "medium"
    },
    {
      id: "3",
      title: "Упражнения по JavaScript ES6",
      description: "Выполнить все практические задания по ES6",
      group: "FE-302",
      course: "Advanced JavaScript",
      assignedTo: "Группа FE-302",
      dueDate: "2024-12-15",
      status: "pending",
      priority: "low"
    },
    {
      id: "4",
      title: "Проект API на Node.js",
      description: "Создать RESTful API с использованием Express",
      group: "BE-201",
      course: "Node.js Backend",
      assignedTo: "Группа BE-201",
      dueDate: "2024-12-12",
      status: "in-progress",
      priority: "high"
    },
  ]);

  let filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterStatus !== "all") {
    filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
  }

  if (filterGroup !== "all") {
    filteredTasks = filteredTasks.filter(task => task.group === filterGroup);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      default: return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      case "medium": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500";
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      default: return "";
    }
  };

  const handleCreate = () => {
    const newTask: Task = {
      id: String(tasks.length + 1),
      title: formData.title,
      description: formData.description,
      group: formData.group,
      course: formData.course,
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
      status: "pending",
      priority: formData.priority,
    };
    setTasks([...tasks, newTask]);
    setIsCreateDialogOpen(false);
    setFormData({ title: "", description: "", group: "", course: "", assignedTo: "", dueDate: "", priority: "medium" });
  };

  const handleEdit = () => {
    if (!selectedTask) return;
    setTasks(tasks.map(t => t.id === selectedTask.id ? { ...selectedTask, ...formData } : t));
    setIsEditDialogOpen(false);
    setSelectedTask(null);
    setFormData({ title: "", description: "", group: "", course: "", assignedTo: "", dueDate: "", priority: "medium" });
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      group: task.group,
      course: task.course,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      priority: task.priority,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t.createTask}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.createDialogTitle}</DialogTitle>
              <DialogDescription>{t.createDialogDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-title">{t.taskTitle}</Label>
                <Input
                  id="create-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={language === "en" ? "Complete React Tutorial" : "Пройти курс по React"}
                />
              </div>
              <div>
                <Label htmlFor="create-description">{t.description}</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === "en" ? "Task description..." : "Описание задачи..."}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-group">{t.group}</Label>
                  <Select value={formData.group} onValueChange={(value: string) => setFormData({ ...formData, group: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select group" : "Выберите группу"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FE-301">FE-301</SelectItem>
                      <SelectItem value="FE-302">FE-302</SelectItem>
                      <SelectItem value="BE-201">BE-201</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="create-course">{t.course}</Label>
                  <Input
                    id="create-course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="React Fundamentals"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="create-assigned">{t.assignedTo}</Label>
                <Input
                  id="create-assigned"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="Group FE-301"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-duedate">{t.dueDate}</Label>
                  <Input
                    id="create-duedate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-priority">{t.priority}</Label>
                  <Select value={formData.priority} onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}>
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
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>{t.cancel}</Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
                {t.save}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t.filterByStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="completed">{t.completed}</SelectItem>
            <SelectItem value="in-progress">{t.inProgress}</SelectItem>
            <SelectItem value="pending">{t.pending}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t.filterByGroup} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="FE-301">FE-301</SelectItem>
            <SelectItem value="FE-302">FE-302</SelectItem>
            <SelectItem value="BE-201">BE-201</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {language === "en" ? "All Tasks" : "Все задачи"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.taskTitle}</TableHead>
                <TableHead>{t.group}</TableHead>
                <TableHead>{t.course}</TableHead>
                <TableHead>{t.dueDate}</TableHead>
                <TableHead>{t.priority}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div>
                      <div>{task.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.group}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{task.course}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{task.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === "high" ? t.high : task.priority === "medium" ? t.medium : t.low}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === "completed" ? t.completed : task.status === "in-progress" ? t.inProgress : t.pending}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editDialogTitle}</DialogTitle>
            <DialogDescription>{t.editDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">{t.taskTitle}</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">{t.description}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-duedate">{t.dueDate}</Label>
              <Input
                id="edit-duedate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-priority">{t.priority}</Label>
              <Select value={formData.priority} onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t.cancel}</Button>
            <Button onClick={handleEdit} className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
