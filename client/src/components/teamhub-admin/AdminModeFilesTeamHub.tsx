import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useLanguage } from "../../lib/language-context";
import { 
  FolderOpen, 
  Search, 
  Plus,
  Upload,
  Download,
  Trash2,
  MoreVertical,
  File,
  Image,
  FileText,
  Database
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  team: string;
  downloads: number;
}

export function AdminModeFilesTeamHub() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const t = {
    title: language === "en" ? "Files Management" : "Управление файлами",
    subtitle: language === "en" ? "Manage all files across teams with full administrative access" : "Управление всеми файлами команд с полным административным доступом",
    search: language === "en" ? "Search files..." : "Поиск файлов...",
    uploadFile: language === "en" ? "Upload File" : "Загрузить файл",
    createFolder: language === "en" ? "Create Folder" : "Создать папку",
    download: language === "en" ? "Download" : "Скачать",
    delete: language === "en" ? "Delete" : "Удалить",
    rename: language === "en" ? "Rename" : "Переименовать",
    uploadedBy: language === "en" ? "Uploaded by" : "Загрузил",
    downloads: language === "en" ? "Downloads" : "Скачиваний",
    team: language === "en" ? "Team" : "Команда",
  };

  const files: FileItem[] = [
    {
      id: "1",
      name: "Mobile_App_Design_v3.fig",
      type: "figma",
      size: "12.5 MB",
      uploadedBy: "Дмитрий Сидоров",
      uploadedAt: "2024-01-15",
      team: "UI/UX Design",
      downloads: 45
    },
    {
      id: "2",
      name: "API_Documentation.pdf",
      type: "pdf",
      size: "2.3 MB",
      uploadedBy: "Мария Петрова",
      uploadedAt: "2024-01-20",
      team: "Backend Engineering",
      downloads: 78
    },
    {
      id: "3",
      name: "User_Flow_Diagram.png",
      type: "image",
      size: "850 KB",
      uploadedBy: "Алексей Иванов",
      uploadedAt: "2024-02-01",
      team: "Mobile Development",
      downloads: 34
    },
    {
      id: "4",
      name: "Database_Schema.sql",
      type: "code",
      size: "156 KB",
      uploadedBy: "Сергей Новиков",
      uploadedAt: "2024-02-10",
      team: "DevOps",
      downloads: 23
    },
    {
      id: "5",
      name: "Project_Requirements.docx",
      type: "document",
      size: "1.2 MB",
      uploadedBy: "Елена Козлова",
      uploadedAt: "2024-02-15",
      team: "QA & Testing",
      downloads: 67
    },
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-5 w-5" />;
      case "pdf":
      case "document":
        return <FileText className="h-5 w-5" />;
      case "code":
        return <Database className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case "image":
        return "from-pink-500 to-rose-600";
      case "pdf":
        return "from-red-500 to-orange-600";
      case "document":
        return "from-blue-500 to-cyan-600";
      case "code":
        return "from-purple-500 to-indigo-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Admin Badge */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <Badge className="bg-red-600 text-white">Admin</Badge>
        </div>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
              <File className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">247</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Total Files" : "Всего файлов"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">8.4 GB</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Storage Used" : "Использовано"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Total Downloads" : "Всего скачиваний"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">56</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "This Week" : "За неделю"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            {t.createFolder}
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            <Upload className="h-4 w-4" />
            {t.uploadFile}
          </Button>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getFileColor(file.type)} flex items-center justify-center text-white`}>
                {getFileIcon(file.type)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    {t.download}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    {t.rename}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="font-medium text-sm mb-2 truncate" title={file.name}>
              {file.name}
            </h3>

            <div className="space-y-1 text-xs text-muted-foreground">
              <p>{file.size}</p>
              <p>
                {t.uploadedBy}: {file.uploadedBy}
              </p>
              <p>{file.team}</p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <span className="text-xs text-muted-foreground">
                {new Date(file.uploadedAt).toLocaleDateString(language === "en" ? "en-US" : "ru-RU")}
              </span>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{file.downloads}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <Card className="p-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {language === "en" ? "No files found" : "Файлы не найдены"}
          </h3>
          <p className="text-muted-foreground">
            {language === "en" ? "Try adjusting your search or upload a new file" : "Попробуйте изменить поиск или загрузить новый файл"}
          </p>
        </Card>
      )}
    </div>
  );
}
