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
import { Checkbox } from "../ui/checkbox";
import { Shield, Plus, Edit, Trash2, Search, Users } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  level: "high" | "medium" | "low";
}

export function AdminModeRoles() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const availablePermissions = [
    { id: "view_groups", label: language === "en" ? "View Groups" : "Просмотр групп" },
    { id: "manage_groups", label: language === "en" ? "Manage Groups" : "Управление группами" },
    { id: "view_students", label: language === "en" ? "View Students" : "Просмотр студентов" },
    { id: "manage_students", label: language === "en" ? "Manage Students" : "Управление студентами" },
    { id: "view_courses", label: language === "en" ? "View Courses" : "Просмотр курсов" },
    { id: "manage_courses", label: language === "en" ? "Manage Courses" : "Управление курсами" },
    { id: "create_tasks", label: language === "en" ? "Create Tasks" : "Создание задач" },
    { id: "grade_tasks", label: language === "en" ? "Grade Tasks" : "Оценка задач" },
    { id: "view_achievements", label: language === "en" ? "View Achievements" : "Просмотр достижений" },
    { id: "manage_achievements", label: language === "en" ? "Manage Achievements" : "Управление достижениями" },
  ];

  const t = {
    title: language === "en" ? "EduCRM Roles Management" : "Управление ролями EduCRM",
    subtitle: language === "en" ? "Define and manage custom roles with specific permissions" : "Определение и управление кастомными ролями с особыми правами",
    createRole: language === "en" ? "Create Role" : "Создать роль",
    editRole: language === "en" ? "Edit Role" : "Редактировать роль",
    search: language === "en" ? "Search roles..." : "Поиск ролей...",
    roleName: language === "en" ? "Role Name" : "Название роли",
    description: language === "en" ? "Description" : "Описание",
    users: language === "en" ? "Users" : "Пользователей",
    permissions: language === "en" ? "Permissions" : "Права",
    level: language === "en" ? "Level" : "Уровень",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    high: language === "en" ? "High" : "Высокий",
    medium: language === "en" ? "Medium" : "Средний",
    low: language === "en" ? "Low" : "Низкий",
    createDialogTitle: language === "en" ? "Create New Role" : "Создать новую роль",
    createDialogDesc: language === "en" ? "Define a custom role with specific permissions" : "Определите кастомную роль с особыми правами",
    editDialogTitle: language === "en" ? "Edit Role" : "Редактировать роль",
    editDialogDesc: language === "en" ? "Update role information and permissions" : "Обновить информацию о роли и правах",
    selectPermissions: language === "en" ? "Select permissions for this role" : "Выберите права для этой роли",
  };

  const [roles, setRoles] = useState<Role[]>([
    { 
      id: "1", 
      name: "Староста", 
      description: "Руководит группой, создает задачи, отслеживает прогресс",
      usersCount: 24,
      permissions: ["view_groups", "manage_groups", "view_students", "create_tasks", "view_achievements"],
      level: "high"
    },
    { 
      id: "2", 
      name: "Зам. старосты", 
      description: "Помогает старосте, может создавать задачи",
      usersCount: 12,
      permissions: ["view_groups", "view_students", "create_tasks"],
      level: "medium"
    },
    { 
      id: "3", 
      name: "Модератор группы", 
      description: "Модерирует активность в группе",
      usersCount: 8,
      permissions: ["view_groups", "view_students", "view_courses"],
      level: "medium"
    },
    { 
      id: "4", 
      name: "Ассистент преподавателя", 
      description: "Помогает с проверкой заданий и оценкой",
      usersCount: 6,
      permissions: ["view_courses", "view_students", "grade_tasks", "view_achievements"],
      level: "high"
    },
    { 
      id: "5", 
      name: "Наблюдатель", 
      description: "Может только просматривать информацию",
      usersCount: 15,
      permissions: ["view_groups", "view_students", "view_courses"],
      level: "low"
    },
  ]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      default: return "";
    }
  };

  const handleCreate = () => {
    const newRole: Role = {
      id: String(roles.length + 1),
      name: formData.name,
      description: formData.description,
      usersCount: 0,
      permissions: formData.permissions,
      level: formData.permissions.length > 5 ? "high" : formData.permissions.length > 3 ? "medium" : "low",
    };
    setRoles([...roles, newRole]);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const handleEdit = () => {
    if (!selectedRole) return;
    setRoles(roles.map(r => r.id === selectedRole.id ? { ...selectedRole, ...formData } : r));
    setIsEditDialogOpen(false);
    setSelectedRole(null);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setIsEditDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permissionId)
        ? formData.permissions.filter(p => p !== permissionId)
        : [...formData.permissions, permissionId]
    });
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
              {t.createRole}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.createDialogTitle}</DialogTitle>
              <DialogDescription>{t.createDialogDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">{t.roleName}</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Модератор группы"
                />
              </div>
              <div>
                <Label htmlFor="create-description">{t.description}</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === "en" ? "Role description..." : "Описание роли..."}
                />
              </div>
              <div>
                <Label className="mb-3 block">{t.selectPermissions}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`create-${permission.id}`}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <label
                        htmlFor={`create-${permission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
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

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {language === "en" ? "All Roles" : "Все роли"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.roleName}</TableHead>
                <TableHead>{t.description}</TableHead>
                <TableHead>{t.users}</TableHead>
                <TableHead>{t.permissions}</TableHead>
                <TableHead>{t.level}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">{role.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{role.usersCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{role.permissions.length} {language === "en" ? "permissions" : "прав"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(role.level)}>
                      {role.level === "high" ? t.high : role.level === "medium" ? t.medium : t.low}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.editDialogTitle}</DialogTitle>
            <DialogDescription>{t.editDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">{t.roleName}</Label>
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
              <Label className="mb-3 block">{t.selectPermissions}</Label>
              <div className="grid grid-cols-2 gap-3">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${permission.id}`}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <label
                      htmlFor={`edit-${permission.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
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
