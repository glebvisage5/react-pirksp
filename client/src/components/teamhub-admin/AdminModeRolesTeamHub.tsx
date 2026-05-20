import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { 
  Shield, 
  Search, 
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  CheckCircle,
  Settings
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";

interface Role {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  permissions: {
    manageMembers: boolean;
    manageProjects: boolean;
    manageTasks: boolean;
    manageSpecs: boolean;
    manageFiles: boolean;
    viewStatistics: boolean;
  };
  color: string;
}

export function AdminModeRolesTeamHub() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const t = {
    title: language === "en" ? "Roles Management" : "Управление ролями",
    subtitle: language === "en" ? "Configure roles and permissions for TeamHub" : "Настройка ролей и прав доступа для TeamHub",
    search: language === "en" ? "Search roles..." : "Поиск ролей...",
    createRole: language === "en" ? "Create Role" : "Создать роль",
    editRole: language === "en" ? "Edit Role" : "Редактировать роль",
    deleteRole: language === "en" ? "Delete Role" : "Удалить роль",
    roleName: language === "en" ? "Role Name" : "Название роли",
    description: language === "en" ? "Description" : "Описание",
    permissions: language === "en" ? "Permissions" : "Права доступа",
    members: language === "en" ? "Members" : "Участники",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    manageMembers: language === "en" ? "Manage Members" : "Управление участниками",
    manageProjects: language === "en" ? "Manage Projects" : "Управление проектами",
    manageTasks: language === "en" ? "Manage Tasks" : "Управление задачами",
    manageSpecs: language === "en" ? "Manage Specifications" : "Управление ТЗ",
    manageFiles: language === "en" ? "Manage Files" : "Управление файлами",
    viewStatistics: language === "en" ? "View Statistics" : "Просмотр статистики",
    viewMembers: language === "en" ? "View Members" : "Просмотр участников",
    configurePermissions: language === "en" ? "Configure Permissions" : "Настроить права",
  };

  const roles: Role[] = [
    {
      id: "1",
      name: "Team Leader",
      description: "Full access to team management, can create and manage all resources",
      memberCount: 12,
      permissions: {
        manageMembers: true,
        manageProjects: true,
        manageTasks: true,
        manageSpecs: true,
        manageFiles: true,
        viewStatistics: true,
      },
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: "2",
      name: "Moderator",
      description: "Can manage projects, tasks, and specifications within the team",
      memberCount: 18,
      permissions: {
        manageMembers: false,
        manageProjects: true,
        manageTasks: true,
        manageSpecs: true,
        manageFiles: true,
        viewStatistics: true,
      },
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "3",
      name: "Developer",
      description: "Can work on tasks and contribute to specifications",
      memberCount: 35,
      permissions: {
        manageMembers: false,
        manageProjects: false,
        manageTasks: true,
        manageSpecs: true,
        manageFiles: true,
        viewStatistics: false,
      },
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: "4",
      name: "Designer",
      description: "Can create and edit design specifications and files",
      memberCount: 14,
      permissions: {
        manageMembers: false,
        manageProjects: false,
        manageTasks: true,
        manageSpecs: true,
        manageFiles: true,
        viewStatistics: false,
      },
      color: "from-pink-500 to-rose-600"
    },
    {
      id: "5",
      name: "Viewer",
      description: "Read-only access to projects and specifications",
      memberCount: 8,
      permissions: {
        manageMembers: false,
        manageProjects: false,
        manageTasks: false,
        manageSpecs: false,
        manageFiles: false,
        viewStatistics: false,
      },
      color: "from-gray-400 to-gray-600"
    },
  ];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleDelete = (roleId: string) => {
    if (confirm(language === "en" ? "Are you sure you want to delete this role?" : "Вы уверены, что хотите удалить эту роль?")) {
      console.log("Deleting role:", roleId);
    }
  };

  const PermissionsForm = ({ defaultPermissions }: { defaultPermissions?: Role["permissions"] }) => {
    const [permissions, setPermissions] = useState(defaultPermissions || {
      manageMembers: false,
      manageProjects: false,
      manageTasks: false,
      manageSpecs: false,
      manageFiles: false,
      viewStatistics: false,
    });

    return (
      <div className="space-y-4">
        <Label>{t.permissions}</Label>
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="manage-members" className="text-sm font-normal cursor-pointer">
              {t.manageMembers}
            </Label>
            <Switch
              id="manage-members"
              checked={permissions.manageMembers}
              onCheckedChange={(checked) => setPermissions({ ...permissions, manageMembers: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="manage-projects" className="text-sm font-normal cursor-pointer">
              {t.manageProjects}
            </Label>
            <Switch
              id="manage-projects"
              checked={permissions.manageProjects}
              onCheckedChange={(checked) => setPermissions({ ...permissions, manageProjects: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="manage-tasks" className="text-sm font-normal cursor-pointer">
              {t.manageTasks}
            </Label>
            <Switch
              id="manage-tasks"
              checked={permissions.manageTasks}
              onCheckedChange={(checked) => setPermissions({ ...permissions, manageTasks: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="manage-specs" className="text-sm font-normal cursor-pointer">
              {t.manageSpecs}
            </Label>
            <Switch
              id="manage-specs"
              checked={permissions.manageSpecs}
              onCheckedChange={(checked) => setPermissions({ ...permissions, manageSpecs: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="manage-files" className="text-sm font-normal cursor-pointer">
              {t.manageFiles}
            </Label>
            <Switch
              id="manage-files"
              checked={permissions.manageFiles}
              onCheckedChange={(checked) => setPermissions({ ...permissions, manageFiles: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="view-statistics" className="text-sm font-normal cursor-pointer">
              {t.viewStatistics}
            </Label>
            <Switch
              id="view-statistics"
              checked={permissions.viewStatistics}
              onCheckedChange={(checked) => setPermissions({ ...permissions, viewStatistics: checked })}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <Plus className="h-4 w-4" />
              {t.createRole}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.createRole}</DialogTitle>
              <DialogDescription>
                {language === "en" ? "Create a new role with custom permissions" : "Создайте новую роль с настраиваемыми правами"}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.roleName}</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.description}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  rows={3}
                />
              </div>
              <PermissionsForm />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  {t.save}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg`}>
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{role.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {role.memberCount} {t.members.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(role)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t.editRole}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("View members", role.id)}>
                    <Users className="h-4 w-4 mr-2" />
                    {t.viewMembers}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Configure permissions", role.id)}>
                    <Settings className="h-4 w-4 mr-2" />
                    {t.configurePermissions}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(role.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t.deleteRole}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.permissions}:</Label>
              <div className="flex flex-wrap gap-2">
                {role.permissions.manageMembers && <Badge variant="secondary">{t.manageMembers}</Badge>}
                {role.permissions.manageProjects && <Badge variant="secondary">{t.manageProjects}</Badge>}
                {role.permissions.manageTasks && <Badge variant="secondary">{t.manageTasks}</Badge>}
                {role.permissions.manageSpecs && <Badge variant="secondary">{t.manageSpecs}</Badge>}
                {role.permissions.manageFiles && <Badge variant="secondary">{t.manageFiles}</Badge>}
                {role.permissions.viewStatistics && <Badge variant="secondary">{t.viewStatistics}</Badge>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.editRole}</DialogTitle>
            <DialogDescription>
              {language === "en" ? "Edit role information and permissions" : "Редактировать информацию роли и права доступа"}
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t.roleName}</Label>
                <Input id="edit-name" name="name" defaultValue={selectedRole.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t.description}</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  defaultValue={selectedRole.description}
                  required 
                  rows={3}
                />
              </div>
              <PermissionsForm defaultPermissions={selectedRole.permissions} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  {t.save}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <Card className="p-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {language === "en" ? "No roles found" : "Роли не найдены"}
          </h3>
          <p className="text-muted-foreground">
            {language === "en" ? "Try adjusting your search or create a new role" : "Попробуйте изменить поиск или создать новую роль"}
          </p>
        </Card>
      )}
    </div>
  );
}
