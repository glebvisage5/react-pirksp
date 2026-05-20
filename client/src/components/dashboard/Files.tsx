import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useLanguage } from "../../lib/language-context";
import { FileText, Upload, Download, Trash2, Search, Folder, File, Image, FileCode, Film, Music, Plus, MoreVertical, FolderPlus, ArrowLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "audio" | "code" | "other";
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  category: string;
  folderId: string | null;
}

interface FolderItem {
  id: string;
  name: string;
  createdDate: string;
  filesCount: number;
}

const mockFolders: FolderItem[] = [
  {
    id: "folder-1",
    name: "Assignments",
    createdDate: "Dec 1, 2024",
    filesCount: 2,
  },
  {
    id: "folder-2",
    name: "Projects",
    createdDate: "Nov 28, 2024",
    filesCount: 3,
  },
];

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "React Assignment.pdf",
    type: "document",
    size: "2.4 MB",
    uploadedBy: "You",
    uploadedDate: "Dec 3, 2024",
    category: "Assignments",
    folderId: "folder-1",
  },
  {
    id: "2",
    name: "Database Schema.sql",
    type: "code",
    size: "45 KB",
    uploadedBy: "You",
    uploadedDate: "Dec 2, 2024",
    category: "Projects",
    folderId: "folder-2",
  },
  {
    id: "3",
    name: "Marketing Presentation.pptx",
    type: "document",
    size: "5.1 MB",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "Dec 1, 2024",
    category: "Presentations",
    folderId: null,
  },
  {
    id: "4",
    name: "UI Mockup.png",
    type: "image",
    size: "1.8 MB",
    uploadedBy: "You",
    uploadedDate: "Nov 30, 2024",
    category: "Design",
    folderId: null,
  },
  {
    id: "5",
    name: "Lecture Recording.mp4",
    type: "video",
    size: "156 MB",
    uploadedBy: "Prof. Johnson",
    uploadedDate: "Nov 29, 2024",
    category: "Lectures",
    folderId: null,
  },
  {
    id: "6",
    name: "Project Proposal.docx",
    type: "document",
    size: "890 KB",
    uploadedBy: "Michael Chen",
    uploadedDate: "Nov 28, 2024",
    category: "Projects",
    folderId: "folder-2",
  },
  {
    id: "7",
    name: "Code Review.js",
    type: "code",
    size: "12 KB",
    uploadedBy: "Emma Davis",
    uploadedDate: "Nov 27, 2024",
    category: "Projects",
    folderId: "folder-2",
  },
  {
    id: "8",
    name: "Study Notes.pdf",
    type: "document",
    size: "3.2 MB",
    uploadedBy: "You",
    uploadedDate: "Nov 26, 2024",
    category: "Notes",
    folderId: "folder-1",
  },
];

