import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Users, Plus, Search, Mail, Phone, UserX, MoreVertical, Trophy, TrendingUp, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useLanguage } from "../../lib/language-context";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "leader" | "member";
  performance: number;
  tasksCompleted: number;
  avatar?: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    role: "leader",
    performance: 95,
    tasksCompleted: 24,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    role: "member",
    performance: 88,
    tasksCompleted: 20,
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "+1 (555) 345-6789",
    role: "member",
    performance: 92,
    tasksCompleted: 22,
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 456-7890",
    role: "member",
    performance: 85,
    tasksCompleted: 18,
  },
  {
    id: "5",
    name: "Olivia Brown",
    email: "olivia.brown@email.com",
    phone: "+1 (555) 567-8901",
    role: "member",
    performance: 90,
    tasksCompleted: 21,
  },
];

export function Group() {
  const { language } = useLanguage();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const t = {
    title: language === "en" ? "Student Groups" : "Группы студентов",
    subtitle: language === "en" ? "Manage your student groups and members" : "Управляйте группами студентов и участниками",
    addStudent: language === "en" ? "Add Student" : "Добавить студента",
    addNewStudent: language === "en" ? "Add New Student" : "Добавить нового студента",
    addStudentDesc: language === "en" ? "Add a student to your group" : "Добавить студента в вашу группу",
    fullName: language === "en" ? "Full Name" : "Полное имя",
    email: language === "en" ? "Email" : "Электронная почта",
    phone: language === "en" ? "Phone" : "Телефон",
    cancel: language === "en" ? "Cancel" : "Отмена",
    totalMembers: language === "en" ? "Total Members" : "Всего участников",
    groupLeaders: language === "en" ? "Group Leaders" : "Лидеры группы",
    avgPerformance: language === "en" ? "Avg Performance" : "Средняя успеваемость",
    tasksCompleted: language === "en" ? "Tasks Completed" : "Задач выполнено",
    searchPlaceholder: language === "en" ? "Search students by name or email..." : "Поиск студентов по имени или email...",
    leader: language === "en" ? "leader" : "лидер",
    member: language === "en" ? "member" : "участник",
    makeLeader: language === "en" ? "Make Leader" : "Сделать лидером",
    remove: language === "en" ? "Remove" : "Удалить",
    performance: language === "en" ? "Performance" : "Успеваемость",
    noStudentsFound: language === "en" ? "No students found" : "Студенты не найдены"
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email) {
      const student: Student = {
        id: (students.length + 1).toString(),
        ...newStudent,
        role: "member",
        performance: 0,
        tasksCompleted: 0,
      };
      setStudents([...students, student]);
      setNewStudent({ name: "", email: "", phone: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleRemoveStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleMakeLeader = (id: string) => {
    setStudents(students.map(s => ({
      ...s,
      role: s.id === id ? "leader" : "member"
    })));
  };

  const stats = {
    total: students.length,
    leaders: students.filter(s => s.role === "leader").length,
    avgPerformance: Math.round(students.reduce((sum, s) => sum + s.performance, 0) / students.length),
    totalTasks: students.reduce((sum, s) => sum + s.tasksCompleted, 0),
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl">{t.title}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.addStudent}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addNewStudent}</DialogTitle>
              <DialogDescription>{t.addStudentDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.fullName}</Label>
                <Input
                  id="name"
                  placeholder={language === "en" ? "John Doe" : "Иван Иванов"}
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === "en" ? "john@example.com" : "ivan@example.com"}
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  {t.cancel}
                </Button>
                <Button onClick={handleAddStudent} className="flex-1">
                  {t.addStudent}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalMembers}</p>
                <div className="text-2xl">{stats.total}</div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.groupLeaders}</p>
                <div className="text-2xl">{stats.leaders}</div>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.avgPerformance}</p>
                <div className="text-2xl">{stats.avgPerformance}%</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.tasksCompleted}</p>
                <div className="text-2xl">{stats.totalTasks}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">{student.name}</CardTitle>
                      {student.role === "leader" && (
                        <Trophy className="h-4 w-4 text-yellow-500 shrink-0" />
                      )}
                    </div>
                    <Badge variant={student.role === "leader" ? "default" : "secondary"} className="mt-1">
                      {student.role === "leader" ? t.leader : t.member}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {student.role !== "leader" && (
                      <DropdownMenuItem onClick={() => handleMakeLeader(student.id)}>
                        <Trophy className="mr-2 h-4 w-4" />
                        {t.makeLeader}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-600"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      {t.remove}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{student.phone}</span>
              </div>
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.performance}</span>
                  <span>{student.performance}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${student.performance}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">{t.tasksCompleted}</span>
                <span>{student.tasksCompleted}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noStudentsFound}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}