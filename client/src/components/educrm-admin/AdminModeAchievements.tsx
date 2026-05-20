import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
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
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Award, Plus, Edit, Trash2, Search, Trophy, Star } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Achievement {
  id: string;
  name: string;
  description: string;
  course: string;
  stage: string;
  studentsEarned: number;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export function AdminModeAchievements() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    course: "",
    stage: "",
    rarity: "common" as "common" | "rare" | "epic" | "legendary",
  });

  const t = {
    title: language === "en" ? "Achievement Management" : "Управление достижениями",
    subtitle: language === "en" ? "Create and manage student achievements" : "Создание и управление достижениями студентов",
    createAchievement: language === "en" ? "Create Achievement" : "Создать достижение",
    editAchievement: language === "en" ? "Edit Achievement" : "Редактировать достижение",
    search: language === "en" ? "Search achievements..." : "Поиск достижений...",
    name: language === "en" ? "Achievement Name" : "Название достижения",
    description: language === "en" ? "Description" : "Описание",
    course: language === "en" ? "Course" : "Курс",
    stage: language === "en" ? "Stage" : "Этап",
    studentsEarned: language === "en" ? "Students Earned" : "Получили",
    rarity: language === "en" ? "Rarity" : "Редкость",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    common: language === "en" ? "Common" : "Обычное",
    rare: language === "en" ? "Rare" : "Редкое",
    epic: language === "en" ? "Epic" : "Эпическое",
    legendary: language === "en" ? "Legendary" : "Легендарное",
    createDialogTitle: language === "en" ? "Create New Achievement" : "Создать новое достижение",
    createDialogDesc: language === "en" ? "Add a new achievement for students" : "Добавьте новое достижение для студентов",
    editDialogTitle: language === "en" ? "Edit Achievement" : "Редактировать достижение",
    editDialogDesc: language === "en" ? "Update achievement information" : "Обновить информацию о достижении",
  };

  const [achievements, setAchievements] = useState<Achievement[]>([
    { 
      id: "1", 
      name: "React Master", 
      description: "Complete all React Fundamentals lessons",
      course: "React Fundamentals", 
      stage: "Final", 
      studentsEarned: 42,
      icon: "🏆",
      rarity: "epic"
    },
    { 
      id: "2", 
      name: "First Steps", 
      description: "Complete your first lesson",
      course: "All Courses", 
      stage: "Stage 1", 
      studentsEarned: 156,
      icon: "🌟",
      rarity: "common"
    },
    { 
      id: "3", 
      name: "Database Guru", 
      description: "Design 5 complex database schemas",
      course: "Database Design", 
      stage: "Advanced", 
      studentsEarned: 23,
      icon: "💎",
      rarity: "legendary"
    },
    { 
      id: "4", 
      name: "Team Player", 
      description: "Help 10 students with their assignments",
      course: "All Courses", 
      stage: "Any", 
      studentsEarned: 67,
      icon: "🤝",
      rarity: "rare"
    },
    { 
      id: "5", 
      name: "Code Ninja", 
      description: "Complete 50 coding challenges",
      course: "Advanced JavaScript", 
      stage: "Intermediate", 
      studentsEarned: 34,
      icon: "⚡",
      rarity: "epic"
    },
  ]);

  const filteredAchievements = achievements.filter(achievement =>
    achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    achievement.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
      case "rare": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "epic": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500";
      case "legendary": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      default: return "";
    }
  };

  const handleCreate = () => {
    const newAchievement: Achievement = {
      id: String(achievements.length + 1),
      name: formData.name,
      description: formData.description,
      course: formData.course,
      stage: formData.stage,
      studentsEarned: 0,
      icon: "🏅",
      rarity: formData.rarity,
    };
    setAchievements([...achievements, newAchievement]);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", description: "", course: "", stage: "", rarity: "common" });
  };

  const handleEdit = () => {
    if (!selectedAchievement) return;
    setAchievements(achievements.map(a => a.id === selectedAchievement.id ? { ...selectedAchievement, ...formData } : a));
    setIsEditDialogOpen(false);
    setSelectedAchievement(null);
    setFormData({ name: "", description: "", course: "", stage: "", rarity: "common" });
  };

  const handleDelete = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
  };

  const openEditDialog = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setFormData({
      name: achievement.name,
      description: achievement.description,
      course: achievement.course,
      stage: achievement.stage,
      rarity: achievement.rarity,
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
              {t.createAchievement}
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
                  placeholder="React Master"
                />
              </div>
              <div>
                <Label htmlFor="create-description">{t.description}</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === "en" ? "Achievement description..." : "Описание достижения..."}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-course">{t.course}</Label>
                  <Input
                    id="create-course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="React Fundamentals"
                  />
                </div>
                <div>
                  <Label htmlFor="create-stage">{t.stage}</Label>
                  <Input
                    id="create-stage"
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    placeholder="Stage 1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="create-rarity">{t.rarity}</Label>
                <Select value={formData.rarity} onValueChange={(value: "common" | "rare" | "epic" | "legendary") => setFormData({ ...formData, rarity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">{t.common}</SelectItem>
                    <SelectItem value="rare">{t.rare}</SelectItem>
                    <SelectItem value="epic">{t.epic}</SelectItem>
                    <SelectItem value="legendary">{t.legendary}</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <CardTitle className="text-base">{achievement.name}</CardTitle>
                    <Badge className={`${getRarityColor(achievement.rarity)} mt-1`}>
                      {achievement.rarity === "common" ? t.common : 
                       achievement.rarity === "rare" ? t.rare : 
                       achievement.rarity === "epic" ? t.epic : t.legendary}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.course}:</span>
                  <span>{achievement.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.stage}:</span>
                  <span>{achievement.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.studentsEarned}:</span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-600" />
                    {achievement.studentsEarned}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(achievement)}>
                  <Edit className="h-3 w-3 mr-1" />
                  {language === "en" ? "Edit" : "Изменить"}
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(achievement.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <Label htmlFor="edit-description">{t.description}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-course">{t.course}</Label>
                <Input
                  id="edit-course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-stage">{t.stage}</Label>
                <Input
                  id="edit-stage"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-rarity">{t.rarity}</Label>
              <Select value={formData.rarity} onValueChange={(value: "common" | "rare" | "epic" | "legendary") => setFormData({ ...formData, rarity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">{t.common}</SelectItem>
                  <SelectItem value="rare">{t.rare}</SelectItem>
                  <SelectItem value="epic">{t.epic}</SelectItem>
                  <SelectItem value="legendary">{t.legendary}</SelectItem>
                </SelectContent>
              </Select>
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
