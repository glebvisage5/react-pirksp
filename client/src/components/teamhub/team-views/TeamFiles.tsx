import { useState, useEffect, useRef } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useLanguage } from "../../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { Loader2, FolderOpen, Search, MoreVertical, Download, Trash2, FileText, Image, File, FileCode, FileArchive, Upload, Grid3x3, List } from "lucide-react";
import { Badge } from "../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { apiTeams, type TeamFile } from "../../../api/teams";

interface TeamFilesProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamFiles({ teamId, userRole = "Team Leader" }: TeamFilesProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [files, setFiles] = useState<TeamFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<TeamFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiTeams.files(teamId)
      .then(setFiles)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

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
    uploadedBy: language === "en" ? "Uploaded by" : "Загрузил",
    download: language === "en" ? "Download" : "Скачать",
    delete: language === "en" ? "Delete" : "Удалить",
    noFiles: language === "en" ? "No files found" : "Файлы не найдены",
    uploadFirst: language === "en" ? "Upload your first file" : "Загрузите первый файл",
    cancel: language === "en" ? "Cancel" : "Отмена",
  };

  const canDelete = userRole === "Team Leader" || userRole === "Moderator";

  const getMimeCategory = (mime: string): string => {
    if (mime.startsWith("image/")) return "image";
    if (mime === "application/pdf" || mime.includes("document") || mime.includes("text")) return "document";
    if (mime.includes("zip") || mime.includes("archive") || mime.includes("compressed")) return "archive";
    if (mime.includes("javascript") || mime.includes("typescript") || mime.includes("json") || mime.includes("xml")) return "code";
    return "other";
  };

  const getFileIcon = (mime: string) => {
    const cat = getMimeCategory(mime);
    switch (cat) {
      case "document": return <FileText className="h-8 w-8" />;
      case "image": return <Image className="h-8 w-8" />;
      case "code": return <FileCode className="h-8 w-8" />;
      case "archive": return <FileArchive className="h-8 w-8" />;
      default: return <File className="h-8 w-8" />;
    }
  };

  const getFileColor = (mime: string) => {
    const cat = getMimeCategory(mime);
    switch (cat) {
      case "document": return "from-blue-500 to-indigo-600";
      case "image": return "from-purple-500 to-pink-600";
      case "code": return "from-emerald-500 to-teal-600";
      case "archive": return "from-orange-500 to-red-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || getMimeCategory(f.mime_type) === filterType;
    return matchesSearch && matchesType;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await apiTeams.uploadFile(teamId, file);
      setFiles(prev => [uploaded, ...prev]);
      toast.success(language === "en" ? "File uploaded" : "Файл загружен");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    try {
      await apiTeams.deleteFile(fileToDelete.id);
      setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      toast.success(language === "en" ? `Deleted: ${fileToDelete.name}` : `Удалено: ${fileToDelete.name}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
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
          <FolderOpen className="h-6 w-6" />{t.files}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
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
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-emerald-500 text-white" : ""}>
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-emerald-500 text-white" : ""}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all flex-1 lg:flex-initial"
          >
            {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            {t.uploadFile}
          </Button>
        </div>
      </div>

      {filteredFiles.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <Card key={file.id} className="p-4 hover:shadow-lg transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getFileColor(file.mime_type)} flex items-center justify-center text-white shadow-lg`}>
                      {getFileIcon(file.mime_type)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={apiTeams.getFileUrl(file)} download={file.name} className="flex items-center cursor-pointer">
                            <Download className="h-4 w-4 mr-2" />{t.download}
                          </a>
                        </DropdownMenuItem>
                        {canDelete && (
                          <DropdownMenuItem className="text-red-600" onClick={() => { setFileToDelete(file); setIsDeleteDialogOpen(true); }}>
                            <Trash2 className="h-4 w-4 mr-2" />{t.delete}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1" title={file.name}>{file.name}</h3>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
                    <div>{file.uploader_name ?? "—"}</div>
                    <div>{new Date(file.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map(file => (
              <Card key={file.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getFileColor(file.mime_type)} flex items-center justify-center text-white shadow-lg shrink-0`}>
                    {getFileIcon(file.mime_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate mb-1">{file.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.uploader_name ?? "—"}</span>
                      <span>•</span>
                      <span>{new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.info(language === "en" ? "Download coming soon" : "Скоро")}>
                        <Download className="h-4 w-4 mr-2" />{t.download}
                      </DropdownMenuItem>
                      {canDelete && (
                        <DropdownMenuItem className="text-red-600" onClick={() => { setFileToDelete(file); setIsDeleteDialogOpen(true); }}>
                          <Trash2 className="h-4 w-4 mr-2" />{t.delete}
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
            <Button onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <Upload className="h-4 w-4 mr-2" />{t.uploadFile}
            </Button>
          </div>
        </Card>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Delete File?" : "Удалить файл?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Delete "${fileToDelete?.name}"? This cannot be undone.`
                : `Удалить "${fileToDelete?.name}"? Это нельзя отменить.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">{t.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
