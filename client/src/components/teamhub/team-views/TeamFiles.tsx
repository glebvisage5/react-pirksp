import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useLanguage } from "../../../lib/language-context";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreVertical,
  Download,
  Trash2,
  FileText,
  Image,
  File,
  FileCode,
  FileArchive,
  Upload,
  Grid3x3,
  List
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
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

interface TeamFile {
  id: string;
  name: string;
  type: "document" | "image" | "code" | "archive" | "other";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  project?: string;
}

interface TeamFilesProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamFiles({ teamId, userRole = "Team Leader" }: TeamFilesProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<TeamFile | null>(null);

  const [files] = useState<TeamFile[]>([
    {
      id: "1",
      name: "Mobile_App_Requirements_v2.pdf",
      type: "document",
      size: "2.4 MB",
      uploadedBy: language === "en" ? "John Doe" : "Иван Петров",
      uploadedAt: "2024-01-28",
      project: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
    },
    {
      id: "2",
      name: "dashboard_mockup_final.png",
      type: "image",
      size: "1.8 MB",
      uploadedBy: language === "en" ? "Jane Smith" : "Мария Сидорова",
      uploadedAt: "2024-01-30",
      project: language === "en" ? "Dashboard Redesign" : "Редизайн панели управления",
    },
    {
      id: "3",
      name: "api_integration.js",
      type: "code",
      size: "45 KB",
      uploadedBy: language === "en" ? "Alex Johnson" : "Алексей Иванов",
      uploadedAt: "2024-01-25",
      project: language === "en" ? "API Integration" : "Интеграция API",
    },
    {
      id: "4",
      name: "design_assets.zip",
      type: "archive",
      size: "12.5 MB",
      uploadedBy: language === "en" ? "Jane Smith" : "Мария Сидорова",
      uploadedAt: "2024-01-27",
      project: language === "en" ? "Dashboard Redesign" : "Редизайн панели управления",
    },
    {
      id: "5",
      name: "security_audit_report.pdf",
      type: "document",
      size: "3.2 MB",
      uploadedBy: language === "en" ? "John Doe" : "Иван Петров",
      uploadedAt: "2024-01-20",
      project: language === "en" ? "Security Audit" : "Аудит безопасности",
    },
    {
      id: "6",
      name: "logo_variants.png",
      type: "image",
      size: "890 KB",
      uploadedBy: language === "en" ? "Jane Smith" : "Мария Сидорова",
      uploadedAt: "2024-01-29",
    },
    {
      id: "7",
      name: "meeting_notes.txt",
      type: "other",
      size: "12 KB",
      uploadedBy: language === "en" ? "Alex Johnson" : "Алексей Иванов",
      uploadedAt: "2024-01-31",
    },
    {
      id: "8",
      name: "authentication_flow.jsx",
      type: "code",
      size: "28 KB",
      uploadedBy: language === "en" ? "John Doe" : "Иван Петров",
      uploadedAt: "2024-01-26",
      project: language === "en" ? "Mobile App Development" : "Разработка мобильного приложения",
    },
  ]);

  const t = {
    files: language === "en" ? "Team Files" : "Файлы команды",
    subtitle: language === "en" ? "Manage team files and documents" : "Управление файлами команды",
    uploadFile: language === "en" ? "Upload File" : "Загрузить файл",
    search: language === "en" ? "Search files..." : "Поиск файлов...",
    filterAll: language === "en" ? "All Types" : "Все типы",
    filterDocuments: language === "en" ? "Documents" : "Документы",
    filterImages: language === "en" ? "Images" : "Изображения",
    filterCode: language === "en" ? "Code" : "Код",
    filterArchives: language === "en" ? "Archives" : "Архивы",
    filterOther: language === "en" ? "Other" : "Прочее",
    gridView: language === "en" ? "Grid" : "Сетка",
    listView: language === "en" ? "List" : "Список",
    uploadedBy: language === "en" ? "Uploaded by" : "Загрузил",
    uploadedAt: language === "en" ? "Uploaded" : "Загружено",
    size: language === "en" ? "Size" : "Размер",
    project: language === "en" ? "Project" : "Проект",
    download: language === "en" ? "Download" : "Скачать",
    delete: language === "en" ? "Delete" : "Удалить",
    noFiles: language === "en" ? "No files found" : "Файлы не найдены",
    uploadFirst: language === "en" ? "Upload your first file" : "Загрузите первый файл",
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-8 w-8" />;
      case "image":
        return <Image className="h-8 w-8" />;
      case "code":
        return <FileCode className="h-8 w-8" />;
      case "archive":
        return <FileArchive className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case "document":
        return "from-blue-500 to-indigo-600";
      case "image":
        return "from-purple-500 to-pink-600";
      case "code":
        return "from-emerald-500 to-teal-600";
      case "archive":
        return "from-orange-500 to-red-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (file: TeamFile) => {
    toast.success(
      language === "en" 
        ? `Downloading: ${file.name}` 
        : `Загрузка: ${file.name}`
    );
  };

  const handleDeleteClick = (file: TeamFile) => {
    setFileToDelete(file);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      toast.success(
        language === "en" 
          ? `Deleted: ${fileToDelete.name}` 
          : `Удалено: ${fileToDelete.name}`
      );
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const isTeamLeader = userRole === "Team Leader";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderOpen className="h-6 w-6" />
          {t.files}
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
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              <SelectItem value="document">{t.filterDocuments}</SelectItem>
              <SelectItem value="image">{t.filterImages}</SelectItem>
              <SelectItem value="code">{t.filterCode}</SelectItem>
              <SelectItem value="archive">{t.filterArchives}</SelectItem>
              <SelectItem value="other">{t.filterOther}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="flex border rounded-lg overflow-hidden">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-emerald-500 text-white" : ""}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-emerald-500 text-white" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all flex-1 lg:flex-initial"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t.uploadFile}
          </Button>
        </div>
      </div>

      {/* Files Display */}
      {filteredFiles.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="p-4 hover:shadow-lg transition-all">
                <div className="space-y-3">
                  {/* Icon */}
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getFileColor(file.type)} flex items-center justify-center text-white shadow-lg`}>
                      {getFileIcon(file.type)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <Download className="h-4 w-4 mr-2" />
                          {t.download}
                        </DropdownMenuItem>
                        {isTeamLeader && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick(file)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t.delete}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* File Name */}
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>

                  {/* Project Badge */}
                  {file.project && (
                    <Badge variant="secondary" className="text-xs">
                      {file.project}
                    </Badge>
                  )}

                  {/* Meta */}
                  <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
                    <div>{file.uploadedBy}</div>
                    <div>{file.uploadedAt}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getFileColor(file.type)} flex items-center justify-center text-white shadow-lg shrink-0`}>
                    {getFileIcon(file.type)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate mb-1">{file.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{file.size}</span>
                      {file.project && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">{file.project}</Badge>
                        </>
                      )}
                      <span>•</span>
                      <span>{file.uploadedBy}</span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4 mr-2" />
                        {t.download}
                      </DropdownMenuItem>
                      {isTeamLeader && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(file)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t.delete}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">{t.noFiles}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.uploadFirst}</p>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <Upload className="h-4 w-4 mr-2" />
              {t.uploadFile}
            </Button>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete File?" : "Удалить файл?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en" 
                ? `Are you sure you want to delete "${fileToDelete?.name}"? This action cannot be undone.`
                : `Вы уверены, что хотите удалить "${fileToDelete?.name}"? Это действие нельзя отменить.`}
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