export function Files() {
  const { language } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [folders, setFolders] = useState<FolderItem[]>(mockFolders);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isMoveFileDialogOpen, setIsMoveFileDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFileForMove, setSelectedFileForMove] = useState<FileItem | null>(null);
  const [selectedFileForDelete, setSelectedFileForDelete] = useState<FileItem | null>(null);
  const [moveToFolderId, setMoveToFolderId] = useState<string>("");

  const t = {
    files: language === "en" ? "Files" : "Файлы",
    subtitle: language === "en" ? "Manage and organize your files" : "Управление и организация файлов",
    uploadFile: language === "en" ? "Upload File" : "Загрузить файл",
    newFolder: language === "en" ? "New Folder" : "Новая папка",
    search: language === "en" ? "Search files..." : "Поиск файлов...",
    filterByType: language === "en" ? "Filter by type" : "Фильтр по типу",
    filterByCategory: language === "en" ? "Filter by category" : "Фильтр по категории",
    all: language === "en" ? "All" : "Все",
    folders: language === "en" ? "Folders" : "Папки",
    backToRoot: language === "en" ? "Back to root" : "Вернуться в корень",
    filesInFolder: language === "en" ? "files" : "файлов",
    noFilesFound: language === "en" ? "No files found" : "Файлы не найдены",
    tryDifferentSearch: language === "en" ? "Try adjusting your search or filters" : "Попробуйте изменить поиск или фильтры",
    uploadNewFile: language === "en" ? "Upload New File" : "Загрузить новый файл",
    uploadFileDescription: language === "en" ? "Upload a file to your library" : "Загрузите файл в вашу библиотеку",
    selectFile: language === "en" ? "Select File" : "Выбрать файл",
    chooseFile: language === "en" ? "Choose file" : "Выбрать файл",
    category: language === "en" ? "Category" : "Категория",
    upload: language === "en" ? "Upload" : "Загрузить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    createNewFolder: language === "en" ? "Create New Folder" : "Создать новую папку",
    createFolderDescription: language === "en" ? "Create a folder to organize your files" : "Создайте папку для организации файлов",
    folderName: language === "en" ? "Folder Name" : "Название папки",
    createFolder: language === "en" ? "Create Folder" : "Создать папку",
    moveFile: language === "en" ? "Move File" : "Переместить файл",
    selectFolder: language === "en" ? "Select a folder" : "Выберите папку",
    rootFolder: language === "en" ? "Root folder" : "Корневая папка",
    move: language === "en" ? "Move" : "Переместить",
    deleteFile: language === "en" ? "Delete File" : "Удалить файл",
    deleteConfirmation: language === "en" ? "Are you sure you want to delete" : "Вы уверены, что хотите удалить",
    deleteWarning: language === "en" ? "This action cannot be undone." : "Это действие не может быть отменено.",
    delete: language === "en" ? "Delete" : "Удалить",
    download: language === "en" ? "Download" : "Скачать",
    moveTo: language === "en" ? "Move to folder" : "Переместить в папку",
    document: language === "en" ? "document" : "документ",
    image: language === "en" ? "image" : "изображение",
    video: language === "en" ? "video" : "видео",
    audio: language === "en" ? "audio" : "аудио",
    code: language === "en" ? "code" : "код",
    other: language === "en" ? "other" : "другое",
    uploadedBy: language === "en" ? "Uploaded by" : "Загрузил",
    on: language === "en" ? "on" : "",
  };

  const currentFolder = folders.find(f => f.id === currentFolderId);

  const displayedFiles = currentFolderId
    ? files.filter(f => f.folderId === currentFolderId)
    : files.filter(f => f.folderId === null);

  const filteredFiles = displayedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || file.type === filterType;
    const matchesCategory = filterCategory === "all" || file.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-8 w-8 text-blue-600" />;
      case "image": return <Image className="h-8 w-8 text-green-600" />;
      case "video": return <Film className="h-8 w-8 text-purple-600" />;
      case "audio": return <Music className="h-8 w-8 text-pink-600" />;
      case "code": return <FileCode className="h-8 w-8 text-orange-600" />;
      default: return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "document": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "image": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "video": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500";
      case "audio": return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-500";
      case "code": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderItem = {
        id: `folder-${folders.length + 1}`,
        name: newFolderName,
        createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        filesCount: 0,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsCreateFolderDialogOpen(false);
    }
  };

  const handleMoveFile = () => {
    if (selectedFileForMove && moveToFolderId) {
      setFiles(files.map(f =>
        f.id === selectedFileForMove.id
          ? { ...f, folderId: moveToFolderId === "root" ? null : moveToFolderId }
          : f
      ));
      
      // Update folder file counts
      setFolders(folders.map(folder => ({
        ...folder,
        filesCount: files.filter(f => f.folderId === folder.id).length
      })));
      
      setSelectedFileForMove(null);
      setMoveToFolderId("");
      setIsMoveFileDialogOpen(false);
    }
  };

  const handleDeleteFile = () => {
    if (selectedFileForDelete) {
      setFiles(files.filter(f => f.id !== selectedFileForDelete.id));
      
      // Update folder file counts
      setFolders(folders.map(folder => ({
        ...folder,
        filesCount: files.filter(f => f.folderId === folder.id && f.id !== selectedFileForDelete.id).length
      })));
      
      setSelectedFileForDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    // Move all files from folder to root
    setFiles(files.map(f => f.folderId === folderId ? { ...f, folderId: null } : f));
    setFolders(folders.filter(f => f.id !== folderId));
    if (currentFolderId === folderId) {
      setCurrentFolderId(null);
    }
  };

  const categories = Array.from(new Set(files.map(f => f.category)));

  const stats = {
    total: files.length,
    totalSize: files.reduce((sum, file) => {
      const size = parseFloat(file.size);
      const unit = file.size.includes("MB") ? 1 : 0.001;
      return sum + (size * unit);
    }, 0),
    folders: folders.length,
    documents: files.filter(f => f.type === "document").length,
    images: files.filter(f => f.type === "image").length,
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl">File Manager</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your course files and documents</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Create a folder to organize your files</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    placeholder="My Folder"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateFolderDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder} className="flex-1">
                    Create Folder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New File</DialogTitle>
                <DialogDescription>Add a file to your collection</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="mb-2">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <Button variant="outline">Browse Files</Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assignments">Assignments</SelectItem>
                      <SelectItem value="projects">Projects</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="lectures">Lectures</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsUploadDialogOpen(false)} className="flex-1">
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumb */}
      {currentFolderId && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentFolderId(null)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Files
          </Button>
          <span className="text-muted-foreground">/</span>
          <span>{currentFolder?.name}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
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
                <p className="text-sm text-muted-foreground">Folders</p>
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
                <p className="text-sm text-muted-foreground">Documents</p>
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
                <p className="text-sm text-muted-foreground">Total Size</p>
                <div className="text-2xl">{stats.totalSize.toFixed(1)} MB</div>
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
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="code">Code</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Folders Grid (only show when not in a folder) */}
      {!currentFolderId && folders.length > 0 && (
        <div>
          <h3 className="mb-4">Folders</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className="cursor-pointer hover:bg-accent transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="flex-1"
                      onClick={() => setCurrentFolderId(folder.id)}
                    >
                      <Folder className="h-12 w-12 text-blue-600 mb-3" />
                      <h4 className="truncate mb-1">{folder.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {folder.filesCount} files
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
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Folder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {folder.createdDate}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Files List */}
      <div>
        <h3 className="mb-4">{currentFolderId ? "Files in this folder" : "Files"}</h3>
        <div className="grid gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="truncate">{file.name}</h4>
                      <Badge className={getFileTypeColor(file.type)} variant="secondary">
                        {file.type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>Uploaded by {file.uploadedBy}</span>
                      <span>•</span>
                      <span>{file.uploadedDate}</span>
                      <span>•</span>
                      <Badge variant="outline">{file.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedFileForMove(file);
                            setIsMoveFileDialogOpen(true);
                          }}
                        >
                          <Folder className="mr-2 h-4 w-4" />
                          Move to Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedFileForDelete(file);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No files found</p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Your First File
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Move File Dialog */}
      <Dialog open={isMoveFileDialogOpen} onOpenChange={setIsMoveFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move File</DialogTitle>
            <DialogDescription>
              Choose a destination folder for {selectedFileForMove?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="moveToFolder">Destination Folder</Label>
              <Select value={moveToFolderId} onValueChange={setMoveToFolderId}>
                <SelectTrigger id="moveToFolder">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root (No folder)</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>
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
                  setIsMoveFileDialogOpen(false);
                  setSelectedFileForMove(null);
                  setMoveToFolderId("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleMoveFile} className="flex-1">
                Move File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedFileForDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFileForDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}