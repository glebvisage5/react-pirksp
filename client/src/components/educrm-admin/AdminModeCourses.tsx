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
import { Textarea } from "../ui/textarea";
import { BookOpen, Plus, Edit, Trash2, Search, Users, Target } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Course {
  id: string;
  name: string;
  author: string;
  description: string;
  studentsEnrolled: number;
  avgProgress: number;
  materials: number;
  achievements: number;
  status: "active" | "draft" | "archived";
}

export function AdminModeCourses() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    description: "",
    materials: 0,
  });

  const t = {
    title: language === "en" ? "Course Management" : "Управление курсами",
    subtitle: language === "en" ? "Create and manage educational courses" : "Создание и управление учебными курсами",
    createCourse: language === "en" ? "Create Course" : "Создать курс",
    editCourse: language === "en" ? "Edit Course" : "Редактировать курс",
    search: language === "en" ? "Search courses..." : "Поиск курсов...",
    courseName: language === "en" ? "Course Name" : "Название курса",
    author: language === "en" ? "Author" : "Автор",
    description: language === "en" ? "Description" : "Описание",
    students: language === "en" ? "Students" : "Студентов",
    progress: language === "en" ? "Avg Progress" : "Ср. прогресс",
    materials: language === "en" ? "Materials" : "Материалы",
    achievements: language === "en" ? "Achievements" : "Достижения",
    status: language === "en" ? "Status" : "Статус",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    active: language === "en" ? "Active" : "Активен",
    draft: language === "en" ? "Draft" : "Черновик",
    archived: language === "en" ? "Archived" : "Архив",
    createDialogTitle: language === "en" ? "Create New Course" : "Создать новый курс",
    createDialogDesc: language === "en" ? "Add a new educational course" : "Добавьте новый учебный курс",
    editDialogTitle: language === "en" ? "Edit Course" : "Редактировать курс",
    editDialogDesc: language === "en" ? "Update course information" : "Обновить информацию о курсе",
  };

  const [courses, setCourses] = useState<Course[]>([
    { 
      id: "1", 
      name: "React Fundamentals", 
      author: "Петр Иванов", 
      description: "Основы разработки на React",
      studentsEnrolled: 156, 
      avgProgress: 82, 
      materials: 24, 
      achievements: 8, 
      status: "active" 
    },
    { 
      id: "2", 
      name: "Advanced JavaScript", 
      author: "Мария Козлова", 
      description: "Продвинутые концепции JavaScript",
      studentsEnrolled: 142, 
      avgProgress: 75, 
      materials: 32, 
      achievements: 12, 
      status: "active" 
    },
    { 
      id: "3", 
      name: "Node.js Backend", 
      author: "Алексей Смирнов", 
      description: "Разработка серверной части на Node.js",
      studentsEnrolled: 98, 
      avgProgress: 68, 
      materials: 28, 
      achievements: 10, 
      status: "active" 
    },
    { 
      id: "4", 
      name: "Database Design", 
      author: "Елена Волкова", 
      description: "Проектирование баз данных",
      studentsEnrolled: 87, 
      avgProgress: 71, 
      materials: 20, 
      achievements: 6, 
      status: "active" 
    },
    { 
      id: "5", 
      name: "Python Basics", 
      author: "Дмитрий Павлов", 
      description: "Основы программирования на Python",
      studentsEnrolled: 12, 
      avgProgress: 0, 
      materials: 18, 
      achievements: 5, 
      status: "draft" 
    },
  ]);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
      default: return "";
    }
  };

  const handleCreate = () => {
    const newCourse: Course = {
      id: String(courses.length + 1),
      name: formData.name,
      author: formData.author,
      description: formData.description,
      studentsEnrolled: 0,
      avgProgress: 0,
      materials: formData.materials,
      achievements: 0,
      status: "draft",
    };
    setCourses([...courses, newCourse]);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", author: "", description: "", materials: 0 });
  };

  const handleEdit = () => {
    if (!selectedCourse) return;
    setCourses(courses.map(c => c.id === selectedCourse.id ? { ...selectedCourse, ...formData } : c));
    setIsEditDialogOpen(false);
    setSelectedCourse(null);
    setFormData({ name: "", author: "", description: "", materials: 0 });
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      author: course.author,
      description: course.description,
      materials: course.materials,
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
              {t.createCourse}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.createDialogTitle}</DialogTitle>
              <DialogDescription>{t.createDialogDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">{t.courseName}</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="React Advanced"
                />
              </div>
              <div>
                <Label htmlFor="create-author">{t.author}</Label>
                <Input
                  id="create-author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Имя преподавателя"
                />
              </div>
              <div>
                <Label htmlFor="create-description">{t.description}</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === "en" ? "Course description..." : "Описание курса..."}
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

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {language === "en" ? "All Courses" : "Все курсы"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.courseName}</TableHead>
                <TableHead>{t.author}</TableHead>
                <TableHead>{t.students}</TableHead>
                <TableHead>{t.progress}</TableHead>
                <TableHead>{t.materials}</TableHead>
                <TableHead>{t.achievements}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.studentsEnrolled}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={course.avgProgress} className="w-20" />
                      <span className="text-sm">{course.avgProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{course.materials}</span>
                    </div>
                  </TableCell>
                  <TableCell>{course.achievements}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status === "active" ? t.active : course.status === "draft" ? t.draft : t.archived}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)}>
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
              <Label htmlFor="edit-name">{t.courseName}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-author">{t.author}</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
