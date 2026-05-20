import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
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
} from "../ui/dialog";
import { Progress } from "../ui/progress";
import { GraduationCap, Search, Eye, Award, CheckCircle } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Student {
  id: string;
  name: string;
  email: string;
  group: string;
  role: string;
  coursesProgress: number;
  tasksCompleted: number;
  totalTasks: number;
  achievements: number;
}

export function AdminModeStudents() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const t = {
    title: language === "en" ? "Student Management" : "Управление студентами",
    subtitle: language === "en" ? "View and manage all students" : "Просмотр и управление всеми студентами",
    search: language === "en" ? "Search students..." : "Поиск студентов...",
    name: language === "en" ? "Name" : "Имя",
    email: language === "en" ? "Email" : "Email",
    group: language === "en" ? "Group" : "Группа",
    role: language === "en" ? "Role" : "Роль",
    progress: language === "en" ? "Progress" : "Прогресс",
    tasks: language === "en" ? "Tasks" : "Задачи",
    achievements: language === "en" ? "Achievements" : "Достижения",
    actions: language === "en" ? "Actions" : "Действия",
    viewDetails: language === "en" ? "View Details" : "Подробнее",
    studentDetails: language === "en" ? "Student Details" : "Детали студента",
    courseProgress: language === "en" ? "Course Progress" : "Прогресс по курсам",
    completedTasks: language === "en" ? "Completed Tasks" : "Завершенные задачи",
    student: language === "en" ? "Student" : "Студент",
    elder: language === "en" ? "Elder" : "Староста",
  };

  const students: Student[] = [
    { id: "1", name: "Александр Новиков", email: "a.novikov@example.com", group: "FE-301", role: "student", coursesProgress: 85, tasksCompleted: 24, totalTasks: 28, achievements: 12 },
    { id: "2", name: "Екатерина Волкова", email: "e.volkova@example.com", group: "FE-301", role: "student", coursesProgress: 92, tasksCompleted: 27, totalTasks: 28, achievements: 15 },
    { id: "3", name: "Михаил Соколов", email: "m.sokolov@example.com", group: "BE-201", role: "elder", coursesProgress: 88, tasksCompleted: 22, totalTasks: 25, achievements: 14 },
    { id: "4", name: "Анна Морозова", email: "a.morozova@example.com", group: "FE-302", role: "student", coursesProgress: 76, tasksCompleted: 19, totalTasks: 26, achievements: 8 },
    { id: "5", name: "Дмитрий Павлов", email: "d.pavlov@example.com", group: "DS-101", role: "student", coursesProgress: 81, tasksCompleted: 16, totalTasks: 20, achievements: 10 },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
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

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {language === "en" ? "All Students" : "Все студенты"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.group}</TableHead>
                <TableHead>{t.role}</TableHead>
                <TableHead>{t.progress}</TableHead>
                <TableHead>{t.tasks}</TableHead>
                <TableHead>{t.achievements}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={student.role === "elder" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500" : ""}>
                      {student.role === "elder" ? t.elder : t.student}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.coursesProgress} className="w-20" />
                      <span className="text-sm">{student.coursesProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{student.tasksCompleted}/{student.totalTasks}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span>{student.achievements}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => viewStudentDetails(student)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.studentDetails}</DialogTitle>
            <DialogDescription>
              {selectedStudent?.name} - {selectedStudent?.group}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{t.courseProgress}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{selectedStudent.coursesProgress}%</div>
                    <Progress value={selectedStudent.coursesProgress} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {t.completedTasks}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{selectedStudent.tasksCompleted}/{selectedStudent.totalTasks}</div>
                    <Progress value={(selectedStudent.tasksCompleted / selectedStudent.totalTasks) * 100} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    {t.achievements}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(selectedStudent.achievements)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center p-3 border rounded-lg">
                        <Award className="h-8 w-8 text-yellow-600 mb-2" />
                        <span className="text-xs text-center">Achievement {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.courseProgress}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["React Fundamentals", "Advanced JavaScript", "Node.js Backend", "Database Design"].map((course, index) => {
                    const progress = [92, 85, 78, 81][index];
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{course}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
