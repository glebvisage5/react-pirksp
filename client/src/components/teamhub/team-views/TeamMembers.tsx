import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useLanguage } from "../../../lib/language-context";
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  Mail,
  Crown,
  Shield,
  User,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Link as LinkIcon,
  QrCode
} from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { toast } from "sonner@2.0.3";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Team Leader" | "Moderator" | "Member" | "Viewer";
  avatar?: string;
  joinedAt: string;
  tasksAssigned: number;
  tasksCompleted: number;
  status: "active" | "inactive";
}

interface TeamMembersProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamMembers({ teamId, userRole = "Team Leader" }: TeamMembersProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [inviteLink] = useState(`https://teamhub.innovatecrm.com/invite/${teamId}`);

  const [members] = useState<Member[]>([
    {
      id: "1",
      name: language === "en" ? "John Doe" : "Иван Петров",
      email: "john.doe@example.com",
      role: "Team Leader",
      joinedAt: "2024-01-15",
      tasksAssigned: 12,
      tasksCompleted: 8,
      status: "active",
    },
    {
      id: "2",
      name: language === "en" ? "Jane Smith" : "Мария Сидорова",
      email: "jane.smith@example.com",
      role: "Moderator",
      joinedAt: "2024-01-18",
      tasksAssigned: 10,
      tasksCompleted: 9,
      status: "active",
    },
    {
      id: "3",
      name: language === "en" ? "Alex Johnson" : "Алексей Иванов",
      email: "alex.johnson@example.com",
      role: "Member",
      joinedAt: "2024-01-20",
      tasksAssigned: 8,
      tasksCompleted: 5,
      status: "active",
    },
    {
      id: "4",
      name: language === "en" ? "Sarah Williams" : "Анна Смирнова",
      email: "sarah.williams@example.com",
      role: "Member",
      joinedAt: "2024-01-22",
      tasksAssigned: 6,
      tasksCompleted: 4,
      status: "active",
    },
    {
      id: "5",
      name: language === "en" ? "Mike Brown" : "Михаил Коваленко",
      email: "mike.brown@example.com",
      role: "Viewer",
      joinedAt: "2024-01-25",
      tasksAssigned: 0,
      tasksCompleted: 0,
      status: "active",
    },
    {
      id: "6",
      name: language === "en" ? "Emily Davis" : "Елена Волкова",
      email: "emily.davis@example.com",
      role: "Member",
      joinedAt: "2024-01-10",
      tasksAssigned: 4,
      tasksCompleted: 4,
      status: "inactive",
    },
  ]);

  const t = {
    members: language === "en" ? "Team Members" : "Участники команды",
    subtitle: language === "en" ? "Manage team members and roles" : "Управление участниками и ролями",
    inviteMember: language === "en" ? "Invite Member" : "Пригласить участника",
    search: language === "en" ? "Search members..." : "Поиск участников...",
    filterAll: language === "en" ? "All Roles" : "Все роли",
    teamLeader: language === "en" ? "Team Leader" : "Лидер команды",
    moderator: language === "en" ? "Moderator" : "Модератор",
    member: language === "en" ? "Member" : "Участник",
    viewer: language === "en" ? "Viewer" : "Наблюдатель",
    active: language === "en" ? "Active" : "Активен",
    inactive: language === "en" ? "Inactive" : "Неактивен",
    tasksAssigned: language === "en" ? "Assigned" : "Назначено",
    tasksCompleted: language === "en" ? "Completed" : "Завершено",
    joined: language === "en" ? "Joined" : "Присоединился",
    email: language === "en" ? "Email" : "Email",
    role: language === "en" ? "Role" : "Роль",
    changeRole: language === "en" ? "Change Role" : "Изменить роль",
    removeMember: language === "en" ? "Remove Member" : "Удалить участника",
    // Invite Dialog
    inviteTitle: language === "en" ? "Invite New Member" : "Пригласить нового участника",
    inviteDesc: language === "en" ? "Share invitation link or send email" : "Поделитесь ссылкой или отправьте email",
    inviteByLink: language === "en" ? "Invite by Link" : "Пригласить по ссылке",
    inviteByEmail: language === "en" ? "Invite by Email" : "Пригласить по Email",
    inviteByQR: language === "en" ? "QR Code" : "QR-код",
    copyLink: language === "en" ? "Copy Link" : "Скопировать ссылку",
    linkCopied: language === "en" ? "Link copied!" : "Ссылка скопирована!",
    inviteLinkLabel: language === "en" ? "Invitation Link" : "Ссылка-приглашение",
    emailAddress: language === "en" ? "Email Address" : "Email адрес",
    selectRole: language === "en" ? "Select Role" : "Выберите роль",
    sendInvite: language === "en" ? "Send Invite" : "Отправить приглашение",
    cancel: language === "en" ? "Cancel" : "Отмена",
    noMembers: language === "en" ? "No members found" : "Участники не найдены",
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

  const getRoleText = (role: string) => {
    switch (role) {
      case "Team Leader":
        return t.teamLeader;
      case "Moderator":
        return t.moderator;
      case "Member":
        return t.member;
      case "Viewer":
        return t.viewer;
      default:
        return role;
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success(t.linkCopied);
  };

  const handleViewProfile = (member: Member) => {
    setSelectedMember(member);
    setIsProfileDialogOpen(true);
  };

  const handleChangeRoleClick = (member: Member) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setIsChangeRoleDialogOpen(true);
  };

  const handleChangeRoleConfirm = () => {
    if (selectedMember) {
      toast.success(
        language === "en" 
          ? `Role changed for ${selectedMember.name}` 
          : `Роль изменена для ${selectedMember.name}`
      );
      setIsChangeRoleDialogOpen(false);
    }
  };

  const handleRemoveMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const handleRemoveMemberConfirm = () => {
    if (selectedMember) {
      toast.success(
        language === "en" 
          ? `Removed ${selectedMember.name} from team` 
          : `Участник ${selectedMember.name} удален из команды`
      );
      setIsDeleteDialogOpen(false);
    }
  };

  const isTeamLeader = userRole === "Team Leader";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          {t.members}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              <SelectItem value="Team Leader">{t.teamLeader}</SelectItem>
              <SelectItem value="Moderator">{t.moderator}</SelectItem>
              <SelectItem value="Member">{t.member}</SelectItem>
              <SelectItem value="Viewer">{t.viewer}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t.inviteMember}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.inviteTitle}</DialogTitle>
              <DialogDescription>{t.inviteDesc}</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">{t.inviteByLink}</TabsTrigger>
                <TabsTrigger value="email">{t.inviteByEmail}</TabsTrigger>
                <TabsTrigger value="qr">{t.inviteByQR}</TabsTrigger>
              </TabsList>

              {/* Link Tab */}
              <TabsContent value="link" className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.inviteLinkLabel}</Label>
                  <div className="flex gap-2">
                    <Input value={inviteLink} readOnly className="flex-1" />
                    <Button onClick={copyInviteLink} variant="outline">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      {t.copyLink}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" 
                    ? "Share this link with anyone you want to invite to the team." 
                    : "Поделитесь этой ссылкой с теми, кого хотите пригласить в команду."}
                </p>
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.emailAddress}</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t.selectRole}</Label>
                  <Select defaultValue="Member">
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">{t.member}</SelectItem>
                      <SelectItem value="Viewer">{t.viewer}</SelectItem>
                      <SelectItem value="Moderator">{t.moderator}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    {t.cancel}
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    {t.sendInvite}
                  </Button>
                </div>
              </TabsContent>

              {/* QR Code Tab */}
              <TabsContent value="qr" className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" 
                      ? "Scan this QR code to join the team" 
                      : "Отсканируйте QR-код для присоединения к команде"}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleColor(member.role)} flex items-center justify-center text-white shadow-lg shrink-0`}>
                      {getRoleIcon(member.role)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                      <Badge className="mt-2" variant="secondary">
                        {getRoleText(member.role)}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {language === "en" ? "View Profile" : "Профиль"}
                      </DropdownMenuItem>
                      {isTeamLeader && member.role !== "Team Leader" && (
                        <DropdownMenuItem onClick={() => handleChangeRoleClick(member)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t.changeRole}
                        </DropdownMenuItem>
                      )}
                      {isTeamLeader && member.role !== "Team Leader" && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleRemoveMemberClick(member)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t.removeMember}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.tasksAssigned}</p>
                    <p className="text-lg font-bold">{member.tasksAssigned}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.tasksCompleted}</p>
                    <p className="text-lg font-bold">{member.tasksCompleted}</p>
                  </div>
                </div>

                {/* Status & Join Date */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge 
                    variant={member.status === "active" ? "default" : "secondary"}
                    className={member.status === "active" ? "bg-emerald-500" : ""}
                  >
                    {member.status === "active" ? t.active : t.inactive}
                  </Badge>
                  <span>{t.joined}: {member.joinedAt}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">{t.noMembers}</h3>
            <Button 
              onClick={() => setIsInviteDialogOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white mt-4"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t.inviteMember}
            </Button>
          </div>
        </Card>
      )}
      
      {/* View Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {language === "en" ? "Member Profile" : "Профиль участника"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" ? "View member details and statistics" : "Просмотр деталей и статистики участника"}
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${getRoleColor(selectedMember.role)} flex items-center justify-center text-white shadow-lg`}>
                  {getRoleIcon(selectedMember.role)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.email}</p>
                  <Badge className="mt-2">{getRoleText(selectedMember.role)}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t.tasksAssigned}</p>
                  <p className="text-3xl font-bold">{selectedMember.tasksAssigned}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t.tasksCompleted}</p>
                  <p className="text-3xl font-bold">{selectedMember.tasksCompleted}</p>
                </Card>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.joined}</span>
                  <span className="font-medium">{selectedMember.joinedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === "en" ? "Status" : "Статус"}</span>
                  <Badge variant={selectedMember.status === "active" ? "default" : "secondary"}>
                    {selectedMember.status === "active" ? t.active : t.inactive}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
              {language === "en" ? "Close" : "Закрыть"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isChangeRoleDialogOpen} onOpenChange={setIsChangeRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Change Member Role" : "Изменить роль участника"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? `Change the role for ${selectedMember?.name}`
                : `Изменить роль для ${selectedMember?.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newRole">{t.selectRole}</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="newRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moderator">{t.moderator}</SelectItem>
                  <SelectItem value="Member">{t.member}</SelectItem>
                  <SelectItem value="Viewer">{t.viewer}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeRoleDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button 
              onClick={handleChangeRoleConfirm}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              {language === "en" ? "Save Changes" : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Remove Member?" : "Удалить участника?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en" 
                ? `Are you sure you want to remove ${selectedMember?.name} from the team? This action cannot be undone.`
                : `Вы уверены, что хотите удалить ${selectedMember?.name} из команды? Это действие нельзя отменить.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "Отмена"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveMemberConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === "en" ? "Remove" : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
