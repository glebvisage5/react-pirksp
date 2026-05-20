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
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { UserCheck, Search, Plus, Trash2, Users, TrendingUp } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Elder {
  id: string;
  name: string;
  email: string;
  groups: string[];
  coElders: string[];
  activity: "high" | "medium" | "low";
  tasksCreated: number;
  studentsManaged: number;
}

export function AdminModeElders() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");

  const t = {
    title: language === "en" ? "Elder Management" : "Управление старостами",
    subtitle: language === "en" ? "Assign and manage group elders" : "Назначение и управление старостами групп",
    search: language === "en" ? "Search elders..." : "Поиск старост...",
    assignElder: language === "en" ? "Assign Elder" : "Назначить старосту",
    name: language === "en" ? "Name" : "Имя",
    email: language === "en" ? "Email" : "Email",
    groups: language === "en" ? "Groups" : "Группы",
    coElders: language === "en" ? "Co-Elders" : "Помощники",
    activity: language === "en" ? "Activity" : "Активность",
    tasksCreated: language === "en" ? "Tasks Created" : "Создано задач",
    actions: language === "en" ? "Actions" : "Действия",
    remove: language === "en" ? "Remove" : "Снять",
    high: language === "en" ? "High" : "Высокая",
    medium: language === "en" ? "Medium" : "Средняя",
    low: language === "en" ? "Low" : "Низкая",
    assignDialogTitle: language === "en" ? "Assign New Elder" : "Назначить нового старосту",
    assignDialogDesc: language === "en" ? "Select a student to become an elder" : "Выберите студента для назначения старостой",
    selectStudent: language === "en" ? "Select student" : "Выберите студента",
    selectGroup: language === "en" ? "Select group" : "Выберите группу",
    group: language === "en" ? "Group" : "Группа",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    studentsManaged: language === "en" ? "Students" : "Студентов",
  };

  const [elders, setElders] = useState<Elder[]>([
    { 
      id: "1", 
      name: "Иван Петров", 
      email: "i.petrov@example.com", 
      groups: ["FE-301"], 
      coElders: ["Анна Смирнова"], 
      activity: "high", 
      tasksCreated: 45,
      studentsManaged: 24
    },
    { 
      id: "2", 
      name: "Мария Сидорова", 
      email: "m.sidorova@example.com", 
      groups: ["FE-302"], 
      coElders: [], 
      activity: "high", 
      tasksCreated: 38,
      studentsManaged: 22
    },
    { 
      id: "3", 
      name: "Алексей Иванов", 
      email: "a.ivanov@example.com", 
      groups: ["BE-201"], 
      coElders: ["Петр Волков"], 
      activity: "medium", 
      tasksCreated: 32,
      studentsManaged: 18
    },
    { 
      id: "4", 
      name: "Елена Козлова", 
      email: "e.kozlova@example.com", 
      groups: ["DS-101"], 
      coElders: [], 
      activity: "medium", 
      tasksCreated: 28,
      studentsManaged: 15
    },
  ]);

  const filteredElders = elders.filter(elder =>
    elder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    elder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    elder.groups.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "high": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "low": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      default: return "";
    }
  };

  const handleRemoveElder = (id: string) => {
    setElders(elders.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <Button 
            onClick={() => setIsAssignDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.assignElder}
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.assignDialogTitle}</DialogTitle>
              <DialogDescription>{t.assignDialogDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.selectStudent}</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectStudent} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student1">Александр Новиков</SelectItem>
                    <SelectItem value="student2">Екатерина Волкова</SelectItem>
                    <SelectItem value="student3">Михаил Соколов</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t.group}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectGroup} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FE-301">FE-301</SelectItem>
                    <SelectItem value="FE-302">FE-302</SelectItem>
                    <SelectItem value="BE-201">BE-201</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>{t.cancel}</Button>
              <Button className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white">
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

      {/* Elders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {language === "en" ? "All Elders" : "Все старосты"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.groups}</TableHead>
                <TableHead>{t.coElders}</TableHead>
                <TableHead>{t.studentsManaged}</TableHead>
                <TableHead>{t.tasksCreated}</TableHead>
                <TableHead>{t.activity}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredElders.map((elder) => (
                <TableRow key={elder.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{elder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{elder.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{elder.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {elder.groups.map((group, index) => (
                        <Badge key={index} variant="outline">{group}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {elder.coElders.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {elder.coElders.map((coElder, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{coElder}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{elder.studentsManaged}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{elder.tasksCreated}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActivityColor(elder.activity)}>
                      {elder.activity === "high" ? t.high : elder.activity === "medium" ? t.medium : t.low}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveElder(elder.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
