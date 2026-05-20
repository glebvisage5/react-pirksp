import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
  FolderKanban,
  Activity
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

interface Team {
  id: string;
  name: string;
  description: string;
  owner: string;
  memberCount: number;
  projectCount: number;
  createdAt: string;
  status: "active" | "inactive";
}

export function AdminModeTeamsTeamHub() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const t = {
    title: language === "en" ? "Teams Management" : "Управление командами",
    subtitle: language === "en" ? "Create, edit, and manage all teams in TeamHub" : "Создавайте, редактируйте и управляйте всеми командами в TeamHub",
    search: language === "en" ? "Search teams..." : "Поиск команд...",
    createTeam: language === "en" ? "Create Team" : "Создать команду",
    editTeam: language === "en" ? "Edit Team" : "Редактировать команду",
    deleteTeam: language === "en" ? "Delete Team" : "Удалить команду",
    teamName: language === "en" ? "Team Name" : "Название команды",
    description: language === "en" ? "Description" : "Описание",
    owner: language === "en" ? "Owner" : "Владелец",
    members: language === "en" ? "Members" : "Участники",
    projects: language === "en" ? "Projects" : "Проекты",
    status: language === "en" ? "Status" : "Статус",
    active: language === "en" ? "Active" : "Активна",
    inactive: language === "en" ? "Inactive" : "Неактивна",
    createdAt: language === "en" ? "Created" : "Создана",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    viewMembers: language === "en" ? "View Members" : "Просмотр участников",
    viewProjects: language === "en" ? "View Projects" : "Просмотр проектов",
    viewActivity: language === "en" ? "View Activity" : "Просмотр активности",
    selectOwner: language === "en" ? "Select owner" : "Выберите владельца",
    selectStatus: language === "en" ? "Select status" : "Выберите статус",
  };

  const teams: Team[] = [
    {
      id: "1",
      name: "Mobile Development",
      description: "Team focused on mobile app development for iOS and Android",
      owner: "Алексей Иванов",
      memberCount: 8,
      projectCount: 5,
      createdAt: "2024-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "Backend Engineering",
      description: "Server-side development and API design",
      owner: "Мария Петрова",
      memberCount: 12,
      projectCount: 8,
      createdAt: "2024-01-20",
      status: "active"
    },
    {
      id: "3",
      name: "UI/UX Design",
      description: "User interface and experience design team",
      owner: "Дмитрий Сидоров",
      memberCount: 6,
      projectCount: 10,
      createdAt: "2024-02-01",
      status: "active"
    },
    {
      id: "4",
      name: "QA & Testing",
      description: "Quality assurance and testing specialists",
      owner: "Елена Козлова",
      memberCount: 5,
      projectCount: 3,
      createdAt: "2024-02-10",
      status: "active"
    },
    {
      id: "5",
      name: "DevOps",
      description: "Infrastructure and deployment automation",
      owner: "Сергей Новиков",
      memberCount: 4,
      projectCount: 2,
      createdAt: "2024-02-15",
      status: "inactive"
    },
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  const handleDelete = (teamId: string) => {
    if (confirm(language === "en" ? "Are you sure you want to delete this team?" : "Вы уверены, что хотите удалить эту команду?")) {
      console.log("Deleting team:", teamId);
    }
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
              {t.createTeam}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.createTeam}</DialogTitle>
              <DialogDescription>
                {language === "en" ? "Create a new team in TeamHub" : "Создайте новую команду в TeamHub"}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.teamName}</Label>
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
              <div className="space-y-2">
                <Label htmlFor="owner">{t.owner}</Label>
                <Select name="owner" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectOwner} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Алексей Иванов</SelectItem>
                    <SelectItem value="user2">Мария Петрова</SelectItem>
                    <SelectItem value="user3">Дмитрий Сидоров</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t.status}</Label>
                <Select name="status" defaultValue="active" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t.active}</SelectItem>
                    <SelectItem value="inactive">{t.inactive}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.owner}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={team.status === "active" ? "default" : "secondary"} className={team.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""}>
                  {team.status === "active" ? t.active : t.inactive}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(team)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t.editTeam}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("View members", team.id)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {t.viewMembers}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("View projects", team.id)}>
                      <FolderKanban className="h-4 w-4 mr-2" />
                      {t.viewProjects}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("View activity", team.id)}>
                      <Activity className="h-4 w-4 mr-2" />
                      {t.viewActivity}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(team.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t.deleteTeam}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{team.description}</p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{team.memberCount}</span>
                <span className="text-muted-foreground">{t.members}</span>
              </div>
              <div className="flex items-center gap-1">
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{team.projectCount}</span>
                <span className="text-muted-foreground">{t.projects}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                {t.createdAt}: {new Date(team.createdAt).toLocaleDateString(language === "en" ? "en-US" : "ru-RU")}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.editTeam}</DialogTitle>
            <DialogDescription>
              {language === "en" ? "Edit team information" : "Редактировать информацию команды"}
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t.teamName}</Label>
                <Input id="edit-name" name="name" defaultValue={selectedTeam.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t.description}</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  defaultValue={selectedTeam.description}
                  required 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-owner">{t.owner}</Label>
                <Select name="owner" defaultValue="user1" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectOwner} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Алексей Иванов</SelectItem>
                    <SelectItem value="user2">Мария Петрова</SelectItem>
                    <SelectItem value="user3">Дмитрий Сидоров</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">{t.status}</Label>
                <Select name="status" defaultValue={selectedTeam.status} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t.active}</SelectItem>
                    <SelectItem value="inactive">{t.inactive}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
      {filteredTeams.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {language === "en" ? "No teams found" : "Команды не найдены"}
          </h3>
          <p className="text-muted-foreground">
            {language === "en" ? "Try adjusting your search or create a new team" : "Попробуйте изменить поиск или создать новую команду"}
          </p>
        </Card>
      )}
    </div>
  );
}
