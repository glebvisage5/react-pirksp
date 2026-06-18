import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLanguage } from "../../lib/language-context";
import { apiTasks, type UserTask } from "../../api/tasks";
import { apiCourses, type Course } from "../../api/courses";
import { toast } from "sonner";
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Search,
  FileText,
  Loader2,
  ClipboardCheck,
  Plus,
} from "lucide-react";

export function TaskProgress() {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<UserTask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const [editStatus, setEditStatus] = useState<UserTask["status"]>("todo");
  const [editProgress, setEditProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const emptyNewTask = { title: "", description: "", due_date: "", priority: "medium" as UserTask["priority"], course_id: "" };
  const [newTask, setNewTask] = useState(emptyNewTask);

  const t = {
    title: language === "en" ? "Task Progress" : "Прогресс задач",
    subtitle: language === "en" ? "Manage and track your assignments" : "Управляйте и отслеживайте ваши задания",
    totalTasks: language === "en" ? "Total Tasks" : "Всего задач",
    done: language === "en" ? "Done" : "Выполнено",
    inProgress: language === "en" ? "In Progress" : "В процессе",
    todo: language === "en" ? "To Do" : "К выполнению",
    review: language === "en" ? "Review" : "На проверке",
    searchPlaceholder: language === "en" ? "Search tasks..." : "Поиск задач...",
    progress: language === "en" ? "Progress" : "Прогресс",
    due: language === "en" ? "Due:" : "Срок:",
    noDueDate: language === "en" ? "No due date" : "Без срока",
    high: language === "en" ? "High" : "Высокий",
    medium: language === "en" ? "Medium" : "Средний",
    low: language === "en" ? "Low" : "Низкий",
    priority: language === "en" ? "priority" : "приоритет",
    description: language === "en" ? "Description" : "Описание",
    dueDate: language === "en" ? "Due Date" : "Срок сдачи",
    status: language === "en" ? "Status" : "Статус",
    complete: language === "en" ? "Complete" : "Завершено",
    remaining: language === "en" ? "Remaining" : "Осталось",
    updateProgress: language === "en" ? "Update Progress" : "Обновить прогресс",
    markComplete: language === "en" ? "Mark as Complete" : "Отметить как выполненное",
    save: language === "en" ? "Save" : "Сохранить",
    loading: language === "en" ? "Loading..." : "Загрузка...",
    noTasks: language === "en" ? "No tasks found" : "Задачи не найдены",
    allStatus: language === "en" ? "All Status" : "Все статусы",
    allPriority: language === "en" ? "All Priority" : "Все приоритеты",
    noDescription: language === "en" ? "No description provided" : "Описание отсутствует",
    newTask: language === "en" ? "New Task" : "Новая задача",
    createTaskTitle: language === "en" ? "Create Task" : "Создать задачу",
    createTaskSubtitle: language === "en" ? "Add a personal task to your list" : "Добавьте личную задачу в свой список",
    titleLabel: language === "en" ? "Title" : "Название",
    titlePlaceholder: language === "en" ? "e.g., Finish lab report" : "например, Закончить лабораторную работу",
    descriptionLabel: language === "en" ? "Description" : "Описание",
    descriptionTaskPlaceholder: language === "en" ? "Add details (optional)..." : "Добавьте детали (необязательно)...",
    courseLabel: language === "en" ? "Course" : "Курс",
    noCourse: language === "en" ? "No course" : "Без курса",
    priorityLabel: language === "en" ? "Priority" : "Приоритет",
    dueDateLabel: language === "en" ? "Due Date" : "Срок сдачи",
    cancel: language === "en" ? "Cancel" : "Отмена",
    create: language === "en" ? "Create" : "Создать",
    titleRequired: language === "en" ? "Please enter a task title" : "Введите название задачи",
    taskCreated: language === "en" ? "Task created" : "Задача создана",
  };

  const statusLabels: Record<UserTask["status"], string> = {
    todo: t.todo,
    "in-progress": t.inProgress,
    review: t.review,
    done: t.done,
  };

  const priorityLabels: Record<UserTask["priority"], string> = {
    high: t.high,
    medium: t.medium,
    low: t.low,
  };

  const loadTasks = () => {
    setLoading(true);
    apiTasks.list({ limit: 100 })
      .then(setTasks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
    apiCourses.enrolled(100).then(setCourses).catch(() => {});
  }, []);

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error(t.titleRequired);
      return;
    }
    setCreating(true);
    apiTasks.create({
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      due_date: newTask.due_date || undefined,
      priority: newTask.priority,
      course_id: newTask.course_id || undefined,
    })
      .then((task) => {
        setTasks([task, ...tasks]);
        setCreateOpen(false);
        setNewTask(emptyNewTask);
        toast.success(t.taskCreated);
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setCreating(false));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.course_title ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: UserTask["status"]) => {
    switch (status) {
      case "done": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-600" />;
      case "review": return <ClipboardCheck className="h-4 w-4 text-purple-600" />;
      case "todo": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: UserTask["status"]) => {
    switch (status) {
      case "done": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "review": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500";
      case "todo": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
    }
  };

  const getPriorityColor = (priority: UserTask["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      case "medium": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500";
      case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "done").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "todo" || t.status === "review").length,
  };

  const openTask = (task: UserTask) => {
    setSelectedTask(task);
    setEditStatus(task.status);
    setEditProgress(task.progress);
  };

  const handleSaveProgress = () => {
    if (!selectedTask) return;
    setSaving(true);
    apiTasks.updateStatus(selectedTask.id, editStatus, editProgress)
      .then(() => {
        const updated = { ...selectedTask, status: editStatus, progress: editProgress };
        setTasks(tasks.map(t => t.id === selectedTask.id ? updated : t));
        setSelectedTask(updated);
        toast.success(language === "en" ? "Progress updated" : "Прогресс обновлён");
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setSaving(false));
  };

  const handleMarkComplete = () => {
    if (!selectedTask) return;
    setSaving(true);
    apiTasks.updateStatus(selectedTask.id, "done", 100)
      .then(() => {
        const updated = { ...selectedTask, status: "done" as const, progress: 100 };
        setTasks(tasks.map(t => t.id === selectedTask.id ? updated : t));
        setSelectedTask(updated);
        setEditStatus("done");
        setEditProgress(100);
        toast.success(language === "en" ? "Task completed!" : "Задача выполнена!");
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setSaving(false));
  };

  const formatDate = (date: string | null) => {
    if (!date) return t.noDueDate;
    return new Date(date).toLocaleDateString(language === "en" ? "en-US" : "ru-RU", {
      year: "numeric", month: "short", day: "numeric"
    });
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

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl">{t.title}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          {t.newTask}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalTasks}</p>
                <div className="text-2xl">{stats.total}</div>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.done}</p>
                <div className="text-2xl text-green-600">{stats.done}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.inProgress}</p>
                <div className="text-2xl text-blue-600">{stats.inProgress}</div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.todo}</p>
                <div className="text-2xl text-yellow-600">{stats.pending}</div>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatus}</SelectItem>
                <SelectItem value="todo">{t.todo}</SelectItem>
                <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                <SelectItem value="review">{t.review}</SelectItem>
                <SelectItem value="done">{t.done}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allPriority}</SelectItem>
                <SelectItem value="high">{t.high}</SelectItem>
                <SelectItem value="medium">{t.medium}</SelectItem>
                <SelectItem value="low">{t.low}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t.noTasks}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => openTask(task)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-2 line-clamp-2">{task.title}</CardTitle>
                    {task.course_title && (
                      <p className="text-sm text-muted-foreground truncate">{task.course_title}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge className={getStatusColor(task.status)} variant="secondary">
                      {statusLabels[task.status]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                  {priorityLabels[task.priority]} {t.priority}
                </Badge>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t.progress}</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t.due} {formatDate(task.due_date)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open: boolean) => !open && setSelectedTask(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle>{selectedTask.title}</DialogTitle>
                    {selectedTask.course_title && (
                      <DialogDescription>{selectedTask.course_title}</DialogDescription>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge className={getStatusColor(selectedTask.status)} variant="secondary">
                      {statusLabels[selectedTask.status]}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTask.priority)} variant="secondary">
                      {priorityLabels[selectedTask.priority]}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="mb-2">{t.description}</h4>
                  <p className="text-muted-foreground">{selectedTask.description || t.noDescription}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t.dueDate}</p>
                          <p>{formatDate(selectedTask.due_date)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(selectedTask.status)}
                        <div>
                          <p className="text-sm text-muted-foreground">{t.status}</p>
                          <p>{statusLabels[selectedTask.status]}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="mb-2">{t.progress}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{selectedTask.progress}% {t.complete}</span>
                      <span>{100 - selectedTask.progress}% {t.remaining}</span>
                    </div>
                    <Progress value={selectedTask.progress} />
                  </div>
                </div>

                <div>
                  <h4 className="mb-2">{t.updateProgress}</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={editStatus} onValueChange={(v: string) => setEditStatus(v as UserTask["status"])}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">{t.todo}</SelectItem>
                        <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                        <SelectItem value="review">{t.review}</SelectItem>
                        <SelectItem value="done">{t.done}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editProgress}
                      onChange={(e) => setEditProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full sm:w-[120px]"
                    />
                    <Button onClick={handleSaveProgress} disabled={saving} className="flex-1">
                      {t.save}
                    </Button>
                  </div>
                </div>

                {selectedTask.status !== "done" && (
                  <Button variant="outline" className="w-full gap-2" onClick={handleMarkComplete} disabled={saving}>
                    <CheckCircle className="h-4 w-4" />
                    {t.markComplete}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onOpenChange={(open: boolean) => { setCreateOpen(open); if (!open) setNewTask(emptyNewTask); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.createTaskTitle}</DialogTitle>
            <DialogDescription>{t.createTaskSubtitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="new-task-title">{t.titleLabel}</Label>
              <Input
                id="new-task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder={t.titlePlaceholder}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-task-description">{t.descriptionLabel}</Label>
              <Textarea
                id="new-task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder={t.descriptionTaskPlaceholder}
                className="mt-1"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t.priorityLabel}</Label>
                <Select value={newTask.priority} onValueChange={(v: string) => setNewTask({ ...newTask, priority: v as UserTask["priority"] })}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t.low}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="high">{t.high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-task-due">{t.dueDateLabel}</Label>
                <Input
                  id="new-task-due"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {courses.length > 0 && (
              <div>
                <Label>{t.courseLabel}</Label>
                <Select value={newTask.course_id || "none"} onValueChange={(v: string) => setNewTask({ ...newTask, course_id: v === "none" ? "" : v })}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t.noCourse}</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{t.cancel}</Button>
            <Button onClick={handleCreateTask} disabled={creating}>{t.create}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
