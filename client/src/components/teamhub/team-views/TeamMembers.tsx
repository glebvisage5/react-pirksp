import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useLanguage } from "../../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { Loader2, Users, Search, MoreVertical, Mail, Crown, Shield, User, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { apiTeams, type TeamMember } from "../../../api/teams";
import { apiSearchUsers } from "../../../api/auth";

interface TeamMembersProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamMembers({ teamId, userRole = "Team Leader" }: TeamMembersProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<{ id: string; name: string; email: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Member");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    apiTeams.members(teamId)
      .then(setMembers)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

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
    tasksAssigned: language === "en" ? "Assigned" : "Назначено",
    tasksCompleted: language === "en" ? "Completed" : "Завершено",
    joined: language === "en" ? "Joined" : "Присоединился",
    changeRole: language === "en" ? "Change Role" : "Изменить роль",
    removeMember: language === "en" ? "Remove Member" : "Удалить участника",
    selectRole: language === "en" ? "Select Role" : "Выберите роль",
    cancel: language === "en" ? "Cancel" : "Отмена",
    noMembers: language === "en" ? "No members found" : "Участники не найдены",
    inviteTitle: language === "en" ? "Add Member by User ID" : "Добавить участника по User ID",
    userId: language === "en" ? "User ID" : "ID пользователя",
    add: language === "en" ? "Add" : "Добавить",
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Team Leader": return <Crown className="h-4 w-4" />;
      case "Moderator": return <Shield className="h-4 w-4" />;
      case "Viewer": return <Eye className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Team Leader": return "from-yellow-500 to-orange-600";
      case "Moderator": return "from-blue-500 to-indigo-600";
      case "Member": return "from-emerald-500 to-teal-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "Team Leader": return t.teamLeader;
      case "Moderator": return t.moderator;
      case "Member": return t.member;
      default: return t.viewer;
    }
  };

  const isTeamLeader = userRole === "Team Leader";

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || m.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleUserSearch = async (q: string) => {
    setUserSearchQuery(q);
    setSelectedUser(null);
    if (q.trim().length < 2) { setUserSearchResults([]); return; }
    setSearching(true);
    try {
      const results = await apiSearchUsers(q);
      setUserSearchResults(results);
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      await apiTeams.addMember(teamId, selectedUser.id, inviteRole);
      const updated = await apiTeams.members(teamId);
      setMembers(updated);
      setIsInviteDialogOpen(false);
      setSelectedUser(null);
      setUserSearchQuery("");
      setUserSearchResults([]);
      toast.success(language === "en" ? "Member added" : "Участник добавлен");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleChangeRoleConfirm = async () => {
    if (!selectedMember) return;
    try {
      await apiTeams.updateMemberRole(teamId, selectedMember.id, newRole as TeamMember["role"]);
      setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, role: newRole as TeamMember["role"] } : m));
      toast.success(language === "en" ? `Role changed for ${selectedMember.name}` : `Роль изменена для ${selectedMember.name}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setIsChangeRoleDialogOpen(false);
    }
  };

  const handleRemoveMemberConfirm = async () => {
    if (!selectedMember) return;
    try {
      await apiTeams.removeMember(teamId, selectedMember.id);
      setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
      toast.success(language === "en" ? `Removed ${selectedMember.name}` : `Участник ${selectedMember.name} удалён`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />{t.members}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              <SelectItem value="Team Leader">{t.teamLeader}</SelectItem>
              <SelectItem value="Moderator">{t.moderator}</SelectItem>
              <SelectItem value="Member">{t.member}</SelectItem>
              <SelectItem value="Viewer">{t.viewer}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isTeamLeader && (
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />{t.inviteMember}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{language === "en" ? "Add Member" : "Добавить участника"}</DialogTitle>
                <DialogDescription>{language === "en" ? "Search by name or email" : "Поиск по имени или email"}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === "en" ? "Search user" : "Поиск пользователя"}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder={language === "en" ? "Name or email..." : "Имя или email..."}
                      value={userSearchQuery}
                      onChange={e => handleUserSearch(e.target.value)}
                    />
                    {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                  {userSearchResults.length > 0 && !selectedUser && (
                    <div className="border rounded-lg overflow-hidden">
                      {userSearchResults.map(u => (
                        <button
                          key={u.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-muted transition-colors border-b last:border-b-0"
                          onClick={() => { setSelectedUser(u); setUserSearchQuery(u.name); setUserSearchResults([]); }}
                        >
                          <div className="font-medium text-sm">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedUser && (
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                        {selectedUser.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{selectedUser.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedUser.email}</div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { setSelectedUser(null); setUserSearchQuery(""); }}>
                        ×
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t.selectRole}</Label>
                  <Select value={inviteRole} onValueChange={v => setInviteRole(v as TeamMember["role"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">{t.member}</SelectItem>
                      <SelectItem value="Viewer">{t.viewer}</SelectItem>
                      <SelectItem value="Moderator">{t.moderator}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { setIsInviteDialogOpen(false); setSelectedUser(null); setUserSearchQuery(""); setUserSearchResults([]); }}>{t.cancel}</Button>
                  <Button disabled={!selectedUser} onClick={handleAddMember} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />{t.add}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <Card key={member.id} className="p-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleColor(member.role)} flex items-center justify-center text-white shadow-lg shrink-0`}>
                      {getRoleIcon(member.role)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                      <Badge className="mt-2" variant="secondary">{getRoleText(member.role)}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedMember(member); setIsProfileDialogOpen(true); }}>
                        <Eye className="h-4 w-4 mr-2" />{language === "en" ? "View Profile" : "Профиль"}
                      </DropdownMenuItem>
                      {isTeamLeader && member.role !== "Team Leader" && (
                        <>
                          <DropdownMenuItem onClick={() => { setSelectedMember(member); setNewRole(member.role); setIsChangeRoleDialogOpen(true); }}>
                            <Edit className="h-4 w-4 mr-2" />{t.changeRole}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedMember(member); setIsDeleteDialogOpen(true); }}>
                            <Trash2 className="h-4 w-4 mr-2" />{t.removeMember}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.tasksAssigned}</p>
                    <p className="text-lg font-bold">{member.tasks_assigned}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.tasksCompleted}</p>
                    <p className="text-lg font-bold">{member.tasks_completed}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.joined}: {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">{t.noMembers}</h3>
            {isTeamLeader && (
              <Button onClick={() => setIsInviteDialogOpen(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white mt-4">
                <UserPlus className="h-4 w-4 mr-2" />{t.inviteMember}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Member Profile" : "Профиль участника"}</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRoleColor(selectedMember.role)} flex items-center justify-center text-white shadow-lg`}>
                  {getRoleIcon(selectedMember.role)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.email}</p>
                  <Badge className="mt-1">{getRoleText(selectedMember.role)}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t.tasksAssigned}</p>
                  <p className="text-3xl font-bold">{selectedMember.tasks_assigned}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t.tasksCompleted}</p>
                  <p className="text-3xl font-bold">{selectedMember.tasks_completed}</p>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground">{t.joined}: {new Date(selectedMember.joined_at).toLocaleDateString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>{language === "en" ? "Close" : "Закрыть"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isChangeRoleDialogOpen} onOpenChange={setIsChangeRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Change Member Role" : "Изменить роль участника"}</DialogTitle>
            <DialogDescription>{selectedMember?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Moderator">{t.moderator}</SelectItem>
                <SelectItem value="Member">{t.member}</SelectItem>
                <SelectItem value="Viewer">{t.viewer}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeRoleDialogOpen(false)}>{t.cancel}</Button>
            <Button onClick={handleChangeRoleConfirm} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              {language === "en" ? "Save" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Remove Member?" : "Удалить участника?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Remove ${selectedMember?.name} from the team?`
                : `Удалить ${selectedMember?.name} из команды?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMemberConfirm} className="bg-red-600 hover:bg-red-700">
              {language === "en" ? "Remove" : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
