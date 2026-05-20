import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useLanguage } from "../../../lib/language-context";
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  FolderKanban,
  History
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { toast } from "sonner@2.0.3";

interface Spec {
  id: string;
  title: string;
  project: string;
  projectId: string;
  author: string;
  lastModified: string;
  version: string;
  status: "draft" | "review" | "approved" | "archived";
  blocks: number;
}

interface TeamSpecsProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamSpecs({ teamId, userRole = "Team Leader" }: TeamSpecsProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [selectedSpec, setSelectedSpec] = useState<Spec | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [specToDelete, setSpecToDelete] = useState<Spec | null>(null);

  const [specs] = useState<Spec[]>([
    {
      id: "1",
      title: language === "en" ? "Mobile App Requirements v2.0" : "Требования к мобильному приложению v2.0",
      project: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
      projectId: "1",
      author: language === "en" ? "John Doe" : "Иван Петров",
      lastModified: "2024-01-28",
      version: "2.0",
      status: "approved",
      blocks: 24,
    },
    {
      id: "2",
      title: language === "en" ? "API Integration Specification" : "Спецификация интеграции API",
      project: language === "en" ? "API Integration" : "Интеграция API",
      projectId: "3",
      author: language === "en" ? "Jane Smith" : "Мария Сидорова",
      lastModified: "2024-01-30",
      version: "1.5",
      status: "review",
      blocks: 18,
    },
    {
      id: "3",
      title: language === "en" ? "Dashboard Design System" : "Дизайн-система панели управления",
      project: language === "en" ? "Dashboard Redesign" : "Редизайн панели управления",
      projectId: "2",
      author: language === "en" ? "Alex Johnson" : "Алексей Иванов",
      lastModified: "2024-01-25",
      version: "3.2",
      status: "approved",
      blocks: 32,
    },
    {
      id: "4",
      title: language === "en" ? "Security Requirements" : "Требования безопасности",
      project: language === "en" ? "Security Audit" : "Аудит безопасности",
      projectId: "4",
      author: language === "en" ? "John Doe" : "Иван Петров",
      lastModified: "2024-01-20",
      version: "1.0",
      status: "archived",
      blocks: 15,
    },
    {
      id: "5",
      title: language === "en" ? "User Authentication Flow" : "Процесс аутентификации пользователей",
      project: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
      projectId: "1",
      author: language === "en" ? "Jane Smith" : "Мария Сидорова",
      lastModified: "2024-01-31",
      version: "1.0",
      status: "draft",
      blocks: 12,
    },
  ]);

  const projects = [
    { id: "1", name: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения" },
    { id: "2", name: language === "en" ? "Dashboard Redesign" : "Редизайн панели управления" },
    { id: "3", name: language === "en" ? "API Integration" : "Интеграция API" },
    { id: "4", name: language === "en" ? "Security Audit" : "Аудит безопасности" },
  ];

  const t = {
    specifications: language === "en" ? "Technical Specifications" : "Технические задания",
    subtitle: language === "en" ? "Manage team specifications and requirements" : "Управление техническими заданиями команды",
    createSpec: language === "en" ? "Create Specification" : "Создать ТЗ",
    search: language === "en" ? "Search specifications..." : "Поиск ТЗ...",
    filterAll: language === "en" ? "All Projects" : "Все проекты",
    statusDraft: language === "en" ? "Draft" : "Черновик",
    statusReview: language === "en" ? "In Review" : "На проверке",
    statusApproved: language === "en" ? "Approved" : "Утверждено",
    statusArchived: language === "en" ? "Archived" : "Архивировано",
    project: language === "en" ? "Project" : "Проект",
    author: language === "en" ? "Author" : "Автор",
    lastModified: language === "en" ? "Last Modified" : "Изменено",
    version: language === "en" ? "Version" : "Версия",
    blocks: language === "en" ? "Blocks" : "Блоков",
    view: language === "en" ? "View" : "Просмотр",
    edit: language === "en" ? "Edit" : "Редактировать",
    versions: language === "en" ? "Versions" : "Версии",
    delete: language === "en" ? "Delete" : "Удалить",
    noSpecs: language === "en" ? "No specifications found" : "ТЗ не найдены",
    createFirst: language === "en" ? "Create your first specification" : "Создайте первое ТЗ",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "review":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "approved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "archived":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return t.statusDraft;
      case "review":
        return t.statusReview;
      case "approved":
        return t.statusApproved;
      case "archived":
        return t.statusArchived;
      default:
        return status;
    }
  };

  const filteredSpecs = specs.filter(spec => {
    const matchesSearch = 
      spec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === "all" || spec.projectId === filterProject;
    return matchesSearch && matchesProject;
  });

  const handleViewSpec = (spec: Spec) => {
    setSelectedSpec(spec);
    setIsViewDialogOpen(true);
  };

  const handleEditSpec = (spec: Spec) => {
    toast.info(language === "en" ? `Editing: ${spec.title}` : `Редактирование: ${spec.title}`);
    // Navigate to spec editor
  };

  const handleViewVersions = (spec: Spec) => {
    toast.info(language === "en" ? `Viewing versions: ${spec.title}` : `Просмотр версий: ${spec.title}`);
    // Navigate to versions view
  };

  const handleDeleteClick = (spec: Spec) => {
    setSpecToDelete(spec);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (specToDelete) {
      toast.success(language === "en" ? `Deleted: ${specToDelete.title}` : `Удалено: ${specToDelete.title}`);
      setIsDeleteDialogOpen(false);
      setSpecToDelete(null);
    }
  };

  const isTeamLeader = userRole === "Team Leader";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          {t.specifications}
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
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full sm:w-64">
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
        </div>
        
        <Button 
          onClick={() => alert(language === "en" ? "Creating specification..." : "Создание ТЗ...")}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t.createSpec}
        </Button>
      </div>

      {/* Specifications List */}
      {filteredSpecs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredSpecs.map((spec) => (
            <Card key={spec.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shrink-0">
                  <FileText className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{spec.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FolderKanban className="h-3.5 w-3.5" />
                          <span>{spec.project}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{spec.author}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewSpec(spec)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t.view}
                        </DropdownMenuItem>
                        {isTeamLeader && (
                          <DropdownMenuItem onClick={() => handleEditSpec(spec)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t.edit}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleViewVersions(spec)}>
                          <History className="h-4 w-4 mr-2" />
                          {t.versions}
                        </DropdownMenuItem>
                        {isTeamLeader && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick(spec)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t.delete}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge className={`${getStatusColor(spec.status)} border`}>
                      {getStatusText(spec.status)}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{spec.lastModified}</span>
                    </div>
                    <Badge variant="outline">
                      {t.version} {spec.version}
                    </Badge>
                    <Badge variant="secondary">
                      {spec.blocks} {t.blocks}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">{t.noSpecs}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.createFirst}</p>
            <Button 
              onClick={() => alert(language === "en" ? "Creating specification..." : "Создание ТЗ...")}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createSpec}
            </Button>
          </div>
        </Card>
      )}
      
      {/* View Spec Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedSpec?.title}
            </DialogTitle>
            <DialogDescription>
              {language === "en" ? "Specification details and content" : "Детали и содержание ТЗ"}
            </DialogDescription>
          </DialogHeader>
          {selectedSpec && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.project}</p>
                  <p className="font-medium">{selectedSpec.project}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.author}</p>
                  <p className="font-medium">{selectedSpec.author}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.version}</p>
                  <p className="font-medium">{selectedSpec.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.lastModified}</p>
                  <p className="font-medium">{selectedSpec.lastModified}</p>
                </div>
              </div>
              <div>
                <Badge className={`${getStatusColor(selectedSpec.status)} border`}>
                  {getStatusText(selectedSpec.status)}
                </Badge>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === "en" ? "Specification content preview" : "Предварительный просмотр содержания ТЗ"}
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    {language === "en" 
                      ? `This specification contains ${selectedSpec.blocks} content blocks...` 
                      : `Данное ТЗ содержит ${selectedSpec.blocks} блоков контента...`}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              {language === "en" ? "Close" : "Закрыть"}
            </Button>
            {isTeamLeader && selectedSpec && (
              <Button 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditSpec(selectedSpec);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t.edit}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete Specification?" : "Удалить ТЗ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en" 
                ? `Are you sure you want to delete "${specToDelete?.title}"? This action cannot be undone.`
                : `Вы уверены, что хотите удалить "${specToDelete?.title}"? Это действие нельзя отменить.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "Отмена"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === "en" ? "Delete" : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
