import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useLanguage } from "../../lib/language-context";
import { apiFiles, type UserFile, type UserFolder } from "../../api/files";
import { toast } from "sonner";
import {
  FileText, Upload, Download, Trash2, Search, Folder, File, Image, FileCode,
  Film, Music, FileArchive, MoreVertical, FolderPlus, ArrowLeft, Loader2, Presentation,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type DeleteTarget = { id: string; name: string; isFolder: boolean };

export function Files() {
  const { language } = useLanguage();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [folders, setFolders] = useState<UserFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState<UserFile | null>(null);
  const [moveTarget, setMoveTarget] = useState<string>("root");
  const [moving, setMoving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    title: language === "en" ? "File Manager" : "Файловый менеджер",
    subtitle: language === "en" ? "Manage and organize your files" : "Управление и организация ваших файлов",
    uploadFile: language === "en" ? "Upload File" : "Загрузить файл",
    newFolder: language === "en" ? "New Folder" : "Новая папка",
    search: language === "en" ? "Search files..." : "Поиск файлов...",
    filterByType: language === "en" ? "File type" : "Тип файла",
    all: language === "en" ? "All Types" : "Все типы",
    document: language === "en" ? "Documents" : "Документы",
    image: language === "en" ? "Images" : "Изображения",
    video: language === "en" ? "Videos" : "Видео",
    audio: language === "en" ? "Audio" : "Аудио",
    code: language === "en" ? "Code" : "Код",
    presentation: language === "en" ? "Presentations" : "Презентации",
    archive: language === "en" ? "Archives" : "Архивы",
    other: language === "en" ? "Other" : "Прочее",
    folders: language === "en" ? "Folders" : "Папки",
    backToRoot: language === "en" ? "Back to all files" : "Назад ко всем файлам",
    filesCount: language === "en" ? "files" : "файлов",
    noFilesFound: language === "en" ? "No files found" : "Файлы не найдены",
    uploadFirst: language === "en" ? "Upload your first file" : "Загрузите первый файл",
    uploadNewFile: language === "en" ? "Upload New File" : "Загрузить новый файл",
    uploadFileDescription: language === "en"
      ? (currentFolder ? `Upload a file into "${currentFolder}"` : "Upload a file to your library")
      : (currentFolder ? `Загрузить файл в папку «${currentFolder}»` : "Загрузите файл в вашу библиотеку"),
    chooseFile: language === "en" ? "Choose file" : "Выбрать файл",
    cancel: language === "en" ? "Cancel" : "Отмена",
    createNewFolder: language === "en" ? "Create New Folder" : "Создать новую папку",
    createFolderDescription: language === "en" ? "Create a folder to organize your files" : "Создайте папку для организации файлов",
    folderName: language === "en" ? "Folder name" : "Название папки",
    folderNamePlaceholder: language === "en" ? "My Folder" : "Моя папка",
    createFolder: language === "en" ? "Create Folder" : "Создать папку",
    moveFile: language === "en" ? "Move File" : "Переместить файл",
    moveFileDescription: language === "en" ? "Choose a destination folder" : "Выберите папку назначения",
    destinationFolder: language === "en" ? "Destination folder" : "Папка назначения",
    rootFolder: language === "en" ? "Root (no folder)" : "Корень (без папки)",
    move: language === "en" ? "Move" : "Переместить",
    moveToFolder: language === "en" ? "Move to folder" : "Переместить в папку",
    download: language === "en" ? "Download" : "Скачать",
    delete: language === "en" ? "Delete" : "Удалить",
    deleteFile: language === "en" ? "Delete file?" : "Удалить файл?",
    deleteFolder: language === "en" ? "Delete folder?" : "Удалить папку?",
    deleteFileConfirmation: (name: string) => language === "en"
      ? `Delete "${name}"? This action cannot be undone.`
      : `Удалить «${name}»? Это действие нельзя отменить.`,
    deleteFolderConfirmation: (name: string) => language === "en"
      ? `Delete folder "${name}"? Files inside will be moved to the root.`
      : `Удалить папку «${name}»? Файлы из неё переместятся в корень.`,
    uploadedBy: language === "en" ? "Uploaded by" : "Загрузил",
    totalFiles: language === "en" ? "Total Files" : "Всего файлов",
    foldersStat: language === "en" ? "Folders" : "Папки",
    documentsStat: language === "en" ? "Documents" : "Документы",
    totalSize: language === "en" ? "Total Size" : "Общий размер",
    folderCreated: language === "en" ? "Folder created" : "Папка создана",
    folderDeleted: language === "en" ? "Folder deleted" : "Папка удалена",
    fileUploaded: language === "en" ? "File uploaded" : "Файл загружен",
    fileDeleted: language === "en" ? "File deleted" : "Файл удалён",
    fileMoved: language === "en" ? "File moved" : "Файл перемещён",
  };

  const load = () => {
    apiFiles.list()
      .then(({ folders, files }) => { setFolders(folders); setFiles(files); })
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const getMimeCategory = (mime: string): string => {
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    if (mime.includes("presentation") || mime.includes("powerpoint")) return "presentation";
    if (mime.includes("zip") || mime.includes("compressed") || mime.includes("archive")) return "archive";
    if (mime === "application/pdf" || mime.includes("word") || mime.includes("sheet") || mime.includes("officedocument") || mime.includes("msword")) return "document";
    if (mime.includes("javascript") || mime.includes("typescript") || mime.includes("json") || mime.includes("xml") || mime.includes("html") || mime.includes("css")) return "code";
    if (mime.includes("text")) return "document";
    return "other";
  };

  const isPdf = (mime: string) => mime === "application/pdf";

  const getFileIcon = (mime: string) => {
    if (isPdf(mime)) return <FileText className="h-8 w-8 text-red-600" />;
    switch (getMimeCategory(mime)) {
      case "document": return <FileText className="h-8 w-8 text-blue-600" />;
      case "presentation": return <Presentation className="h-8 w-8 text-yellow-600" />;
      case "image": return <Image className="h-8 w-8 text-green-600" />;
      case "video": return <Film className="h-8 w-8 text-purple-600" />;
      case "audio": return <Music className="h-8 w-8 text-pink-600" />;
      case "code": return <FileCode className="h-8 w-8 text-orange-600" />;
      case "archive": return <FileArchive className="h-8 w-8 text-amber-600" />;
      default: return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeColor = (mime: string) => {
    if (isPdf(mime)) return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
    switch (getMimeCategory(mime)) {
      case "document": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "presentation": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "image": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "video": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500";
      case "audio": return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-500";
      case "code": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500";
      case "archive": return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-500";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB", "TB"];
    let value = bytes / 1024;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  const displayedFiles = files.filter(f => f.folder === currentFolder);

  const filteredFiles = displayedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || getMimeCategory(file.mime_type) === filterType;
    return matchesSearch && matchesType;
  });

  const folderFileCount = (folderName: string) => files.filter(f => f.folder === folderName).length;

  const stats = {
    total: files.length,
    folders: folders.length,
    documents: files.filter(f => getMimeCategory(f.mime_type) === "document").length,
    totalSize: files.reduce((sum, f) => sum + Number(f.size), 0),
  };

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    setCreatingFolder(true);
    try {
      await apiFiles.createFolder(name);
      toast.success(t.folderCreated);
      setNewFolderName("");
      setIsCreateFolderDialogOpen(false);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await apiFiles.upload(file, currentFolder);
      toast.success(t.fileUploaded);
      setIsUploadDialogOpen(false);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMove = async () => {
    if (!fileToMove) return;
    setMoving(true);
    try {
      await apiFiles.move(fileToMove.id, moveTarget === "root" ? null : moveTarget);
      toast.success(t.fileMoved);
      setIsMoveDialogOpen(false);
      setFileToMove(null);
      setMoveTarget("root");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setMoving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await apiFiles.delete(itemToDelete.id);
      toast.success(itemToDelete.isFolder ? t.folderDeleted : t.fileDeleted);
      if (itemToDelete.isFolder && currentFolder === itemToDelete.name) setCurrentFolder(null);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
        <div className="flex gap-2">
          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                {t.newFolder}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.createNewFolder}</DialogTitle>
                <DialogDescription>{t.createFolderDescription}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">{t.folderName}</Label>
                  <Input
                    id="folderName"
                    placeholder={t.folderNamePlaceholder}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(false)} className="flex-1">
                    {t.cancel}
                  </Button>
                  <Button onClick={handleCreateFolder} disabled={creatingFolder || !newFolderName.trim()} className="flex-1">
                    {creatingFolder ? <Loader2 className="h-4 w-4 animate-spin" /> : t.createFolder}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={uploading}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {t.uploadFile}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.uploadNewFile}</DialogTitle>
                <DialogDescription>{t.uploadFileDescription}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t.chooseFile}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} className="flex-1">
                    {t.cancel}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumb */}
      {currentFolder && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentFolder(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToRoot}
          </Button>
          <span className="text-muted-foreground">/</span>
          <span>{currentFolder}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalFiles}</p>
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
                <p className="text-sm text-muted-foreground">{t.foldersStat}</p>
                <div className="text-2xl">{stats.folders}</div>
              </div>
              <Folder className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.documentsStat}</p>
                <div className="text-2xl">{stats.documents}</div>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalSize}</p>
                <div className="text-2xl">{formatSize(stats.totalSize)}</div>
              </div>
              <Image className="h-8 w-8 text-purple-600" />
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
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t.filterByType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="document">{t.document}</SelectItem>
                <SelectItem value="image">{t.image}</SelectItem>
                <SelectItem value="video">{t.video}</SelectItem>
                <SelectItem value="audio">{t.audio}</SelectItem>
                <SelectItem value="code">{t.code}</SelectItem>
                <SelectItem value="presentation">{t.presentation}</SelectItem>
                <SelectItem value="archive">{t.archive}</SelectItem>
                <SelectItem value="other">{t.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Folders Grid (only show when not in a folder) */}
      {!currentFolder && folders.length > 0 && (
        <div>
          <h3 className="mb-4">{t.folders}</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {folders.map((folder) => (
              <Card key={folder.id} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1" onClick={() => setCurrentFolder(folder.name)}>
                      <Folder className="h-12 w-12 text-blue-600 mb-3" />
                      <h4 className="truncate mb-1">{folder.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {folderFileCount(folder.name)} {t.filesCount}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setItemToDelete({ id: folder.id, name: folder.name, isFolder: true });
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Files List */}
      {filteredFiles.length > 0 && (
        <div>
          <div className="grid gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      {getFileIcon(file.mime_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="truncate">{file.name}</h4>
                        <Badge className={getFileTypeColor(file.mime_type)} variant="secondary">
                          {t[getMimeCategory(file.mime_type) as keyof typeof t] as string}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{formatSize(file.size)}</span>
                        <span>•</span>
                        <span>{t.uploadedBy} {file.uploader_name ?? "—"}</span>
                        <span>•</span>
                        <span>{new Date(file.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <a href={apiFiles.getFileUrl(file)} download={file.name}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={apiFiles.getFileUrl(file)} download={file.name} className="flex items-center cursor-pointer">
                              <Download className="mr-2 h-4 w-4" />
                              {t.download}
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setFileToMove(file);
                              setMoveTarget(file.folder ?? "root");
                              setIsMoveDialogOpen(true);
                            }}
                          >
                            <Folder className="mr-2 h-4 w-4" />
                            {t.moveToFolder}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setItemToDelete({ id: file.id, name: file.name, isFolder: false });
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t.noFilesFound}</p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              {t.uploadFirst}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Move File Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.moveFile}</DialogTitle>
            <DialogDescription>{t.moveFileDescription}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="moveToFolder">{t.destinationFolder}</Label>
              <Select value={moveTarget} onValueChange={setMoveTarget}>
                <SelectTrigger id="moveToFolder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">{t.rootFolder}</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.name}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsMoveDialogOpen(false);
                  setFileToMove(null);
                  setMoveTarget("root");
                }}
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button onClick={handleMove} disabled={moving} className="flex-1">
                {moving ? <Loader2 className="h-4 w-4 animate-spin" /> : t.move}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{itemToDelete?.isFolder ? t.deleteFolder : t.deleteFile}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete
                ? (itemToDelete.isFolder
                  ? t.deleteFolderConfirmation(itemToDelete.name)
                  : t.deleteFileConfirmation(itemToDelete.name))
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
