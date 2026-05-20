import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useLanguage } from "../../../lib/language-context";
import { 
  Settings as SettingsIcon, 
  Save,
  Trash2,
  AlertTriangle,
  Image as ImageIcon,
  Users,
  Bell,
  Shield
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Switch } from "../../ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
import { toast } from "sonner@2.0.3";

interface TeamSettingsProps {
  teamId: string;
  team: {
    name: string;
    description: string;
  };
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamSettings({ teamId, team, userRole = "Team Leader" }: TeamSettingsProps) {
  const { language } = useLanguage();
  const [teamName, setTeamName] = useState(team.name);
  const [teamDescription, setTeamDescription] = useState(team.description);
  
  // Notification settings
  const [notifyNewMember, setNotifyNewMember] = useState(true);
  const [notifyNewTask, setNotifyNewTask] = useState(true);
  const [notifyTaskUpdate, setNotifyTaskUpdate] = useState(true);
  const [notifySpecUpdate, setNotifySpecUpdate] = useState(false);
  const [notifyProjectUpdate, setNotifyProjectUpdate] = useState(true);
  
  // Privacy settings
  const [teamVisibility, setTeamVisibility] = useState<"public" | "private">("private");
  const [allowJoinRequests, setAllowJoinRequests] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);

  const t = {
    settings: language === "en" ? "Team Settings" : "Настройки команды",
    subtitle: language === "en" ? "Manage team configuration and preferences" : "Управление конфигурацией команды",
    
    // Tabs
    tabGeneral: language === "en" ? "General" : "Основные",
    tabNotifications: language === "en" ? "Notifications" : "Уведомления",
    tabPrivacy: language === "en" ? "Privacy" : "Приватность",
    tabDanger: language === "en" ? "Danger Zone" : "Опасная зона",
    
    // General
    teamName: language === "en" ? "Team Name" : "Название команды",
    teamDescription: language === "en" ? "Team Description" : "Описание команды",
    teamAvatar: language === "en" ? "Team Avatar" : "Аватар команды",
    uploadAvatar: language === "en" ? "Upload Avatar" : "Загрузить аватар",
    saveChanges: language === "en" ? "Save Changes" : "Сохранить изменения",
    changesSaved: language === "en" ? "Changes saved successfully" : "Изменения успешно сохранены",
    
    // Notifications
    notificationsTitle: language === "en" ? "Notification Preferences" : "Настройки уведомлений",
    notificationsDesc: language === "en" ? "Choose what notifications you want to receive" : "Выберите, какие уведомления вы хотите получать",
    notifyNewMember: language === "en" ? "New member joins team" : "Новый участник присоединяется к команде",
    notifyNewTask: language === "en" ? "New task is created" : "Создана новая задача",
    notifyTaskUpdate: language === "en" ? "Task status is updated" : "Обновлен статус задачи",
    notifySpecUpdate: language === "en" ? "Specification is updated" : "Обновлено ТЗ",
    notifyProjectUpdate: language === "en" ? "Project is updated" : "Обновлен проект",
    
    // Privacy
    privacyTitle: language === "en" ? "Privacy Settings" : "Настройки приватности",
    privacyDesc: language === "en" ? "Control who can see and join your team" : "Контроль видимости и доступа к команде",
    teamVisibility: language === "en" ? "Team Visibility" : "Видимость команды",
    visibilityPublic: language === "en" ? "Public" : "Публичная",
    visibilityPrivate: language === "en" ? "Private" : "Приватная",
    visibilityPublicDesc: language === "en" ? "Anyone can see this team" : "Команду могут видеть все",
    visibilityPrivateDesc: language === "en" ? "Only members can see this team" : "Команду видят только участники",
    allowJoinRequests: language === "en" ? "Allow join requests" : "Разрешить запросы на вступление",
    allowJoinRequestsDesc: language === "en" ? "Users can request to join the team" : "Пользователи могут запрашивать вступление в команду",
    requireApproval: language === "en" ? "Require approval for new members" : "Требовать одобрение новых участников",
    requireApprovalDesc: language === "en" ? "Team leader must approve all new members" : "Лидер команды должен одобрять всех новых участников",
    
    // Danger Zone
    dangerZoneTitle: language === "en" ? "Danger Zone" : "Опасная зона",
    dangerZoneDesc: language === "en" ? "Irreversible and destructive actions" : "Необратимые и разрушительные действия",
    deleteTeam: language === "en" ? "Delete Team" : "Удалить команду",
    deleteTeamDesc: language === "en" ? "Permanently delete this team and all its data" : "Навсегда удалить эту команду и все её данные",
    deleteTeamButton: language === "en" ? "Delete Team" : "Удалить команду",
    
    // Delete Dialog
    deleteDialogTitle: language === "en" ? "Delete Team?" : "Удалить команду?",
    deleteDialogDesc: language === "en" 
      ? "This action cannot be undone. This will permanently delete the team, all projects, tasks, specifications, and remove all members."
      : "Это действие нельзя отменить. Это навсегда удалит команду, все проекты, задачи, технические задания и удалит всех участников.",
    deleteDialogConfirm: language === "en" 
      ? "Type the team name to confirm:"
      : "Введите название команды для подтверждения:",
    cancel: language === "en" ? "Cancel" : "Отмена",
    confirmDelete: language === "en" ? "Yes, Delete Team" : "Да, удалить команду",
  };

