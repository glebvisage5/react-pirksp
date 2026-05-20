import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useLanguage } from "../../lib/language-context";
import { 
  UserPlus, 
  Search, 
  Mail,
  Phone,
  Edit,
  Trash2,
  MoreVertical,
  Shield,
  Users,
  CheckCircle
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
import { Avatar, AvatarFallback } from "../ui/avatar";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  team: string;
  tasksCompleted: number;
  joinedAt: string;
  status: "active" | "inactive";
}

export function AdminModeMembersTeamHub() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const t = {
    title: language === "en" ? "Members Management" : "Управление участниками",
    subtitle: language === "en" ? "Manage all members across teams" : "Управление всеми участниками команд",
    search: language === "en" ? "Search members..." : "Поиск участников...",
    inviteMember: language === "en" ? "Invite Member" : "Пригласить участника",
    editMember: language === "en" ? "Edit Member" : "Редактировать участника",
    deleteMember: language === "en" ? "Remove Member" : "Удалить участника",
    name: language === "en" ? "Name" : "Имя",
    email: language === "en" ? "Email" : "Email",
    phone: language === "en" ? "Phone" : "Телефон",
    role: language === "en" ? "Role" : "Роль",
    team: language === "en" ? "Team" : "Команда",
    tasksCompleted: language === "en" ? "Tasks Completed" : "Выполнено задач",
    joinedAt: language === "en" ? "Joined" : "Присоединился",
    status: language === "en" ? "Status" : "Статус",
    active: language === "en" ? "Active" : "Активен",
    inactive: language === "en" ? "Inactive" : "Неактивен",
    actions: language === "en" ? "Actions" : "Действия",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    viewTasks: language === "en" ? "View Tasks" : "Просмотр задач",
    viewActivity: language === "en" ? "View Activity" : "Просмотр активности",
    changeRole: language === "en" ? "Change Role" : "Изменить роль",
    moveToTeam: language === "en" ? "Move to Team" : "Перенести в команду",
    selectRole: language === "en" ? "Select role" : "Выберите роль",
    selectTeam: language === "en" ? "Select team" : "Выберите команду",
  };

  const members: Member[] = [
    {
      id: "1",
      name: "Алексей Иванов",
      email: "alexey.ivanov@example.com",
      phone: "+7 900 123-45-67",
      role: "Team Leader",
      team: "Mobile Development",
      tasksCompleted: 45,
      joinedAt: "2024-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "Мария Петрова",
      email: "maria.petrova@example.com",
      phone: "+7 900 234-56-78",
      role: "Developer",
      team: "Backend Engineering",
      tasksCompleted: 38,
      joinedAt: "2024-01-20",
      status: "active"
    },
    {
      id: "3",
      name: "Дмитрий Сидоров",
      email: "dmitry.sidorov@example.com",
      phone: "+7 900 345-67-89",
      role: "Designer",
      team: "UI/UX Design",
      tasksCompleted: 52,
      joinedAt: "2024-02-01",
      status: "active"
    },
    {
      id: "4",
      name: "Елена Козлова",
      email: "elena.kozlova@example.com",
      phone: "+7 900 456-78-90",
      role: "Moderator",
      team: "QA & Testing",
      tasksCompleted: 31,
      joinedAt: "2024-02-10",
      status: "active"
    },
    {
      id: "5",
      name: "Сергей Новиков",
      email: "sergey.novikov@example.com",
      phone: "+7 900 567-89-01",
      role: "Viewer",
      team: "DevOps",
      tasksCompleted: 12,
      joinedAt: "2024-02-15",
      status: "inactive"
    },
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDelete = (memberId: string) => {
    if (confirm(language === "en" ? "Are you sure you want to remove this member?" : "Вы уверены, что хотите удалить этого участника?")) {
      console.log("Removing member:", memberId);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Team Leader":
        return "from-purple-500 to-indigo-600";
      case "Moderator":
        return "from-blue-500 to-cyan-600";
      case "Developer":
        return "from-emerald-500 to-teal-600";
      case "Designer":
        return "from-pink-500 to-rose-600";
      case "Viewer":
        return "from-gray-400 to-gray-600";
      default:
        return "from-orange-500 to-red-600";
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
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <UserPlus className="h-4 w-4" />
              {t.inviteMember}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.inviteMember}</DialogTitle>
              <DialogDescription>
                {language === "en" ? "Invite a new member to TeamHub" : "Пригласите нового участника в TeamHub"}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t.role}</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectRole} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team-leader">Team Leader</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">{t.team}</Label>
                <Select name="team" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectTeam} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="backend">Backend Engineering</SelectItem>
                    <SelectItem value="design">UI/UX Design</SelectItem>
                    <SelectItem value="qa">QA & Testing</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>
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

      {/* Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className={`bg-gradient-to-br ${getRoleColor(member.role)} text-white font-semibold`}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {member.role}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.status === "active" ? "default" : "secondary"} className={member.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""}>
                  {member.status === "active" ? t.active : t.inactive}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(member)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t.editMember}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Change role", member.id)}>
                      <Shield className="h-4 w-4 mr-2" />
                      {t.changeRole}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Move to team", member.id)}>
                      <Users className="h-4 w-4 mr-2" />
                      {t.moveToTeam}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("View tasks", member.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t.viewTasks}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t.deleteMember}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{member.team}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">{member.tasksCompleted}</span>
                <span className="text-sm text-muted-foreground">{t.tasksCompleted}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.joinedAt} {new Date(member.joinedAt).toLocaleDateString(language === "en" ? "en-US" : "ru-RU")}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.editMember}</DialogTitle>
            <DialogDescription>
              {language === "en" ? "Edit member information" : "Редактировать информацию участника"}
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t.name}</Label>
                <Input id="edit-name" name="name" defaultValue={selectedMember.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">{t.email}</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={selectedMember.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">{t.phone}</Label>
                <Input id="edit-phone" name="phone" type="tel" defaultValue={selectedMember.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">{t.role}</Label>
                <Select name="role" defaultValue="developer" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectRole} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team-leader">Team Leader</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-team">{t.team}</Label>
                <Select name="team" defaultValue="mobile" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectTeam} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="backend">Backend Engineering</SelectItem>
                    <SelectItem value="design">UI/UX Design</SelectItem>
                    <SelectItem value="qa">QA & Testing</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
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
      {filteredMembers.length === 0 && (
        <Card className="p-12 text-center">
          <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {language === "en" ? "No members found" : "Участники не найдены"}
          </h3>
          <p className="text-muted-foreground">
            {language === "en" ? "Try adjusting your search or invite a new member" : "Попробуйте изменить поиск или пригласить нового участника"}
          </p>
        </Card>
      )}
    </div>
  );
}
