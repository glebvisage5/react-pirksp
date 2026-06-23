import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import { MapPin, Plus, Edit, Trash2, Search, Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Roadmap {
  id: string;
  name: string;
  course: string;
  stages: number;
  completedStages: number;
  deadline: string;
  status: "active" | "completed" | "pending";
}

export function AdminModeRoadmaps() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    stages: 1,
    deadline: "",
  });

  const t = {
    title: language === "en" ? "Roadmap Management" : "Управление дорожными картами",
    subtitle: language === "en" ? "Create and manage learning roadmaps" : "Создание и управление дорожными картами обучения",
    createRoadmap: language === "en" ? "Create Roadmap" : "Создать дорожную карту",
    editRoadmap: language === "en" ? "Edit Roadmap" : "Редактировать карту",
    search: language === "en" ? "Search roadmaps..." : "Поиск дорожных карт...",
    name: language === "en" ? "Roadmap Name" : "Название карты",
    course: language === "en" ? "Course" : "Курс",
    stages: language === "en" ? "Stages" : "Этапы",
    progress: language === "en" ? "Progress" : "Прогресс",
    deadline: language === "en" ? "Deadline" : "Дедлайн",
    status: language === "en" ? "Status" : "Статус",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    active: language === "en" ? "Active" : "Активна",
    completed: language === "en" ? "Completed" : "Завершена",
    pending: language === "en" ? "Pending" : "Ожидает",
    createDialogTitle: language === "en" ? "Create New Roadmap" : "Создать новую дорожную карту",
    createDialogDesc: language === "en" ? "Add a new learning roadmap" : "Добавьте новую дорожную карту обучения",
    editDialogTitle: language === "en" ? "Edit Roadmap" : "Редактировать дорожную карту",
    editDialogDesc: language === "en" ? "Update roadmap information" : "Обновить информацию о дорожной карте",
    stagesCount: language === "en" ? "Number of stages" : "Количество этапов",
  };

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
    { id: "1", name: "Путь Frontend-разработчика", course: "React Fundamentals", stages: 8, completedStages: 6, deadline: "2024-12-31", status: "active" },
    { id: "2", name: "Мастерство Backend", course: "Node.js Backend", stages: 10, completedStages: 4, deadline: "2025-01-15", status: "active" },
    { id: "3", name: "Путь в Data Science", course: "Python Basics", stages: 12, completedStages: 12, deadline: "2024-11-30", status: "completed" },
    { id: "4", name: "Full Stack разработчик", course: "Advanced JavaScript", stages: 15, completedStages: 0, deadline: "2025-03-01", status: "pending" },
  ]);

  const filteredRoadmaps = roadmaps.filter(roadmap =>
    roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roadmap.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      default: return "";
    }
  };

  const handleCreate = () => {
    const newRoadmap: Roadmap = {
      id: String(roadmaps.length + 1),
      name: formData.name,
      course: formData.course,
      stages: formData.stages,
      completedStages: 0,
      deadline: formData.deadline,
      status: "pending",
    };
    setRoadmaps([...roadmaps, newRoadmap]);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", course: "", stages: 1, deadline: "" });
  };

  const handleEdit = () => {
    if (!selectedRoadmap) return;
    setRoadmaps(roadmaps.map(r => r.id === selectedRoadmap.id ? { ...selectedRoadmap, ...formData } : r));
    setIsEditDialogOpen(false);
    setSelectedRoadmap(null);
    setFormData({ name: "", course: "", stages: 1, deadline: "" });
  };

  const handleDelete = (id: string) => {
    setRoadmaps(roadmaps.filter(r => r.id !== id));
  };

  const openEditDialog = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    setFormData({
      name: roadmap.name,
      course: roadmap.course,
      stages: roadmap.stages,
      deadline: roadmap.deadline,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t.createRoadmap}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.createDialogTitle}</DialogTitle>
              <DialogDescription>{t.createDialogDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">{t.name}</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === "en" ? "Frontend Developer Path" : "Путь Frontend-разработчика"}
                />
              </div>
              <div>
                <Label htmlFor="create-course">{t.course}</Label>
                <Input
                  id="create-course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder={language === "en" ? "React Fundamentals" : "Название курса"}
                />
              </div>
              <div>
                <Label htmlFor="create-stages">{t.stagesCount}</Label>
                <Input
                  id="create-stages"
                  type="number"
                  min="1"
                  value={formData.stages}
                  onChange={(e) => setFormData({ ...formData, stages: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="create-deadline">{t.deadline}</Label>
                <Input
                  id="create-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>{t.cancel}</Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
                {t.save}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {/* Roadmaps Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {language === "en" ? "All Roadmaps" : "Все дорожные карты"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.course}</TableHead>
                <TableHead>{t.stages}</TableHead>
                <TableHead>{t.progress}</TableHead>
                <TableHead>{t.deadline}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoadmaps.map((roadmap) => {
                const progress = (roadmap.completedStages / roadmap.stages) * 100;
                return (
                  <TableRow key={roadmap.id}>
                    <TableCell className="font-medium">{roadmap.name}</TableCell>
                    <TableCell>{roadmap.course}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{roadmap.completedStages}/{roadmap.stages}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="w-20" />
                        <span className="text-sm">{Math.round(progress)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{roadmap.deadline}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(roadmap.status)}>
                        {roadmap.status === "active" ? t.active : roadmap.status === "completed" ? t.completed : t.pending}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(roadmap)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(roadmap.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editDialogTitle}</DialogTitle>
            <DialogDescription>{t.editDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">{t.name}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-course">{t.course}</Label>
              <Input
                id="edit-course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-stages">{t.stagesCount}</Label>
              <Input
                id="edit-stages"
                type="number"
                min="1"
                value={formData.stages}
                onChange={(e) => setFormData({ ...formData, stages: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="edit-deadline">{t.deadline}</Label>
              <Input
                id="edit-deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t.cancel}</Button>
            <Button onClick={handleEdit} className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
