import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useLanguage } from "../../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { Loader2, FolderKanban, Plus, Search, MoreVertical, Eye, Edit, Trash2, CheckCircle2, Clock, AlertCircle, PlayCircle, Save } from "lucide-react";
// X removed — unused
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { apiTeams, type Project } from "../../../api/teams";

interface TeamProjectsProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamProjects({ teamId, userRole = "Team Leader" }: TeamProjectsProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiTeams.projects(teamId)
      .then(setProjects)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  const t = {
    projects: language === "en" ? "Projects" : "Проекты",
    subtitle: language === "en" ? "Manage team projects" : "Управление проектами команды",
    createProject: language === "en" ? "Create Project" : "Создать проект",
    search: language === "en" ? "Search projects..." : "Поиск проектов...",
    filterAll: language === "en" ? "All Projects" : "Все проекты",
    filterActive: language === "en" ? "Active" : "Активные",
    filterPlanned: language === "en" ? "Planned" : "Запланированные",
    filterCompleted: language === "en" ? "Completed" : "Завершенные",
    filterOnHold: language === "en" ? "On Hold" : "Приостановленные",
    statusActive: language === "en" ? "Active" : "Активный",
    statusPlanned: language === "en" ? "Planned" : "Запланирован",
    statusCompleted: language === "en" ? "Completed" : "Завершен",
    statusOnHold: language === "en" ? "On Hold" : "Приостановлен",
    tasks: language === "en" ? "Tasks" : "Задачи",
    progress: language === "en" ? "Progress" : "Прогресс",
    startDate: language === "en" ? "Start" : "Начало",
    endDate: language === "en" ? "End" : "Конец",
    view: language === "en" ? "View" : "Открыть",
    edit: language === "en" ? "Edit" : "Редактировать",
    delete: language === "en" ? "Delete" : "Удалить",
    createProjectTitle: language === "en" ? "Create New Project" : "Создать новый проект",
    createProjectDesc: language === "en" ? "Add a new project to this team" : "Добавить новый проект в команду",
    viewProjectTitle: language === "en" ? "Project Details" : "Детали проекта",
    editProjectTitle: language === "en" ? "Edit Project" : "Редактировать проект",
    projectName: language === "en" ? "Project Name" : "Название проекта",
    projectDescription: language === "en" ? "Description" : "Описание",
    projectStatus: language === "en" ? "Status" : "Статус",
    projectStartDate: language === "en" ? "Start Date" : "Дата начала",
    projectEndDate: language === "en" ? "End Date" : "Дата окончания",
    create: language === "en" ? "Create" : "Создать",
    save: language === "en" ? "Save Changes" : "Сохранить изменения",
    cancel: language === "en" ? "Cancel" : "Отмена",
    close: language === "en" ? "Close" : "Закрыть",
    noProjects: language === "en" ? "No projects found" : "Проекты не найдены",
    createFirst: language === "en" ? "Create your first project" : "Создайте первый проект",
    projectCreated: language === "en" ? "Project created" : "Проект создан",
    projectUpdated: language === "en" ? "Project updated" : "Проект обновлен",
    projectDeleted: language === "en" ? "Project deleted" : "Проект удален",
  };

  const canEdit = userRole === "Team Leader" || userRole === "Moderator";

  const formatDate = (str: string | null | undefined) => {
    if (!str) return "";
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString(language === "en" ? "en-GB" : "ru-RU");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <PlayCircle className="h-4 w-4" />;
      case "planned": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "on-hold": return <AlertCircle className="h-4 w-4" />;
      default: return <FolderKanban className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "planned": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "completed": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "on-hold": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return t.statusActive;
      case "planned": return t.statusPlanned;
      case "completed": return t.statusCompleted;
      case "on-hold": return t.statusOnHold;
      default: return status;
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const created = await apiTeams.createProject(teamId, {
        title: fd.get("name") as string,
        description: fd.get("description") as string,
        status: fd.get("status") as Project["status"],
        start_date: fd.get("startDate") as string || undefined,
        end_date: fd.get("endDate") as string || undefined,
      });
      setProjects(prev => [created, ...prev]);
      setIsCreateDialogOpen(false);
      toast.success(t.projectCreated);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;
    const fd = new FormData(e.currentTarget);
    try {
      const updated = await apiTeams.updateProject(selectedProject.id, {
        title: fd.get("name") as string,
        description: fd.get("description") as string,
        status: fd.get("status") as Project["status"],
        start_date: fd.get("startDate") as string || undefined,
        end_date: fd.get("endDate") as string || undefined,
      });
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? updated : p));
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      toast.success(t.projectUpdated);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm(language === "en" ? "Delete this project?" : "Удалить проект?")) return;
    try {
      await apiTeams.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success(t.projectDeleted);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderKanban className="h-6 w-6" />
          {t.projects}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              <SelectItem value="active">{t.filterActive}</SelectItem>
              <SelectItem value="planned">{t.filterPlanned}</SelectItem>
              <SelectItem value="completed">{t.filterCompleted}</SelectItem>
              <SelectItem value="on-hold">{t.filterOnHold}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {canEdit && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto">
                <Plus className="h-4 w-4 mr-2" />{t.createProject}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t.createProjectTitle}</DialogTitle>
                <DialogDescription>{t.createProjectDesc}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.projectName}</Label>
                  <Input id="name" name="name" required placeholder={language === "en" ? "Mobile App Development" : "Разработка мобильного приложения"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t.projectDescription}</Label>
                  <Textarea id="description" name="description" rows={3} placeholder={language === "en" ? "What is this project about?" : "О чём этот проект?"} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t.projectStatus}</Label>
                    <Select name="status" defaultValue="planned">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">{t.statusPlanned}</SelectItem>
                        <SelectItem value="active">{t.statusActive}</SelectItem>
                        <SelectItem value="on-hold">{t.statusOnHold}</SelectItem>
                        <SelectItem value="completed">{t.statusCompleted}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">{t.projectStartDate}</Label>
                    <Input id="startDate" name="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">{t.projectEndDate}</Label>
                    <Input id="endDate" name="endDate" type="date" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>{t.cancel}</Button>
                  <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">{t.create}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map(project => {
            const progress = project.task_count > 0
              ? Math.round((project.completed_task_count / project.task_count) * 100)
              : 0;
            return (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedProject(project); setIsViewDialogOpen(true); }}>
                          <Eye className="h-4 w-4 mr-2" />{t.view}
                        </DropdownMenuItem>
                        {canEdit && (
                          <>
                            <DropdownMenuItem onClick={() => { setSelectedProject(project); setIsEditDialogOpen(true); }}>
                              <Edit className="h-4 w-4 mr-2" />{t.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />{t.delete}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Badge className={`${getStatusColor(project.status)} border`}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1">{getStatusText(project.status)}</span>
                  </Badge>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.progress}</span>
                      <span className="font-medium">{project.completed_task_count}/{project.task_count} {t.tasks}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  {(project.start_date || project.end_date) && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      {project.start_date && <div><span className="font-medium">{t.startDate}:</span> {formatDate(project.start_date)}</div>}
                      {project.end_date && <div><span className="font-medium">{t.endDate}:</span> {formatDate(project.end_date)}</div>}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">{t.noProjects}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.createFirst}</p>
            {canEdit && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <Plus className="h-4 w-4 mr-2" />{t.createProject}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.viewProjectTitle}</DialogTitle>
            <DialogDescription>{selectedProject?.description}</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">{t.projectStatus}</Label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(selectedProject.status)} border`}>
                      {getStatusIcon(selectedProject.status)}
                      <span className="ml-1">{getStatusText(selectedProject.status)}</span>
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t.progress}</Label>
                  <p className="mt-1 font-semibold">{selectedProject.completed_task_count}/{selectedProject.task_count} {t.tasks}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsViewDialogOpen(false)}>{t.close}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.editProjectTitle}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t.projectName}</Label>
                <Input id="edit-name" name="name" required defaultValue={selectedProject.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t.projectDescription}</Label>
                <Textarea id="edit-description" name="description" rows={3} defaultValue={selectedProject.description ?? ""} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t.projectStatus}</Label>
                  <Select name="status" defaultValue={selectedProject.status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">{t.statusPlanned}</SelectItem>
                      <SelectItem value="active">{t.statusActive}</SelectItem>
                      <SelectItem value="on-hold">{t.statusOnHold}</SelectItem>
                      <SelectItem value="completed">{t.statusCompleted}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">{t.projectStartDate}</Label>
                  <Input id="edit-startDate" name="startDate" type="date" defaultValue={selectedProject.start_date ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">{t.projectEndDate}</Label>
                  <Input id="edit-endDate" name="endDate" type="date" defaultValue={selectedProject.end_date ?? ""} />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t.cancel}</Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <Save className="h-4 w-4 mr-2" />{t.save}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
