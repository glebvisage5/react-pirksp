import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Users,
  FileText,
  CheckSquare,
  MoreVertical,
  Settings,
  Trash2,
  ExternalLink,
  Calendar
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

interface Project {
  id: string;
  name: string;
  description: string;
  team: string;
  status: "planning" | "active" | "completed" | "on-hold";
  specs: number;
  tasks: number;
  progress: number;
  createdAt: string;
  deadline: string;
}

interface ProjectsProps {
  onCreateSpec: () => void;
}

export function Projects({ onCreateSpec }: ProjectsProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Mobile App Redesign",
      description: "Полный редизайн мобильного приложения с новым UI/UX",
      team: "Mobile Dev Team",
      status: "active",
      specs: 3,
      tasks: 28,
      progress: 65,
      createdAt: "2024-01-15",
      deadline: "2024-03-30",
    },
    {
      id: "2",
      name: "API v2 Development",
      description: "Разработка новой версии REST API",
      team: "Backend Team",
      status: "active",
      specs: 2,
      tasks: 15,
      progress: 40,
      createdAt: "2024-02-01",
      deadline: "2024-04-15",
    },
    {
      id: "3",
      name: "Landing Page",
      description: "Создание новой посадочной страницы для продукта",
      team: "Design Team",
      status: "planning",
      specs: 1,
      tasks: 8,
      progress: 15,
      createdAt: "2024-02-10",
      deadline: "2024-03-01",
    },
    {
      id: "4",
      name: "E-commerce Platform",
      description: "Разработка платформы для онлайн-торговли",
      team: "Mobile Dev Team",
      status: "completed",
      specs: 5,
      tasks: 42,
      progress: 100,
      createdAt: "2023-11-01",
      deadline: "2024-01-31",
    },
  ]);

  const t = {
    projects: language === "en" ? "Projects" : "Проекты",
    subtitle: language === "en" ? "Manage your team projects and specifications" : "Управляйте проектами команды и ТЗ",
    createProject: language === "en" ? "Create Project" : "Создать проект",
    search: language === "en" ? "Search projects..." : "Поиск проектов...",
    allProjects: language === "en" ? "All Projects" : "Все проекты",
    all: language === "en" ? "All" : "Все",
    planning: language === "en" ? "Planning" : "Планирование",
    active: language === "en" ? "Active" : "Активные",
    completed: language === "en" ? "Completed" : "Завершённые",
    onHold: language === "en" ? "On Hold" : "На паузе",
    team: language === "en" ? "Team" : "Команда",
    specs: language === "en" ? "Specs" : "ТЗ",
    tasks: language === "en" ? "Tasks" : "Задачи",
    progress: language === "en" ? "Progress" : "Прогресс",
    deadline: language === "en" ? "Deadline" : "Дедлайн",
    viewProject: language === "en" ? "View Project" : "Открыть проект",
    settings: language === "en" ? "Settings" : "Настройки",
    delete: language === "en" ? "Delete" : "Удалить",
    createSpec: language === "en" ? "Create Spec" : "Создать ТЗ",
    // Create Project Dialog
    projectName: language === "en" ? "Project Name" : "Название проекта",
    projectDescription: language === "en" ? "Description" : "Описание",
    selectTeam: language === "en" ? "Select Team" : "Выберите команду",
    projectDeadline: language === "en" ? "Deadline" : "Дедлайн",
    create: language === "en" ? "Create" : "Создать",
    cancel: language === "en" ? "Cancel" : "Отмена",
    createProjectTitle: language === "en" ? "Create New Project" : "Создать новый проект",
    createProjectDesc: language === "en" ? "Set up a new project for your team" : "Создайте новый проект для вашей команды",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "from-blue-500 to-cyan-600";
      case "active":
        return "from-emerald-500 to-teal-600";
      case "completed":
        return "from-green-600 to-emerald-700";
      case "on-hold":
        return "from-orange-500 to-red-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      team: formData.get("team") as string,
      status: "planning",
      specs: 0,
      tasks: 0,
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
      deadline: formData.get("deadline") as string,
    };
    setProjects([newProject, ...projects]);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.projects}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="planning">{t.planning}</SelectItem>
              <SelectItem value="active">{t.active}</SelectItem>
              <SelectItem value="completed">{t.completed}</SelectItem>
              <SelectItem value="on-hold">{t.onHold}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createProject}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.createProjectTitle}</DialogTitle>
              <DialogDescription>{t.createProjectDesc}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.projectName}</Label>
                <Input id="name" name="name" required placeholder={language === "en" ? "Mobile App Redesign" : "Редизайн мобильного приложения"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.projectDescription}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder={language === "en" ? "Describe the project goals" : "Опишите цели проекта"}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">{t.selectTeam}</Label>
                <Select name="team" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectTeam} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mobile Dev Team">Mobile Dev Team</SelectItem>
                    <SelectItem value="Design Team">Design Team</SelectItem>
                    <SelectItem value="Backend Team">Backend Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">{t.projectDeadline}</Label>
                <Input id="deadline" name="deadline" type="date" required />
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

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.allProjects} ({filteredProjects.length})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {t[project.status as keyof typeof t] || project.status}
                      </Badge>
                    </div>
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
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t.viewProject}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onCreateSpec}>
                        <FileText className="h-4 w-4 mr-2" />
                        {t.createSpec}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        {t.settings}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Team */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{project.team}</span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t.progress}</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getStatusColor(project.status)} transition-all`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {project.specs} {t.specs}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {project.tasks} {t.tasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {project.deadline}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
