import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useLanguage } from "../../../lib/language-context";
import { KanbanBoard } from "../KanbanBoard";
import { toast } from "sonner@2.0.3";
import { Loader2, CheckSquare, Plus, Search, MoreVertical, Eye, Edit, Trash2, User, Calendar, LayoutList, LayoutGrid } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { apiTeams, type TeamTask, type Project, type TeamMember } from "../../../api/teams";

interface TeamTasksProps {
  teamId: string;
}

export function TeamTasks({ teamId }: TeamTasksProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      apiTeams.tasks(teamId),
      apiTeams.projects(teamId),
      apiTeams.members(teamId),
    ])
      .then(([t, p, m]) => { setTasks(t); setProjects(p); setMembers(m); })
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  const t = {
    tasks: language === "en" ? "Tasks" : "Задачи",
    subtitle: language === "en" ? "Manage team tasks and track progress" : "Управление задачами команды",
    createTask: language === "en" ? "Create Task" : "Создать задачу",
    createTaskTitle: language === "en" ? "Create New Task" : "Создать новую задачу",
    createTaskDesc: language === "en" ? "Add a task to the team" : "Добавить задачу в команду",
    search: language === "en" ? "Search tasks..." : "Поиск задач...",
    filterAll: language === "en" ? "All Statuses" : "Все статусы",
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
    taskCreated: language === "en" ? "Task created" : "Задача создана",
    taskDeleted: language === "en" ? "Task deleted" : "Задача удалена",
    // form labels
    titleLabel: language === "en" ? "Title" : "Название",
    descLabel: language === "en" ? "Description" : "Описание",
    projectLabel: language === "en" ? "Project" : "Проект",
    assigneeLabel: language === "en" ? "Assignee" : "Исполнитель",
    priorityLabel: language === "en" ? "Priority" : "Приоритет",
    dueDateLabel: language === "en" ? "Due Date" : "Срок",
    statusLabel: language === "en" ? "Status" : "Статус",
    noProject: language === "en" ? "No project" : "Без проекта",
    noAssignee: language === "en" ? "No assignee" : "Без исполнителя",
    create: language === "en" ? "Create" : "Создать",
    cancel: language === "en" ? "Cancel" : "Отмена",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent": return t.priorityUrgent;
      case "high": return t.priorityHigh;
      case "medium": return t.priorityMedium;
      default: return t.priorityLow;
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TeamTask["status"]) => {
    try {
      const updated = await apiTeams.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      toast.success(t.taskMoved);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await apiTeams.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success(t.taskDeleted);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const projectId = fd.get("project_id") as string;
    const assigneeId = fd.get("assignee_id") as string;
    const dueDate = fd.get("due_date") as string;
    setCreating(true);
    try {
      const created = await apiTeams.createTask(teamId, {
        title: fd.get("title") as string,
        description: (fd.get("description") as string) || undefined,
        project_id: projectId && projectId !== "__none__" ? projectId : undefined,
        assignee_id: assigneeId && assigneeId !== "__none__" ? assigneeId : undefined,
        priority: fd.get("priority") as TeamTask["priority"],
        status: fd.get("status") as TeamTask["status"],
        due_date: dueDate || undefined,
      });
      setTasks(prev => [created, ...prev]);
      setIsCreateOpen(false);
      (e.target as HTMLFormElement).reset();
      toast.success(t.taskCreated);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setCreating(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderTaskCard = (task: TeamTask) => (
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
              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />{t.view}</DropdownMenuItem>
              <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />{t.edit}</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => handleTaskDelete(task.id)}>
                <Trash2 className="h-4 w-4 mr-2" />{t.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
            {getPriorityText(task.priority)}
          </Badge>
          {task.project_title && (
            <Badge variant="outline" className="text-xs">{task.project_title}</Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{task.assignee_name ?? "—"}</span>
          </div>
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{task.due_date}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckSquare className="h-6 w-6" />{t.tasks}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              <SelectItem value="todo">{language === "en" ? "To Do" : "К выполнению"}</SelectItem>
              <SelectItem value="in-progress">{language === "en" ? "In Progress" : "В работе"}</SelectItem>
              <SelectItem value="review">{language === "en" ? "Review" : "На проверке"}</SelectItem>
              <SelectItem value="done">{language === "en" ? "Done" : "Готово"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />{t.createTask}
        </Button>
      </div>

      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={view === "kanban" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("kanban")}
          className={view === "kanban" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />{t.kanbanView}
        </Button>
        <Button
          variant={view === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("list")}
          className={view === "list" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""}
        >
          <LayoutList className="h-4 w-4 mr-2" />{t.listView}
        </Button>
      </div>

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

      {/* Create Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.createTaskTitle}</DialogTitle>
            <DialogDescription>{t.createTaskDesc}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">{t.titleLabel}</Label>
              <Input
                id="task-title"
                name="title"
                required
                placeholder={language === "en" ? "Fix login bug" : "Исправить баг авторизации"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-desc">{t.descLabel}</Label>
              <Textarea id="task-desc" name="description" rows={3} placeholder={language === "en" ? "Task details..." : "Детали задачи..."} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.projectLabel}</Label>
                <Select name="project_id" defaultValue="__none__">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">{t.noProject}</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.assigneeLabel}</Label>
                <Select name="assignee_id" defaultValue="__none__">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">{t.noAssignee}</SelectItem>
                    {members.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.priorityLabel}</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t.priorityLow}</SelectItem>
                    <SelectItem value="medium">{t.priorityMedium}</SelectItem>
                    <SelectItem value="high">{t.priorityHigh}</SelectItem>
                    <SelectItem value="urgent">{t.priorityUrgent}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.statusLabel}</Label>
                <Select name="status" defaultValue="todo">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">{language === "en" ? "To Do" : "К выполнению"}</SelectItem>
                    <SelectItem value="in-progress">{language === "en" ? "In Progress" : "В работе"}</SelectItem>
                    <SelectItem value="review">{language === "en" ? "Review" : "На проверке"}</SelectItem>
                    <SelectItem value="done">{language === "en" ? "Done" : "Готово"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">{t.dueDateLabel}</Label>
              <Input id="task-due" name="due_date" type="date" />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>{t.cancel}</Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {t.create}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
