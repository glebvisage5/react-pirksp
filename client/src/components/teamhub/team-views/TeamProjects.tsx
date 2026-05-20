import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useLanguage } from "../../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  X,
  Save
} from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
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

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "planned" | "completed" | "on-hold";
  tasks: number;
  completedTasks: number;
  startDate: string;
  endDate: string;
}

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

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
      description: language === "en" ? "iOS and Android native applications" : "Нативные приложения для iOS и Android",
      status: "active",
      tasks: 24,
      completedTasks: 12,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
    },
    {
      id: "2",
      name: language === "en" ? "Dashboard Redesign" : "Редизайн панели управления",
      description: language === "en" ? "Complete UI/UX overhaul" : "Полная переработка UI/UX",
      status: "active",
      tasks: 18,
      completedTasks: 15,
      startDate: "2024-02-01",
      endDate: "2024-04-30",
    },
    {
      id: "3",
      name: language === "en" ? "API Integration" : "Интеграция API",
      description: language === "en" ? "Third-party services integration" : "Интеграция сторонних сервисов",
      status: "planned",
      tasks: 10,
      completedTasks: 0,
      startDate: "2024-05-01",
      endDate: "2024-07-31",
    },
    {
      id: "4",
      name: language === "en" ? "Security Audit" : "Аудит безопасности",
      description: language === "en" ? "Complete security review" : "Полный анализ безопасности",
      status: "completed",
      tasks: 15,
      completedTasks: 15,
      startDate: "2023-12-01",
      endDate: "2024-01-31",
    },
  ]);

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
    deleteConfirm: language === "en" ? "Are you sure you want to delete this project?" : "Вы уверены, что хотите удалить этот проект?",
    projectCreated: language === "en" ? "Project created" : "Проект создан",
    projectUpdated: language === "en" ? "Project updated" : "Проект обновлен",
    projectDeleted: language === "en" ? "Project deleted" : "Проект удален",
  };

  const isLeader = userRole === "Team Leader";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <PlayCircle className="h-4 w-4" />;
      case "planned":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "on-hold":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FolderKanban className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "planned":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "on-hold":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t.statusActive;
      case "planned":
        return t.statusPlanned;
      case "completed":
        return t.statusCompleted;
      case "on-hold":
        return t.statusOnHold;
      default:
        return status;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: Project = {
      id: String(projects.length + 1),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as Project["status"],
      tasks: 0,
      completedTasks: 0,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    };
    setProjects([newProject, ...projects]);
    setIsCreateDialogOpen(false);
    toast.success(t.projectCreated);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;

    const formData = new FormData(e.currentTarget);
    const updatedProject: Project = {
      ...selectedProject,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as Project["status"],
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    };
    
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setIsEditDialogOpen(false);
    setSelectedProject(null);
    toast.success(t.projectUpdated);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm(t.deleteConfirm)) {
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success(t.projectDeleted);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderKanban className="h-6 w-6" />
          {t.projects}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              <SelectItem value="active">{t.filterActive}</SelectItem>
              <SelectItem value="planned">{t.filterPlanned}</SelectItem>
              <SelectItem value="completed">{t.filterCompleted}</SelectItem>
              <SelectItem value="on-hold">{t.filterOnHold}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createProject}
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
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  placeholder={language === "en" ? "Mobile App Development" : "Разработка мобильного приложения"} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.projectDescription}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder={language === "en" ? "What is this project about?" : "О чём этот проект?"}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">{t.projectStatus}</Label>
                  <Select name="status" defaultValue="planned">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
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
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t.projectEndDate}</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
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

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => {
            const progress = Math.round((project.completedTasks / project.tasks) * 100) || 0;
            return (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProject(project)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t.view}
                        </DropdownMenuItem>
                        {isLeader && (
                          <>
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t.delete}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`${getStatusColor(project.status)} border`}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1">{getStatusText(project.status)}</span>
                  </Badge>

                  {/* Tasks Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.progress}</span>
                      <span className="font-medium">
                        {project.completedTasks}/{project.tasks} {t.tasks}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <div>
                      <span className="font-medium">{t.startDate}:</span> {project.startDate}
                    </div>
                    <div>
                      <span className="font-medium">{t.endDate}:</span> {project.endDate}
                    </div>
                  </div>
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
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createProject}
            </Button>
          </div>
        </Card>
      )}

      {/* View Project Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.viewProjectTitle}</DialogTitle>
            <DialogDescription>
              {language === "en" ? "View project information and details" : "Просмотр информации и деталей проекта"}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">{t.projectName}</Label>
                <p className="text-lg font-semibold mt-1">{selectedProject.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t.projectDescription}</Label>
                <p className="mt-1">{selectedProject.description}</p>
              </div>
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
                  <p className="mt-1 font-semibold">
                    {selectedProject.completedTasks}/{selectedProject.tasks} {t.tasks}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">{t.projectStartDate}</Label>
                  <p className="mt-1">{selectedProject.startDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t.projectEndDate}</Label>
                  <p className="mt-1">{selectedProject.endDate}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  {t.close}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.editProjectTitle}</DialogTitle>
            <DialogDescription>
              {language === "en" ? "Update project information and settings" : "Обновление информации и настроек проекта"}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t.projectName}</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  required 
                  defaultValue={selectedProject.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t.projectDescription}</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  required 
                  defaultValue={selectedProject.description}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">{t.projectStatus}</Label>
                  <Select name="status" defaultValue={selectedProject.status}>
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
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
                  <Input 
                    id="edit-startDate" 
                    name="startDate" 
                    type="date" 
                    required 
                    defaultValue={selectedProject.startDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">{t.projectEndDate}</Label>
                  <Input 
                    id="edit-endDate" 
                    name="endDate" 
                    type="date" 
                    required 
                    defaultValue={selectedProject.endDate}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {t.save}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
