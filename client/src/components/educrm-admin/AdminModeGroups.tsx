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
import { Users, Plus, Edit, Trash2, Search, UserCheck, TrendingUp } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Group {
  id: string;
  name: string;
  elder: string;
  studentsCount: number;
  coursesCount: number;
  activity: "high" | "medium" | "low";
  description: string;
}

export function AdminModeGroups() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    elder: "",
    students: [] as string[],
  });

  const t = {
    title: language === "en" ? "Group Management" : "Управление группами",
    subtitle: language === "en" ? "Create, edit, and manage learning groups" : "Создание, редактирование и управление учебными группами",
    createGroup: language === "en" ? "Create Group" : "Создать группу",
    editGroup: language === "en" ? "Edit Group" : "Редактировать группу",
    search: language === "en" ? "Search groups..." : "Поиск групп...",
    groupName: language === "en" ? "Group Name" : "Название группы",
    description: language === "en" ? "Description" : "Описание",
    elder: language === "en" ? "Elder" : "Староста",
    students: language === "en" ? "Students" : "Студенты",
    courses: language === "en" ? "Courses" : "Курсы",
    activity: language === "en" ? "Activity" : "Активность",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    delete: language === "en" ? "Delete" : "Удалить",
    high: language === "en" ? "High" : "Высокая",
    medium: language === "en" ? "Medium" : "Средняя",
    low: language === "en" ? "Low" : "Низкая",
    selectElder: language === "en" ? "Select elder" : "Выберите старосту",
    createDialogTitle: language === "en" ? "Create New Group" : "Создать новую группу",
    createDialogDesc: language === "en" ? "Add a new learning group to the system" : "Добавьте новую учебную группу в систему",
    editDialogTitle: language === "en" ? "Edit Group" : "Редактировать группу",
    editDialogDesc: language === "en" ? "Update group information" : "Обновить информацию о группе",
  };

  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "FE-301", elder: "Иван Петров", studentsCount: 24, coursesCount: 5, activity: "high", description: "Frontend разработка, продвинутый уровень" },
    { id: "2", name: "FE-302", elder: "Мария Сидорова", studentsCount: 22, coursesCount: 5, activity: "high", description: "Frontend разработка, продвинутый уровень" },
    { id: "3", name: "BE-201", elder: "Алексей Иванов", studentsCount: 18, coursesCount: 4, activity: "medium", description: "Backend разработка, средний уровень" },
    { id: "4", name: "DS-101", elder: "Елена Козлова", studentsCount: 15, coursesCount: 3, activity: "medium", description: "Data Science, начальный уровень" },
    { id: "5", name: "ML-401", elder: "Дмитрий Смирнов", studentsCount: 12, coursesCount: 6, activity: "low", description: "Machine Learning, экспертный уровень" },
  ]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.elder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "high": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "low": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      default: return "";
    }
  };

  const handleCreate = () => {
    const newGroup: Group = {
      id: String(groups.length + 1),
      name: formData.name,
      elder: formData.elder,
      studentsCount: formData.students.length,
      coursesCount: 0,
      activity: "medium",
      description: formData.description,
    };
    setGroups([...groups, newGroup]);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", description: "", elder: "", students: [] });
  };

  const handleEdit = () => {
    if (!selectedGroup) return;
    setGroups(groups.map(g => g.id === selectedGroup.id ? { ...selectedGroup, ...formData } : g));
    setIsEditDialogOpen(false);
    setSelectedGroup(null);
    setFormData({ name: "", description: "", elder: "", students: [] });
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  const openEditDialog = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      elder: group.elder,
      students: [],
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
              {t.createGroup}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.createDialogTitle}</DialogTitle>
              <DialogDescription>{t.createDialogDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">{t.groupName}</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="FE-301"
                />
              </div>
              <div>
                <Label htmlFor="create-description">{t.description}</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === "en" ? "Group description..." : "Описание группы..."}
                />
              </div>
              <div>
                <Label htmlFor="create-elder">{t.elder}</Label>
                <Select value={formData.elder} onValueChange={(value) => setFormData({ ...formData, elder: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectElder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Иван Петров">Иван Петров</SelectItem>
                    <SelectItem value="Мария Сидорова">Мария Сидорова</SelectItem>
                    <SelectItem value="Алексей Иванов">Алексей Иванов</SelectItem>
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

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === "en" ? "All Groups" : "Все группы"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.groupName}</TableHead>
                <TableHead>{t.elder}</TableHead>
                <TableHead>{t.students}</TableHead>
                <TableHead>{t.courses}</TableHead>
                <TableHead>{t.activity}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      {group.elder}
                    </div>
                  </TableCell>
                  <TableCell>{group.studentsCount}</TableCell>
                  <TableCell>{group.coursesCount}</TableCell>
                  <TableCell>
                    <Badge className={getActivityColor(group.activity)}>
                      {group.activity === "high" ? t.high : group.activity === "medium" ? t.medium : t.low}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(group)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(group.id)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editDialogTitle}</DialogTitle>
            <DialogDescription>{t.editDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">{t.groupName}</Label>
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
            <div>
              <Label htmlFor="edit-elder">{t.elder}</Label>
              <Select value={formData.elder} onValueChange={(value) => setFormData({ ...formData, elder: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Иван Петров">Иван Петров</SelectItem>
                  <SelectItem value="Мария Сидорова">Мария Сидорова</SelectItem>
                  <SelectItem value="Алексей Иванов">Алексей Иванов</SelectItem>
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
