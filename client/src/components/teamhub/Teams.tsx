import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { 
  Users, 
  Plus, 
  Search, 
  Crown, 
  Shield, 
  User, 
  Eye,
  MoreVertical,
  Settings,
  UserPlus,
  Trash2
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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


interface Team {
  id: string;
  name: string;
  description: string;
  owner: string;
  role: "Team Leader" | "Moderator" | "Member" | "Viewer";
  members: number;
  projects: number;
  createdAt: string;
}

interface TeamsProps {
  onTeamSelect: (team: Team) => void;
}

export function Teams({ onTeamSelect }: TeamsProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Mobile Dev Team",
      description: "Команда разработки мобильных приложений",
      owner: "Иван Петров",
      role: "Team Leader",
      members: 8,
      projects: 3,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Design Team",
      description: "Команда дизайнеров UI/UX",
      owner: "Мария Сидорова",
      role: "Moderator",
      members: 5,
      projects: 2,
      createdAt: "2024-02-01",
    },
    {
      id: "3",
      name: "Backend Team",
      description: "Серверная разработка и API",
      owner: "Алексей Иванов",
      role: "Member",
      members: 6,
      projects: 4,
      createdAt: "2024-01-20",
    },
  ]);

  const t = {
    teams: language === "en" ? "Teams" : "Команды",
    subtitle: language === "en" ? "Manage your teams and collaborate" : "Управляйте командами и сотрудничайте",
    createTeam: language === "en" ? "Create Team" : "Создать команду",
    search: language === "en" ? "Search teams..." : "Поиск команд...",
    myTeams: language === "en" ? "My Teams" : "Мои команды",
    members: language === "en" ? "Members" : "Участники",
    projects: language === "en" ? "Projects" : "Проекты",
    role: language === "en" ? "Role" : "Роль",
    teamLeader: language === "en" ? "Team Leader" : "Лидер команды",
    moderator: language === "en" ? "Moderator" : "Модератор",
    member: language === "en" ? "Member" : "Участник",
    viewer: language === "en" ? "Viewer" : "Наблюдатель",
    viewTeam: language === "en" ? "View Team" : "Открыть команду",
    settings: language === "en" ? "Settings" : "Настройки",
    invite: language === "en" ? "Invite" : "Пригласить",
    leave: language === "en" ? "Leave" : "Покинуть",
    // Create Team Dialog
    teamName: language === "en" ? "Team Name" : "Название команды",
    teamDescription: language === "en" ? "Description" : "Описание",
    create: language === "en" ? "Create" : "Создать",
    cancel: language === "en" ? "Cancel" : "Отмена",
    createTeamTitle: language === "en" ? "Create New Team" : "Создать новую команду",
    createTeamDesc: language === "en" ? "Set up a new team to collaborate with others" : "Создайте новую команду для совместной работы",
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Team Leader":
        return <Crown className="h-4 w-4" />;
      case "Moderator":
        return <Shield className="h-4 w-4" />;
      case "Member":
        return <User className="h-4 w-4" />;
      case "Viewer":
        return <Eye className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Team Leader":
        return "from-yellow-500 to-orange-600";
      case "Moderator":
        return "from-blue-500 to-indigo-600";
      case "Member":
        return "from-emerald-500 to-teal-600";
      case "Viewer":
        return "from-gray-500 to-slate-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTeam: Team = {
      id: String(teams.length + 1),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      owner: "Вы",
      role: "Team Leader",
      members: 1,
      projects: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTeams([newTeam, ...teams]);
    setIsCreateDialogOpen(false);
  };

  const handleOpenTeam = (team: Team) => {
    onTeamSelect(team);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.teams}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createTeam}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.createTeamTitle}</DialogTitle>
              <DialogDescription>{t.createTeamDesc}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.teamName}</Label>
                <Input id="name" name="name" required placeholder={language === "en" ? "Mobile Dev Team" : "Команда мобильной разработки"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.teamDescription}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder={language === "en" ? "What does this team work on?" : "Над чем работает эта команда?"}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  {t.create}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teams Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.myTeams} ({filteredTeams.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Card 
              key={team.id} 
              className="p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleOpenTeam(team)}
            >
              <div className="space-y-4">
                {/* Team Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{team.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {team.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenTeam(team)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t.viewTeam}
                      </DropdownMenuItem>
                      {team.role === "Team Leader" && (
                        <>
                          <DropdownMenuItem onClick={() => handleOpenTeam(team)}>
                            <Settings className="h-4 w-4 mr-2" />
                            {t.settings}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            {t.invite}
                          </DropdownMenuItem>
                        </>
                      )}
                      {team.role !== "Team Leader" && (
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t.leave}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getRoleColor(team.role)} flex items-center justify-center text-white`}>
                    {getRoleIcon(team.role)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                    <p className="text-sm font-medium">{team.role}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {team.members} {t.members.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {team.projects} {t.projects.toLowerCase()}
                    </Badge>
                  </div>
                </div>

                {/* Owner */}
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Owner: " : "Владелец: "}{team.owner}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