  const isTeamLeader = userRole === "Team Leader";

  const handleSaveGeneral = () => {
    if (!isTeamLeader) {
      toast.error(
        language === "en" 
          ? "Only Team Leader can modify settings" 
          : "Только лидер команды может изменять настройки"
      );
      return;
    }
    // Save general settings
    console.log("Saving general settings:", { teamName, teamDescription });
    toast.success(
      language === "en" 
        ? "Settings saved successfully" 
        : "Настройки успешно сохранены"
    );
  };

  const handleSaveNotifications = () => {
    // Save notification settings
    console.log("Saving notification settings");
    toast.success(
      language === "en" 
        ? "Notification settings saved" 
        : "Настройки уведомлений сохранены"
    );
  };

  const handleSavePrivacy = () => {
    if (!isTeamLeader) {
      toast.error(
        language === "en" 
          ? "Only Team Leader can modify privacy settings" 
          : "Только лидер команды может изменять настройки приватности"
      );
      return;
    }
    // Save privacy settings
    console.log("Saving privacy settings");
    toast.success(
      language === "en" 
        ? "Privacy settings saved" 
        : "Настройки приватности сохранены"
    );
  };

  const handleDeleteTeam = () => {
    // Delete team
    console.log("Deleting team:", teamId);
    toast.success(
      language === "en" 
        ? "Team deleted successfully" 
        : "Команда успешно удалена"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          {t.settings}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="general">{t.tabGeneral}</TabsTrigger>
          <TabsTrigger value="notifications">{t.tabNotifications}</TabsTrigger>
          <TabsTrigger value="privacy">{t.tabPrivacy}</TabsTrigger>
          <TabsTrigger value="danger">{t.tabDanger}</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Team Name */}
              <div className="space-y-2">
                <Label htmlFor="teamName">{t.teamName}</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder={language === "en" ? "Enter team name" : "Введите название команды"}
                  disabled={!isTeamLeader}
                />
              </div>

              {/* Team Description */}
              <div className="space-y-2">
                <Label htmlFor="teamDescription">{t.teamDescription}</Label>
                <Textarea
                  id="teamDescription"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder={language === "en" ? "Enter team description" : "Введите описание команды"}
                  rows={4}
                  disabled={!isTeamLeader}
                />
              </div>

              {/* Team Avatar */}
              <div className="space-y-2">
                <Label>{t.teamAvatar}</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                    <Users className="h-10 w-10" />
                  </div>
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {t.uploadAvatar}
                  </Button>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleSaveGeneral}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t.saveChanges}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
                  <Bell className="h-5 w-5" />
                  {t.notificationsTitle}
                </h3>
                <p className="text-sm text-muted-foreground">{t.notificationsDesc}</p>
              </div>

              <div className="space-y-4">
                {/* New Member */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{t.notifyNewMember}</p>
                  </div>
                  <Switch checked={notifyNewMember} onCheckedChange={setNotifyNewMember} />
                </div>

                {/* New Task */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{t.notifyNewTask}</p>
                  </div>
                  <Switch checked={notifyNewTask} onCheckedChange={setNotifyNewTask} />
                </div>

                {/* Task Update */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{t.notifyTaskUpdate}</p>
                  </div>
                  <Switch checked={notifyTaskUpdate} onCheckedChange={setNotifyTaskUpdate} />
                </div>

                {/* Spec Update */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{t.notifySpecUpdate}</p>
                  </div>
                  <Switch checked={notifySpecUpdate} onCheckedChange={setNotifySpecUpdate} />
                </div>

                {/* Project Update */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{t.notifyProjectUpdate}</p>
                  </div>
                  <Switch checked={notifyProjectUpdate} onCheckedChange={setNotifyProjectUpdate} />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleSaveNotifications}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t.saveChanges}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
                  <Shield className="h-5 w-5" />
                  {t.privacyTitle}
                </h3>
                <p className="text-sm text-muted-foreground">{t.privacyDesc}</p>
              </div>

              <div className="space-y-4">
                {/* Team Visibility */}
                <div className="p-4 rounded-lg border space-y-3">
                  <div>
                    <p className="font-medium mb-1">{t.teamVisibility}</p>
                    <p className="text-sm text-muted-foreground">
                      {teamVisibility === "public" ? t.visibilityPublicDesc : t.visibilityPrivateDesc}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      variant={teamVisibility === "public" ? "default" : "outline"}
                      className={`cursor-pointer ${teamVisibility === "public" ? "bg-emerald-500" : ""} ${!isTeamLeader ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => isTeamLeader && setTeamVisibility("public")}
                    >
                      {t.visibilityPublic}
                    </Badge>
                    <Badge 
                      variant={teamVisibility === "private" ? "default" : "outline"}
                      className={`cursor-pointer ${teamVisibility === "private" ? "bg-emerald-500" : ""} ${!isTeamLeader ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => isTeamLeader && setTeamVisibility("private")}
                    >
                      {t.visibilityPrivate}
                    </Badge>
                  </div>
                </div>

                {/* Allow Join Requests */}
                <div className="flex items-start justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium mb-1">{t.allowJoinRequests}</p>
                    <p className="text-sm text-muted-foreground">{t.allowJoinRequestsDesc}</p>
                  </div>
                  <Switch 
                    checked={allowJoinRequests} 
                    onCheckedChange={setAllowJoinRequests}
                    disabled={!isTeamLeader}
                  />
                </div>

                {/* Require Approval */}
                <div className="flex items-start justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium mb-1">{t.requireApproval}</p>
                    <p className="text-sm text-muted-foreground">{t.requireApprovalDesc}</p>
                  </div>
                  <Switch 
                    checked={requireApproval} 
                    onCheckedChange={setRequireApproval}
                    disabled={!isTeamLeader}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleSavePrivacy}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t.saveChanges}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger" className="space-y-6 mt-6">
          <Card className="p-6 border-red-200 dark:border-red-800">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-1 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  {t.dangerZoneTitle}
                </h3>
                <p className="text-sm text-muted-foreground">{t.dangerZoneDesc}</p>
              </div>

              {/* Delete Team */}
              <div className="p-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      {t.deleteTeam}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {t.deleteTeamDesc}
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t.deleteTeamButton}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                          {t.deleteDialogTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t.deleteDialogDesc}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-2">
                        <Label>{t.deleteDialogConfirm}</Label>
                        <Input placeholder={teamName} />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteTeam}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t.confirmDelete}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
