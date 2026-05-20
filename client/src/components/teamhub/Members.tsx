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
  Crown,
  Shield,
  User,
  Eye,
  MoreVertical,
  Trash2,
  Edit,
  Send,
  Users,
  CheckCircle2,
  Clock,
  XCircle
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Team Leader" | "Moderator" | "Member" | "Viewer";
  team: string;
  joinedAt: string;
  status: "active" | "pending" | "inactive";
}

interface Invitation {
  id: string;
  email: string;
  team: string;
  role: "Team Leader" | "Moderator" | "Member" | "Viewer";
  sentAt: string;
  sentBy: string;
  status: "pending" | "accepted" | "declined";
}

export function Members() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const [members] = useState<Member[]>([
    {
      id: "1",
      name: "Иван Петров",
      email: "ivan@example.com",
      role: "Team Leader",
      team: "Mobile Dev Team",
      joinedAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Мария Сидорова",
      email: "maria@example.com",
      role: "Moderator",
      team: "Mobile Dev Team",
      joinedAt: "2024-01-20",
      status: "active",
    },
    {
      id: "3",
      name: "Алексей Иванов",
      email: "alexey@example.com",
      role: "Member",
      team: "Backend Team",
      joinedAt: "2024-02-01",
      status: "active",
    },
    {
      id: "4",
      name: "Анна Смирнова",
      email: "anna@example.com",
      role: "Viewer",
      team: "Design Team",
      joinedAt: "2024-02-05",
      status: "active",
    },
  ]);

  const [invitations] = useState<Invitation[]>([
    {
      id: "1",
      email: "dmitry@example.com",
      team: "Mobile Dev Team",
      role: "Member",
      sentAt: "2024-02-10",
      sentBy: "Иван Петров",
      status: "pending",
    },
    {
      id: "2",
      email: "elena@example.com",
      team: "Design Team",
      role: "Moderator",
      sentAt: "2024-02-08",
      sentBy: "Мария Сидорова",
      status: "accepted",
    },
  ]);

  const t = {
    members: language === "en" ? "Team Members" : "Участники команды",
    subtitle: language === "en" ? "Manage team members and invitations" : "Управление участниками команды и приглашениями",
    inviteMember: language === "en" ? "Invite Member" : "Пригласить участника",
    search: language === "en" ? "Search members..." : "Поиск участников...",
    allMembers: language === "en" ? "All Members" : "Все участники",
    invitations: language === "en" ? "Invitations" : "Приглашения",
    active: language === "en" ? "Active" : "Активные",
    pending: language === "en" ? "Pending" : "Ожидают",
    role: language === "en" ? "Role" : "Роль",
    team: language === "en" ? "Team" : "Команда",
    joined: language === "en" ? "Joined" : "Присоединился",
    status: language === "en" ? "Status" : "Статус",
    teamLeader: language === "en" ? "Team Leader" : "Лидер команды",
    moderator: language === "en" ? "Moderator" : "Модератор",
    member: language === "en" ? "Member" : "Участник",
    viewer: language === "en" ? "Viewer" : "Наблюдатель",
    edit: language === "en" ? "Edit Role" : "Изменить роль",
    remove: language === "en" ? "Remove" : "Удалить",
    // Invite Dialog
    inviteTitle: language === "en" ? "Invite New Member" : "Пригласить нового участника",
    inviteDesc: language === "en" ? "Send an invitation to join your team" : "Отправьте приглашение присоединиться к команде",
    emailAddress: language === "en" ? "Email Address" : "Email адрес",
    selectTeam: language === "en" ? "Select Team" : "Выберите команду",
    selectRole: language === "en" ? "Select Role" : "Выберите роль",
    sendInvite: language === "en" ? "Send Invitation" : "Отправить приглашение",
    cancel: language === "en" ? "Cancel" : "Отмена",
    // Invitation statuses
    accepted: language === "en" ? "Accepted" : "Принято",
    declined: language === "en" ? "Declined" : "Отклонено",
    sentBy: language === "en" ? "Sent by" : "Отправил",
    sentOn: language === "en" ? "Sent on" : "Отправлено",
    resend: language === "en" ? "Resend" : "Отправить повторно",
    revoke: language === "en" ? "Revoke" : "Отозвать",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "declined":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsInviteDialogOpen(false);
    alert(language === "en" ? "Invitation sent!" : "Приглашение отправлено!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.members}
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
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t.inviteMember}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.inviteTitle}</DialogTitle>
              <DialogDescription>{t.inviteDesc}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.emailAddress}</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder={language === "en" ? "member@example.com" : "участник@example.com"} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">{t.selectTeam}</Label>
                <Select name="team" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile Dev Team</SelectItem>
                    <SelectItem value="design">Design Team</SelectItem>
                    <SelectItem value="backend">Backend Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t.selectRole}</Label>
                <Select name="role" defaultValue="Member">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Team Leader">{t.teamLeader}</SelectItem>
                    <SelectItem value="Moderator">{t.moderator}</SelectItem>
                    <SelectItem value="Member">{t.member}</SelectItem>
                    <SelectItem value="Viewer">{t.viewer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  {t.sendInvite}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            {t.allMembers} ({filteredMembers.length})
          </TabsTrigger>
          <TabsTrigger value="invitations" className="gap-2">
            <Mail className="h-4 w-4" />
            {t.invitations} ({invitations.filter(i => i.status === "pending").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRoleColor(member.role)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {member.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{member.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t.remove}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded bg-gradient-to-br ${getRoleColor(member.role)} flex items-center justify-center text-white`}>
                          {getRoleIcon(member.role)}
                        </div>
                        <span className="text-sm">{member.role}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {member.team}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {t.joined}: {member.joinedAt}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <Card key={invitation.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{invitation.email}</p>
                        {getStatusIcon(invitation.status)}
                        <Badge variant={invitation.status === "accepted" ? "default" : invitation.status === "pending" ? "secondary" : "outline"}>
                          {t[invitation.status as keyof typeof t]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{invitation.team}</span>
                        <span>•</span>
                        <span>{invitation.role}</span>
                        <span>•</span>
                        <span>{t.sentBy}: {invitation.sentBy}</span>
                        <span>•</span>
                        <span>{invitation.sentAt}</span>
                      </div>
                    </div>
                  </div>

                  {invitation.status === "pending" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        {t.resend}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        {t.revoke}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
