import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
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
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  File, 
  FolderPlus, 
  Upload, 
  Trash2, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  FileArchive,
  Download,
  Eye
} from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "archive" | "other";
  size: string;
  uploadedBy: string;
  uploadDate: string;
  visibility: "public" | "group" | "course" | "student";
  downloads: number;
  folder: string;
}

export function AdminModeFiles() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [folderName, setFolderName] = useState("");

  const t = {
    title: language === "en" ? "File Management" : "Управление файлами",
    subtitle: language === "en" ? "Upload, organize, and manage EduCRM files" : "Загрузка, организация и управление файлами EduCRM",
    uploadFile: language === "en" ? "Upload File" : "Загрузить файл",
    createFolder: language === "en" ? "Create Folder" : "Создать папку",
    search: language === "en" ? "Search files..." : "Поиск файлов...",
    fileName: language === "en" ? "File Name" : "Название файла",
    type: language === "en" ? "Type" : "Тип",
    size: language === "en" ? "Size" : "Размер",
    uploadedBy: language === "en" ? "Uploaded By" : "Загрузил",
    date: language === "en" ? "Date" : "Дата",
    visibility: language === "en" ? "Visibility" : "Видимость",
    downloads: language === "en" ? "Downloads" : "Загрузок",
    actions: language === "en" ? "Actions" : "Действия",
    public: language === "en" ? "Public" : "Публично",
    group: language === "en" ? "Group Only" : "Только группа",
    course: language === "en" ? "Course Only" : "Только курс",
    student: language === "en" ? "Student Only" : "Только студент",
    uploadDialogTitle: language === "en" ? "Upload New File" : "Загрузить новый файл",
    uploadDialogDesc: language === "en" ? "Upload a file to EduCRM" : "Загрузите файл в EduCRM",
    createFolderDialogTitle: language === "en" ? "Create New Folder" : "Создать новую папку",
    createFolderDialogDesc: language === "en" ? "Organize your files with folders" : "Организуйте файлы с помощью папок",
    folderName: language === "en" ? "Folder Name" : "Название папки",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    upload: language === "en" ? "Upload" : "Загрузить",
    selectFile: language === "en" ? "Select file to upload" : "Выберите файл для загрузки",
    setVisibility: language === "en" ? "Set visibility" : "Установить видимость",
    storageUsed: language === "en" ? "Storage Used" : "Использовано хранилища",
    totalFiles: language === "en" ? "Total Files" : "Всего файлов",
    totalDownloads: language === "en" ? "Total Downloads" : "Всего загрузок",
  };

  const [files, setFiles] = useState<FileItem[]>([
    { 
      id: "1", 
      name: "React Tutorial.pdf", 
      type: "document", 
      size: "2.4 MB", 
      uploadedBy: "Иван Петров", 
      uploadDate: "2024-12-01",
      visibility: "course",
      downloads: 45,
      folder: "Courses/React"
    },
    { 
      id: "2", 
      name: "Database Schema.png", 
      type: "image", 
      size: "856 KB", 
      uploadedBy: "Мария Сидорова", 
      uploadDate: "2024-11-28",
      visibility: "group",
      downloads: 23,
      folder: "Courses/Database"
    },
    { 
      id: "3", 
      name: "Lecture Recording.mp4", 
      type: "video", 
      size: "124 MB", 
      uploadedBy: "Алексей Иванов", 
      uploadDate: "2024-11-25",
      visibility: "public",
      downloads: 67,
      folder: "Lectures"
    },
    { 
      id: "4", 
      name: "Project Files.zip", 
      type: "archive", 
      size: "15.2 MB", 
      uploadedBy: "Елена Козлова", 
      uploadDate: "2024-11-20",
      visibility: "course",
      downloads: 34,
      folder: "Projects"
    },
  ]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-5 w-5 text-blue-600" />;
      case "image": return <ImageIcon className="h-5 w-5 text-green-600" />;
      case "video": return <Video className="h-5 w-5 text-purple-600" />;
      case "archive": return <FileArchive className="h-5 w-5 text-orange-600" />;
      default: return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "public": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "group": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "course": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500";
      case "student": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500";
      default: return "";
    }
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const totalSize = files.reduce((acc, file) => {
    const size = parseFloat(file.size);
    const unit = file.size.split(" ")[1];
    return acc + (unit === "GB" ? size * 1024 : size);
  }, 0);

  const totalDownloads = files.reduce((acc, file) => acc + file.downloads, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                {t.createFolder}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.createFolderDialogTitle}</DialogTitle>
                <DialogDescription>{t.createFolderDialogDesc}</DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor="folder-name">{t.folderName}</Label>
                <Input
                  id="folder-name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="My Folder"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(false)}>{t.cancel}</Button>
                <Button className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
                  {t.save}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
                <Upload className="h-4 w-4 mr-2" />
                {t.uploadFile}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.uploadDialogTitle}</DialogTitle>
                <DialogDescription>{t.uploadDialogDesc}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.selectFile}</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Click to upload or drag and drop" : "Нажмите для загрузки или перетащите файл"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>{t.setVisibility}</Label>
                  <Select defaultValue="course">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t.public}</SelectItem>
                      <SelectItem value="group">{t.group}</SelectItem>
                      <SelectItem value="course">{t.course}</SelectItem>
                      <SelectItem value="student">{t.student}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>{t.cancel}</Button>
                <Button className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
                  {t.upload}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t.storageUsed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
            <Progress value={65} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">65% of 200 MB</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t.totalFiles}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "en" ? "Across all folders" : "Во всех папках"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t.totalDownloads}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "en" ? "Total file downloads" : "Всего загрузок файлов"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            {language === "en" ? "All Files" : "Все файлы"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.fileName}</TableHead>
                <TableHead>{t.size}</TableHead>
                <TableHead>{t.uploadedBy}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.visibility}</TableHead>
                <TableHead>{t.downloads}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{file.folder}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell className="text-sm">{file.uploadedBy}</TableCell>
                  <TableCell className="text-sm">{file.uploadDate}</TableCell>
                  <TableCell>
                    <Badge className={getVisibilityColor(file.visibility)}>
                      {file.visibility === "public" ? t.public : 
                       file.visibility === "group" ? t.group : 
                       file.visibility === "course" ? t.course : t.student}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>{file.downloads}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
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
    </div>
  );
}
